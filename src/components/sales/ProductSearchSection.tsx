import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Package, Loader2, Plus } from "lucide-react";
import { Product } from "@/types/sales";

interface ProductSearchProps {
  onAddProduct: (product: Product, quantity: number) => void;
}

export const ProductSearchSection = ({ onAddProduct }: ProductSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

  // محاكاة البحث - في التطبيق الحقيقي سيتم الاتصال بـ API
  const searchProducts = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // محاكاة تأخير API
    setTimeout(() => {
      const mockProducts: Product[] = [
        { id: "1", name: "لابتوب HP ProBook 450", price: 850000, stock: 15, sku: "HP-450" },
        { id: "2", name: "لابتوب Dell Latitude 5420", price: 920000, stock: 8, sku: "DELL-5420" },
        { id: "3", name: "ماوس Logitech MX Master 3", price: 85000, stock: 45, sku: "LOG-MX3" },
        { id: "4", name: "كيبورد ميكانيكي RGB", price: 120000, stock: 22, sku: "KB-RGB" },
        { id: "5", name: "شاشة Samsung 27 بوصة", price: 350000, stock: 12, sku: "SAM-27" },
      ];

      const filtered = mockProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku?.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchProducts(query);
  };

  const handleAddProduct = (product: Product) => {
    const quantity = selectedQuantities[product.id] || 1;
    onAddProduct(product, quantity);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedQuantities({});
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-large border-2 border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in hover:shadow-glow/50">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-border/50">
        <div className="p-2 sm:p-2.5 bg-gradient-accent rounded-lg sm:rounded-xl shadow-medium">
          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          اختيار المنتجات
        </h2>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="group">
          <Label htmlFor="productSearch" className="text-xs sm:text-sm font-semibold text-foreground mb-2 block flex items-center gap-1.5 sm:gap-2">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent rounded-full"></span>
            بحث عن منتج
          </Label>
          <div className="relative">
            <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 bg-accent/10 rounded-md sm:rounded-lg group-focus-within:bg-accent/20 transition-colors">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
            </div>
            <Input
              id="productSearch"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="ابحث بالاسم أو رمز المنتج..."
              className="pr-10 sm:pr-12 pl-10 sm:pl-12 h-12 sm:h-14 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-border/60 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 bg-background/50 hover:bg-background"
            />
            {isSearching && (
              <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 bg-accent/10 rounded-md sm:rounded-lg">
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* نتائج البحث */}
        {searchResults.length > 0 && (
          <div className="bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl sm:rounded-2xl border-2 border-border/50 max-h-64 sm:max-h-80 overflow-y-auto shadow-medium backdrop-blur-sm">
            {searchResults.map((product, index) => (
              <div
                key={product.id}
                className="p-3 sm:p-5 border-b border-border/50 last:border-0 hover:bg-primary/5 transition-all duration-200 group/item"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 w-full sm:min-w-[200px]">
                    <h4 className="font-bold text-foreground text-base sm:text-lg mb-1.5 sm:mb-2 group-hover/item:text-primary transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-xs sm:text-sm">
                      <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-muted/50 rounded-md sm:rounded-lg text-muted-foreground font-medium">
                        SKU: {product.sku}
                      </span>
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/10 rounded-md sm:rounded-lg text-primary font-bold">
                        {product.price.toLocaleString("en-US")} IQD
                      </span>
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-semibold ${
                        product.stock > 10 
                          ? "bg-success/10 text-success" 
                          : "bg-accent/10 text-accent"
                      }`}>
                        المخزون: {product.stock.toLocaleString("en-US")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground font-medium">الكمية</span>
                      <Input
                        type="number"
                        inputMode="numeric"
                        min="1"
                        max={product.stock}
                        value={selectedQuantities[product.id] || 1}
                        onChange={(e) => setSelectedQuantities({
                          ...selectedQuantities,
                          [product.id]: parseInt(e.target.value) || 1
                        })}
                        className="w-16 sm:w-20 h-10 sm:h-11 text-sm text-center rounded-lg sm:rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <Button
                      onClick={() => handleAddProduct(product)}
                      className="bg-gradient-primary hover:shadow-glow transition-all h-10 sm:h-11 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-medium hover:scale-105 active:scale-95 flex-1 sm:flex-initial"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 sm:ml-1.5" />
                      إضافة
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="inline-flex p-4 bg-muted/30 rounded-2xl mb-4">
              <Package className="w-12 h-12 opacity-50" />
            </div>
            <p className="text-lg font-medium">لا توجد نتائج للبحث</p>
            <p className="text-sm mt-1">جرب البحث بكلمات مختلفة</p>
          </div>
        )}
      </div>
    </div>
  );
};
