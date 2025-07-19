# Supabase 数据库配置

## 📊 数据库架构

### 表结构

1. **categories** - 分类表
   - 存储AI工具的分类信息
   - 包含名称、描述、图标、颜色等

2. **ai_tools** - AI工具表
   - 核心表，存储所有AI工具信息
   - 包含名称、描述、URL、评分、浏览量等

3. **tags** - 标签表
   - 存储工具标签信息
   - 用于工具的多维度分类

4. **tool_tags** - 工具标签关联表
   - 多对多关系表
   - 连接工具和标签

## 🚀 部署步骤

### 1. 在Supabase控制台执行SQL

1. 登录 [Supabase控制台](https://app.supabase.com)
2. 选择你的项目
3. 进入 "SQL Editor"
4. 依次执行以下文件：
   ```sql
   -- 首先执行基础架构
   supabase/schema.sql
   
   -- 然后配置安全策略
   supabase/rls.sql
   ```

### 2. 验证部署

执行以下查询验证表是否创建成功：

```sql
-- 查看所有表
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- 查看分类数据
SELECT * FROM categories;

-- 查看示例工具数据
SELECT * FROM ai_tools;
```

## 🔧 API使用示例

### 获取所有分类
```sql
SELECT * FROM categories ORDER BY sort_order;
```

### 搜索AI工具
```sql
SELECT * FROM search_ai_tools(
    search_query => 'ChatGPT',
    category_filter => NULL,
    is_free_filter => NULL,
    tag_filter => NULL,
    sort_by => 'views',
    sort_order => 'DESC',
    limit_count => 10,
    offset_count => 0
);
```

### 获取热门工具
```sql
SELECT * FROM ai_tools 
WHERE status = 'active' 
ORDER BY views DESC 
LIMIT 10;
```

### 增加工具浏览量
```sql
SELECT increment_tool_views('tool_id_here');
```

## 🔒 安全配置

- 启用了行级安全策略（RLS）
- 只允许查看状态为 'active' 的工具
- 所有写操作需要认证（可在后台管理中配置）

## 📈 性能优化

- 创建了必要的索引
- 优化了搜索函数
- 支持分页和排序

## 🎯 后续扩展

可以根据需要添加以下功能：
- 用户收藏系统
- 工具评论和评分
- 用户认证和个人资料
- 工具提交和审核流程