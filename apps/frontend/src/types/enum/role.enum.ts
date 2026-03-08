export enum PERMISSIONS {
  // USER
  CREATE_USER = 'create__user',
  VIEW_USER_LIST = 'view_user_list',
  PROMOTE_USER = 'promote_user',
  DEMOTE_USER = 'demote_user',
  BLOCK_UNBLOCK_USER = 'block_unblock_user',
  ACTIVE_UNACTIVE_USER = 'active_unactive_user',
  DELETE_USER = 'delete_user',
  DELETE_USERS = 'delete_users',
  STATISTIC_USERS = 'statistics_users',

  // ROLE
  CREATE_ROLE = 'create_role',
  UPDATE_ROLE = 'update_role',

  // REPORT
  CREATE_REPORT = 'create_report',
  UPDATE_REPORT = 'update_report',
  DELETE_REPORT = 'delete_report',
  UPDATE_REPORT_STATUS = 'update_report_status',

  // ERROR
  CREATE_ERROR = 'create_error',
  UPDATE_ERROR = 'update_error',
  DELETE_ERROR = 'delete_error',

  // ISSUE
  CREATE_ISSUE = 'create_issue',
  GET_ISSUE = 'get_issue',
  UPDATE_ISSUE = 'update_issue',
  DELETE_ISSUE = 'delete_issue',
  DELETE_ISSUE_MEDIA = 'delete_issue_media',
  TOGGLE_ISSUE = 'toggle_issue',

  //   MONITOR
  CET_MONITORS = 'get_monitors',
  TOGGLE_MONITOR = 'toggle_monitor',
  UPDATE_MONITOR = 'update_monitor',
  DELETE_MONITOR = 'delete_monitor',
  DELETE_ACCESS_MONITOR = 'delete_access_monitor',
  ACCESS_MONITOR = 'delete_monitor',
  CREATE_ACCESS_MONITOR = 'create_access_monitor',

  // TICKET
  CET_TICKETS = 'get_tickets',
  UPDATE_TICKETS = 'update_ticket',

  VIEW_AUDIT = 'view_audit',
}
