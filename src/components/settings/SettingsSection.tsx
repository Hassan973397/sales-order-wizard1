import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeliveryCompany } from "@/types/sales";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface SettingsSectionProps {
  onDefaultDeliveryCompanyChange?: (companyId: string | null) => void;
}

// بيانات شركات التوصيل - نفس القائمة في DeliverySection
const deliveryCompanies: DeliveryCompany[] = [
  { id: "1", name: "برايم", cost: 5000 },
  { id: "2", name: "مرسال", cost: 5000 },
];

const SETTINGS_KEY = "sales-order-settings";

interface AppSettings {
  defaultDeliveryCompanyId: string | null;
}

export const SettingsSection = ({ onDefaultDeliveryCompanyChange }: SettingsSectionProps) => {
  const [defaultDeliveryCompanyId, setDefaultDeliveryCompanyId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // تحميل الإعدادات من localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const settings: AppSettings = JSON.parse(savedSettings);
        if (settings.defaultDeliveryCompanyId) {
          setDefaultDeliveryCompanyId(settings.defaultDeliveryCompanyId);
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }, []);

  // حفظ الإعدادات
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const settings: AppSettings = {
        defaultDeliveryCompanyId,
      };
      
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      
      // إشعار callback إذا كان موجوداً
      if (onDefaultDeliveryCompanyChange) {
        onDefaultDeliveryCompanyChange(defaultDeliveryCompanyId);
      }
      
      toast.success("تم حفظ الإعدادات بنجاح", {
        description: defaultDeliveryCompanyId 
          ? `شركة التوصيل الافتراضية: ${deliveryCompanies.find(c => c.id === defaultDeliveryCompanyId)?.name}`
          : "لا توجد شركة توصيل افتراضية",
        icon: <CheckCircle2 className="w-5 h-5 text-success" />,
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-large border-2 border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-border/50">
        <div className="p-2 sm:p-2.5 bg-gradient-primary rounded-lg sm:rounded-xl shadow-medium">
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          الإعدادات
        </h2>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="group">
          <Label htmlFor="defaultDeliveryCompany" className="text-xs sm:text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5 sm:gap-2">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full"></span>
            شركة التوصيل الافتراضية
          </Label>
          <Select
            value={defaultDeliveryCompanyId || ""}
            onValueChange={(value) => setDefaultDeliveryCompanyId(value || null)}
          >
            <SelectTrigger 
              id="defaultDeliveryCompany"
              className="h-12 sm:h-14 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 hover:bg-background pr-8 sm:pr-10"
            >
              <SelectValue placeholder="اختر شركة التوصيل الافتراضية...">
                {defaultDeliveryCompanyId 
                  ? deliveryCompanies.find(c => c.id === defaultDeliveryCompanyId)?.name 
                  : "لا توجد"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-sm border-2 border-border/50 rounded-xl shadow-large min-w-[200px]">
              <SelectItem value="" className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 rounded-lg transition-colors py-3">
                <span className="font-bold text-base">لا توجد</span>
              </SelectItem>
              {deliveryCompanies.map((company) => (
                <SelectItem 
                  key={company.id} 
                  value={company.id}
                  className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 rounded-lg transition-colors py-3"
                >
                  <div className="flex items-center justify-between w-full gap-4 pr-2">
                    <span className="font-bold text-base">{company.name}</span>
                    <span className="px-3 py-1.5 bg-primary/10 text-primary font-bold rounded-lg whitespace-nowrap">
                      {company.cost.toLocaleString("en-US")} IQD
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            سيتم اختيار هذه الشركة تلقائياً عند إنشاء طلب جديد
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-12 sm:h-14 bg-gradient-primary hover:shadow-glow transition-all rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          {isSaving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </div>
    </div>
  );
};

// دالة مساعدة لتحميل الإعدادات
export const loadSettings = (): AppSettings => {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }
  return { defaultDeliveryCompanyId: null };
};

// دالة مساعدة للحصول على شركة التوصيل الافتراضية
export const getDefaultDeliveryCompany = (): DeliveryCompany | null => {
  const settings = loadSettings();
  if (settings.defaultDeliveryCompanyId) {
    return deliveryCompanies.find(c => c.id === settings.defaultDeliveryCompanyId) || null;
  }
  return null;
};

