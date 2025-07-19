-- 网站导航数据库Schema
-- 删除已存在的表（如果需要重新创建）
DROP TABLE IF EXISTS website_tags CASCADE;
DROP TABLE IF EXISTS websites CASCADE; 
DROP TABLE IF EXISTS nav_categories CASCADE;

-- 创建导航分类表
CREATE TABLE nav_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10) DEFAULT '🌐',
  color VARCHAR(20) DEFAULT 'blue',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建网站表
CREATE TABLE websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_number INTEGER, -- 序号
  title VARCHAR(200) NOT NULL, -- 链接标题
  url TEXT NOT NULL, -- URL
  description TEXT, -- 描述
  category_id UUID REFERENCES nav_categories(id),
  subcategory VARCHAR(200), -- 子分类
  priority VARCHAR(10), -- 优先级 (🥇🥈🥉👍)
  response_time DECIMAL(10,2), -- 响应时间(ms)
  status VARCHAR(20) DEFAULT '✅ 有效', -- 验证状态
  is_featured BOOLEAN DEFAULT false,
  click_count INTEGER DEFAULT 0,
  favicon_url TEXT,
  screenshot_url TEXT,
  tags TEXT[], -- 标签数组
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建网站标签表（可选，用于更细粒度的标签管理）
CREATE TABLE website_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_websites_category ON websites(category_id);
CREATE INDEX idx_websites_status ON websites(status);
CREATE INDEX idx_websites_priority ON websites(priority);
CREATE INDEX idx_websites_sequence ON websites(sequence_number);
CREATE INDEX idx_website_tags_website_id ON website_tags(website_id);
CREATE INDEX idx_website_tags_tag ON website_tags(tag);

-- 插入导航分类数据
INSERT INTO nav_categories (name, description, icon, color, sort_order) VALUES
('影视娱乐', '影视、动漫、直播、纪录片等娱乐资源', '🎬', 'red', 1),
('图书资源', '电子书、漫画、音乐、听书等学习资源', '📚', 'blue', 2),
('BT磁力', 'BT磁力资源搜索工具', '🧲', 'purple', 3),
('AI工具', '免费AI工具和教程', '🤖', 'green', 4),
('特惠福利', '优惠券、折扣等特惠信息', '💰', 'yellow', 5),
('软件工具', '电脑手机常用软件工具', '💻', 'indigo', 6),
('常用网站', '开发工具、实用网站等', '🌐', 'cyan', 7),
('学习教育', '在线课程、教育资源', '🎓', 'teal', 8),
('设计创作', '设计工具、影视后期', '🎨', 'pink', 9),
('考试认证', '考证、考级等资源', '📝', 'orange', 10),
('实用导航', '导航网站集合', '🧭', 'gray', 11),
('站内功能', '本站相关功能和链接', '⚙️', 'slate', 12);

-- 启用行级安全
ALTER TABLE nav_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_tags ENABLE ROW LEVEL SECURITY;

-- 创建政策：允许所有人读取
CREATE POLICY "Allow read access for all users" ON nav_categories FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON websites FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON website_tags FOR SELECT USING (true);

-- 创建政策：只允许认证用户写入（管理员）
CREATE POLICY "Allow insert for authenticated users" ON nav_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow update for authenticated users" ON nav_categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow delete for authenticated users" ON nav_categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON websites FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow update for authenticated users" ON websites FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow delete for authenticated users" ON websites FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON website_tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow update for authenticated users" ON website_tags FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow delete for authenticated users" ON website_tags FOR DELETE USING (auth.role() = 'authenticated');

-- 创建搜索函数
CREATE OR REPLACE FUNCTION search_websites(search_query TEXT)
RETURNS TABLE (
  id UUID,
  title VARCHAR(200),
  url TEXT,
  description TEXT,
  category_id UUID,
  subcategory VARCHAR(200),
  priority VARCHAR(10),
  response_time DECIMAL(10,2),
  status VARCHAR(20),
  category_name VARCHAR(100),
  category_icon VARCHAR(10),
  category_color VARCHAR(20)
) 
LANGUAGE SQL STABLE
AS $$
  SELECT 
    w.id,
    w.title,
    w.url,
    w.description,
    w.category_id,
    w.subcategory,
    w.priority,
    w.response_time,
    w.status,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color
  FROM websites w
  LEFT JOIN nav_categories c ON w.category_id = c.id
  WHERE 
    w.status = '✅ 有效' AND
    (search_query IS NULL OR search_query = '' OR
     w.title ILIKE '%' || search_query || '%' OR
     w.description ILIKE '%' || search_query || '%' OR
     w.subcategory ILIKE '%' || search_query || '%' OR
     c.name ILIKE '%' || search_query || '%')
  ORDER BY 
    w.sequence_number ASC,
    w.priority DESC,
    w.click_count DESC;
$$;