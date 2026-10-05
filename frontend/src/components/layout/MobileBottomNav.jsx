import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineMagnifyingGlass,
  HiOutlineBars3,
  HiOutlineXMark,
} from "react-icons/hi2";

import { useCategories } from "../../context/CategoriesContext";
import categoryStyles from "../../config/categoryStyles";
import { activeTheme } from "../../config/seasons";

function MobileBottomNav() {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  const { categories } = useCategories();


  /* =========================================================
     MOSTRAR / OCULTAR SEGÚN SCROLL
  ========================================================= */

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Cerca del inicio siempre mostramos la barra
      if (currentScrollY <= 40) {
        setVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      // Si las categorías están abiertas,
      // no escondemos la navegación.
      if (categoriesOpen) {
        setVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      // Bajando → ocultar
      if (currentScrollY > lastScrollY) {
        setVisible(false);
      }

      // Subiendo → mostrar
      else if (currentScrollY < lastScrollY) {
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [categoriesOpen]);


  /* =========================================================
     CERRAR CATEGORÍAS
  ========================================================= */

  const closeCategories = () => {
    setCategoriesOpen(false);
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          BARRA INFERIOR MOBILE
      ===================================================== */}

      <nav
        className={`
          mobile-bottom-nav
          lg:hidden
          ${
            visible
              ? "mobile-bottom-nav--visible"
              : "mobile-bottom-nav--hidden"
          }
        `}
      >

        {/* ===================================================
            INICIO
        =================================================== */}

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `
              mobile-bottom-nav__item
              ${isActive ? "mobile-bottom-nav__item--active" : ""}
            `
          }
        >
          <HiOutlineHome className="mobile-bottom-nav__icon" />

          <span>
            Inicio
          </span>
        </NavLink>


        {/* ===================================================
            CATEGORÍAS
        =================================================== */}

        <button
          type="button"
          onClick={() => {
            setCategoriesOpen(true);
            setVisible(true);
          }}
          className={`
            mobile-bottom-nav__item
            ${
              categoriesOpen
                ? "mobile-bottom-nav__item--active"
                : ""
            }
          `}
          aria-label="Abrir categorías"
          aria-expanded={categoriesOpen}
        >
          <HiOutlineSquares2X2 className="mobile-bottom-nav__icon" />

          <span>
            Categorías
          </span>
        </button>


        {/* ===================================================
            BUSCAR
        =================================================== */}

        <Link
          to="/products"
          className="mobile-bottom-nav__item"
        >
          <HiOutlineMagnifyingGlass className="mobile-bottom-nav__icon" />

          <span>
            Buscar
          </span>
        </Link>


        {/* ===================================================
            MENÚ
        =================================================== */}

        <button
          type="button"
          onClick={() => {
            setVisible(true);

            window.dispatchEvent(
              new Event("open-mobile-menu")
            );
          }}
          className="mobile-bottom-nav__item"
          aria-label="Abrir menú"
        >
          <HiOutlineBars3 className="mobile-bottom-nav__icon" />

          <span>
            Menú
          </span>
        </button>

      </nav>


      {/* =====================================================
          OVERLAY CATEGORÍAS
      ===================================================== */}

      <div
        onClick={closeCategories}
        className={`
          fixed
          inset-0
          z-[45]
          bg-black/40
          transition-opacity
          duration-300

          ${
            categoriesOpen
              ? "opacity-100 visible pointer-events-auto"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
      />


      {/* =====================================================
          PANEL DE CATEGORÍAS
      ===================================================== */}

      <aside
        className={`
          fixed
          left-0
          right-0
          bottom-0
          z-[50]

          bg-white
          rounded-t-3xl
          shadow-2xl

          max-h-[80vh]

          transition-all
          duration-300
          ease-out

          ${
            categoriesOpen
              ? "translate-y-0 opacity-100 visible pointer-events-auto"
              : "translate-y-full opacity-0 invisible pointer-events-none"
          }
        `}
      >

        {/* ===================================================
            ENCABEZADO
        =================================================== */}

        <div
          className={`
            flex
            items-center
            justify-between
            px-5
            py-4
            border-b

            ${activeTheme.mobileHeader}
          `}
        >

          <div>

            <h2
              className={`
                text-lg
                font-bold
                ${activeTheme.navbarLogo}
              `}
            >
              Categorías
            </h2>

            <p className="text-xs text-stone-500 mt-1">
              Explora nuestros productos
            </p>

          </div>


          <button
            type="button"
            onClick={closeCategories}
            aria-label="Cerrar categorías"
            className={`
              p-2
              rounded-full
              transition-colors
              ${activeTheme.navbarText}
              ${activeTheme.navbarHover}
            `}
          >
            <HiOutlineXMark size={28} />
          </button>

        </div>


        {/* ===================================================
            LISTA DE CATEGORÍAS
        =================================================== */}

        <div
          className="
            overflow-y-auto
            px-5
            py-5
            pb-8
            max-h-[calc(80vh-85px)]
          "
        >

          <div className="grid grid-cols-2 gap-3">

            {categories.map((category) => {

              const key = category.name
                .toLowerCase()
                .trim();

              const config = categoryStyles[key];

              return (
                <Link
                  key={category.name}
                  to={`/products?categoria=${encodeURIComponent(
                    category.name
                  )}`}
                  onClick={closeCategories}
                  className={`
                    flex
                    items-center
                    gap-3

                    rounded-xl

                    px-3
                    py-4

                    border
                    border-stone-100

                    bg-stone-50

                    transition-all
                    duration-200

                    active:scale-[0.97]

                    ${activeTheme.navbarText}

                    ${
                      config?.hover ||
                      activeTheme.navbarHover
                    }
                  `}
                >

                  <span className="text-2xl">
                    {config?.icon || "📁"}
                  </span>

                  <span className="text-sm font-medium">
                    {category.name}
                  </span>

                </Link>
              );
            })}

          </div>


          {/* =================================================
              TODOS LOS PRODUCTOS
          ================================================= */}

          <Link
            to="/products"
            onClick={closeCategories}
            className="
              mt-4
              flex
              items-center
              justify-center
              w-full

              rounded-xl

              bg-stone-100

              py-3

              text-sm
              font-semibold
              text-stone-700

              active:scale-[0.98]

              transition-transform
            "
          >
            Ver todos los productos
          </Link>

        </div>

      </aside>
    </>
  );
}

export default MobileBottomNav;