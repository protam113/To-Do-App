//api/api.ts

const url = process.env.NEXT_PUBLIC_BASE_URL_DEV;

const version = process.env.NEXT_PUBLIC_API_VERSION_DEV;
// Base URL api =v1
const baseURL = `${url}${version}`;

/**
 * ========== @Endpoints ==========
 */
const endpoints = {
  // WORKER
  worker: process.env.NEXT_PUBLIC_HEALTH,
  health: process.env.NEXT_PUBLIC_APP_HEALTH,
  health_detailed: process.env.NEXT_PUBLIC_APP_HEALTH_DETAIL,

  // AUTH
  login: process.env.NEXT_PUBLIC_LOGIN,
  register: process.env.NEXT_PUBLIC_REGISTER,
  refresh: process.env.NEXT_PUBLIC_REFRESH,
  logout: process.env.NEXT_PUBLIC_LOGOUT,
  logout_all: process.env.NEXT_PUBLIC_LOGOUT_ALL_DEVICES,

  // USER
  profile: process.env.NEXT_PUBLIC_PROFILE,
  profile_avatar: process.env.NEXT_PUBLIC_USER_AVATAR,
  users: process.env.NEXT_PUBLIC_USERS,
  user_list: process.env.NEXT_PUBLIC_USERS_LIST,
  promote_manager: process.env.NEXT_PUBLIC_PROMOTE_MANAGER,
  delete_users: process.env.NEXT_PUBLIC_USERS_DELETE,
  delete_user: process.env.NEXT_PUBLIC_USER_DELETE,
  demote_manager: process.env.NEXT_PUBLIC_DEMOTE_MANAGER,
  change_password: process.env.NEXT_PUBLIC_USER_CHANGE_PASSWORD,
  roles: process.env.NEXT_PUBLIC_ROLES,
  role: process.env.NEXT_PUBLIC_ROLE,

  // 2FA
  setup_2fa: process.env.NEXT_PUBLIC_2FA_SETUP,
  enble_2fa: process.env.NEXT_PUBLIC_2FA_ENBLE,
  disable_2fa: process.env.NEXT_PUBLIC_2FA_DISABLE,
  status_2fa: process.env.NEXT_PUBLIC_2FA_STATUS,
  verify_2fa: process.env.NEXT_PUBLIC_2FA_VERIFY,

  // AUDIT LOG
  audit_log: process.env.NEXT_PUBLIC_AUDIT_LOG,
  logs: process.env.NEXT_PUBLIC_LOGS,
  logs_stats: process.env.NEXT_PUBLIC_LOGS_STATS,

  // ERROR
  errors: process.env.NEXT_PUBLIC_ERRORS,
  error: process.env.NEXT_PUBLIC_ERROR,

  // REPORT
  reports: process.env.NEXT_PUBLIC_REPORTS,
  report: process.env.NEXT_PUBLIC_REPORT,
  report_attachments: process.env.NEXT_PUBLIC_REPORT_ATTACHMENTS,
  report_delete_attachment: process.env.NEXT_PUBLIC_REPORT_ATTACHMENT,
  report_daily: process.env.NEXT_PUBLIC_REPORT_STATIS_DAILY,
  report_sumary: process.env.NEXT_PUBLIC_REPORT_STATIS_SUMARY,
  report_trend: process.env.NEXT_PUBLIC_REPORT_STATIS_TREND,
  report_status: process.env.NEXT_PUBLIC_REPORT_STATUS,

  // MONITOR
  monitors: process.env.NEXT_PUBLIC_MONITORS,
  monitor: process.env.NEXT_PUBLIC_MONITOR,
  monitor_active: process.env.NEXT_PUBLIC_MONITOR_ACTIVE,
  generate_code: process.env.NEXT_PUBLIC_MONITOR_ACCESS_CODE,
  codes: process.env.NEXT_PUBLIC_MONITOR_ACCESS_CODES,
  code: process.env.NEXT_PUBLIC_MONITOR_DELETE_CODE,
  get_auth: process.env.NEXT_PUBLIC_MONITOR_AUTH,

  admin_sessions: process.env.NEXT_PUBLIC_ADMIN_SESSIONS,
  admin_session: process.env.NEXT_PUBLIC_ADMIN_SESSION,
  admin_user_session: process.env.NEXT_PUBLIC_ADMIN_USER_SESSION,
  my_sessions: process.env.NEXT_PUBLIC_MY_SESSIONS,

  // // TYPE
  // types: process.env.NEXT_PUBLIC_TYPES,
  // type: process.env.NEXT_PUBLIC_TYPE,

  // TICKET
  tickets: process.env.NEXT_PUBLIC_TICKETS,
  my_tickets: process.env.NEXT_PUBLIC_TICKETS_MY,
  ticket_status: process.env.NEXT_PUBLIC_TICKET_STATUS,
  ticket: process.env.NEXT_PUBLIC_TICKET,

  // TAG
  // tags: process.env.NEXT_PUBLIC_TAGS,

  // STATISTICS
  statistic_user_overview: process.env.NEXT_PUBLIC_STATISTICS_USER_OVERVIEW,
  statistic_user_growth: process.env.NEXT_PUBLIC_STATISTICS_USER_GROWTH,
  statistic_user_role: process.env.NEXT_PUBLIC_STATISTICS_USER_ROLE,
  statistic_user_activity: process.env.NEXT_PUBLIC_STATISTICS_USER_ACTIVITY,

  // MEDIA
  presign: process.env.NEXT_PUBLIC_PRESIGN,
  confirm: process.env.NEXT_PUBLIC_CONFIRM,
  delete_media: process.env.NEXT_PUBLIC_DELETE_MEDIA,
};

export { baseURL, endpoints };
