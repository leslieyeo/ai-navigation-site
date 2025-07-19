'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">AI</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              导航站
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              首页
            </Link>
            <Link 
              href="/tools" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              工具
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              分类
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              关于
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索AI工具..."
                className="w-64 px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-gray-200"
          >
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                首页
              </Link>
              <Link href="/tools" className="text-gray-700 hover:text-blue-600 transition-colors">
                工具
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition-colors">
                分类
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                关于
              </Link>
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索AI工具..."
                  className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}