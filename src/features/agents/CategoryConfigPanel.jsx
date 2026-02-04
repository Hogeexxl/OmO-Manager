import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ModelSelector from './ModelSelector';
import { useTranslation } from 'react-i18next';

const CategoryConfigPanel = ({ categoryId, config, allModels, onUpdate, comment, onCommentChange }) => {
  const { t } = useTranslation();
  const catConfig = config?.categories?.[categoryId] || {};
  const model = catConfig.model || "";

  const responsibility = t(`categoriesInfo.${categoryId}.responsibility`, { defaultValue: "" });
  const fallbackChain = t(`categoriesInfo.${categoryId}.fallbackChain`, { defaultValue: "" });

  const [commentEnabled, setCommentEnabled] = useState(false);
  const [localComment, setLocalComment] = useState("");

  useEffect(() => {
    setCommentEnabled(!!comment);
    setLocalComment(comment || "");
  }, [categoryId, comment]);

  const handleUpdate = (field, value) => {
    onUpdate(categoryId, field, value);
  };

  const handleCommentToggle = (enabled) => {
    setCommentEnabled(enabled);
    if (!enabled) {
      onCommentChange(categoryId, null);
      setLocalComment("");
    } else if (responsibility && !localComment) {
      setLocalComment(responsibility);
      onCommentChange(categoryId, responsibility);
    }
  };

  const handleCommentChange = (value) => {
    setLocalComment(value);
    onCommentChange(categoryId, value);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="p-6 border-b bg-card">
        <h2 className="text-lg font-semibold capitalize">
          {categoryId.replace(/-/g, ' ')}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {responsibility || t('agents.selectCategory')}
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Model</Label>
            <ModelSelector 
              models={allModels}
              value={model}
              onChange={(val) => handleUpdate('model', val)}
            />
            <p className="text-xs text-muted-foreground">
              {t('agents.config.fallback')} {fallbackChain}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Comment</Label>
              <Switch
                checked={commentEnabled}
                onCheckedChange={handleCommentToggle}
              />
            </div>
            {commentEnabled && (
              <Textarea
                value={localComment}
                onChange={(e) => handleCommentChange(e.target.value)}
                className="min-h-[100px] font-mono text-sm bg-card border-border resize-none p-4"
                placeholder="Enter comment..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryConfigPanel;
