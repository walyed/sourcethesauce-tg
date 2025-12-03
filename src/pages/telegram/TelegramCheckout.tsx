import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/store/cart";
import { useTelegramMainButton } from "@/hooks/useTelegramMainButton";
import { useTelegramBackButton } from "@/hooks/useTelegramBackButton";
import { useTelegramUser } from "@/lib/telegram/context";
import { createOrder } from "@/lib/data/orders";
import { successNotification, errorNotification } from "@/lib/telegram/haptics";
import { toast } from "sonner";

const TelegramCheckout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { configure, hide, showProgress, hideProgress } = useTelegramMainButton();
  const { user, isInTelegram } = useTelegramUser();

  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getCartTotal();
  const shipping = 10;
  const total = subtotal + shipping;

  // Back button for Telegram
  useTelegramBackButton(() => {
    navigate(-1);
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate("/telegram/cart");
      return;
    }

    configure({
      text: `Place Order (£${total.toFixed(2)})`,
      isVisible: true,
      isActive: !!phone.trim() && !isProcessing,
      onClick: handlePlaceOrder,
    });

    return () => hide();
  }, [items.length, total, phone, isProcessing]);

  const handlePlaceOrder = () => {
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      errorNotification();
      return;
    }

    setIsProcessing(true);
    showProgress();

    // Get Telegram user data if available
    const telegramUser = user || null;

    // Simulate API call delay
    setTimeout(() => {
      // Create the order using centralized data access
      const order = createOrder({
        items,
        subtotal,
        shipping,
        total,
        phone,
        notes,
        telegramUserId: telegramUser?.id,
        telegramUsername: telegramUser?.username,
      });

      console.log("📦 Order Created:", order);

      hideProgress();
      setIsProcessing(false);
      clearCart();
      successNotification();
      toast.success("Order placed successfully!");
      navigate(`/telegram/orders/${order.id}`);
    }, 1500);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-card/98 backdrop-blur-md z-10 border-b border-border shadow-sm">
        <div className="p-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/telegram/cart")}>
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          <h1 className="text-lg font-black uppercase tracking-tight">Checkout</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Order Summary */}
        <div className="premium-card p-5">
          <h2 className="font-black text-base mb-4 uppercase tracking-tight">Order Summary</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.title} ({item.variant.size}/{item.variant.color}) x{item.quantity}
                </span>
                <span className="font-medium">
                  £{(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">£{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t">
                <span className="uppercase tracking-tight">Total</span>
                <span className="text-primary text-lg">£{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="premium-card p-5">
          <h2 className="font-black text-base mb-4 uppercase tracking-tight">Contact Information</h2>
          {isInTelegram && user && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Telegram User</p>
              <p className="text-sm font-bold">
                {user.first_name} {user.last_name}
                {user.username && <span className="text-muted-foreground ml-2">@{user.username}</span>}
              </p>
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Phone Number *
              </label>
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Delivery Notes (Optional)
              </label>
              <Textarea
                placeholder="Any special instructions for delivery..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="premium-card p-5">
          <h2 className="font-black text-base mb-3 uppercase tracking-tight">Payment Information</h2>
          <p className="text-sm text-muted-foreground">
            Payment will be processed securely after order confirmation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TelegramCheckout;
