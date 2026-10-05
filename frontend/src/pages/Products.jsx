import ProductGrid from "../components/products/ProductGrid";
import site from "../config/site";
import usePageMeta from "../hooks/usePageMeta";

function Productos() {
  usePageMeta({
    title: `Catálogo · ${site.name}`,
    description:
      "Moldes e implementos para elaborar velas artesanales en Costa Rica. Explora el catálogo de BunnyJoy.",
    path: "/products",
  });

  return (
    <main className="min-h-screen">
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold text-rose-500">
          Catálogo {site.name} 🐰
        </h1>
        <p className="text-gray-600 mt-2">
		  Encuentra moldes e implementos para elaborar tus propias velas artesanales.
		</p>
      </div>

      <ProductGrid />
    </main>
  );
}

export default Productos;