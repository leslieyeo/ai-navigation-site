'use client';

import { motion } from 'framer-motion';
import { Website } from '@/types';
import { incrementWebsiteClicks } from '@/lib/api';

interface WebsiteCardProps {
  website: Website;
  index: number;
}

export default function WebsiteCard({ website, index }: WebsiteCardProps) {
  const handleClick = async () => {
    // 增加点击量（异步，不等待结果）
    incrementWebsiteClicks(website.id).catch(console.error);
    
    // 打开网站链接
    window.open(website.url, '_blank', 'noopener,noreferrer');
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case '🥇': return 'text-yellow-600 bg-yellow-50';
      case '🥈': return 'text-gray-600 bg-gray-50';
      case '🥉': return 'text-orange-600 bg-orange-50';
      case '👍': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getPriorityText = (priority?: string) => {
    switch (priority) {
      case '🥇': return '金牌推荐';
      case '🥈': return '银牌推荐';
      case '🥉': return '铜牌推荐';
      case '👍': return '特别推荐';
      default: return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      {/* 网站标题和分类图标 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {website.nav_categories?.icon && (
            <span className="text-2xl">{website.nav_categories.icon}</span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {website.title}
          </h3>
        </div>
        
        {/* 优先级标签 */}
        {website.priority && getPriorityText(website.priority) && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(website.priority)}`}>
            {website.priority} {getPriorityText(website.priority)}
          </span>
        )}
      </div>

      {/* 子分类 */}
      {website.subcategory && (
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
            {website.subcategory}
          </span>
        </div>
      )}

      {/* 描述 */}
      {website.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {website.description}
        </p>
      )}

      {/* 底部信息 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          {/* 分类名称 */}
          {website.nav_categories?.name && (
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {website.nav_categories.name}
            </span>
          )}
          
          {/* 点击量 */}
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{website.click_count || 0}次访问</span>
          </div>
        </div>

        {/* 响应时间 */}
        {website.response_time && (
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{Math.round(website.response_time)}ms</span>
          </div>
        )}
      </div>

      {/* 悬浮时的外部链接图标 */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </motion.div>
  );
}