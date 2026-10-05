import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useProduct } from "../services/site/productService";
import usePageMeta from "../hooks/usePageMeta";
import ProductGallery from "../components/products/ProductGallery";
import ProductInfo from "../components/products/ProductInfo";
import RelatedProducts from "../components/products/RelatedProducts";
import Button from "../components/common/Button";
import { ProductDetailSkeleton, SectionError } from "../components/common/Skeletons";

function BackButton({ onClick }) {
  return (
    <Button onClick={onClick}>
      <ArrowLeft
        size={18}
        className="transition-transform duration-200 group-hover:-translate-x-1"
      />
      Volver
    </Button>
  );
}

function ProductDetail() {
  // /product/:slug — también acepta un id numérico (enlaces antiguos).
  const { slug } = useParams();

  const navigate = useNavigate();

  const { product, related, status, reload } = useProduct(slug);

  const description = product?.descripcion
    ? product.descripcion.replace(/\s+/g, " ").trim().slice(0, 160)
    : product
      ? `Conoce ${product.nombre} en BunnyJoy.`
      : undefined;

  usePageMeta({
    title: product
      ? `${product.nombre} · BunnyJoy`
      : status === "notfound"
        ? "Producto no encontrado · BunnyJoy"
        : undefined,
    description,
    path: product ? `/product/${encodeURIComponent(product.slug)}` : undefined,
    image: product?.imagen?.[0],
    type: "product",
    noindex: status === "notfound",
  });

  // Si se llegó por un id antiguo, dejar la URL canónica con el slug.
  useEffect(() => {
    if (product && product.slug !== slug) {
      navigate(`/product/${encodeURIComponent(product.slug)}`, {
        replace: true,
      });
    }
  }, [product, slug, navigate]);

  if (status === "notfound") {
    return (
      <div className="text-center py-20">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Producto no encontrado
        </h2>

        <BackButton onClick={() => navigate(-1)} />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">

      <BackButton onClick={() => navigate(-1)} />

      {status === "loading" && <ProductDetailSkeleton />}

      {status === "error" && (
        <div className="mt-8">
          <SectionError
            onRetry={reload}
            message="No pudimos cargar este producto."
          />
        </div>
      )}

      {status === "ready" && product && (
        <>
          <div className="mt-8 grid lg:grid-cols-2 gap-12">

            <ProductGallery key={product.id} product={product} />

            <ProductInfo product={product} />

          </div>

          <RelatedProducts product={product} products={related} />
        </>
      )}

    </main>
  );
}

export default ProductDetail;
