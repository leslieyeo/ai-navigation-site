# AI导航站 🤖

一个现代化的AI工具导航网站，帮助用户发现和使用最新的AI工具。

## 🚀 技术栈

- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **部署**: Vercel
- **动画**: Framer Motion
- **状态管理**: Zustand
- **多语言**: next-intl

## 🌟 功能特性

- 🔍 智能搜索和分类
- 🎨 炫酷的动画效果
- 🌍 多语言支持 (中文/英文)
- 📱 响应式设计
- ⚡ 快速加载
- 🆓 完全免费部署

## 🏗️ 项目结构

```
ai-navigation-site/
├── README.md
├── .gitignore
├── package.json
├── next.config.ts
├── tailwind.config.js
├── tsconfig.json
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # 可复用组件
│   ├── lib/             # 工具函数和配置
│   ├── types/           # TypeScript类型定义
│   └── utils/           # 辅助函数
├── public/              # 静态资源
└── supabase/           # Supabase配置和SQL
```

## 🚀 快速开始

1. 克隆项目
```bash
git clone <repository-url>
cd ai-navigation-site
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，填入你的Supabase配置
```

4. 启动开发服务器
```bash
npm run dev
```

5. 打开 [http://localhost:3000](http://localhost:3000) 查看结果

## 📦 部署

### Vercel部署 (推荐)

1. 将代码推送到GitHub
2. 在Vercel中导入你的GitHub仓库
3. 配置环境变量
4. 自动部署完成

### 手动部署

```bash
npm run build
npm start
```

## 🗄️ 数据库设置

1. 注册 [Supabase](https://supabase.com) 账号
2. 创建新项目
3. 在SQL编辑器中运行 `supabase/schema.sql`
4. 获取项目URL和API密钥
5. 更新 `.env.local` 文件

## 🎨 自定义

### 添加新的AI工具分类
编辑 `src/utils/constants.ts` 文件

### 修改主题颜色
编辑 `tailwind.config.js` 文件

### 添加新语言
编辑 `src/lib/i18n.ts` 文件

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License