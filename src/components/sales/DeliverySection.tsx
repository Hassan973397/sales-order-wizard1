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
    <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-large border-2 border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in hover:shadow-glow/50">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-border/50">
        <div className="p-2.5 bg-gradient-primary rounded-xl shadow-medium">
          <Truck className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          شركة التوصيل
        </h2>
      </div>

      <div className="space-y-5">
        <div className="group">
          <Label htmlFor="deliveryCompany" className="text-sm font-semibold text-foreground mb-2.5 block flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
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
              className="h-14 rounded-xl border-2 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 hover:bg-background pr-10 [&>span]:!line-clamp-none [&>span]:!whitespace-nowrap [&>span]:!overflow-visible"
            >
              <SelectValue placeholder="اختر شركة التوصيل..." className="text-base font-medium">
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
        </div>

        {selectedCompany && (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-sm"></div>
            <div className="relative p-5 bg-gradient-to-r from-primary/15 to-primary/5 border-2 border-primary/40 rounded-2xl shadow-medium animate-fade-in-scale">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-primary/20 rounded-lg">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-base font-bold text-foreground">تكلفة التوصيل:</span>
                </div>
                <span className="text-2xl md:text-3xl font-extrabold text-primary">
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
