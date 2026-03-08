interface RoleDistribution {
  admin?: number;
  manager?: number;
  user?: number;
}

export interface UserOverviewStat {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  blockedUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  roleDistribution: RoleDistribution;
  newUsersLast7Days: number;
  newUsersLast30Days: number;
  activePercentage: string;
  verifiedPercentage: string;
}

export interface UserGrowStat {
  period: string;
  newUsers: number;
  totalUsers: number;
}

export interface RoleStatictis {
  role: string;
  count: number;
  activeCount: number;
  blockedCount: number;
  percentage: string;
}

export interface UserRoleStat {
  roles: RoleStatictis[];
}

export interface UserActivityStatictis {
  activeIn24h: string;
  activeIn7d: number;
  activeIn30d: number;
  inactiveOver30d: number;
  neverLoggedIn: number;
  totalUsers: number;
  activityRate24h: string;
  activityRate7d: string;
  activityRate30d: string;
}
