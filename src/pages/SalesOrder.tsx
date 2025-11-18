import { useState, useEffect } from "react";
import { PasteDataSection } from "@/components/sales/PasteDataSection";
import { CustomerInfoSection } from "@/components/sales/CustomerInfoSection";
import { ProductSearchSection } from "@/components/sales/ProductSearchSection";
import { OrderItemsList } from "@/components/sales/OrderItemsList";
import { DeliverySection } from "@/components/sales/DeliverySection";
import { OrderSummary } from "@/components/sales/OrderSummary";
import { SettingsSection, getDefaultDeliveryCompany } from "@/components/settings/SettingsSection";
import { Product, DeliveryCompany, OrderItem, SalesOrder } from "@/types/sales";
import { toast } from "sonner";
import { CheckCircle2, Settings } from "lucide-react";

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
  const [showSettings, setShowSettings] = useState(false);

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

    // تطبيق شركة التوصيل الافتراضية
    const defaultCompany = getDefaultDeliveryCompany();
    if (defaultCompany) {
      setDeliveryCompany(defaultCompany);
    }
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

  // معالجة البيانات المستخرجة من النص المُلصق
  const handleDataParsed = (data: {
    customerName?: string;
    phone?: string;
    address?: string;
    province?: string;
    addressDetails?: string;
    productName?: string;
  }) => {
    if (data.customerName) {
      setCustomerName(data.customerName);
    }
    if (data.phone) {
      setPhone(data.phone);
    }
    if (data.province) {
      setProvince(data.province);
    }
    if (data.addressDetails) {
      setAddressDetails(data.addressDetails);
    }
    if (data.productName) {
      // البحث عن المنتج وإضافته
      // محاكاة البحث - في التطبيق الحقيقي سيتم الاتصال بـ API
      const mockProducts: Product[] = [
        { id: "1", name: "لابتوب HP ProBook 450", price: 850000, stock: 15, sku: "HP-450" },
        { id: "2", name: "لابتوب Dell Latitude 5420", price: 920000, stock: 8, sku: "DELL-5420" },
        { id: "3", name: "ماوس Logitech MX Master 3", price: 85000, stock: 45, sku: "LOG-MX3" },
        { id: "4", name: "كيبورد ميكانيكي RGB", price: 120000, stock: 22, sku: "KB-RGB" },
        { id: "5", name: "شاشة Samsung 27 بوصة", price: 350000, stock: 12, sku: "SAM-27" },
        { id: "6", name: "صوبة كهربائية", price: 150000, stock: 30, sku: "HEATER-001" },
        { id: "7", name: "مكيف هواء", price: 800000, stock: 10, sku: "AC-001" },
        { id: "8", name: "ثلاجة", price: 1200000, stock: 5, sku: "FRIDGE-001" },
      ];

      // البحث عن المنتج في القائمة
      const foundProduct = mockProducts.find(p => 
        p.name.toLowerCase().includes(data.productName!.toLowerCase()) ||
        data.productName!.toLowerCase().includes(p.name.toLowerCase())
      );

      if (foundProduct) {
        handleAddProduct(foundProduct, 1);
        toast.success("تم إضافة المنتج تلقائياً", {
          description: foundProduct.name,
        });
      } else {
        // إذا لم نجد المنتج، نضيفه كمنتج جديد
        const newProduct: Product = {
          id: `custom-${Date.now()}`,
          name: data.productName,
          price: 0,
          stock: 999,
          sku: "CUSTOM"
        };
        handleAddProduct(newProduct, 1);
        toast.info("تم إضافة المنتج (يرجى تحديد السعر)", {
          description: data.productName,
        });
      }
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-4 sm:py-6 md:py-8 px-3 sm:px-4 relative overflow-hidden" dir="rtl">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10 animate-fade-in">
          <div className="text-center mb-4 sm:mb-6">
            {/* Logo */}
            <div className="inline-block mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-50"></div>
                <div className="relative p-1 sm:p-1.5 bg-gradient-primary rounded-full sm:rounded-2xl shadow-glow">
                  <div className="bg-card rounded-full sm:rounded-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5">
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                      {/* Logo Icon/Text */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary via-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary-foreground">ال</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                        شركة الغري
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl font-medium mb-2">
              نظام إدارة طلبات المبيعات
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="h-0.5 sm:h-1 w-8 sm:w-12 bg-gradient-primary rounded-full"></div>
              <div className="h-0.5 sm:h-1 w-1.5 sm:w-2 bg-primary rounded-full"></div>
              <div className="h-0.5 sm:h-1 w-8 sm:w-12 bg-gradient-primary rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* العمود الأيسر - معلومات الطلب */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* قسم لصق البيانات */}
            <PasteDataSection onDataParsed={handleDataParsed} />

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
