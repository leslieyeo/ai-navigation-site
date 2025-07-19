#!/bin/bash

# AI导航站部署脚本

echo "🚀 开始部署AI导航站..."

# 检查环境变量
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ 错误: NEXT_PUBLIC_SUPABASE_URL 环境变量未设置"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ 错误: NEXT_PUBLIC_SUPABASE_ANON_KEY 环境变量未设置"
    exit 1
fi

echo "✅ 环境变量检查通过"

# 安装依赖
echo "📦 安装依赖..."
npm ci

# 类型检查
echo "🔍 运行类型检查..."
npm run type-check

# Lint检查
echo "🧹 运行代码检查..."
npm run lint

# 构建项目
echo "🏗️ 构建项目..."
npm run build

echo "✅ 构建完成！"
echo "🌐 准备部署到Vercel..."