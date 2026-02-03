/* [INPUT] Large list of models */
/* [OUTPUT] Performant Combobox for model selection */
/* [POS] src/features/agents/ModelSelector.jsx */
import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ModelSelector = ({ models, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter models for performance - only show top 50 matches
  const filteredModels = models
    .filter((model) => 
      !search || 
      model.name.toLowerCase().includes(search.toLowerCase()) || 
      model.id.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 50);

  const selectedModel = models.find((m) => m.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal bg-card border-border hover:bg-muted/50"
        >
          {value ? (
             <span className="truncate">
                {selectedModel ? `${selectedModel.name} (${selectedModel.id})` : value}
             </span>
          ) : (
             <span className="text-muted-foreground">Select model...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search model..." value={search} onValueChange={setSearch} />
           <CommandList>
              {filteredModels.length === 0 && (
                <CommandEmpty>No model found.</CommandEmpty>
              )}
              <CommandGroup>
                  {filteredModels.map((model) => (
                     <div
                        key={model.id}
                        onClick={() => {
                           onChange(model.id);
                           setOpen(false);
                        }}
                        className="flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
                     >
                        <Check
                           className={cn(
                              "mr-2 h-4 w-4 shrink-0",
                              value === model.id ? "opacity-100" : "opacity-0"
                           )}
                        />
                        <span className="truncate font-medium">{model.id}</span>
                     </div>
                  ))}
             </CommandGroup>
           </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ModelSelector;
