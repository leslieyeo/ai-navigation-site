// 应用常量
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'AI导航站',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || '发现最新最好用的AI工具',
  url: 'https://ai-tools.vercel.app',
  author: 'AI Navigation Team',
} as const;

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
} as const;

// 支持的语言
export const LOCALES = ['zh', 'en'] as const;

// 工具排序选项
export const SORT_OPTIONS = [
  { value: 'latest', label: '最新' },
  { value: 'popular', label: '最热门' },
  { value: 'rating', label: '评分最高' },
] as const;

// 默认分类颜色
export const CATEGORY_COLORS = [
  'bg-blue-500',
  'bg-green-500', 
  'bg-purple-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-indigo-500',
  'bg-pink-500',
  'bg-gray-500',
] as const;