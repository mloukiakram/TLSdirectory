import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://astodpwfzeudvlbpjknn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdG9kcHdmemV1ZHZsYnBqa25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NzA5ODAsImV4cCI6MjA4ODU0Njk4MH0.8PMyKm6nYxY5FZW5YWzq8kQrR7tDRDeS5DUmgoeyOk4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
