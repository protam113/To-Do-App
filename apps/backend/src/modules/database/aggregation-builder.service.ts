import { Injectable } from '@nestjs/common';
import { COLLECTION_KEYS } from '../../assets';

/**
 * Configuration for $lookup aggregation stage
 */
export interface LookupConfig {
  from: string;
  localField: string;
  foreignField: string;
  as: string;
  pipeline?: any[];
  unwind?: boolean;
  preserveNullAndEmptyArrays?: boolean;
}

/**
 * Options for building aggregation pipelines
 */
export interface AggregationBuilderOptions {
  collection: string;
  match?: Record<string, any>;
  lookups?: LookupConfig[];
  project?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
}

/**
 * Options for task aggregation pipeline
 */
export interface TaskAggregationOptions {
  match?: Record<string, any>;
  project?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
  includeProject?: boolean;
  includeTeam?: boolean;
  includeType?: boolean;
  includeStatus?: boolean;
  includeAssignee?: boolean;
  includePriority?: boolean;
}

/**
 * Options for project aggregation pipeline
 */
export interface ProjectAggregationOptions {
  match?: Record<string, any>;
  project?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
  includeTeam?: boolean;
}

/**
 * Options for comment aggregation pipeline
 */
export interface CommentAggregationOptions {
  match?: Record<string, any>;
  project?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
  includeUser?: boolean;
  includeReplyCount?: boolean;
}

/**
 * AggregationBuilderService provides reusable aggregation pipeline builders
 * to replace Mongoose populate chains with efficient $lookup stages.
 *
 * This service is stateless - no request-specific state is stored between requests.
 *
 * Requirements: 1.1, 1.4, 2.1, 3.1, 3.3
 */
