'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SearchSection from '@/components/SearchSection';
import CategoryCard from '@/components/CategoryCard';
import ToolCard from '@/components/ToolCard';
import NavCategoryCard from '@/components/NavCategoryCard';
import WebsiteCard from '@/components/WebsiteCard';
import { getCategories, getFeaturedTools, getCategoryToolCount, getNavCategories, getFeaturedWebsites, getNavCategoryWebsiteCount } from '@/lib/api';
import { Category, AITool, NavCategory, Website } from '@/types';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredTools, setFeaturedTools] = useState<AITool[]>([]);
  const [navCategories, setNavCategories] = useState<NavCategory[]>([]);
  const [featuredWebsites, setFeaturedWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, toolsData, navCategoriesData, websitesData] = await Promise.all([
          getCategories(),
          getFeaturedTools(8),
          getNavCategories(),
          getFeaturedWebsites(8)
        ]);
        
        // 为每个AI工具分类获取工具数量
        const categoriesWithCounts = await Promise.all(
          categoriesData.map(async (category) => ({
            ...category,
            toolCount: await getCategoryToolCount(category.id)
          }))
        );
        
        // 为每个网站分类获取网站数量
        const navCategoriesWithCounts = await Promise.all(
          navCategoriesData.map(async (category) => ({
            ...category,
            websiteCount: await getNavCategoryWebsiteCount(category.id)
          }))
        );
        
        setCategories(categoriesWithCounts);
        setFeaturedTools(toolsData);
        setNavCategories(navCategoriesWithCounts);
        setFeaturedWebsites(websitesData);
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    console.log('搜索:', query);
    // TODO: 实现搜索功能
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <SearchSection onSearch={handleSearch} />

      {/* Website Navigation Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              精选网站分类
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              从影视娱乐到学习工作，从开发工具到生活服务，发现优质网站资源
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {navCategories.map((category, index) => (
              <NavCategoryCard
                key={category.id}
                category={category}
                websiteCount={(category as any).websiteCount || 0}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI工具分类
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              从写作到绘画，从代码到视频，找到最适合你需求的AI工具
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                toolCount={(category as any).toolCount || 0}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Websites Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              精选网站推荐
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              最受欢迎和最实用的网站资源，提升你的工作和生活效率
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredWebsites.map((website, index) => (
              <WebsiteCard
                key={website.id}
                website={website}
                index={index}
              />
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/websites"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              查看全部网站
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured AI Tools Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              精选AI工具
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              最受欢迎和最新的AI工具，助力你的创作和工作
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredTools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                index={index}
              />
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/tools"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              查看全部AI工具
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">117+</div>
              <div className="text-lg opacity-90">优质网站</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">12+</div>
              <div className="text-lg opacity-90">精选分类</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-lg opacity-90">日访问量</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">99%</div>
              <div className="text-lg opacity-90">有效链接</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}