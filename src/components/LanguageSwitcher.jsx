import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(nextLng);
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleLanguage}
      className="!h-10 !w-10"
      title={i18n.language === 'en' ? "Current: English. Click to switch to Chinese" : "当前：中文。点击切换为英文"}
    >
      <div className="h-5 w-5 bg-foreground/80 text-background rounded-full flex items-center justify-center text-[10px] font-bold pt-[1px]">
         {i18n.language === 'en' ? "EN" : "中"}
      </div>
    </Button>
  );
};

export default LanguageSwitcher;
