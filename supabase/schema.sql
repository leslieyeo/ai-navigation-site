-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20) DEFAULT 'bg-blue-500',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建AI工具表
CREATE TABLE IF NOT EXISTS ai_tools (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    url VARCHAR(500) NOT NULL,
    logo_url VARCHAR(500),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_free BOOLEAN DEFAULT TRUE,
    pricing VARCHAR(100),
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    views INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(20) DEFAULT 'bg-gray-500',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建工具标签关联表
CREATE TABLE IF NOT EXISTS tool_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tool_id UUID REFERENCES ai_tools(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tool_id, tag_id)
);

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_ai_tools_category_id ON ai_tools(category_id);
CREATE INDEX IF NOT EXISTS idx_ai_tools_status ON ai_tools(status);
CREATE INDEX IF NOT EXISTS idx_ai_tools_featured ON ai_tools(featured);
CREATE INDEX IF NOT EXISTS idx_ai_tools_created_at ON ai_tools(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tools_views ON ai_tools(views DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tools_rating ON ai_tools(rating DESC);
CREATE INDEX IF NOT EXISTS idx_tool_tags_tool_id ON tool_tags(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_tags_tag_id ON tool_tags(tag_id);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为表添加更新时间触发器
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_tools_updated_at BEFORE UPDATE ON ai_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入默认分类数据
INSERT INTO categories (name, description, icon, color, sort_order) VALUES
('AI写作', '文本生成、编辑和优化工具', '✍️', 'bg-blue-500', 1),
('AI绘画', '图像生成、编辑和设计工具', '🎨', 'bg-purple-500', 2),
('AI视频', '视频生成、编辑和制作工具', '🎬', 'bg-red-500', 3),
('AI音频', '语音合成、音乐生成和音频处理', '🎵', 'bg-green-500', 4),
('AI代码', '代码生成、审查和优化工具', '💻', 'bg-gray-800', 5),
('AI办公', '办公自动化和效率提升工具', '📊', 'bg-yellow-500', 6),
('AI营销', '内容营销和社媒管理工具', '📢', 'bg-pink-500', 7),
('AI教育', '学习辅助和教育工具', '📚', 'bg-indigo-500', 8)
ON CONFLICT (name) DO NOTHING;

-- 插入默认标签数据
INSERT INTO tags (name, color) VALUES
('免费', 'bg-green-500'),
('付费', 'bg-orange-500'),
('API', 'bg-blue-500'),
('开源', 'bg-purple-500'),
('中文', 'bg-red-500'),
('热门', 'bg-yellow-500'),
('新品', 'bg-pink-500')
ON CONFLICT (name) DO NOTHING;

-- 插入示例AI工具数据
DO $$
DECLARE
    writing_category_id UUID;
    painting_category_id UUID;
    free_tag_id UUID;
    popular_tag_id UUID;
BEGIN
    -- 获取分类ID
    SELECT id INTO writing_category_id FROM categories WHERE name = 'AI写作' LIMIT 1;
    SELECT id INTO painting_category_id FROM categories WHERE name = 'AI绘画' LIMIT 1;
    
    -- 获取标签ID
    SELECT id INTO free_tag_id FROM tags WHERE name = '免费' LIMIT 1;
    SELECT id INTO popular_tag_id FROM tags WHERE name = '热门' LIMIT 1;
    
    -- 插入示例工具
    INSERT INTO ai_tools (name, description, url, category_id, is_free, rating, views, featured) VALUES
    ('ChatGPT', '最受欢迎的AI对话助手，可以回答问题、写作、编程等', 'https://chat.openai.com', writing_category_id, FALSE, 4.8, 1500000, TRUE),
    ('Claude', 'Anthropic开发的AI助手，擅长分析、写作和对话', 'https://claude.ai', writing_category_id, FALSE, 4.7, 800000, TRUE),
    ('Midjourney', '顶级AI图像生成工具，创作高质量艺术作品', 'https://midjourney.com', painting_category_id, FALSE, 4.9, 1200000, TRUE),
    ('DALL-E 3', 'OpenAI的图像生成模型，理解复杂描述', 'https://openai.com/dall-e-3', painting_category_id, FALSE, 4.6, 900000, TRUE)
    ON CONFLICT DO NOTHING;
    
END $$;