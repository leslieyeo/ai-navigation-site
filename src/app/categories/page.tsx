'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CategoryCard from '@/components/CategoryCard';
import { getCategories, getCategoryToolCount } from '@/lib/api';
import { Category } from '@/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await getCategories();
        
        // 为每个分类获取工具数量
        const categoriesWithCounts = await Promise.all(
          categoriesData.map(async (category) => ({
            ...category,
            toolCount: await getCategoryToolCount(category.id)
          }))
        );
        
        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error('获取分类失败:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI工具分类
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              按分类浏览AI工具，快速找到适合您需求的解决方案
            </p>
          </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              toolCount={(category as any).toolCount || 0}
              index={index}
            />
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              暂无分类
            </h3>
            <p className="text-gray-600">
              分类正在整理中，请稍后再来查看
            </p>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {categories.length}
              </div>
              <div className="text-gray-600">个分类</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {categories.reduce((sum, cat) => sum + ((cat as any).toolCount || 0), 0)}
              </div>
              <div className="text-gray-600">个工具</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold text-gray-900 mb-2">
                100%
              </div>
              <div className="text-gray-600">免费使用</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold text-gray-900 mb-2">
                24/7
              </div>
              <div className="text-gray-600">随时访问</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}