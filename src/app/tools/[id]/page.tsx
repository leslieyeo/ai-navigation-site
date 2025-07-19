'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import { getToolById, getAITools, incrementToolViews } from '@/lib/api';
import { AITool } from '@/types';

export default function ToolDetailPage() {
  const [tool, setTool] = useState<AITool | null>(null);
  const [relatedTools, setRelatedTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const toolId = params.id as string;

  useEffect(() => {
    async function fetchTool() {
      if (!toolId) return;
      
      setLoading(true);
      try {
        const toolData = await getToolById(toolId);
        
        if (!toolData) {
          setNotFound(true);
          return;
        }
        
        setTool(toolData);
        
        // 增加浏览量
        incrementToolViews(toolId);
        
        // 获取相关工具
        if (toolData.category_id) {
          const { data: related } = await getAITools({
            category: toolData.category_id,
            limit: 4
          });
          setRelatedTools(related.filter(t => t.id !== toolId));
        }
      } catch (error) {
        console.error('获取工具详情失败:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchTool();
  }, [toolId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (notFound || !tool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">工具未找到</h1>
          <p className="text-gray-600 mb-6">抱歉，您访问的工具不存在或已被删除</p>
          <Link 
            href="/tools"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            浏览所有工具
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">首页</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-gray-700">工具</Link>
            <span>/</span>
            <span className="text-gray-900">{tool.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="p-8 pb-6">
                <div className="flex items-start space-x-6">
                  {/* Logo */}
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {tool.logo_url ? (
                      <Image
                        src={tool.logo_url}
                        alt={tool.name}
                        width={80}
                        height={80}
                        className="rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-blue-600 font-bold text-2xl">
                        {tool.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {tool.name}
                    </h1>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      {tool.is_free ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          免费
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                          付费
                        </span>
                      )}
                      
                      {tool.rating && (
                        <div className="flex items-center space-x-1">
                          <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-gray-700 font-medium">{tool.rating}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-500">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {tool.views.toLocaleString()} 次访问
                      </div>
                    </div>

                    {/* Tags */}
                    {tool.tags && tool.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tool.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="px-8 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">工具介绍</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {tool.description}
                </p>
              </div>

              {/* Pricing */}
              {tool.pricing && (
                <div className="px-8 pb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">价格信息</h2>
                  <p className="text-gray-700">{tool.pricing}</p>
                </div>
              )}

              {/* Action Button */}
              <div className="px-8 pb-8">
                <motion.a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  访问 {tool.name}
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Category Info */}
            {(tool as any).categories && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">分类</h3>
                <Link
                  href={`/categories/${(tool as any).categories.id}`}
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <span className="text-lg">{(tool as any).categories.icon}</span>
                  <span className="font-medium">{(tool as any).categories.name}</span>
                </Link>
              </motion.div>
            )}

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">相关工具</h3>
                <div className="space-y-4">
                  {relatedTools.slice(0, 3).map((relatedTool, index) => (
                    <div key={relatedTool.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <Link href={`/tools/${relatedTool.id}`} className="block group">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center flex-shrink-0">
                            {relatedTool.logo_url ? (
                              <Image
                                src={relatedTool.logo_url}
                                alt={relatedTool.name}
                                width={40}
                                height={40}
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <span className="text-blue-600 font-bold">
                                {relatedTool.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {relatedTool.name}
                            </h4>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {relatedTool.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/tools?category=${tool.category_id}`}
                  className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  查看更多相关工具
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}