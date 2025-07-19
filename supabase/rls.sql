-- 启用行级安全策略
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_tags ENABLE ROW LEVEL SECURITY;

-- 分类表策略 - 所有人可读
CREATE POLICY "categories_select_policy" ON categories
    FOR SELECT USING (true);

-- AI工具表策略 - 只显示活跃状态的工具
CREATE POLICY "ai_tools_select_policy" ON ai_tools
    FOR SELECT USING (status = 'active');

-- 标签表策略 - 所有人可读
CREATE POLICY "tags_select_policy" ON tags
    FOR SELECT USING (true);

-- 工具标签关联表策略 - 所有人可读
CREATE POLICY "tool_tags_select_policy" ON tool_tags
    FOR SELECT USING (true);

-- 创建用于管理的函数（可选，用于后台管理）
CREATE OR REPLACE FUNCTION increment_tool_views(tool_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE ai_tools 
    SET views = views + 1 
    WHERE id = tool_id AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建搜索函数
CREATE OR REPLACE FUNCTION search_ai_tools(
    search_query TEXT DEFAULT '',
    category_filter UUID DEFAULT NULL,
    is_free_filter BOOLEAN DEFAULT NULL,
    tag_filter TEXT[] DEFAULT NULL,
    sort_by TEXT DEFAULT 'created_at',
    sort_order TEXT DEFAULT 'DESC',
    limit_count INTEGER DEFAULT 12,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    description TEXT,
    url VARCHAR,
    logo_url VARCHAR,
    category_id UUID,
    category_name VARCHAR,
    is_free BOOLEAN,
    pricing VARCHAR,
    rating DECIMAL,
    views INTEGER,
    featured BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    tag_names TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.description,
        t.url,
        t.logo_url,
        t.category_id,
        c.name as category_name,
        t.is_free,
        t.pricing,
        t.rating,
        t.views,
        t.featured,
        t.created_at,
        COALESCE(
            ARRAY_AGG(DISTINCT tags.name) FILTER (WHERE tags.name IS NOT NULL),
            ARRAY[]::TEXT[]
        ) as tag_names
    FROM ai_tools t
    LEFT JOIN categories c ON t.category_id = c.id
    LEFT JOIN tool_tags tt ON t.id = tt.tool_id
    LEFT JOIN tags ON tt.tag_id = tags.id
    WHERE 
        t.status = 'active'
        AND (
            search_query = '' 
            OR t.name ILIKE '%' || search_query || '%'
            OR t.description ILIKE '%' || search_query || '%'
        )
        AND (category_filter IS NULL OR t.category_id = category_filter)
        AND (is_free_filter IS NULL OR t.is_free = is_free_filter)
        AND (
            tag_filter IS NULL 
            OR EXISTS (
                SELECT 1 FROM tool_tags tt2 
                JOIN tags t2 ON tt2.tag_id = t2.id 
                WHERE tt2.tool_id = t.id 
                AND t2.name = ANY(tag_filter)
            )
        )
    GROUP BY t.id, c.name
    ORDER BY 
        CASE 
            WHEN sort_by = 'name' AND sort_order = 'ASC' THEN t.name
        END ASC,
        CASE 
            WHEN sort_by = 'name' AND sort_order = 'DESC' THEN t.name
        END DESC,
        CASE 
            WHEN sort_by = 'views' AND sort_order = 'DESC' THEN t.views
        END DESC,
        CASE 
            WHEN sort_by = 'views' AND sort_order = 'ASC' THEN t.views
        END ASC,
        CASE 
            WHEN sort_by = 'rating' AND sort_order = 'DESC' THEN t.rating
        END DESC,
        CASE 
            WHEN sort_by = 'rating' AND sort_order = 'ASC' THEN t.rating
        END ASC,
        CASE 
            WHEN sort_by = 'created_at' AND sort_order = 'DESC' THEN t.created_at
        END DESC,
        CASE 
            WHEN sort_by = 'created_at' AND sort_order = 'ASC' THEN t.created_at
        END ASC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;