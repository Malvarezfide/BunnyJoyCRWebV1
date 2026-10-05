import { Link } from "react-router-dom";
import { useCategories } from "../../context/CategoriesContext";
import categoryStyles from "../../config/categoryStyles";

function CategoriesMenu() {
  
  const { categories } = useCategories();

  return (
    <div className="relative group">

      <button
        type="button"
        className="flex items-center gap-2 hover:text-rose-500 transition"
      >
        Productos

        <span className="text-xs transition-transform group-hover:rotate-180">
          ▼
        </span>
      </button>

      <div
        className="
          absolute
          left-0
          w-60
          rounded-xl
          border
          bg-white
          shadow-xl
          z-50
          opacity-0
          invisible
          pointer-events-none
          transition-all
          duration-200
          group-hover:opacity-100
          group-hover:visible
          group-hover:pointer-events-auto
        "
      >

        {categories.map((category) => {
          const key = category.name.toLowerCase().trim();
          const config = categoryStyles[key];

          return (
            <Link
              key={category.name}
              to={`/products?categoria=${category.name}`}
              className={`
                flex
                items-center
                gap-3
                px-4
                py-3
                transition
                ${config?.hover || "hover:bg-rose-50"}
              `}
            >
              <span className="text-lg">
                {config?.icon || "📁"}
              </span>

              <span>
                {category.name}
              </span>
            </Link>
          );
        })}

        <hr />

        <Link
          to="/products"
          className="flex items-center gap-3 px-4 py-3 hover:bg-rose-50 transition"
        >
          <span>🛍️</span>
          <span>Ver todos</span>
        </Link>

      </div>
    </div>
  );
}

export default CategoriesMenu;
