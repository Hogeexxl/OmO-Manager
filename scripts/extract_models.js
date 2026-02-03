/**
 * [INPUT]: 依赖 原材料/api.json 原始模型数据
 * [OUTPUT]: 对外生成 src/data/models_info.json 扁平化的模型详细数据
 * [POS]: scripts 目录下的数据处理工具，用于提取并扁平化所有模型的详细参数
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../原材料/api.json');
const outputPath = path.join(__dirname, '../原材料/models_info.json');

try {
  // 1. 读取原始数据
  const rawData = fs.readFileSync(inputPath, 'utf8');
  const apiData = JSON.parse(rawData);
  
  const allModels = [];

  // 2. 遍历服务商和模型
  for (const [providerId, providerData] of Object.entries(apiData)) {
    if (!providerData.models) continue;

    for (const [modelId, modelData] of Object.entries(providerData.models)) {
      // 保留模型所有原始参数，并注入 providerId 确保归属清晰
      allModels.push({
        ...modelData,
        id: modelData.id || modelId, // 确保 id 存在
        providerId: providerId
      });
    }
  }

  // 3. 确保目录存在并写入文件
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(allModels, null, 2));
  console.log(`成功提取 ${allModels.length} 个模型信息到: ${outputPath}`);

} catch (err) {
  console.error('提取模型信息失败:', err);
  process.exit(1);
}
