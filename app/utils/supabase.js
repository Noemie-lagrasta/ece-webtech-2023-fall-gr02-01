import { createClient } from '@supabase/supabase-js';

const Url = 'https://ugxpwajfppcpboosjczr.supabase.co';
const AnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVneHB3YWpmcHBjcGJvb3NqY3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAyMTU5OTYsImV4cCI6MjAxNTc5MTk5Nn0.H0YL6Gjqx-sb-A2coH0r6EQIRYUAHRqNVRvEpcPI3kc';

const supabase = createClient(Url, AnonKey);

export { supabase };