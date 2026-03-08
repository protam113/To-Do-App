// DONE

import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserEntity } from '../../entities';
import { Connection, Model } from 'mongoose';

import { mapUserResponse, toUserDataResponse } from '../../mappers';

import { buildCacheKey } from '../../utils/key';
import { AppException, buildUserFilter } from '../../helpers';
import { AuditHelper } from '../../helpers/audit.helper';
import { LuaScriptService } from '../cache/redis.service';
import { CacheInvalidationService } from '../cache/cache-invalidation.service';
import { AuditAction, AuditType } from 'src/types/enum/log-audit.enum';
import { CreateUserLocalDto, UpdatePasswordDto } from 'src/types/dtos/user/create-user.dto';
import { PaginationOptionsInterface } from 'src/types/pagination/pagination.options.interface';
import { Pagination } from 'src/types/pagination/pagination';
import { UserListData } from 'src/types/responses/user/list.reponse';
import { LogCode } from 'src/types/log-configs/code';
import { Message, SuccessMessage } from 'src/types/log-configs/message';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectConnection() private connection: Connection,

    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
    private readonly redisCacheService: LuaScriptService,
    private readonly cacheInvalidationService: CacheInvalidationService,
    private readonly auditHelper: AuditHelper,
  ) { }


  async create(createUserDto: CreateUserLocalDto) {
    const user = new this.userModel({
      ...createUserDto,
      verified: false,
    });
    const result = await user.save();

    await this.cacheInvalidationService.invalidateUser();

    // Requirements: 1.1, 7.1 - Log USER_CREATED on user registration
    this.auditHelper.log({
      type: AuditType.USER,
      action: AuditAction.USER_CREATED,
      userId: result._id.toString(),
      resourceId: result._id.toString(),
      resourceType: 'user',
      metadata: {
        username: result.username,
        email: result.email,
      },
      status: 'success',
    });

    return result;
  }

  async findByEmail(email: string) {
    return await this.userModel
      .findOne({ email })
      .select('-password -refreshTokens -providerId');
  }

  async findOne(_id: string) {
    const user = await this.userModel
      .findOne({ _id })
      .select('-password -refreshTokens -providerId')
      .populate('role', 'name slug permissions')
      .lean();
    return user ? mapUserResponse(user) : null;
  }

  async findOneRaw(_id: string) {
    return await this.userModel
      .findOne({ _id })
      .select('-password -refreshTokens -providerId')
      .lean();
  }

  async getUsersList(
    options: PaginationOptionsInterface,
    searchQuery?: string
  ): Promise<
    Pagination<{
      id: string;
      username: string;
      email: string;
      fullName?: string;
      avatarUrl?: string | null;
    }>
  > {
    const cacheKey = buildCacheKey('users:list', {
      page: options.page,
      page_size: options.page_size,
      search: searchQuery || '',
    });

    const cached = await this.redisCacheService.get<
      Pagination<{
        id: string;
        username: string;
        email: string;
        fullName?: string;
        avatarUrl?: string | null;
      }>
    >(cacheKey);
    if (cached) {
      this.logger.log(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    const filter: any = {
      isActive: true,
      isBlocked: false,
    };

    if (searchQuery) {
      filter.$or = [
        { username: { $regex: searchQuery, $options: 'i' } },
        { fullName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('_id username email firstName lastName fullName avatarUrl')
        .sort({ username: 1 })
        .skip((options.page - 1) * options.page_size)
        .limit(options.page_size)
        .lean(),
      this.userModel.countDocuments(filter),
    ]);

    const results = users.map((user) => {
      let displayName = user.fullName;
      return {
        id: user._id.toString(),
        username: user.username || '',
        email: user.email,
        fullName: displayName,
      };
    });

    const result = new Pagination({
      results,
      total,
      total_page: Math.ceil(total / options.page_size),
      page_size: options.page_size,
      current_page: options.page,
    });

    await this.redisCacheService.set(cacheKey, result, 300).catch(() => null);

    return result;
  }

  async getAllUsers(
    options: PaginationOptionsInterface,
    startDate?: string,
    endDate?: string,
    searchQuery?: string,
  ): Promise<Pagination<UserListData>> {
    const cacheKey = buildCacheKey('users', {
      page: options.page,
      page_size: options.page_size,
      start: startDate,
      end: endDate,
      search: searchQuery || '',
    });
    const cached = await this.redisCacheService.get<Pagination<UserListData>>(
      cacheKey
    );
    if (cached) {
      this.logger.log(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    const filter = buildUserFilter({
      startDate,
      endDate,
      searchQuery,
      isActive: true,
      isBlocked: false,
    });

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-password -refreshTokens -providerId')
        .populate('role', 'slug name')
        .sort({ createdAt: -1 })
        .skip((options.page - 1) * options.page_size)
        .limit(options.page_size)
        .lean(),
      this.userModel.countDocuments(filter),
    ]);

    const results = users.map(toUserDataResponse);

    const result = new Pagination<UserListData>({
      results,
      total,
      total_page: Math.ceil(total / options.page_size),
      page_size: options.page_size,
      current_page: options.page,
    });

    await this.redisCacheService.set(cacheKey, result, 3600).catch(() => null);
    return result;
  }

  async validateUser(userId: string): Promise<void> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new AppException(
          LogCode.USER_NOT_FOUND,
          Message.USER_NOT_FOUND,
          HttpStatus.UNAUTHORIZED
        );
      }
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(
        LogCode.DB_ERROR,
        Message.DB_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateProfile(
    userId: string,
    updates: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone_number?: string;
    },
    adminId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<UserListData> {
    if (!userId?.trim()) {
      throw new AppException(
        LogCode.USER_NOT_FOUND,
        Message.INVALID_USER,
        HttpStatus.BAD_REQUEST
      );
    }

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new AppException(
        LogCode.USER_NOT_FOUND,
        Message.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    // Check if email is being changed and if it's already taken
    if (updates.email && updates.email !== user.email) {
      const existingUser = await this.userModel.findOne({
        email: updates.email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        throw new AppException(
          LogCode.EMAIL_ALREADY_TAKEN,
          Message.EMAIL_ALREADY_TAKEN,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    const oldValues: any = {};
    const newValues: any = {};


    if (updates.email !== undefined) {
      oldValues.email = user.email;
      newValues.email = updates.email;
      user.email = updates.email;
    }
    const updated = await user.save();

    await this.cacheInvalidationService.invalidateUser(userId);

    this.auditHelper.log({
      type: AuditType.USER,
      action: AuditAction.USER_UPDATED,
      userId: adminId,
      resourceId: userId,
      resourceType: 'user',
      ipAddress,
      userAgent,
      metadata: {
        username: user.username,
        updatedFields: Object.keys(newValues),
      },
      oldValue: oldValues,
      newValue: newValues,
      status: 'success',
    });

    return toUserDataResponse(updated.toObject());
  }

  // ==================== STATISTICS ====================

  async getOverviewStatistics() {
    // Requirements: 3.1, 3.2 - Use buildCacheKey utility for consistent key generation
    const cacheKey = buildCacheKey('user:stats:overview', {});
    const cached = await this.redisCacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      blockedUsers,
      verifiedUsers,
      roleStats,
      newUsersLast7Days,
      newUsersLast30Days,
    ] = await Promise.all([
      this.userModel.countDocuments({ isDeleted: false }),
      this.userModel.countDocuments({ isActive: true, isDeleted: false }),
      this.userModel.countDocuments({ isActive: false, isDeleted: false }),
      this.userModel.countDocuments({ isBlocked: true, isDeleted: false }),
      this.userModel.countDocuments({ verified: true, isDeleted: false }),
      this.userModel.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),
      this.userModel.countDocuments({
        createdAt: { $gte: last7Days },
        isDeleted: false,
      }),
      this.userModel.countDocuments({
        createdAt: { $gte: last30Days },
        isDeleted: false,
      }),
    ]);

    const roleDistribution = roleStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const result = {
      totalUsers,
      activeUsers,
      inactiveUsers,
      blockedUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
      roleDistribution,
      newUsersLast7Days,
      newUsersLast30Days,
      activePercentage:
        totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) : '0',
      verifiedPercentage:
        totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(2) : '0',
    };

    await this.redisCacheService.set(cacheKey, result, 300); // Cache 5 minutes
    return result;
  }

  async getUserGrowthStatistics(
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
    startDate?: string,
    endDate?: string
  ) {
    const cacheKey = buildCacheKey('user:stats:growth', {
      period,
      start: startDate,
      end: endDate,
    });

    const cached = await this.redisCacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    let groupFormat: any;
    let dateFormat: string;

    switch (period) {
      case 'daily':
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        };
        dateFormat = '%Y-%m-%d';
        break;
      case 'weekly':
        groupFormat = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' },
        };
        dateFormat = '%Y-W%V';
        break;
      case 'monthly':
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        };
        dateFormat = '%Y-%m';
        break;
    }

    const growthData = await this.userModel.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: groupFormat,
          count: { $sum: 1 },
          date: { $first: '$createdAt' },
        },
      },
      { $sort: { date: 1 } },
      {
        $project: {
          _id: 0,
          period: {
            $dateToString: { format: dateFormat, date: '$date' },
          },
          count: 1,
          date: 1,
        },
      },
    ]);

    // Calculate cumulative total
    let cumulative = 0;
    const result = growthData.map((item) => {
      cumulative += item.count;
      return {
        period: item.period,
        newUsers: item.count,
        totalUsers: cumulative,
      };
    });

    await this.redisCacheService.set(cacheKey, result, 600); // Cache 10 minutes
    return result;
  }

  async getActivityStatistics() {
    // Requirements: 3.1, 3.2 - Use buildCacheKey utility for consistent key generation
    const cacheKey = buildCacheKey('user:stats:activity', {});
    const cached = await this.redisCacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const moreThan30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      activeIn24h,
      activeIn7d,
      activeIn30d,
      inactiveOver30d,
      neverLoggedIn,
      totalUsers,
    ] = await Promise.all([
      this.userModel.countDocuments({
        lastLogin: { $gte: last24Hours },
        isDeleted: false,
      }),
      this.userModel.countDocuments({
        lastLogin: { $gte: last7Days },
        isDeleted: false,
      }),
      this.userModel.countDocuments({
        lastLogin: { $gte: last30Days },
        isDeleted: false,
      }),
      this.userModel.countDocuments({
        lastLogin: { $lt: moreThan30Days },
        isDeleted: false,
      }),
      this.userModel.countDocuments({
        lastLogin: null,
        isDeleted: false,
      }),
      this.userModel.countDocuments({ isDeleted: false }),
    ]);

    const result = {
      activeIn24h,
      activeIn7d,
      activeIn30d,
      inactiveOver30d,
      neverLoggedIn,
      totalUsers,
      activityRate24h:
        totalUsers > 0 ? ((activeIn24h / totalUsers) * 100).toFixed(2) : '0',
      activityRate7d:
        totalUsers > 0 ? ((activeIn7d / totalUsers) * 100).toFixed(2) : '0',
      activityRate30d:
        totalUsers > 0 ? ((activeIn30d / totalUsers) * 100).toFixed(2) : '0',
    };

    await this.redisCacheService.set(cacheKey, result, 300); // Cache 5 minutes
    return result;
  }



  // ==================== SOFT DELETE ====================

  async initiatePasswordChange(
    userId: string,
    dto: UpdatePasswordDto
  ): Promise<{ status: string; message: string }> {
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) {
      throw new AppException(
        LogCode.USER_NOT_FOUND,
        Message.USER_NOT_FOUND,
        HttpStatus.UNAUTHORIZED
      );
    }

    const isValidPassword = await user.comparePassword(dto.currentPassword);
    if (!isValidPassword) {
      throw new AppException(
        LogCode.PASSWORD_INCORRECT,
        Message.PASSWORD_INCORRECT,
        HttpStatus.BAD_REQUEST
      );
    }

    user.password = dto.newPassword;
    await user.save();

    // Log password change for audit
    this.auditHelper.log({
      type: AuditType.USER,
      action: AuditAction.USER_UPDATED,
      userId: userId,
      resourceId: userId,
      resourceType: 'user',
      metadata: {
        field: 'password',
        action: 'password_changed',
      },
      status: 'success',
    });

    return {
      status: 'success',
      message: SuccessMessage.PASSWORD_UPDATED,
    };
  }
}
