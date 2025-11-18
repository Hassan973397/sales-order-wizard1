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

    // تنظيف النص
    const cleanText = text.trim().replace(/\s+/g, " ");

    // قائمة المحافظات العراقية
    const iraqiProvinces = [
      "بغداد", "البصرة", "نينوى", "الأنبار", "كربلاء",
      "النجف", "ذي قار", "القادسية", "ميسان", "المثنى",
      "واسط", "صلاح الدين", "ديالى", "بابل", "كركوك",
      "أربيل", "السليمانية", "دهوك"
    ];

    // استخراج اسم الزبون - أنماط متعددة
    const namePatterns = [
      /الزبون\s*:?\s*([^\n\r]+?)(?=\s*(?:الرقم|رقم|07|078|079|075|077|076|العنوان|عنوان|المنتج|منتج|$))/i,
      /اسم\s*:?\s*([^\n\r]+?)(?=\s*(?:الرقم|رقم|07|078|079|075|077|076|العنوان|عنوان|المنتج|منتج|$))/i,
      /العميل\s*:?\s*([^\n\r]+?)(?=\s*(?:الرقم|رقم|07|078|079|075|077|076|العنوان|عنوان|المنتج|منتج|$))/i,
      /^([^\n\r]+?)(?=\s*(?:الرقم|رقم|07|078|079|075|077|076|العنوان|عنوان|المنتج|منتج))/i,
    ];
    
    for (const pattern of namePatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim();
        // التأكد من أن النص ليس رقم هاتف أو محافظة
        if (!/^\d+$/.test(name) && !iraqiProvinces.some(p => name.includes(p))) {
          result.customerName = name;
          break;
        }
      }
    }

    // استخراج رقم الهاتف - أنماط متعددة
    const phonePatterns = [
      /الرقم\s*:?\s*(0?7[0-9]{9,10})/i,
      /رقم\s*:?\s*(0?7[0-9]{9,10})/i,
      /(0?7[0-9]{9,10})/g,
    ];
    
    const phoneMatches = cleanText.match(/(0?7[0-9]{9,10})/g);
    if (phoneMatches && phoneMatches.length > 0) {
      // أخذ أول رقم هاتف صحيح
      const phone = phoneMatches[0];
      if (phone.length >= 10 && phone.length <= 11) {
        result.phone = phone.startsWith("0") ? phone : `0${phone}`;
      }
    }

    // استخراج العنوان والمحافظة
    const addressPatterns = [
      /العنوان\s*:?\s*([^\n\r]+?)(?=\s*(?:المنتج|منتج|$))/i,
      /عنوان\s*:?\s*([^\n\r]+?)(?=\s*(?:المنتج|منتج|$))/i,
    ];

    // البحث عن المحافظة في النص
    let foundProvince = "";
    let provinceIndex = -1;
    for (const province of iraqiProvinces) {
      const index = cleanText.indexOf(province);
      if (index !== -1) {
        foundProvince = province;
        provinceIndex = index;
        break;
      }
    }

    // استخراج العنوان
    for (const pattern of addressPatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        const addressText = match[1].trim();
        
        if (foundProvince && addressText.includes(foundProvince)) {
          // إذا كانت المحافظة موجودة في نص العنوان
          result.province = foundProvince;
          // استخراج تفاصيل العنوان (كل شيء بعد المحافظة)
          const provinceInAddressIndex = addressText.indexOf(foundProvince);
          if (provinceInAddressIndex !== -1) {
            const afterProvince = addressText.substring(provinceInAddressIndex + foundProvince.length).trim();
            result.addressDetails = afterProvince || "";
          } else {
            result.addressDetails = addressText.replace(foundProvince, "").trim();
          }
        } else if (foundProvince) {
          // إذا كانت المحافظة موجودة في النص لكن ليس في نص العنوان
          result.province = foundProvince;
          result.addressDetails = addressText;
        } else {
          // إذا لم نجد محافظة، نحاول البحث في النص الكامل
          result.addressDetails = addressText;
        }
        break;
      }
    }

    // إذا لم نجد عنوان محدد لكن وجدنا محافظة في النص
    if (foundProvince && !result.province && provinceIndex !== -1) {
      result.province = foundProvince;
      // استخراج تفاصيل العنوان بعد المحافظة
      const afterProvince = cleanText.substring(provinceIndex + foundProvince.length).trim();
      // البحث عن الكلمات التالية (المنتج، الرقم، إلخ)
      const nextKeywordMatch = afterProvince.match(/\s*(المنتج|منتج|الرقم|رقم|$)/i);
      if (nextKeywordMatch && nextKeywordMatch.index !== undefined) {
        result.addressDetails = afterProvince.substring(0, nextKeywordMatch.index).trim();
      } else {
        // إذا لم نجد كلمة تالية، نأخذ أول 100 حرف
        result.addressDetails = afterProvince.substring(0, 100).trim();
      }
    }

    // استخراج اسم المنتج - أنماط متعددة
    const productPatterns = [
      /المنتج\s*:?\s*([^\n\r]+?)(?=\s*$)/i,
      /منتج\s*:?\s*([^\n\r]+?)(?=\s*$)/i,
      /الصنف\s*:?\s*([^\n\r]+?)(?=\s*$)/i,
      /السلعة\s*:?\s*([^\n\r]+?)(?=\s*$)/i,
    ];

    for (const pattern of productPatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        const productText = match[1].trim();
        // تنظيف المنتج من أي محافظة قد تكون موجودة
        let cleanProduct = productText;
        for (const province of iraqiProvinces) {
          if (productText.includes(province)) {
            cleanProduct = productText.replace(province, "").trim();
            break;
          }
        }
        result.productName = cleanProduct;
        break;
      }
    }

    // إذا لم نجد منتج بتنسيق محدد، نبحث عن كلمات مفتاحية
    if (!result.productName) {
      const productKeywords = ["صوبة", "مكيف", "ثلاجة", "لابتوب", "شاشة", "ماوس", "كيبورد", "دوارة"];
      for (const keyword of productKeywords) {
        if (cleanText.toLowerCase().includes(keyword.toLowerCase())) {
          // البحث عن المنتج بعد كلمة "المنتج" أو في نهاية النص
          const keywordIndex = cleanText.toLowerCase().indexOf(keyword.toLowerCase());
          
          // التأكد من أن الكلمة ليست جزء من محافظة أو عنوان
          const beforeKeyword = cleanText.substring(0, keywordIndex);
          const isInProvince = iraqiProvinces.some(p => beforeKeyword.includes(p));
          
          if (!isInProvince) {
            // استخراج الجملة التي تحتوي على الكلمة المفتاحية
            const start = Math.max(0, keywordIndex - 15);
            const end = Math.min(cleanText.length, keywordIndex + keyword.length + 50);
            let productText = cleanText.substring(start, end).trim();
            
            // إزالة أي محافظة من المنتج
            for (const province of iraqiProvinces) {
              productText = productText.replace(province, "").trim();
            }
            
            result.productName = productText;
            break;
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
          className="w-full h-12 sm:h-14 bg-gradient-primary hover:shadow-glow transition-all rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
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

