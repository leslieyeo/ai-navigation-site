const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// 使用服务角色密钥来绕过RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 分类映射
const categoryMapping = {
  '01 影视／动漫／直播／纪录片': '影视娱乐',
  '02 电子书／漫画／音乐／听书': '图书资源', 
  '03 BT磁力资源搜索': 'BT磁力',
  '04 免费AI工具': 'AI工具',
  '05 特惠福利精选🆕': '特惠福利',
  '06 电脑手机常用': '软件工具',
  '07 电脑常用': '软件工具',
  '08 手机常用': '软件工具',
  '09 常用网站': '常用网站',
  '10 冷门网站': '常用网站',
  '11 学习网站': '学习教育',
  '12 实用导航': '实用导航',
  '13 设计／影视后期': '设计创作',
  '14 考证／考级等资源': '考试认证',
  '站内功能': '站内功能'
};

async function getCategoryId(categoryName) {
  const mappedName = categoryMapping[categoryName] || categoryName;
  
  const { data, error } = await supabase
    .from('nav_categories')
    .select('id')
    .eq('name', mappedName)
    .single();
    
  if (error) {
    console.log(`分类未找到: ${mappedName}, 使用默认分类`);
    // 返回第一个分类的ID作为默认值
    const { data: defaultCategory } = await supabase
      .from('nav_categories')
      .select('id')
      .limit(1)
      .single();
    return defaultCategory?.id;
  }
  
  return data.id;
}

async function importData() {
  console.log('开始导入CSV数据...');
  
  const websites = [];
  const csvFilePath = '/Users/dada/code/网站导航/🏆最终有效链接完整清单.csv';
  
  // 检查文件是否存在
  if (!fs.existsSync(csvFilePath)) {
    console.error('CSV文件不存在:', csvFilePath);
    return;
  }
  
  // 读取CSV文件
  fs.createReadStream(csvFilePath)
    .pipe(csv({
      headers: ['序号', '分类', '链接标题', 'URL', '子分类', '优先级', '响应时间(ms)', '验证状态'],
      skipEmptyLines: true
    }))
    .on('data', (row) => {
      // 跳过标题行和空行
      if (row['序号'] === '序号' || !row['序号'] || row['序号'].startsWith('﻿')) {
        return;
      }
      
      websites.push({
        sequence_number: parseInt(row['序号']) || 0,
        category: row['分类'] || '',
        title: row['链接标题'] || '',
        url: row['URL'] || '',
        subcategory: row['子分类'] || '',
        priority: row['优先级'] || '',
        response_time: parseFloat(row['响应时间(ms)']) || 0,
        status: row['验证状态'] || ''
      });
    })
    .on('end', async () => {
      console.log(`解析完成，共${websites.length}条记录`);
      
      // 批量插入数据
      for (let i = 0; i < websites.length; i++) {
        const website = websites[i];
        
        try {
          const categoryId = await getCategoryId(website.category);
          
          const insertData = {
            sequence_number: website.sequence_number,
            title: website.title,
            url: website.url,
            category_id: categoryId,
            subcategory: website.subcategory,
            priority: website.priority,
            response_time: website.response_time,
            status: website.status,
            is_featured: website.priority === '🥇' || website.priority === '👍'
          };
          
          const { data, error } = await supabase
            .from('websites')
            .insert(insertData);
            
          if (error) {
            console.error(`插入第${i + 1}条记录失败:`, error.message);
            console.error('数据:', insertData);
          } else {
            console.log(`✅ 成功插入第${i + 1}条记录: ${website.title}`);
          }
          
          // 添加延迟避免API限制
          if (i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
        } catch (error) {
          console.error(`处理第${i + 1}条记录时出错:`, error.message);
        }
      }
      
      console.log('数据导入完成！');
    })
    .on('error', (error) => {
      console.error('读取CSV文件出错:', error);
    });
}

// 运行导入
importData().catch(console.error);