import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";
import { useTelegramMainButton } from "@/hooks/useTelegramMainButton";
import { useTelegramBackButton } from "@/hooks/useTelegramBackButton";
import { lightImpact } from "@/lib/telegram/haptics";

const TelegramCart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { configure, hide } = useTelegramMainButton();

  const subtotal = getCartTotal();
  const shipping = items.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  // Back button for Telegram
  useTelegramBackButton(() => {
    navigate(-1);
  });

  // Configure main button based on cart state
  useEffect(() => {
    if (items.length > 0) {
      configure({
        text: `Checkout (£${total.toFixed(2)})`,
        isVisible: true,
        isActive: true,
        onClick: () => {
          lightImpact();
          navigate("/telegram/checkout");
        },
      });
    } else {
      hide();
    }

    return () => hide();
  }, [items.length, total, configure, hide, navigate]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-28">
        <div className="sticky top-0 bg-card/98 backdrop-blur-md z-10 border-b border-border shadow-sm">
          <div className="p-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/telegram")}>
              <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
            </Button>
            <h1 className="text-lg font-black uppercase tracking-tight">Shopping Cart</h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 pt-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-100 mb-6 animate-float">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-black mb-2 uppercase tracking-tight">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6 text-center font-medium">
            Start shopping to add items to your cart
          </p>
          <Button onClick={() => navigate("/telegram")} className="h-12 px-6 font-bold">Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-card/98 backdrop-blur-md z-10 border-b border-border shadow-sm">
        <div className="p-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/telegram")}>
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-black uppercase tracking-tight">Shopping Cart</h1>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">{items.length} {items.length === 1 ? 'Item' : 'Items'}</p>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="premium-card p-4">
            <div className="flex gap-3">
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground mb-1">
                  {item.variant.size} / {item.variant.color}
                </p>
                <p className="text-base font-bold text-primary">
                  £{item.unitPrice.toFixed(2)}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      lightImpact();
                      updateQuantity(item.id, item.quantity - 1);
                    }}
                    disabled={item.quantity <= 1}
                    className="h-7 w-7"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-bold min-w-[24px] text-center">
                    {item.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      lightImpact();
                      updateQuantity(item.id, item.quantity + 1);
                    }}
                    className="h-7 w-7"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    lightImpact();
                    removeFromCart(item.id);
                  }}
                  className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <p className="text-sm font-bold">
                  £{(item.unitPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="p-4 pb-24">
        <div className="premium-card p-5 space-y-3">
          <h3 className="font-black text-base uppercase tracking-tight mb-4">Order Summary</h3>
            <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-bold">£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-bold">£{shipping.toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-border">
              <div className="flex justify-between text-base">
              <span className="font-black uppercase tracking-tight">Total</span>
              <span className="font-black text-primary text-lg">£{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramCart;
