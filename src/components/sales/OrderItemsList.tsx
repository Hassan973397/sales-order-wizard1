import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingCart } from "lucide-react";
import { OrderItem } from "@/types/sales";

interface OrderItemsListProps {
  items: OrderItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onUpdatePrice: (index: number, price: number) => void;
  onRemoveItem: (index: number) => void;
}

export const OrderItemsList = ({
  items,
  onUpdateQuantity,
  onUpdatePrice,
  onRemoveItem,
}: OrderItemsListProps) => {
  if (items.length === 0) {
    return (
      <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-large border-2 border-border/50 text-center py-16">
        <div className="inline-flex p-4 bg-muted/30 rounded-2xl mb-6">
          <ShoppingCart className="w-16 h-16 text-muted-foreground opacity-50" />
        </div>
        <p className="text-muted-foreground text-xl font-semibold mb-2">لم يتم إضافة منتجات بعد</p>
        <p className="text-sm text-muted-foreground">ابحث عن المنتجات وأضفها للطلب</p>
      </div>
    );
  }

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-large border-2 border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in hover:shadow-glow/50">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-border/50">
        <div className="p-2 sm:p-2.5 bg-gradient-primary rounded-lg sm:rounded-xl shadow-medium">
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          المنتجات المضافة
        </h2>
        <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/10 text-primary font-bold rounded-full text-xs sm:text-sm">
          {items.length}
        </span>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-5 bg-gradient-to-r from-secondary/20 to-secondary/5 rounded-xl sm:rounded-2xl border-2 border-border/50 hover:border-primary/50 hover:shadow-medium transition-all duration-200 group"
          >
            <div className="flex-1 w-full sm:min-w-[200px]">
              <h4 className="font-bold text-foreground text-base sm:text-lg mb-1 group-hover:text-primary transition-colors">
                {item.product.name}
              </h4>
              <p className="text-xs text-muted-foreground">SKU: {item.product.sku}</p>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-wrap w-full sm:w-auto">
              <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                <span className="text-xs text-muted-foreground font-medium">السعر</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="500"
                  value={item.price}
                  onChange={(e) => onUpdatePrice(index, parseFloat(e.target.value) || 0)}
                  className="w-20 sm:w-28 h-10 sm:h-11 text-sm text-center rounded-lg sm:rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                <span className="text-xs text-muted-foreground font-medium">الكمية</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max={item.product.stock}
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(index, parseInt(e.target.value) || 1)}
                  className="w-18 sm:w-24 h-10 sm:h-11 text-sm text-center rounded-lg sm:rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="flex flex-col items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-lg sm:rounded-xl">
                <span className="text-xs text-muted-foreground font-medium">الإجمالي</span>
                <span className="font-bold text-primary text-lg sm:text-xl">
                  {(item.price * item.quantity).toLocaleString("en-US")} IQD
                </span>
              </div>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => onRemoveItem(index)}
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl shadow-medium hover:shadow-lg transition-all hover:scale-110 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
