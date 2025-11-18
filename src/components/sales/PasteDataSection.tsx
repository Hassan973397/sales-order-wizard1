import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Clipboard, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface PasteDataSectionProps {
  onDataParsed: (data: {
    customerName?: string;
    phone?: string;
    address?: string;
    province?: string;
    addressDetails?: string;
    productName?: string;
  }) => void;
}

export const PasteDataSection = ({ onDataParsed }: PasteDataSectionProps) => {
  const [pastedText, setPastedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // دالة لتحليل النص واستخراج المعلومات
  const parseText = (text: string) => {
    const result: {
      customerName?: string;
      phone?: string;
      address?: string;
      province?: string;
      addressDetails?: string;
      productName?: string;
    } = {};

    // تقسيم النص إلى أسطر
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

    // قائمة المحافظات العراقية
    const iraqiProvinces = [
      "بغداد", "البصرة", "نينوى", "الأنبار", "كربلاء",
      "النجف", "ذي قار", "القادسية", "ميسان", "المثنى",
      "واسط", "صلاح الدين", "ديالى", "بابل", "كركوك",
      "أربيل", "السليمانية", "دهوك"
    ];

    // معالجة كل سطر
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 1. البحث عن الاسم (السطر الأول عادة أو الذي يحتوي على "الزبون" أو "اسم")
      if (!result.customerName) {
        const nameMatch = line.match(/^(?:الزبون|اسم|العميل)\s*:?\s*(.+)$/i);
        if (nameMatch && nameMatch[1]) {
          const name = nameMatch[1].trim();
          // التأكد من أن النص ليس رقم هاتف
          if (!/^0?7\d{9,10}$/.test(name)) {
            result.customerName = name;
            continue;
          }
        }
        // إذا كان السطر الأول ولا يحتوي على كلمات مفتاحية، قد يكون الاسم
        if (i === 0 && !line.match(/^(?:الرقم|رقم|العنوان|عنوان|المنتج|منتج|0?7\d)/i)) {
          const isPhone = /^0?7\d{9,10}$/.test(line);
          const isProvince = iraqiProvinces.some(p => line.includes(p));
          if (!isPhone && !isProvince && line.length > 2) {
            result.customerName = line;
            continue;
          }
        }
      }

      // 2. البحث عن رقم الهاتف
      if (!result.phone) {
        const phoneMatch = line.match(/^(?:الرقم|رقم)\s*:?\s*(0?7\d{9,10})/i);
        if (phoneMatch && phoneMatch[1]) {
          const phone = phoneMatch[1];
          result.phone = phone.startsWith("0") ? phone : `0${phone}`;
          continue;
        }
        // البحث عن رقم هاتف في السطر بدون كلمة "الرقم"
        const phoneOnly = line.match(/^(0?7\d{9,10})$/);
        if (phoneOnly && phoneOnly[1]) {
          const phone = phoneOnly[1];
          result.phone = phone.startsWith("0") ? phone : `0${phone}`;
          continue;
        }
      }

      // 3. البحث عن العنوان والمحافظة
      if (!result.province && !result.addressDetails) {
        const addressMatch = line.match(/^(?:العنوان|عنوان)\s*:?\s*(.+)$/i);
        if (addressMatch && addressMatch[1]) {
          const addressText = addressMatch[1].trim();
          
          // البحث عن المحافظة في العنوان
          let foundProvince = "";
          for (const province of iraqiProvinces) {
            if (addressText.includes(province)) {
              foundProvince = province;
              break;
            }
          }
          
          if (foundProvince) {
            result.province = foundProvince;
            // استخراج تفاصيل العنوان (كل شيء بعد المحافظة)
            const provinceIndex = addressText.indexOf(foundProvince);
            const afterProvince = addressText.substring(provinceIndex + foundProvince.length).trim();
            result.addressDetails = afterProvince;
          } else {
            // إذا لم نجد محافظة في هذا السطر، نبحث في السطور التالية
            result.addressDetails = addressText;
          }
          continue;
        }
        
        // إذا لم نجد كلمة "العنوان"، نبحث عن محافظة في السطر
        for (const province of iraqiProvinces) {
          if (line.includes(province)) {
            result.province = province;
            // استخراج تفاصيل العنوان بعد المحافظة
            const provinceIndex = line.indexOf(province);
            const afterProvince = line.substring(provinceIndex + province.length).trim();
            result.addressDetails = afterProvince;
            continue;
          }
        }
      }

      // 4. البحث عن المنتج
      if (!result.productName) {
        const productMatch = line.match(/^(?:المنتج|منتج|الصنف|السلعة)\s*:?\s*(.+)$/i);
        if (productMatch && productMatch[1]) {
          let productText = productMatch[1].trim();
          // تنظيف المنتج من أي محافظة قد تكون موجودة
          for (const province of iraqiProvinces) {
            productText = productText.replace(province, "").trim();
          }
          result.productName = productText;
          continue;
        }
        
        // إذا كان السطر الأخير ولم نجد منتج بعد، قد يكون المنتج
        if (i === lines.length - 1 && !result.productName) {
          const isPhone = /^0?7\d{9,10}$/.test(line);
          const isProvince = iraqiProvinces.some(p => line.includes(p));
          if (!isPhone && !isProvince && line.length > 2) {
            let productText = line;
            // تنظيف المنتج من أي محافظة
            for (const province of iraqiProvinces) {
              productText = productText.replace(province, "").trim();
            }
            result.productName = productText;
          }
        }
      }
    }

    return result;
  };

  const handleParse = () => {
    if (!pastedText.trim()) {
      toast.error("يرجى لصق النص أولاً");
      return;
    }

    setIsProcessing(true);

    // محاكاة معالجة
    setTimeout(() => {
      const parsedData = parseText(pastedText);
      
      const foundFields = [];
      if (parsedData.customerName) foundFields.push("اسم الزبون");
      if (parsedData.phone) foundFields.push("رقم الهاتف");
      if (parsedData.province || parsedData.addressDetails) foundFields.push("العنوان");
      if (parsedData.productName) foundFields.push("المنتج");

      if (foundFields.length > 0) {
        onDataParsed(parsedData);
        toast.success(`تم استخراج ${foundFields.length} حقل بنجاح`, {
          description: foundFields.join("، "),
          icon: <CheckCircle2 className="w-5 h-5 text-success" />,
        });
        setPastedText(""); // مسح النص بعد المعالجة
      } else {
        toast.warning("لم يتم العثور على معلومات صحيحة", {
          description: "يرجى التأكد من تنسيق النص",
          icon: <AlertCircle className="w-5 h-5 text-accent" />,
        });
      }

      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-large border-2 border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-border/50">
        <div className="p-2 sm:p-2.5 bg-gradient-primary rounded-lg sm:rounded-xl shadow-medium">
          <Clipboard className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          لصق البيانات
        </h2>
      </div>

      <div className="space-y-4">
        <div className="group">
          <Label htmlFor="pasteData" className="text-xs sm:text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5 sm:gap-2">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full"></span>
            الصق النص هنا (مثال: الزبون حسن الحمداني، الرقم 0780000012، العنوان النجف حي الحرفين، المنتج صوبة كهربائية دوارة)
          </Label>
          <div className="relative">
            <Textarea
              id="pasteData"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="مثال:&#10;الزبون حسن الحمداني&#10;الرقم 0780000012&#10;العنوان النجف حي الحرفين&#10;المنتج صوبة كهربائية دوارة"
              className="min-h-[120px] sm:min-h-[150px] text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 hover:bg-background resize-none pr-12"
            />
            <div className="absolute left-2 sm:left-3 top-2.5 sm:top-3 p-1 sm:p-1.5 bg-primary/10 rounded-md sm:rounded-lg">
              <Clipboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            </div>
          </div>
        </div>

        <Button
          onClick={handleParse}
          disabled={!pastedText.trim() || isProcessing}
          className="w-full h-14 sm:h-16 bg-gradient-primary hover:shadow-glow transition-all rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 ml-2 animate-pulse" />
              جاري التحليل...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              تحليل وإدخال البيانات تلقائياً
            </>
          )}
        </Button>

      </div>
    </div>
  );
};

