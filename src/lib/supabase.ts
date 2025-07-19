import { createClient } from '@supabase/supabase-js';

// Supabase配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// 数据库表名常量
export const TABLES = {
  TOOLS: 'ai_tools',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  TOOL_TAGS: 'tool_tags',
} as const;