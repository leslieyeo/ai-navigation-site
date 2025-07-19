import { supabase, TABLES } from './supabase';
import { AITool, Category, SearchParams, ApiResponse, Website, NavCategory } from '@/types';

// 获取所有分类
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .select('*')
      .order('sort_order');
      
    if (error) {
      console.error('获取分类失败:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('获取分类异常:', err);
    return [];
  }
}

// 获取AI工具列表（支持分页和筛选）
export async function getAITools(params: SearchParams = {}): Promise<ApiResponse<AITool[]>> {
  try {
    let query = supabase
      .from(TABLES.TOOLS)
      .select(`
        *,
        categories!ai_tools_category_id_fkey(
          id,
          name,
          icon,
          color
        )
      `)
      .eq('status', 'active');

    // 分类筛选
    if (params.category) {
      query = query.eq('category_id', params.category);
    }

    // 免费/付费筛选
    if (params.is_free !== undefined) {
      query = query.eq('is_free', params.is_free);
    }

    // 搜索
    if (params.query) {
      query = query.or(`name.ilike.%${params.query}%,description.ilike.%${params.query}%`);
    }

    // 排序
    switch (params.sort) {
      case 'popular':
        query = query.order('views', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'latest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // 分页
    const page = params.page || 1;
    const limit = params.limit || 12;
    const offset = (page - 1) * limit;

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('获取AI工具失败:', error);
      return { data: [], count: 0, error: error.message };
    }

    return { data: data || [], count: count || 0 };
  } catch (err) {
    console.error('获取AI工具异常:', err);
    return { data: [], count: 0, error: (err as Error).message };
  }
}

// 获取单个工具详情
export async function getToolById(id: string): Promise<AITool | null> {
  try {
    const { data, error } = await supabase
      .from(TABLES.TOOLS)
      .select(`
        *,
        categories!ai_tools_category_id_fkey(
          id,
          name,
          icon,
          color
        ),
        tool_tags!tool_tags_tool_id_fkey(
          tags!tool_tags_tag_id_fkey(
            id,
            name,
            color
          )
        )
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('获取工具详情失败:', error);
      return null;
    }

    // 处理标签数据结构
    if (data && data.tool_tags) {
      data.tags = data.tool_tags.map((tt: any) => tt.tags.name);
    }

    return data;
  } catch (err) {
    console.error('获取工具详情异常:', err);
    return null;
  }
}

// 获取精选工具
export async function getFeaturedTools(limit = 8): Promise<AITool[]> {
  try {
    const { data, error } = await supabase
      .from(TABLES.TOOLS)
      .select(`
        *,
        categories!ai_tools_category_id_fkey(
          id,
          name,
          icon,
          color
        )
      `)
      .eq('status', 'active')
      .eq('featured', true)
      .order('views', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('获取精选工具失败:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('获取精选工具异常:', err);
    return [];
  }
}

// 获取热门工具
export async function getPopularTools(limit = 10): Promise<AITool[]> {
  try {
    const { data, error } = await supabase
      .from(TABLES.TOOLS)
      .select(`
        *,
        categories!ai_tools_category_id_fkey(
          id,
          name,
          icon,
          color
        )
      `)
      .eq('status', 'active')
      .order('views', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('获取热门工具失败:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('获取热门工具异常:', err);
    return [];
  }
}

// 搜索工具（使用Supabase函数）
export async function searchTools(params: SearchParams): Promise<ApiResponse<AITool[]>> {
  try {
    const { data, error } = await supabase.rpc('search_ai_tools', {
      search_query: params.query || '',
      category_filter: params.category || null,
      is_free_filter: params.is_free,
      tag_filter: params.tags || null,
      sort_by: params.sort || 'created_at',
      sort_order: 'DESC',
      limit_count: params.limit || 12,
      offset_count: ((params.page || 1) - 1) * (params.limit || 12)
    });

    if (error) {
      console.error('搜索工具失败:', error);
      return { data: [], error: error.message };
    }

    return { data: data || [], count: data?.length || 0 };
  } catch (err) {
    console.error('搜索工具异常:', err);
    return { data: [], error: (err as Error).message };
  }
}

// 增加工具浏览量
export async function incrementToolViews(toolId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('increment_tool_views', {
      tool_id: toolId
    });

    if (error) {
      console.error('增加浏览量失败:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('增加浏览量异常:', err);
    return false;
  }
}

// 获取分类下的工具数量
export async function getCategoryToolCount(categoryId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from(TABLES.TOOLS)
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId)
      .eq('status', 'active');

    if (error) {
      console.error('获取分类工具数量失败:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('获取分类工具数量异常:', err);
    return 0;
  }
}

// ============ 网站导航相关API ============

// 获取所有导航分类
export async function getNavCategories(): Promise<NavCategory[]> {
  try {
    const { data, error } = await supabase
      .from(TABLES.NAV_CATEGORIES)
      .select('*')
      .order('sort_order');
      
    if (error) {
      console.error('获取导航分类失败:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('获取导航分类异常:', err);
    return [];
  }
}

// 获取网站列表（支持分页和筛选）
export async function getWebsites(params: SearchParams = {}): Promise<ApiResponse<Website[]>> {
  try {
    let query = supabase
      .from(TABLES.WEBSITES)
      .select(`
        *,
        nav_categories(
          id,
          name,
          icon,
          color
        )
      `)
      .eq('status', '✅ 有效');

    // 分类筛选
    if (params.category) {
      query = query.eq('category_id', params.category);
    }

    // 搜索
    if (params.query) {
      query = query.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%,subcategory.ilike.%${params.query}%`);
    }

    // 排序
    switch (params.sort) {
      case 'popular':
        query = query.order('click_count', { ascending: false });
        break;
      case 'latest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'priority':
        query = query.order('priority', { ascending: false });
        break;
      default:
        query = query.order('sequence_number', { ascending: true });
        break;
    }

    // 分页
    const page = params.page || 1;
    const limit = params.limit || 12;
    const offset = (page - 1) * limit;

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('获取网站列表失败:', error);
      return { data: [], count: 0, error: error.message };
    }

    return { data: data || [], count: count || 0 };
  } catch (err) {
    console.error('获取网站列表异常:', err);
    return { data: [], count: 0, error: (err as Error).message };
  }
}

