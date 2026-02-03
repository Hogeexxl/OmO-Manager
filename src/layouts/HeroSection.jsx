/* [INPUT] None */
/* [OUTPUT] Hero Section for Landing Page */
/* [POS] src/layouts/HeroSection.jsx */
import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const HeroSection = ({ onOpenFolder }) => {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Manage your OpenCode Experience <br className="hidden sm:inline" />
          with Style and Ease.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Visual configuration manager for <code>opencode.json</code> and <code>oh-my-opencode.json</code>. 
          Modify providers, tweak agents, and manage models without touching raw JSON.
        </p>
      </div>
      <div className="flex gap-4">
        <Button size="lg" onClick={onOpenFolder}>
          📂 Open Configuration Folder
        </Button>
        <Button variant="outline" size="lg" onClick={() => window.open('https://github.com/anomalyco/opencode', '_blank')}>
          GitHub
        </Button>
      </div>
      
      {/* Feature Cards Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
         <Card>
            <CardHeader>
               <CardTitle>Providers</CardTitle>
               <CardDescription>Visual API Key & Model management</CardDescription>
            </CardHeader>
         </Card>
         <Card>
            <CardHeader>
               <CardTitle>Agents</CardTitle>
               <CardDescription>Drag & Drop agent organization</CardDescription>
            </CardHeader>
         </Card>
         <Card>
            <CardHeader>
               <CardTitle>Safe Edits</CardTitle>
               <CardDescription>Validation before saving to disk</CardDescription>
            </CardHeader>
         </Card>
      </div>
    </section>
  );
};

export default HeroSection;
