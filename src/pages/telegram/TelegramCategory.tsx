import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingBag, AlertCircle, User, UserRound, Baby, Watch, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryById } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { useTelegramBackButton } from "@/hooks/useTelegramBackButton";

const TelegramCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  // Back button for Telegram
  useTelegramBackButton(() => {
    navigate(-1);
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 300));
        const cat = getCategoryById(categoryId || "");
        if (!cat) {
          setError("Category not found");
          return;
        }
        const prods = getProductsByCategory(categoryId || "");
        setCategory(cat);
        setProducts(prods);
      } catch (err) {
        setError("Failed to load category");
        console.error("Error loading category:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [categoryId]);

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-28 flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p className="text-muted-foreground mb-6 text-center">{error}</p>
        <Button onClick={() => navigate("/telegram")}>Go Home</Button>
      </div>
    );
  }

  if (loading || !category) {
    return (
      <div className="min-h-screen bg-background pb-28">
        <div className="sticky top-0 bg-primary text-primary-foreground z-10 p-4">
          <Skeleton className="h-8 w-48 bg-primary-foreground/20" />
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const iconMap: Record<string, any> = {
    User,
    UserRound,
    Baby,
    Watch,
    Sparkles,
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-28">
      {/* Header */}
      <div className="sticky top-0 bg-primary text-primary-foreground z-10 shadow-md">
        <div className="p-5 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/telegram")}
            className="text-primary-foreground hover:bg-primary-foreground/20 h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-black flex items-center gap-3 uppercase tracking-tight">
              {(() => {
                const IconComponent = iconMap[category.icon] || Sparkles;
                return <IconComponent className="h-6 w-6 opacity-90" strokeWidth={1.5} />;
              })()}
              {category.name}
            </h1>
            <p className="text-xs opacity-75 uppercase tracking-wider mt-1">{products.length} Products Available</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No products available</h2>
            <p className="text-muted-foreground mb-6">Check back later for new items</p>
            <Button onClick={() => navigate("/telegram")}>Browse Other Categories</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product: any) => (
              <button
                key={product.id}
                onClick={() => navigate(`/telegram/product/${product.id}`)}
                className="premium-card p-0 overflow-hidden group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.isNew && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">
                      New
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-xs mb-1.5 line-clamp-2 uppercase tracking-wide leading-tight">
                    {product.title}
                  </h3>
                  <p className="text-sm font-black text-primary">
                    £{product.price.toFixed(2)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TelegramCategory;
