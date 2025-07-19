import Link from 'next/link';

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🤖 AI导航站
        </h1>
        <p className="text-gray-600 mb-6">
          发现最好用的AI工具
        </p>
        <div className="space-x-4">
          <Link 
            href="/test" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            测试连接
          </Link>
          <Link 
            href="/" 
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            完整版首页
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>如果你看到这个页面，说明Next.js运行正常</p>
          <p>URL: http://localhost:3000/simple</p>
        </div>
      </div>
    </div>
  );
}