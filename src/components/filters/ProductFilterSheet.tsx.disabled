import { useState, useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { getAvailableSizes, getAvailableColors, getPriceRange } from "@/lib/data/products";

export interface FilterValues {
  size?: string;
  color?: string;
  priceMin?: number;
  priceMax?: number;
}

interface ProductFilterSheetProps {
  filters: FilterValues;
  onApply: (filters: FilterValues) => void;
  onClear: () => void;
}

export const ProductFilterSheet = ({ filters, onApply, onClear }: ProductFilterSheetProps) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);

  const sizes = getAvailableSizes();
  const colors = getAvailableColors();
  const priceRange = getPriceRange();

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApply(localFilters);
    setOpen(false);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClear();
    setOpen(false);
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <SlidersHorizontal className="h-4 w-4" strokeWidth={2.5} />
          {activeFilterCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="text-heading-xl flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" strokeWidth={1.5} />
            Filters
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-8 overflow-y-auto h-[calc(85vh-140px)]">
          {/* Size Filter */}
          <div>
            <label className="text-caption mb-3 block">Size</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setLocalFilters(prev => ({
                    ...prev,
                    size: prev.size === size ? undefined : size
                  }))}
                  className={`px-4 py-2.5 rounded-lg border-2 font-bold text-sm transition-all ${
                    localFilters.size === size
                      ? "border-foreground bg-foreground text-background"
                      : "border-neutral-200 hover:border-foreground/40"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <label className="text-caption mb-3 block">Color</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setLocalFilters(prev => ({
                    ...prev,
                    color: prev.color === color ? undefined : color
                  }))}
                  className={`px-4 py-2.5 rounded-lg border-2 font-bold text-sm capitalize transition-all ${
                    localFilters.color === color
                      ? "border-foreground bg-foreground text-background"
                      : "border-neutral-200 hover:border-foreground/40"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="text-caption mb-3 block">Price Range</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLocalFilters(prev => ({
                  ...prev,
                  priceMin: undefined,
                  priceMax: 50
                }))}
                className={`p-4 rounded-lg border-2 font-bold text-sm transition-all ${
                  localFilters.priceMax === 50 && !localFilters.priceMin
                    ? "border-foreground bg-foreground text-background"
                    : "border-neutral-200 hover:border-foreground/40"
                }`}
              >
                Under £50
              </button>
              <button
                onClick={() => setLocalFilters(prev => ({
                  ...prev,
                  priceMin: 50,
                  priceMax: 100
                }))}
                className={`p-4 rounded-lg border-2 font-bold text-sm transition-all ${
                  localFilters.priceMin === 50 && localFilters.priceMax === 100
                    ? "border-foreground bg-foreground text-background"
                    : "border-neutral-200 hover:border-foreground/40"
                }`}
              >
                £50 - £100
              </button>
              <button
                onClick={() => setLocalFilters(prev => ({
                  ...prev,
                  priceMin: 100,
                  priceMax: undefined
                }))}
                className={`p-4 rounded-lg border-2 font-bold text-sm transition-all ${
                  localFilters.priceMin === 100 && !localFilters.priceMax
                    ? "border-foreground bg-foreground text-background"
                    : "border-neutral-200 hover:border-foreground/40"
                }`}
              >
                Over £100
              </button>
              <button
                onClick={() => setLocalFilters(prev => ({
                  ...prev,
                  priceMin: undefined,
                  priceMax: undefined
                }))}
                className={`p-4 rounded-lg border-2 font-bold text-sm transition-all ${
                  !localFilters.priceMin && !localFilters.priceMax
                    ? "border-foreground bg-foreground text-background"
                    : "border-neutral-200 hover:border-foreground/40"
                }`}
              >
                Any Price
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t flex gap-3">
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex-1 h-12 font-bold"
          >
            Clear All
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 h-12 font-bold premium-button"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
