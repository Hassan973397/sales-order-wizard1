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

      <div className="space-y-5">
        <div className="flex items-center justify-between py-4 px-4 bg-secondary/30 rounded-xl border border-border/50">
          <span className="text-muted-foreground font-medium">المجموع الفرعي:</span>
          <span className="font-bold text-foreground text-xl">
            {subtotal.toLocaleString("en-US")} IQD
          </span>
        </div>

        <div className="flex items-center justify-between py-4 px-4 bg-secondary/30 rounded-xl border border-border/50">
          <span className="text-muted-foreground font-medium">تكلفة التوصيل:</span>
          <span className="font-bold text-foreground text-xl">
            {deliveryCost === 0 
              ? <span className="text-success">مجاناً</span>
              : `${deliveryCost.toLocaleString("en-US")} IQD`}
          </span>
        </div>

        <div className="flex items-center justify-between py-5 px-5 bg-gradient-primary rounded-2xl shadow-glow border-2 border-primary/50">
          <span className="text-xl font-bold text-primary-foreground">المجموع الكلي:</span>
          <span className="text-3xl font-extrabold text-primary-foreground">
            {total.toLocaleString("en-US")} IQD
          </span>
        </div>

        <Button
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="w-full h-16 text-lg font-bold bg-gradient-primary hover:shadow-glow transition-all rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-large hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
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
