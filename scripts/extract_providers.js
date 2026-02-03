/**
 * [INPUT]: 依赖 原材料/api.json 原始模型数据
 * [OUTPUT]: 对外生成 src/data/providers_info.json 结构化服务商元数据
 * [POS]: scripts 目录下的数据处理工具，用于提取服务商层级的核心参数
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../原材料/api.json');
const outputPath = path.join(__dirname, '../原材料/providers_info.json');

try {
  // 1. 读取原始数据
  const rawData = fs.readFileSync(inputPath, 'utf8');
  const apiData = JSON.parse(rawData);
  
  const providers = [];

  // 2. 遍历服务商并提取核心元数据
  for (const [id, data] of Object.entries(apiData)) {
    providers.push({
      id: id,
      name: data.name || id,
      api: data.api || "",
      env: data.env || [],
      npm: data.npm || "",
      doc: data.doc || "",
      models: data.models ? Object.keys(data.models) : []
    });
  }

  // 3. 确保目录存在并写入文件
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(providers, null, 2));
  console.log(`成功提取 ${providers.length} 个服务商信息到: ${outputPath}`);

} catch (err) {
  console.error('提取服务商信息失败:', err);
  process.exit(1);
}
