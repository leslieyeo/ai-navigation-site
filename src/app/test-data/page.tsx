'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDataPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testData() {
      try {
        // 测试分类数据
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('nav_categories')
          .select('*')
          .limit(5);

        if (categoriesError) {
          console.error('分类查询错误:', categoriesError);
          setError('分类查询错误: ' + categoriesError.message);
        } else {
          setCategories(categoriesData || []);
          console.log('分类数据:', categoriesData);
        }

        // 测试网站数据
        const { data: websitesData, error: websitesError } = await supabase
          .from('websites')
          .select('*')
          .limit(10);

        if (websitesError) {
          console.error('网站查询错误:', websitesError);
          setError('网站查询错误: ' + websitesError.message);
        } else {
          setWebsites(websitesData || []);
          console.log('网站数据:', websitesData);
        }

      } catch (err) {
        console.error('测试数据错误:', err);
        setError('测试数据错误: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    testData();
  }, []);

  if (loading) {
    return <div className="p-8">加载中...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">数据测试页面</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          错误: {error}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">导航分类 ({categories.length})</h2>
        <div className="bg-gray-100 p-4 rounded">
          <pre className="text-sm">{JSON.stringify(categories, null, 2)}</pre>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">网站数据 ({websites.length})</h2>
        <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
          <pre className="text-sm">{JSON.stringify(websites.slice(0, 3), null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}