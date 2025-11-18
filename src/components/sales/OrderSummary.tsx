import { Button } from "@/components/ui/button";
import { Receipt, Send, Loader2 } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  deliveryCost: number;
  total: number;
  onSubmit: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
}

export const OrderSummary = ({
  subtotal,
  deliveryCost,
  total,
  onSubmit,
  isSubmitting,
  canSubmit,
}: OrderSummaryProps) => {
  return (
    <div className="bg-gradient-to-br from-card/95 via-card/90 to-primary/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-large border-2 border-primary/30 animate-fade-in-scale sticky top-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-border/50">
        <div className="p-2.5 bg-gradient-primary rounded-xl shadow-medium">
          <Receipt className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          ملخص الطلب
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3.5 px-4 bg-gradient-to-r from-secondary/40 to-secondary/20 rounded-xl border-2 border-border/60 shadow-soft">
          <span className="text-muted-foreground font-semibold text-base">المجموع الفرعي:</span>
          <span className="font-bold text-foreground text-lg">
            {subtotal.toLocaleString("en-US")} IQD
          </span>
        </div>

        <div className="flex items-center justify-between py-3.5 px-4 bg-gradient-to-r from-secondary/40 to-secondary/20 rounded-xl border-2 border-border/60 shadow-soft">
          <span className="text-muted-foreground font-semibold text-base">تكلفة التوصيل:</span>
          <span className="font-bold text-foreground text-lg">
            {deliveryCost === 0 
              ? <span className="text-success font-extrabold">مجاناً</span>
              : `${deliveryCost.toLocaleString("en-US")} IQD`}
          </span>
        </div>

        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent opacity-20 blur-xl"></div>
          <div className="relative flex items-center justify-between py-5 px-6 bg-gradient-to-r from-primary to-primary/90 rounded-2xl shadow-glow border-2 border-primary/60">
            <span className="text-lg md:text-xl font-bold text-primary-foreground">المجموع الكلي:</span>
            <span className="text-2xl md:text-3xl font-extrabold text-primary-foreground">
              {total.toLocaleString("en-US")} IQD
            </span>
          </div>
        </div>

        <Button
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="w-full h-14 md:h-16 text-base md:text-lg font-bold bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:shadow-glow transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-large hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 ml-2 animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 ml-2" />
              إنشاء الطلب
            </>
          )}
        </Button>

        {!canSubmit && (
          <div className="p-4 bg-destructive/10 border-2 border-destructive/30 rounded-xl">
            <p className="text-sm text-destructive text-center font-medium">
              ⚠️ يرجى إكمال جميع الحقول المطلوبة وإضافة منتج واحد على الأقل
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
