import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import Button from "../common/Button";

// `products` los calcula el servidor (misma categoría y tags en común,
// ordenados por relevancia), así el detalle no necesita el catálogo.
function RelatedProducts({ product, products: relatedProducts }) {
  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-20">

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            También te puede interesar
          </h2>

          <p className="text-gray-500 mt-1">
            Más productos de la categoría {product.categoria}
          </p>
        </div>

        <Button to="/products">
          Ver catálogo

          <ArrowRight
            size={18}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          
        </Button>


      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

        {relatedProducts.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
          />
        ))}

      </div>

    </section>
  );
}

export default RelatedProducts;