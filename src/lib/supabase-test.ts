import { supabase, TABLES } from './supabase';

// 测试Supabase连接
export async function testSupabaseConnection() {
  try {
    console.log('🔄 测试Supabase连接...');
    
    // 测试基本连接
    const { data, error } = await supabase.from(TABLES.CATEGORIES).select('*').limit(1);
    
    if (error) {
      console.error('❌ Supabase连接失败:', error);
      return false;
    }
    
    console.log('✅ Supabase连接成功!');
    console.log('📊 示例数据:', data);
    return true;
  } catch (err) {
    console.error('❌ 连接测试异常:', err);
    return false;
  }
}

// 获取分类列表
export async function getCategories() {
  const { data, error } = await supabase
    .from(TABLES.CATEGORIES)
    .select('*')
    .order('sort_order');
    
  if (error) {
    console.error('获取分类失败:', error);
    return [];
  }
  
  return data || [];
}

// 获取AI工具列表
export async function getAITools(params?: {
  category?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from(TABLES.TOOLS)
    .select(`
      *,
      categories(name, icon, color)
    `)
    .eq('status', 'active');
    
  if (params?.category) {
    query = query.eq('category_id', params.category);
  }
  
  query = query
    .order('created_at', { ascending: false })
    .limit(params?.limit || 12)
    .range(params?.offset || 0, (params?.offset || 0) + (params?.limit || 12) - 1);
    
  const { data, error } = await query;
  
  if (error) {
    console.error('获取AI工具失败:', error);
    return [];
  }
  
  return data || [];
}