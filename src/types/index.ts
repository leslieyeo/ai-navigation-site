// AI工具类型定义
export interface AITool {
  id: string;
  name: string;
  description: string;
  url: string;
  logo_url?: string;
  category_id: string;
  tags: string[];
  is_free: boolean;
  pricing?: string;
  rating?: number;
  views: number;
  created_at: string;
  updated_at: string;
}

// 分类类型定义
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at: string;
}

// 搜索参数类型
export interface SearchParams {
  query?: string;
  category?: string;
  is_free?: boolean;
  tags?: string[];
  sort?: 'latest' | 'popular' | 'rating' | 'priority';
  page?: number;
  limit?: number;
}

// API响应类型
export interface ApiResponse<T> {
  data: T;
  count?: number;
  error?: string;
}

// 语言类型
export type Locale = 'zh' | 'en';

// 主题类型
export type Theme = 'light' | 'dark';

// ============ 网站导航相关类型 ============

// 网站类型定义
export interface Website {
  id: string;
  sequence_number?: number;
  title: string;
  url: string;
  description?: string;
  category_id: string;
  subcategory?: string;
  priority?: string;
  response_time?: number;
  status: string;
  is_featured: boolean;
  click_count: number;
  favicon_url?: string;
  screenshot_url?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  nav_categories?: NavCategory;
}

// 导航分类类型定义
export interface NavCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}