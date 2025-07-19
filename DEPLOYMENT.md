# 🚀 AI导航站部署指南

## 快速部署到Vercel

### 方式一：通过Vercel网站部署（推荐）

1. **登录Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用GitHub账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 导入你的GitHub仓库

3. **配置环境变量**
   在Vercel项目设置中添加以下环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=你的supabase项目URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的supabase匿名密钥
   NEXT_PUBLIC_APP_NAME=AI导航站
   NEXT_PUBLIC_APP_DESCRIPTION=发现最新最好用的AI工具
   ```

4. **部署**
   - 点击 "Deploy" 按钮
   - 等待构建完成（通常2-3分钟）

### 方式二：通过Vercel CLI部署

1. **安装Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **初始化项目**
   ```bash
   vercel
   ```

4. **设置环境变量**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

5. **部署**
   ```bash
   vercel --prod
   ```

## 环境变量说明

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase项目URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase匿名密钥 | ✅ |
| `NEXT_PUBLIC_APP_NAME` | 应用名称 | ❌ |
| `NEXT_PUBLIC_APP_DESCRIPTION` | 应用描述 | ❌ |

## 部署后检查

部署完成后，请检查以下项目：

1. **基本功能**
   - [ ] 首页加载正常
   - [ ] 分类页面显示数据
   - [ ] 工具列表页面显示数据
   - [ ] 搜索功能正常

2. **SEO优化**
   - [ ] `/robots.txt` 可访问
   - [ ] `/sitemap.xml` 可访问
   - [ ] 页面meta标签完整

3. **性能检查**
   - [ ] 页面加载速度
   - [ ] 图片优化
   - [ ] 代码分割

## 常见问题

### Q: 部署失败，显示环境变量错误
A: 确保在Vercel项目设置中正确配置了所有必需的环境变量。

### Q: 页面显示"连接失败"
A: 检查Supabase的URL和密钥是否正确，确保Supabase项目状态正常。

### Q: 搜索功能不工作
A: 确保Supabase数据库中已执行了所有SQL脚本，包括搜索函数。

## 自定义域名

1. 在Vercel项目设置中点击 "Domains"
2. 添加你的自定义域名
3. 按照提示配置DNS记录

## 监控和分析

Vercel提供了以下监控功能：
- 访问统计
- 性能监控
- 错误日志
- 实时日志

访问 Vercel Dashboard 查看详细数据。

## 更新部署

每次推送到主分支时，Vercel会自动重新部署。你也可以：

1. 在Vercel Dashboard手动触发部署
2. 使用CLI命令：`vercel --prod`

## 回滚

如果新版本有问题，可以在Vercel Dashboard中回滚到之前的版本。

---

🎉 恭喜！你的AI导航站已成功部署！