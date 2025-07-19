'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { AITool } from '@/types';

interface ToolCardProps {
  tool: AITool;
  index?: number;
}

export default function ToolCard({ tool, index = 0 }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
                {tool.logo_url ? (
                  <Image
                    src={tool.logo_url}
                    alt={tool.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-blue-600 font-bold text-lg">
                    {tool.name.charAt(0)}
                  </span>
                )}
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  {tool.is_free ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      免费
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      付费
                    </span>
                  )}
                  {tool.rating && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-600">{tool.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Views */}
            <div className="text-right">
              <div className="text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {tool.views.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              {tool.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
              {tool.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                  +{tool.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {tool.pricing || '查看详情'}
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/tools/${tool.id}`}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                详情
              </Link>
              <motion.a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                访问
                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}