'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { testSupabaseConnection } from '@/lib/supabase-test';

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState('testing...');

  useEffect(() => {
    async function test() {
      try {
        console.log('开始测试Supabase连接...');
        const isConnected = await testSupabaseConnection();
        
        if (isConnected) {
          setConnectionStatus('✅ 连接成功');
        } else {
          setConnectionStatus('❌ 连接失败');
        }
      } catch (error) {
        console.error('测试失败:', error);
        setConnectionStatus('❌ 测试异常: ' + (error as Error).message);
      }
    }

    test();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Supabase连接测试</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">连接状态:</h2>
            <p className="text-gray-600">{connectionStatus}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">环境变量:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm">
              SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已配置' : '❌ 未配置'}
              {'\n'}SUPABASE_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 已配置' : '❌ 未配置'}
            </pre>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}