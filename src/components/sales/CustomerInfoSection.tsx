import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { User, Phone, MapPin, FileText, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-large border-2 border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in hover:shadow-glow/50">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-border/50">
        <div className="p-2 sm:p-2.5 bg-gradient-primary rounded-lg sm:rounded-xl shadow-medium">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          معلومات الزبون
        </h2>
      </div>
      
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="group">
          <Label htmlFor="customerName" className="text-xs sm:text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5 sm:gap-2">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full"></span>
            اسم الزبون *
          </Label>
          <div className="relative">
            <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 bg-primary/10 rounded-md sm:rounded-lg group-focus-within:bg-primary/20 transition-colors">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            </div>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              placeholder="أدخل اسم الزبون"
              className="pr-10 sm:pr-12 h-12 sm:h-14 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 hover:bg-background"
              required
            />
          </div>
        </div>

        <div className="group">
          <Label htmlFor="phone" className="text-xs sm:text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5 sm:gap-2">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full"></span>
            رقم الموبايل *
          </Label>
          <div className="relative">
            <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 bg-primary/10 rounded-md sm:rounded-lg group-focus-within:bg-primary/20 transition-colors">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            </div>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="07XX XXX XXXX"
              className="pr-10 sm:pr-12 h-12 sm:h-14 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 hover:bg-background"
              required
            />
          </div>
        </div>

        <div className="group">
          <Label htmlFor="province" className="text-xs sm:text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5 sm:gap-2">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full"></span>
            المحافظة *
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id="province"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full h-12 sm:h-14 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 hover:bg-background justify-between font-normal"
              >
                <span className={cn("truncate", !province && "text-muted-foreground")}>
                  {province || "اختر المحافظة..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command className="bg-card/95 backdrop-blur-sm border-2 border-border/50 rounded-xl shadow-large">
                <CommandInput placeholder="ابحث عن المحافظة..." className="h-12" />
                <CommandList className="max-h-60">
                  <CommandEmpty>لم يتم العثور على محافظة.</CommandEmpty>
                  <CommandGroup>
                    {iraqiProvinces.map((prov) => (
                      <CommandItem
                        key={prov}
                        value={prov}
                        onSelect={() => {
                          onProvinceChange(prov === province ? "" : prov);
                          setOpen(false);
                        }}
                        className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 rounded-lg transition-colors py-3"
                      >
                        <Check
                          className={cn(
                            "ml-2 h-4 w-4",
                            province === prov ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {prov}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="group">
          <Label htmlFor="addressDetails" className="text-xs sm:text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5 sm:gap-2">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full"></span>
            تفاصيل العنوان *
          </Label>
          <div className="relative">
            <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 bg-primary/10 rounded-md sm:rounded-lg group-focus-within:bg-primary/20 transition-colors">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            </div>
            <Input
              id="addressDetails"
              value={addressDetails}
              onChange={(e) => onAddressDetailsChange(e.target.value)}
              placeholder="الحي، الشارع، رقم الدار..."
              className="pr-10 sm:pr-12 h-12 sm:h-14 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 hover:bg-background"
              required
            />
          </div>
        </div>

        <div className="group">
          <Label htmlFor="notes" className="text-xs sm:text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5 sm:gap-2">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent rounded-full"></span>
            ملاحظات (اختياري)
          </Label>
          <div className="relative">
            <div className="absolute right-2 sm:right-3 top-2.5 sm:top-3 p-1 sm:p-1.5 bg-accent/10 rounded-md sm:rounded-lg group-focus-within:bg-accent/20 transition-colors">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
            </div>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="أي ملاحظات إضافية..."
              className="pr-10 sm:pr-12 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-border/60 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 bg-background/50 hover:bg-background resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
