export interface RoleResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
}