@Injectable()
export class AggregationBuilderService {
  /**
   * Build a $lookup stage for aggregation pipeline
   *
   * @param config - Lookup configuration
   * @returns Array of pipeline stages ($lookup and optional $unwind)
   */
  buildLookupStage(config: LookupConfig): any[] {
    const stages: any[] = [];

    if (config.pipeline && config.pipeline.length > 0) {
      // Use $lookup with pipeline for more complex joins
      stages.push({
        $lookup: {
          from: config.from,
          let: { localValue: `$${config.localField}` },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [`$${config.foreignField}`, '$$localValue'] },
              },
            },
            ...config.pipeline,
          ],
          as: config.as,
        },
      });
    } else {
      // Simple $lookup
      stages.push({
        $lookup: {
          from: config.from,
          localField: config.localField,
          foreignField: config.foreignField,
          as: config.as,
        },
      });
    }

    // Optionally unwind the result
    if (config.unwind) {
      stages.push({
        $unwind: {
          path: `$${config.as}`,
          preserveNullAndEmptyArrays: config.preserveNullAndEmptyArrays ?? true,
        },
      });
    }

    return stages;
  }

  /**
   * Build a $project stage for aggregation pipeline
   *
   * @param fields - Fields to include/exclude
   * @returns $project stage
   */
  buildProjectStage(fields: Record<string, any>): any {
    return { $project: fields };
  }

  /**
   * Build a $match stage for aggregation pipeline
   *
   * @param conditions - Match conditions
   * @returns $match stage
   */
  buildMatchStage(conditions: Record<string, any>): any {
    return { $match: conditions };
  }

  /**
   * Build a $sort stage for aggregation pipeline
   *
   * @param sortFields - Sort fields and directions
   * @returns $sort stage
   */
  buildSortStage(sortFields: Record<string, 1 | -1>): any {
    return { $sort: sortFields };
  }

  /**
   * Build task aggregation pipeline with all related data in a single query.
   * Replaces nested populate chains with $lookup aggregation stages.
   *
   * Requirements: 1.1 - Use aggregation pipeline to JOIN task, project, team, type, status, priority, and assignee
   * Requirements: 1.4 - Replace nested populate chains with $lookup aggregation stages
   *
   * @param options - Task aggregation options
   * @returns Aggregation pipeline array
   */
  buildTaskAggregation(options: TaskAggregationOptions = {}): any[] {
    const {
      match = {},
      project,
      sort = { createdAt: -1 },
      skip,
      limit,
      includeProject = true,
      includeTeam = true,
      includeType = true,
      includeStatus = true,
      includeAssignee = true,
      includePriority = true,
    } = options;

    const pipeline: any[] = [];

    // Match stage - filter tasks
    if (Object.keys(match).length > 0) {
      pipeline.push(this.buildMatchStage(match));
    }

    // Lookup assignee (user)
    if (includeAssignee) {
      pipeline.push(
        ...this.buildLookupStage({
          from: COLLECTION_KEYS.USER,
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'assignedUser',
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                email: 1,
                firstName: 1,
                lastName: 1,
              },
            },
          ],
          unwind: true,
          preserveNullAndEmptyArrays: true,
        })
      );
    }


    // Sort stage
    if (sort && Object.keys(sort).length > 0) {
      pipeline.push(this.buildSortStage(sort));
    }

    // Skip stage for pagination
    if (skip !== undefined && skip > 0) {
      pipeline.push({ $skip: skip });
    }

    // Limit stage for pagination
    if (limit !== undefined && limit > 0) {
      pipeline.push({ $limit: limit });
    }

    // Project stage - select only required fields
    if (project) {
      pipeline.push(this.buildProjectStage(project));
    } else {
      // Default projection for task response
      pipeline.push(
        this.buildProjectStage({
          _id: 1,
          name: 1,
          description: 1,
          startDate: 1,
          endDate: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          project: {
            _id: '$project._id',
            name: '$project.name',
            slug: '$project.slug',
            team: {
              _id: '$project.team._id',
              name: '$project.team.name',
              slug: '$project.team.slug',
            },
          },
          type: {
            _id: '$type._id',
            name: '$type.name',
            slug: '$type.slug',
          },
          statusTag: {
            _id: '$statusTag._id',
            name: '$statusTag.name',
            slug: '$statusTag.slug',
            color: '$statusTag.color',
          },
          assignedUser: {
            _id: '$assignedUser._id',
            username: '$assignedUser.username',
            email: '$assignedUser.email',
            firstName: '$assignedUser.firstName',
            lastName: '$assignedUser.lastName',
          },
          priority: {
            _id: '$priority._id',
            level: '$priority.level',
          },
        })
      );
    }

    return pipeline;
  }

  /**
   * Build project aggregation pipeline with team data.
   * Replaces populate chains with $lookup aggregation stages.
   *
   * Requirements: 2.1 - Use aggregation with $lookup to JOIN team data
   *
   * @param options - Project aggregation options
   * @returns Aggregation pipeline array
   */
  buildProjectAggregation(options: ProjectAggregationOptions = {}): any[] {
    const {
      match = {},
      project,
      sort = { createdAt: -1 },
      skip,
      limit,
      includeTeam = true,
    } = options;

    const pipeline: any[] = [];

    // Match stage - filter projects
    if (Object.keys(match).length > 0) {
      pipeline.push(this.buildMatchStage(match));
    }


    // Sort stage
    if (sort && Object.keys(sort).length > 0) {
      pipeline.push(this.buildSortStage(sort));
    }

    // Skip stage for pagination
    if (skip !== undefined && skip > 0) {
      pipeline.push({ $skip: skip });
    }

    // Limit stage for pagination
    if (limit !== undefined && limit > 0) {
      pipeline.push({ $limit: limit });
    }

    // Project stage - select only required fields
    if (project) {
      pipeline.push(this.buildProjectStage(project));
    } else {
      // Default projection for project response
      pipeline.push(
        this.buildProjectStage({
          _id: 1,
          name: 1,
          slug: 1,
          description: 1,
          projectStatus: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          team: {
            _id: '$team._id',
            name: '$team.name',
            slug: '$team.slug',
          },
        })
      );
    }

    return pipeline;
  }

  /**
   * Build comment aggregation pipeline with user data and reply counts.
   * Replaces populate chains and separate aggregate queries with single pipeline.
   *
   * Requirements: 3.1 - Use aggregation to JOIN user data and calculate reply counts
   * Requirements: 3.3 - Use $lookup with pipeline instead of separate aggregate query
   *
   * @param options - Comment aggregation options
   * @returns Aggregation pipeline array
   */
  buildCommentAggregation(options: CommentAggregationOptions = {}): any[] {
    const {
      match = {},
      project,
      sort = { createdAt: -1 },
      skip,
      limit,
      includeUser = true,
      includeReplyCount = true,
    } = options;

    const pipeline: any[] = [];

    // Match stage - filter comments
    if (Object.keys(match).length > 0) {
      pipeline.push(this.buildMatchStage(match));
    }

    // Lookup user
    if (includeUser) {
      pipeline.push(
        ...this.buildLookupStage({
          from: COLLECTION_KEYS.USER,
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                email: 1,
                firstName: 1,
                lastName: 1,
              },
            },
          ],
          unwind: true,
          preserveNullAndEmptyArrays: true,
        })
      );
    }

    // Sort stage
    if (sort && Object.keys(sort).length > 0) {
      pipeline.push(this.buildSortStage(sort));
    }

    // Skip stage for pagination
    if (skip !== undefined && skip > 0) {
      pipeline.push({ $skip: skip });
    }

    // Limit stage for pagination
    if (limit !== undefined && limit > 0) {
      pipeline.push({ $limit: limit });
    }

    // Project stage - select only required fields
    if (project) {
      pipeline.push(this.buildProjectStage(project));
    } else {
      // Default projection for comment response
      pipeline.push(
        this.buildProjectStage({
          _id: 1,
          content: 1,
          taskId: 1,
          parentId: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            _id: '$user._id',
            username: '$user.username',
            email: '$user.email',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
          },
          replyCount: 1,
        })
      );
    }

    return pipeline;
  }

  /**
   * Build a count pipeline for getting total documents matching criteria
   *
   * @param match - Match conditions
   * @returns Aggregation pipeline for counting
   */
  buildCountPipeline(match: Record<string, any>): any[] {
    return [this.buildMatchStage(match), { $count: 'total' }];
  }
}
