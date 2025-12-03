import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { useRecentlyViewed } from "@/lib/store/recentlyViewed";

interface RecentlyViewedProps {
  limit?: number;
  isTelegram?: boolean;
}

export const RecentlyViewed = ({ limit = 6, isTelegram = false }: RecentlyViewedProps) => {
  const navigate = useNavigate();
  const { getRecentlyViewed } = useRecentlyViewed();
  
  const products = getRecentlyViewed().slice(0, limit);

  if (products.length === 0) return null;

  const handleProductClick = (productId: string) => {
    const basePath = isTelegram ? "/telegram" : "";
    navigate(`${basePath}/product/${productId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5" strokeWidth={1.5} />
        <h2 className="text-heading-xl uppercase tracking-tight">Recently Viewed</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="flex-shrink-0 w-32 cursor-pointer group"
          >
            <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-neutral-100">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xs font-bold line-clamp-2 mb-1">{product.title}</h3>
            <p className="text-sm font-black">£{product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
