import { supabaseService } from '@/lib/supabase/service'
import { MemberInsert } from '../member.types'

export const memberServices = {
  insert: (member: MemberInsert) => supabaseService.from('project_members').insert(member),
}
