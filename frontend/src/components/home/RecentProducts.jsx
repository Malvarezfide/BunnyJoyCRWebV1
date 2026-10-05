import { useRef } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

import ProductCard from "../products/ProductCard";
import Button from "../common/Button";
import { CardSkeleton, SectionError } from "../common/Skeletons";

// `products` ya llega ordenado y limitado por la API (novedades primero).
function RecentProducts({ products: novedades, status, onRetry }) {
  const scrollRef = useRef(null);

  if (status === "ready" && !novedades.length) {
    return null;
  }

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const amount = direction === "left"
      ? -360
      : 360;

    scrollRef.current.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">

      {/* =====================================================
          ENCABEZADO
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-end
          sm:justify-between
          gap-5
          mb-8
        "
      >

        <div>

          <div className="flex items-center gap-3 mb-2">

            <span className="w-10 h-1 bg-emerald-500 rounded-full" />

            <span
              className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                uppercase
                tracking-wider
                text-emerald-600
              "
            >
              <Sparkles size={16} />
              Recién agregados
            </span>

          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Novedades
          </h2>

          <p className="text-gray-500 mt-3 max-w-xl">
            Descubre los últimos artículos que hemos agregado al catálogo.
          </p>

        </div>

        <Button to="/products">
          Ver catálogo
          <ArrowRight size={18} />
        </Button>

      </div>


      {/* =====================================================
          CONTROLES
      ====================================================== */}

      <div className="flex justify-end gap-2 mb-4">

        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Ver productos anteriores"
          className="
            w-10
            h-10
            rounded-full
            border
            border-gray-200
            bg-white
            text-gray-700
            flex
            items-center
            justify-center
            shadow-sm
            hover:bg-gray-50
            hover:shadow
            transition
          "
        >
          <ArrowLeft size={18} />
        </button>

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Ver más novedades"
          className="
            w-10
            h-10
            rounded-full
            border
            border-gray-200
            bg-white
            text-gray-700
            flex
            items-center
            justify-center
            shadow-sm
            hover:bg-gray-50
            hover:shadow
            transition
          "
        >
          <ArrowRight size={18} />
        </button>

      </div>


      {/* =====================================================
          CARRUSEL
      ====================================================== */}

      {status === "error" && <SectionError onRetry={onRetry} />}

      {status !== "error" && (
        <div
          ref={scrollRef}
          className="
            flex
            gap-5
            overflow-x-auto
            snap-x
            snap-mandatory
            scroll-smooth
            pb-4

            [&::-webkit-scrollbar]:h-2
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-thumb]:rounded-full
          "
        >

          {status === "loading" &&
            Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="flex-none w-[82%] sm:w-[46%] lg:w-[31.5%]"
              >
                <CardSkeleton />
              </div>
            ))}

          {novedades.map((product) => (

            <div
              key={product.id}
              className="
                flex-none
                w-[82%]
                sm:w-[46%]
                lg:w-[31.5%]
                snap-start
              "
            >
              <ProductCard
                product={product}
                view="home"
              />
            </div>

          ))}

        </div>
      )}

    </section>
  );
}

export default RecentProducts;
