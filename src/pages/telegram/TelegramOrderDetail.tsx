import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, AlertCircle } from "lucide-react";
import { getOrderById } from "@/lib/data/orders";
import { Order } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useTelegramBackButton } from "@/hooks/useTelegramBackButton";

const TelegramOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Back button for Telegram
  useTelegramBackButton(() => {
    navigate(-1);
  });

  const loadOrder = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data = getOrderById(id);
      if (!data) {
        setError("Order not found");
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError("Failed to load order");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-28">
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm z-10 border-b border-border">
          <div className="p-3">
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="p-4 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background pb-28">
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm z-10 border-b border-border">
          <div className="p-3 flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/telegram")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base font-semibold">Order Details</h1>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-lg font-semibold mb-2">{error || "Order not found"}</h2>
            <p className="text-sm text-muted-foreground mb-4">Please try again</p>
            <Button onClick={loadOrder} size="sm">Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-card/98 backdrop-blur-md z-10 border-b border-border shadow-sm">
        <div className="p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/telegram")}
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          <h1 className="text-lg font-black uppercase tracking-tight">Order Details</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Order Info */}
        <div className="premium-card p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-black text-lg mb-1 uppercase tracking-tight">
                Order #{order.id.split("-")[1]}
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                {order.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="telegram-card p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Items
          </h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 pb-3 border-b last:border-b-0"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {item.variant.size} / {item.variant.color}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    £{item.lineTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="telegram-card p-4">
          <h3 className="font-semibold mb-3">Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">£{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">£{order.shipping.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">£{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="telegram-card p-4">
          <h3 className="font-semibold mb-3">Contact</h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{order.phone}</p>
            </div>
            {order.notes && (
              <div>
                <p className="text-xs text-muted-foreground">Notes</p>
                <p className="text-sm font-medium">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramOrderDetail;
