
export type AdminRole = 'admin' | 'editor' | 'viewer';

export type Permission = 
  | 'users.view' 
  | 'users.create' 
  | 'users.edit' 
  | 'users.delete'
  | 'content.view'
  | 'content.create'
  | 'content.edit'
  | 'content.delete'
  | 'site.edit'
  | 'clients.view'
  | 'clients.manage'
  | 'leads.view'
  | 'leads.manage';

export interface AdminPermission {
  id: string;
  role: AdminRole;
  permission_key: Permission;
  created_at: string;
  updated_at: string;
}
