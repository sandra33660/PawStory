import { createClient } from '@supabase/supabase-js';
 
export const supabase = createClient(
  'https://bkpfezreeqilupdnroac.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGZlenJlZXFpbHVwZG5yb2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNTYwNTYsImV4cCI6MjA5NDgzMjA1Nn0.rmH4-DBIm_xjxgfqh6gYVkjjFWUiIW3tezvGii32WMY'
);
 