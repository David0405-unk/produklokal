import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xgmbuskaehclvnxaqopv.supabase.co';
const supabaseAnonKey = 'sb_publishable_58IRdqieaUI4At981zN_9w_Hqdml0Bk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);