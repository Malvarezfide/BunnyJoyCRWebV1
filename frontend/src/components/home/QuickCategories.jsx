import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useCategories } from "../../context/CategoriesContext";
import categoryStyles from "../../config/categoryStyles";

function QuickCategories() {
  
  const { categories } = useCategories();

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">

      {/* TÍTULO */}

      <div className="text-center mb-8">

        <h2
          className="
            text-2xl
            sm:text-3xl
            font-bold
            text-gray-800
          "
        >
          Explora por categoría
        </h2>

        <p
          className="
            mt-2
            text-gray-500
          "
        >
          Encuentra rápidamente lo que estás buscando
        </p>

      </div>


      {/* CATEGORÍAS */}

      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          gap-4
          max-w-4xl
          mx-auto
        "
      >

        {categories.map((category) => {

          const key = category.name.toLowerCase().trim();
          const style = categoryStyles[key];

          return (
            <Link
              key={category.id || category.name}
              to={`/products?categoria=${category.name}`}
              className={`
                group
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                text-center
                shadow-sm
                transition
                duration-200
                hover:-translate-y-1
                hover:shadow-md
                ${style?.hover || "hover:bg-gray-50"}
              `}
            >

              {/* ICONO */}

              <div
                className="
                  text-4xl
                  sm:text-5xl
                  mb-3
                  transition
                  duration-200
                  group-hover:scale-110
                "
              >
                {style?.icon || category.icon || "📁"}
              </div>


              {/* NOMBRE */}

              <h3
                className="
                  font-semibold
                  text-gray-800
                "
              >
                {category.name}
              </h3>


              {/* INDICADOR */}

              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  mt-2
                  text-sm
                  text-gray-400
                  group-hover:text-gray-600
                  transition
                "
              >
                Ver productos

                <ArrowRight
                  size={18}
                  className="
                    relative
                    top-[1px]
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                />
              </span>

            </Link>
          );
        })}

      </div>

    </section>
  );
}

export default QuickCategories;
