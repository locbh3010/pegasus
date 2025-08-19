import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'

export enum MemberRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export type Member = Tables<'project_members'> & {
  role: MemberRole
}

export type MemberInsert = TablesInsert<'project_members'> & {
  role: MemberRole
}

export type MemberUpdate = TablesUpdate<'project_members'> & {
  role: MemberRole
}
