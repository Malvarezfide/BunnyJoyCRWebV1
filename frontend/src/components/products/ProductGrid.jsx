import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useCatalog } from "../../services/site/productService";
import categoryStyles from "../../config/categoryStyles";
import { CardGridSkeleton, SectionError } from "../common/Skeletons";

import {
  HiXMark,
  HiOutlineBars3,
  HiOutlineSquares2X2,
} from "react-icons/hi2";

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

const ORDER_KEY = "productsOrder";

function readSavedOrder() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(ORDER_KEY));

    return Array.isArray(saved) ? saved : null;
  } catch {
    return null;
  }
}

function saveOrder(ids) {
  try {
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(ids));
  } catch {
    // Sin sessionStorage (modo privado): el orden solo dura esta visita.
  }
}

// Orden aleatorio estable durante la sesión. Los productos que no
// estaban en el orden guardado (creados después) se agregan al inicio.
function stableShuffle(products) {
  const saved = readSavedOrder();

  if (saved) {
    const byId = new Map(products.map((p) => [p.id, p]));
    const known = new Set(saved);

    const ordered = saved.map((id) => byId.get(id)).filter(Boolean);
    const added = products.filter((p) => !known.has(p.id));

    const result = [...added, ...ordered];

    if (added.length) saveOrder(result.map((p) => p.id));

    return result;
  }

  const shuffled = shuffle(products);

  saveOrder(shuffled.map((p) => p.id));

  return shuffled;
}

function ProductGrid() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "large";
  const navigate = useNavigate();

  // Resúmenes del catálogo activo (sin descripción ni galería). Se
  // filtra y busca en el cliente: con un catálogo pequeño es más rápido
  // que ir al servidor por cada tecla. Ver README → "Cuándo paginar".
  const { products: productsData, status, reload } = useCatalog();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const changeView = (newView) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", newView);

    navigate(`/products?${params.toString()}`);
  };

  const category = searchParams.get("categoria") || "Todos";

  const categories = [
    "Todos",
    ...new Set(productsData.map((p) => p.categoria).filter(Boolean)),
  ];

  const shuffledProducts = useMemo(
    () => stableShuffle(productsData),
    [productsData]
  );

  const filteredProducts = useMemo(() => {
    const source =
      category === "Todos"
        ? shuffledProducts
        : productsData;

    return source.filter((p) => {
      const searchable = [
        p.nombre,
        p.categoria,
        ...(p.etiquetas || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchSearch = searchable.includes(search.toLowerCase());

      const matchCategory =
        category === "Todos" || p.categoria === category;

      return matchSearch && matchCategory;
    });
  }, [shuffledProducts, productsData, search, category]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">

      {/* BUSCADOR */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);

              const params = new URLSearchParams(searchParams);

              if (value) {
                params.set("search", value);
              } else {
                params.delete("search");
              }

              navigate(`/products?${params.toString()}`, {
                replace: true,
              });
            }}
            className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");

                const params = new URLSearchParams(searchParams);
                params.delete("search");

                navigate(`/products?${params.toString()}`, {
                  replace: true,
                });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition"
              aria-label="Limpiar búsqueda"
            >
              <HiXMark size={20} />
            </button>
          )}
        </div>
      </div>

      {/* CATEGORÍAS */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Categorías
          </h2>

          <span className="text-xs text-gray-400">
            Explora nuestros productos
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const key = cat.toLowerCase().trim();
            const config = categoryStyles[key];
            const isActive = category === cat;

            return (
              <button
                key={cat}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);

                  if (cat === "Todos") {
                    params.delete("categoria");
                  } else {
                    params.set("categoria", cat);
                  }

                  if (search) {
                    params.set("search", search);
                  }

                  navigate(`/products?${params.toString()}`);
                }}
                className={`
                  group
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? config?.active ||
                        "bg-rose-500 text-white border-rose-500 shadow-sm"
                      : `
                          bg-white
                          text-gray-700
                          border-gray-200
                          ${config?.hover || "hover:bg-rose-50 hover:text-rose-600"}
                          hover:shadow-sm
                        `
                  }
                `}
              >
                <span
                  className={`
                    text-base
                    transition-transform
                    duration-200
                    ${!isActive ? "group-hover:scale-110" : ""}
                  `}
                >
                  {cat === "Todos"
                    ? "🛍️"
                    : config?.icon || "📁"}
                </span>

                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CAMBIO DE VISTA */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">
          {status === "ready" ? `${filteredProducts.length} productos` : "\u00a0"}
        </span>

        <div className="md:hidden flex items-center gap-2">
          <span className="text-xs text-gray-400 mr-1">
            Vista
          </span>

          <button
            type="button"
            onClick={() => changeView("large")}
            title="Vista de lista"
            aria-label="Vista de lista"
            className={`
              p-2
              rounded-lg
              border
              transition-all
              duration-200

              ${
                view === "large"
                  ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-rose-50 hover:text-rose-500"
              }
            `}
          >
            <HiOutlineBars3 size={20} />
          </button>

          <button
            type="button"
            onClick={() => changeView("grid")}
            title="Vista de dos columnas"
            aria-label="Vista de dos columnas"
            className={`
              p-2
              rounded-lg
              border
              transition-all
              duration-200

              ${
                view === "grid"
                  ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-rose-50 hover:text-rose-500"
              }
            `}
          >
            <HiOutlineSquares2X2 size={20} />
          </button>
        </div>
      </div>

      {/* GRID */}
      <div
        className={`
          grid gap-4 sm:gap-5
          ${
            view === "large"
              ? "grid-cols-1"
              : "grid-cols-2"
          }
          md:grid-cols-3
          lg:grid-cols-4
        `}
      >
        {status === "loading" && (
          <div className="col-span-full">
            <CardGridSkeleton
              count={8}
              gridClassName="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
            />
          </div>
        )}

        {status === "error" && (
          <div className="col-span-full">
            <SectionError
              onRetry={reload}
              message="No pudimos cargar el catálogo."
            />
          </div>
        )}

        {status === "ready" && filteredProducts.length === 0 && (
          <p className="text-gray-500">
            No se encontraron productos 🐰
          </p>
        )}

        {status === "ready" &&
          filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              view={view}
              priority={index < 2}
            />
          ))}
      </div>
    </section>
  );
}

export default ProductGrid;
