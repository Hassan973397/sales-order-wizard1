import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck } from "lucide-react";
import { DeliveryCompany } from "@/types/sales";

interface DeliverySectionProps {
  selectedCompany: DeliveryCompany | null;
  onSelectCompany: (company: DeliveryCompany) => void;
}

// بيانات شركات التوصيل - في التطبيق الحقيقي ستأتي من API
const deliveryCompanies: DeliveryCompany[] = [
  { id: "1", name: "برايم", cost: 5000 },
  { id: "2", name: "مرسال", cost: 5000 },
];

export const DeliverySection = ({ selectedCompany, onSelectCompany }: DeliverySectionProps) => {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-large border-2 border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in hover:shadow-glow/50">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-border/50">
        <div className="p-2 sm:p-2.5 bg-gradient-primary rounded-lg sm:rounded-xl shadow-medium">
          <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          شركة التوصيل
        </h2>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="group">
          <Label htmlFor="deliveryCompany" className="text-xs sm:text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5 sm:gap-2">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full"></span>
            اختر شركة التوصيل *
          </Label>
          <Select
            value={selectedCompany?.id}
            onValueChange={(value) => {
              const company = deliveryCompanies.find(c => c.id === value);
              if (company) onSelectCompany(company);
            }}
          >
            <SelectTrigger 
              id="deliveryCompany"
              className="h-12 sm:h-14 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 hover:bg-background pr-8 sm:pr-10 text-right [&>span]:!line-clamp-none [&>span]:!whitespace-nowrap [&>span]:!overflow-visible [&>span]:!text-right"
            >
              <SelectValue placeholder="اختر شركة التوصيل..." className="text-sm sm:text-base font-medium text-right">
                {selectedCompany ? `${selectedCompany.name} - ${selectedCompany.cost.toLocaleString("en-US")} IQD` : ""}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-sm border-2 border-border/50 rounded-xl shadow-large min-w-[200px]">
              {deliveryCompanies.map((company) => (
                <SelectItem 
                  key={company.id} 
                  value={company.id}
                  className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 rounded-lg transition-colors py-3"
                >
                  <div className="flex items-center justify-between w-full gap-4 flex-row-reverse">
                    <span className="font-bold text-base text-right">{company.name}</span>
                    <span className="px-3 py-1.5 bg-primary/10 text-primary font-bold rounded-lg whitespace-nowrap">
                      {company.cost.toLocaleString("en-US")} IQD
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCompany && (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-sm"></div>
            <div className="relative p-4 sm:p-5 bg-gradient-to-r from-primary/15 to-primary/5 border-2 border-primary/40 rounded-xl sm:rounded-2xl shadow-medium animate-fade-in-scale">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="p-1 sm:p-1.5 bg-primary/20 rounded-md sm:rounded-lg">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-foreground">تكلفة التوصيل:</span>
                </div>
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary">
                  {selectedCompany.cost.toLocaleString("en-US")} IQD
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
