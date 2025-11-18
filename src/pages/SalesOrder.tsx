import { useState, useEffect } from "react";
import { CustomerInfoSection } from "@/components/sales/CustomerInfoSection";
import { ProductSearchSection } from "@/components/sales/ProductSearchSection";
import { OrderItemsList } from "@/components/sales/OrderItemsList";
import { DeliverySection } from "@/components/sales/DeliverySection";
import { OrderSummary } from "@/components/sales/OrderSummary";
import { Product, DeliveryCompany, OrderItem, SalesOrder } from "@/types/sales";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

// منتج تجريبي افتراضي
const defaultProduct: Product = {
  id: "demo-1",
  name: "منتج تجريبي - لابتوب Dell",
  price: 500000,
  stock: 10,
  sku: "DEMO-001"
};

const SalesOrderPage = () => {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [notes, setNotes] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [deliveryCompany, setDeliveryCompany] = useState<DeliveryCompany | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // إضافة منتج تجريبي عند تحميل الصفحة (في نهاية القائمة)
  useEffect(() => {
    // إضافة المنتج التجريبي فقط مرة واحدة عند تحميل الصفحة
    setOrderItems(prev => {
      const hasDemoProduct = prev.some(item => item.product.id === defaultProduct.id);
      if (!hasDemoProduct) {
        return [...prev, {
          product: defaultProduct,
          quantity: 1,
          price: defaultProduct.price
        }];
      }
      return prev;
    });
  }, []);

  // إضافة منتج للطلب
  const handleAddProduct = (product: Product, quantity: number) => {
    const existingItemIndex = orderItems.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setOrderItems(updatedItems);
      toast.success("تم تحديث الكمية", {
        description: `${product.name} - الكمية الجديدة: ${updatedItems[existingItemIndex].quantity.toLocaleString('en-US')}`,
      });
    } else {
      setOrderItems([...orderItems, { product, quantity, price: product.price }]);
      toast.success("تم إضافة المنتج", {
        description: product.name,
        icon: <CheckCircle2 className="w-5 h-5 text-success" />,
      });
    }
  };

  // تحديث كمية منتج
  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const updatedItems = [...orderItems];
    updatedItems[index].quantity = quantity;
    setOrderItems(updatedItems);
  };

  // تحديث سعر منتج
  const handleUpdatePrice = (index: number, price: number) => {
    if (price < 0) return;
    const updatedItems = [...orderItems];
    updatedItems[index].price = price;
    setOrderItems(updatedItems);
  };

  // حذف منتج
  const handleRemoveItem = (index: number) => {
    const item = orderItems[index];
    setOrderItems(orderItems.filter((_, i) => i !== index));
    toast.info("تم حذف المنتج", {
      description: item.product.name,
    });
  };

  // حساب الأسعار
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCost = deliveryCompany?.cost || 0;
  const total = subtotal + deliveryCost;

  // التحقق من إمكانية الإرسال
  const canSubmit = customerName && phone && province && addressDetails && orderItems.length > 0 && deliveryCompany;

  // إرسال الطلب
  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);

    const order: SalesOrder = {
      customerName,
      phone,
      address: `${province} - ${addressDetails}`,
      notes,
      items: orderItems,
      deliveryCompany,
      subtotal,
      deliveryCost,
      total,
    };

    // محاكاة إرسال للـ API
    setTimeout(() => {
      console.log("Order submitted:", order);
      
      toast.success("تم إنشاء الطلب بنجاح! 🎉", {
        description: `طلب بقيمة ${total.toLocaleString("en-US")} دينار عراقي`,
        duration: 5000,
      });

      // إعادة تعيين النموذج
      setCustomerName("");
      setPhone("");
      setProvince("");
      setAddressDetails("");
      setNotes("");
      setOrderItems([]);
      setDeliveryCompany(null);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4 relative overflow-hidden" dir="rtl">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex-1"></div>
            <div className="flex items-center gap-4">
              <div className="p-1 bg-gradient-primary rounded-2xl shadow-glow">
                <div className="bg-card rounded-xl px-6 py-3">
                  <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    شركة الغري
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-lg md:text-xl font-medium mb-2">
              إنشاء طلب مبيعات جديد
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-12 bg-gradient-primary rounded-full"></div>
              <div className="h-1 w-2 bg-primary rounded-full"></div>
              <div className="h-1 w-12 bg-gradient-primary rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* العمود الأيسر - معلومات الطلب */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <CustomerInfoSection
              customerName={customerName}
              phone={phone}
              province={province}
              addressDetails={addressDetails}
              notes={notes}
              onCustomerNameChange={setCustomerName}
              onPhoneChange={setPhone}
              onProvinceChange={setProvince}
              onAddressDetailsChange={setAddressDetails}
              onNotesChange={setNotes}
            />

            <ProductSearchSection onAddProduct={handleAddProduct} />

            <OrderItemsList
              items={orderItems}
              onUpdateQuantity={handleUpdateQuantity}
              onUpdatePrice={handleUpdatePrice}
              onRemoveItem={handleRemoveItem}
            />

            <DeliverySection
              selectedCompany={deliveryCompany}
              onSelectCompany={setDeliveryCompany}
            />
          </div>

          {/* العمود الأيمن - ملخص الطلب */}
          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={subtotal}
              deliveryCost={deliveryCost}
              total={total}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              canSubmit={!!canSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderPage;
