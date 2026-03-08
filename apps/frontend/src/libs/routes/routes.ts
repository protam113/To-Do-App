function deepFreeze<T>(obj: T): T {
  Object.getOwnPropertyNames(obj).forEach((key) => {
    const prop = (obj as any)[key];
    if (typeof prop === 'object' && prop !== null) {
      deepFreeze(prop);
    }
  });
  return Object.freeze(obj);
}

type RouteMap = {
  readonly HOME: string;
  readonly COMPANY: string;
  readonly REPORT: string;

  readonly BLOG: {
    readonly ROOT: string;
    readonly DETAIL: (slug: string) => string;
    readonly ID: string;
  };
  readonly SERVICE: {
    readonly ROOT: string;
    readonly DETAIL: (slug: string) => string;
    readonly ID: string;
  };
  readonly PRODUCT: {
    readonly ROOT: string;
    readonly DETAIL: (slug: string) => string;
    readonly ID: string;
  };
  readonly PROJECT: {
    readonly ROOT: string;
    readonly DETAIL: (slug: string) => string;
    readonly ID: string;
  };

  // Private route
  readonly LOGIN: string;
  readonly DASHBOARD: string;
  readonly ADMIN_TEAM: string;
  readonly ADMIN_TASK: string;
  readonly ADMIN_TYPE: string;
  readonly ADMIN_AUDIT_LOG: string;
  readonly ADMIN_REPORT: string;

  readonly ADMIN_TICKET: string;
};

export const ROUTES: Readonly<RouteMap> = deepFreeze({
  HOME: '/',
  COMPANY: '/company',
  REPORT: '/report',

  BLOG: {
    ROOT: '/blogs',
    DETAIL: (slug: string) => `/services/${slug}`,
    ID: '123',
  },
  SERVICE: {
    ROOT: '/services',
    DETAIL: (slug: string) => `/services/${slug}`,
    ID: '123',
  },
  PRODUCT: {
    ROOT: '/products',
    DETAIL: (slug: string) => `/services/${slug}`,
    ID: '123',
  },
  PROJECT: {
    ROOT: '/company',
    DETAIL: (slug: string) => `/company/project/${slug}`,
    ID: '123',
  },

  LOGIN: '/admin/login',

  DASHBOARD: '/admin',
  ADMIN_TEAM: '/admin/team',
  ADMIN_TASK: '/admin/task',
  ADMIN_TYPE: '/admin/type',
  ADMIN_REPORT: '/admin/evidence',
  ADMIN_AUDIT_LOG: '/admin/audit-log',
  ADMIN_TICKET: '/admin/ticket',
} as const);
