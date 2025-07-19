'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import ToolCard from '@/components/ToolCard';
import { getAITools, getCategories } from '@/lib/api';
import { AITool, Category, SearchParams } from '@/types';

export default function ToolsPage() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchParams>({
    page: 1,
    limit: 12,
    sort: 'latest'
  });
  const [totalCount, setTotalCount] = useState(0);

  const searchParams = useSearchParams();

  useEffect(() => {
    // 从URL参数获取初始筛选条件
    const categoryParam = searchParams.get('category');
    const queryParam = searchParams.get('q');
    const freeParam = searchParams.get('free');

    setFilters(prev => ({
      ...prev,
      category: categoryParam || undefined,
      query: queryParam || undefined,
      is_free: freeParam === 'true' ? true : freeParam === 'false' ? false : undefined
    }));
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [toolsResponse, categoriesData] = await Promise.all([
          getAITools(filters),
          getCategories()
        ]);
        
        setTools(toolsResponse.data);
        setTotalCount(toolsResponse.count || 0);
        setCategories(categoriesData);
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<SearchParams>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // 重置到第一页
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / (filters.limit || 12));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI工具大全
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              发现 {totalCount} 个精选AI工具，提升你的工作效率
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">筛选条件</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  搜索
                </label>
                <input
                  type="text"
                  placeholder="搜索工具名称或描述..."
                  value={filters.query || ''}
                  onChange={(e) => handleFilterChange({ query: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Free/Paid Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  价格
                </label>
                <select
                  value={filters.is_free === true ? 'true' : filters.is_free === false ? 'false' : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange({ 
                      is_free: value === 'true' ? true : value === 'false' ? false : undefined 
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部</option>
                  <option value="true">免费</option>
                  <option value="false">付费</option>
                </select>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  排序
                </label>
                <select
                  value={filters.sort || 'latest'}
                  onChange={(e) => handleFilterChange({ sort: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="latest">最新</option>
                  <option value="popular">最热门</option>
                  <option value="rating">评分最高</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({ page: 1, limit: 12, sort: 'latest' })}
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                清除筛选
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                找到 <span className="font-semibold text-gray-900">{totalCount}</span> 个工具
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">每页显示:</span>
                <select
                  value={filters.limit || 12}
                  onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Tools Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {tools.map((tool, index) => (
                  <ToolCard key={tool.id} tool={tool} index={index} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && tools.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  未找到相关工具
                </h3>
                <p className="text-gray-600 mb-4">
                  尝试调整筛选条件或搜索关键词
                </p>
                <button
                  onClick={() => setFilters({ page: 1, limit: 12, sort: 'latest' })}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  清除所有筛选条件
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange((filters.page || 1) - 1)}
                  disabled={(filters.page || 1) <= 1}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const currentPage = filters.page || 1;
                  let pageNum;
                  
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm rounded-md ${
                        pageNum === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange((filters.page || 1) + 1)}
                  disabled={(filters.page || 1) >= totalPages}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}