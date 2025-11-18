import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, MapPin, FileText } from "lucide-react";

interface CustomerInfoProps {
  customerName: string;
  phone: string;
  province: string;
  addressDetails: string;
  notes: string;
  onCustomerNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onAddressDetailsChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

const iraqiProvinces = [
  "بغداد",
  "البصرة",
  "نينوى",
  "الأنبار",
  "كربلاء",
  "النجف",
  "ذي قار",
  "القادسية",
  "ميسان",
  "المثنى",
  "واسط",
  "صلاح الدين",
  "ديالى",
  "بابل",
  "كركوك",
  "أربيل",
  "السليمانية",
  "دهوك"
];

export const CustomerInfoSection = ({
  customerName,
  phone,
  province,
  addressDetails,
  notes,
  onCustomerNameChange,
  onPhoneChange,
  onProvinceChange,
  onAddressDetailsChange,
  onNotesChange,
}: CustomerInfoProps) => {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-large border-2 border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in hover:shadow-glow/50">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-border/50">
        <div className="p-2.5 bg-gradient-primary rounded-xl shadow-medium">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          معلومات الزبون
        </h2>
      </div>
      
      <div className="space-y-5 md:space-y-6">
        <div className="group">
          <Label htmlFor="customerName" className="text-sm font-semibold text-foreground mb-2.5 block flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            اسم الزبون *
          </Label>
          <div className="relative">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-primary/10 rounded-lg group-focus-within:bg-primary/20 transition-colors">
              <User className="w-4 h-4 text-primary" />
            </div>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              placeholder="أدخل اسم الزبون"
              className="pr-12 h-14 rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 hover:bg-background"
              required
            />
          </div>
        </div>

        <div className="group">
          <Label htmlFor="phone" className="text-sm font-semibold text-foreground mb-2.5 block flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            رقم الموبايل *
          </Label>
          <div className="relative">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-primary/10 rounded-lg group-focus-within:bg-primary/20 transition-colors">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="07XX XXX XXXX"
              className="pr-12 h-14 rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 hover:bg-background"
              required
            />
          </div>
        </div>

        <div className="group">
          <Label htmlFor="province" className="text-sm font-semibold text-foreground mb-2.5 block flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            المحافظة *
          </Label>
          <Select value={province} onValueChange={onProvinceChange}>
            <SelectTrigger 
              id="province"
              className="h-14 rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 hover:bg-background"
            >
              <SelectValue placeholder="اختر المحافظة..." />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-sm border-2 border-border/50 max-h-60 rounded-xl shadow-large">
              {iraqiProvinces.map((prov) => (
                <SelectItem 
                  key={prov} 
                  value={prov}
                  className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 rounded-lg transition-colors"
                >
                  {prov}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="group">
          <Label htmlFor="addressDetails" className="text-sm font-semibold text-foreground mb-2.5 block flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            تفاصيل العنوان *
          </Label>
          <div className="relative">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-primary/10 rounded-lg group-focus-within:bg-primary/20 transition-colors">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <Input
              id="addressDetails"
              value={addressDetails}
              onChange={(e) => onAddressDetailsChange(e.target.value)}
              placeholder="الحي، الشارع، رقم الدار..."
              className="pr-12 h-14 rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 hover:bg-background"
              required
            />
          </div>
        </div>

        <div className="group">
          <Label htmlFor="notes" className="text-sm font-semibold text-foreground mb-2.5 block flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
            ملاحظات (اختياري)
          </Label>
          <div className="relative">
            <div className="absolute right-3 top-3 p-1.5 bg-accent/10 rounded-lg group-focus-within:bg-accent/20 transition-colors">
              <FileText className="w-4 h-4 text-accent" />
            </div>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="أي ملاحظات إضافية..."
              className="pr-12 min-h-[120px] rounded-xl border-2 border-border/60 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 bg-background/50 hover:bg-background resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
