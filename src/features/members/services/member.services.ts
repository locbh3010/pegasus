import { supabase } from '@/lib/supabase/client'
import { MemberInsert } from '../member.types'

export const memberServices = {
  insert: (member: MemberInsert) => supabase.from('project_members').insert(member),
}
