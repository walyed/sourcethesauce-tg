import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, AlertCircle } from "lucide-react";
import { getOrderById } from "@/lib/data/orders";
import { Order } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="container mx-auto max-w-4xl p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background pb-28">
        <div className="container mx-auto max-w-4xl p-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/orders")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">{error || "Order not found"}</h2>
            <p className="text-muted-foreground mb-4">Please try again</p>
            <Button onClick={loadOrder}>Retry</Button>
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
      <div className="container mx-auto max-w-4xl p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/orders")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>

        {/* Order Header */}
        <div className="telegram-card p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Order #{order.id.split("-")[1]}
              </h1>
              <p className="text-muted-foreground">
                Placed on{" "}
                {order.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="telegram-card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b last:border-b-0"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.variant.size} / {item.variant.color}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">£{item.lineTotal.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    £{item.unitPrice.toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="telegram-card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
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
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">£{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Delivery Info */}
        <div className="telegram-card p-6">
          <h2 className="text-xl font-semibold mb-4">Contact & Delivery</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{order.phone}</p>
            </div>
            {order.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Delivery Notes</p>
                <p className="font-medium">{order.notes}</p>
              </div>
            )}
            {order.telegramUsername && (
              <div>
                <p className="text-sm text-muted-foreground">Telegram</p>
                <p className="font-medium">@{order.telegramUsername}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
