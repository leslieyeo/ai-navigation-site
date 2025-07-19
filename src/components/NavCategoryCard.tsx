'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { NavCategory } from '@/types';

interface NavCategoryCardProps {
  category: NavCategory;
  websiteCount: number;
  index: number;
}

export default function NavCategoryCard({ category, websiteCount, index }: NavCategoryCardProps) {
  const getColorClasses = (color?: string) => {
    const colorMap: Record<string, string> = {
      red: 'bg-red-50 border-red-200 hover:bg-red-100 text-red-700',
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700',
      green: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700',
      yellow: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 text-yellow-700',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700',
      pink: 'bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-700',
      indigo: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-700',
      cyan: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100 text-cyan-700',
      teal: 'bg-teal-50 border-teal-200 hover:bg-teal-100 text-teal-700',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700',
      gray: 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700',
      slate: 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700',
    };
    
    return colorMap[color || 'gray'] || colorMap.gray;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.05 }}
      className="relative"
    >
      <Link href={`/websites?category=${category.id}`}>
        <div className={`
          relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 cursor-pointer
          ${getColorClasses(category.color)}
        `}>
          {/* 分类图标 */}
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">
              {category.icon || '🌐'}
            </div>
          </div>

          {/* 分类名称 */}
          <h3 className="text-lg font-semibold text-center mb-2">
            {category.name}
          </h3>

          {/* 分类描述 */}
          {category.description && (
            <p className="text-sm text-center mb-3 opacity-80 line-clamp-2">
              {category.description}
            </p>
          )}

          {/* 网站数量 */}
          <div className="text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-50">
              {websiteCount} 个网站
            </span>
          </div>

          {/* 装饰性背景图案 */}
          <div className="absolute -top-2 -right-2 w-16 h-16 opacity-10">
            <div className="w-full h-full rounded-full bg-current"></div>
          </div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 opacity-5">
            <div className="w-full h-full rounded-full bg-current"></div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}