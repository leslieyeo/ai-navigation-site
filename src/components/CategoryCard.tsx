'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  toolCount?: number;
  index?: number;
}

export default function CategoryCard({ category, toolCount = 0, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/categories/${category.id}`}>
        <div className={`
          relative overflow-hidden rounded-xl p-6 text-white cursor-pointer
          bg-gradient-to-br ${category.color || 'from-blue-500 to-blue-600'}
          hover:shadow-2xl transition-all duration-300
          group
        `}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/20"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">
                {category.icon || '🤖'}
              </div>
              <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-2 group-hover:scale-105 transition-transform">
              {category.name}
            </h3>

            {/* Description */}
            {category.description && (
              <p className="text-white/80 text-sm mb-4 line-clamp-2">
                {category.description}
              </p>
            )}

            {/* Tool Count */}
            <div className="flex items-center justify-between">
              <span className="text-white/90 text-sm">
                {toolCount} 个工具
              </span>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center text-sm opacity-80"
              >
                探索更多
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
    </motion.div>
  );
}