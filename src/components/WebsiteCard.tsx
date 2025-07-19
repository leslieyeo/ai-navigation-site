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

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    switch (priority) {
      case '🥇':
        return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">金牌</span>;
      case '🥈':
        return <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">银牌</span>;
      case '🥉':
        return <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">铜牌</span>;
      case '👍':
        return <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">推荐</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      {/* 标题和优先级 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {website.nav_categories?.icon && (
            <span className="text-xl flex-shrink-0">{website.nav_categories.icon}</span>
          )}
          <h3 className="font-semibold text-gray-900 text-sm truncate">
            {website.title}
          </h3>
        </div>
        {getPriorityBadge(website.priority)}
      </div>

      {/* 子分类 */}
      {website.subcategory && (
        <div className="mb-2">
          <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
            {website.subcategory}
          </span>
        </div>
      )}

      {/* 描述 */}
      {website.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {website.description}
        </p>
      )}

      {/* 底部信息 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          {/* 分类 */}
          {website.nav_categories?.name && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {website.nav_categories.name}
            </span>
          )}
          
          {/* 访问次数 */}
          <span>{website.click_count || 0} 次访问</span>
        </div>

        {/* 响应时间 */}
        {website.response_time && (
          <span className="text-green-600">
            {Math.round(website.response_time)}ms
          </span>
        )}
      </div>
    </motion.div>
  );
}