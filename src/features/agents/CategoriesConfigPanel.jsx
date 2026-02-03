/* [INPUT] Categories list + Models */
/* [OUTPUT] Form to edit category defaults */
/* [POS] src/features/agents/CategoriesConfigPanel.jsx */
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ModelSelector from './ModelSelector';
import modelsData from '@/data/models.json';

// Flatten models
// const allModels = Object.values(modelsData).flatMap(p => p.models || []);

const CategoriesConfigPanel = ({ categoriesData, config, onUpdate, allModels }) => {
  
  const handleUpdate = (category, field, value) => {
     onUpdate(category, field, value);
  };

  return (
    <div className="flex h-full flex-col">
       {/* Header */}
       <div className="p-6 border-b bg-card space-y-2">
          <h2 className="text-lg font-semibold">Categories Configuration</h2>
          <p className="text-muted-foreground text-sm">
             Configure default models and complexity for different task categories.
          </p>
       </div>

       {/* Content */}
       <ScrollArea className="flex-1">
          <div className="p-6 space-y-4">
             <div className="grid grid-cols-1 gap-4">
                {categoriesData.map(category => {
                   const catConfig = config.category?.[category] || {};
                   const model = catConfig.model || "";
                   const variant = catConfig.variant || "medium";

                   return (
                      <Card key={category} className="bg-card border-border shadow-none hover:shadow-sm transition-shadow">
                         <CardHeader className="pb-3 pt-4 px-4">
                            <CardTitle className="text-base font-medium capitalize flex items-center gap-2">
                               {category.replace(/-/g, ' ')}
                            </CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4 px-4 pb-4">
                            {/* Model */}
                            <div className="space-y-1.5">
                               <Label className="text-xs tracking-wide text-muted-foreground">Default Model</Label>
                               <ModelSelector 
                                  models={allModels}
                                  value={model}
                                  onChange={(val) => handleUpdate(category, 'model', val)}
                               />
                            </div>

                            {/* Variant */}
                            <div className="space-y-1.5">
                               <Label className="text-xs tracking-wide text-muted-foreground">Complexity Variant</Label>
                               <Select 
                                  value={variant} 
                                  onValueChange={(val) => handleUpdate(category, 'variant', val)}
                               >
                                  <SelectTrigger className="bg-card border-border h-9 text-sm">
                                     <SelectValue placeholder="Select variant" />
                                  </SelectTrigger>
                                  <SelectContent>
                                     <SelectItem value="xlow">xLow (Fastest)</SelectItem>
                                     <SelectItem value="low">Low</SelectItem>
                                     <SelectItem value="medium">Medium</SelectItem>
                                     <SelectItem value="high">High</SelectItem>
                                     <SelectItem value="xhigh">xHigh (Smartest)</SelectItem>
                                  </SelectContent>
                               </Select>
                            </div>
                         </CardContent>
                      </Card>
                   );
                })}
             </div>
          </div>
       </ScrollArea>
    </div>
  );
};

export default CategoriesConfigPanel;
