'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchSectionProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function SearchSection({ 
  onSearch, 
  placeholder = "搜索AI工具、描述或功能..." 
}: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const popularSearches = [
    'ChatGPT', 'Midjourney', '文本生成', '图像处理', 
    '代码辅助', '视频制作', '语音合成', 'PPT制作'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            发现最好用的
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}AI工具
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            精心筛选的AI工具集合，提升你的工作效率，释放创造力
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative max-w-2xl mx-auto mb-8"
          >
            <form onSubmit={handleSearch} className="relative">
              <div className={`
                relative flex items-center bg-white rounded-2xl shadow-lg
                transition-all duration-300 overflow-hidden
                ${isFocused ? 'shadow-2xl ring-4 ring-blue-500/20' : 'hover:shadow-xl'}
              `}>
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full px-6 py-4 text-lg text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="m-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>搜索</span>
                </motion.button>
              </div>
            </form>

            {/* Search Suggestions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6"
            >
              <p className="text-sm text-gray-500 mb-3">热门搜索：</p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularSearches.map((term, index) => (
                  <motion.button
                    key={term}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery(term);
                      onSearch?.(term);
                    }}
                    className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
                  >
                    {term}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center space-x-8 text-center"
          >
            <div>
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">AI工具</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">分类</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600">用户</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}