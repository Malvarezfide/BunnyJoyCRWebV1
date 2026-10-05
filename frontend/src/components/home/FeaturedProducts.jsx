import { ArrowRight, Star } from "lucide-react";
import ProductCard from "../products/ProductCard";
import Button from "../common/Button";
import { CardGridSkeleton, SectionError } from "../common/Skeletons";

function FeaturedProducts({ products, status, onRetry }) {
  // Sin destacados no hay sección (y no se reserva espacio).
  if (status === "ready" && products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
        
        <div>
          <div className="flex items-center gap-3 mb-2">
		    <span className="w-10 h-1 bg-rose-500 rounded-full" />

		    <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-rose-500">
			  <Star size={16} className="fill-rose-500" />
			  Selección especial
		    </span>
		  </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Productos destacados
          </h2>

          <p className="text-gray-500 mt-3 max-w-xl">
            Descubre algunos de nuestros favoritos y encuentra algo que te encante.
          </p>
        </div>

        {/* Botón Ver todos */}
        
        <Button to="/products">
          Ver todos

          <ArrowRight
            size={18}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
        </Button>


      </div>

      {/* Productos */}
      {status === "loading" && (
        <CardGridSkeleton
          count={3}
          gridClassName="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        />
      )}

      {status === "error" && <SectionError onRetry={onRetry} />}

      {status === "ready" && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}

    </section>
  );
}

export default FeaturedProducts;