// 获取精选网站
export async function getFeaturedWebsites(limit = 8): Promise<Website[]> {
  try {
    const { data, error } = await supabase
      .from(TABLES.WEBSITES)
      .select(`
        *,
        nav_categories(
          id,
          name,
          icon,
          color
        )
      `)
      .eq('status', '✅ 有效')
      .eq('is_featured', true)
      .order('click_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('获取精选网站失败:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('获取精选网站异常:', err);
    return [];
  }
}

// 获取分类下的网站数量
export async function getNavCategoryWebsiteCount(categoryId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from(TABLES.WEBSITES)
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId)
      .eq('status', '✅ 有效');

    if (error) {
      console.error('获取分类网站数量失败:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('获取分类网站数量异常:', err);
    return 0;
  }
}

// 增加网站点击量
export async function incrementWebsiteClicks(websiteId: string): Promise<boolean> {
  try {
    // 先获取当前点击量
    const { data: currentData, error: fetchError } = await supabase
      .from(TABLES.WEBSITES)
      .select('click_count')
      .eq('id', websiteId)
      .single();

    if (fetchError) {
      console.error('获取当前点击量失败:', fetchError);
      return false;
    }

    // 更新点击量
    const { error } = await supabase
      .from(TABLES.WEBSITES)
      .update({ click_count: (currentData?.click_count || 0) + 1 })
      .eq('id', websiteId);

    if (error) {
      console.error('增加网站点击量失败:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('增加网站点击量异常:', err);
    return false;
  }
}

// 搜索网站
export async function searchWebsites(params: SearchParams): Promise<ApiResponse<Website[]>> {
  try {
    const { data, error } = await supabase.rpc('search_websites', {
      search_query: params.query || ''
    });

    if (error) {
      console.error('搜索网站失败:', error);
      return { data: [], error: error.message };
    }

    return { data: data || [], count: data?.length || 0 };
  } catch (err) {
    console.error('搜索网站异常:', err);
    return { data: [], error: (err as Error).message };
  }
}