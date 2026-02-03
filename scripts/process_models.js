import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawPath = path.join(__dirname, '../原材料/api.json');
const outPath = path.join(__dirname, '../src/data/models.json');

try {
  const rawData = fs.readFileSync(rawPath, 'utf8');
  const apiData = JSON.parse(rawData);
  
  const optimized = {};

  // apiData is an object: { "providerName": { "models": { ... } } }
  for (const [providerKey, providerData] of Object.entries(apiData)) {
       // Store provider metadata if available (name, etc)
       // We keep the structure: { providerId: { name: "...", models: [ { id, name, limit... } ] } }
       // Or simpler: just the array of model objects if we don't need provider metadata?
       // User UI shows "Provider List" which implies we might need provider name. 
       // api.json structure: "provider": { "name": "...", "models": {...} }
       
       const modelsList = [];
       
       // Iterate over models
       for (const [modelKey, modelData] of Object.entries(providerData.models)) {
          // Keep the full object, but ensure ID is there
          const modelObj = {
             id: modelData.id || modelKey,
             name: modelData.name,
             limit: modelData.limit,
             modalities: modelData.modalities,
             cost: modelData.cost,
             // Add other fields as needed
          };
          
          // Clean ID logic if needed, but for "code generation" we need the exact ID to put in config.
          // Usually we want the full unique ID.
          // e.g. "anthropic/claude-sonnet-4".
          
          modelsList.push(modelObj);
       }
       
       optimized[providerKey] = {
          name: providerData.name || providerKey, // Use official name if available
          models: modelsList
       };
    }

  // Create dir if not exists (though src/data should exist)
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outPath, JSON.stringify(optimized, null, 2));
  console.log('Successfully generated src/data/models.json');

} catch (err) {
  console.error('Error processing models:', err);
  process.exit(1);
}
