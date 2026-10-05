import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useCategories } from "../../context/CategoriesContext";
import categoryStyles from "../../config/categoryStyles";
import { activeTheme } from "../../config/seasons";
import SocialLinks from "./SocialLinks";
import logo from "../../assets/logo.webp";

import {
  HiOutlineBars3,
  HiOutlineXMark,
} from "react-icons/hi2";


function MobileMenu() {
  
  const [open, setOpen] = useState(false);
  const { categories } = useCategories();

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  
  // Abrir el menú desde la barra inferior móvil
	useEffect(() => {
	  const handleOpenMobileMenu = () => {
		setOpen(true);
	  };

	  window.addEventListener(
		"open-mobile-menu",
		handleOpenMobileMenu
	  );

	  return () => {
		window.removeEventListener(
		  "open-mobile-menu",
		  handleOpenMobileMenu
		);
	  };
	}, []);

  // Cerrar el menú al pasar a escritorio
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* =====================================================
          BOTÓN HAMBURGUESA
      ===================================================== */}

      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className={`
          lg:hidden
          transition-colors
          duration-300
          ${activeTheme.navbarText}
          ${open ? "invisible" : ""}
        `}
      >
        <HiOutlineBars3 size={34} />
      </button>


      {/* =====================================================
          OVERLAY
      ===================================================== */}

      <div
        onClick={() => setOpen(false)}
        className={`
          fixed
          inset-0
          bg-black/40
          z-40
          transition-opacity
          duration-300

          ${
            open
              ? "opacity-100 visible pointer-events-auto"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
      />


      {/* =====================================================
          PANEL MOBILE
      ===================================================== */}

      <aside
        className={`
          fixed
          top-0
          right-0
          flex
          flex-col
          h-screen
          w-[85%]
          max-w-sm
          bg-white
          z-[60]
          shadow-xl
          transition-all
          duration-300
          ease-in-out

          ${
            open
              ? "translate-x-0 opacity-100 visible pointer-events-auto"
              : "translate-x-full opacity-0 invisible pointer-events-none"
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
            p-5
            border-b
            transition-colors
            duration-300
            ${activeTheme.mobileHeader}
          `}
        >

          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <img
              src={logo}
              alt="Logo BunnyJoy"
              className="w-10 h-10 object-contain"
            />

            <span
              className={`
                font-bold
                text-xl
                transition-colors
                duration-300
                ${activeTheme.navbarLogo}
              `}
            >
              BunnyJoy
            </span>
          </Link>


          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className={`
              transition-colors
              duration-300
              ${activeTheme.navbarText}
            `}
          >
            <HiOutlineXMark size={34} />
          </button>

        </div>


        {/* ===================================================
            NAVEGACIÓN
        =================================================== */}

        <nav className="flex-1 overflow-y-auto px-6 py-6">

          {/* Inicio */}

          <Link
            to="/"
            onClick={() => setOpen(false)}
            className={`
              block
              py-3
              text-lg
              transition-colors
              duration-300
              ${activeTheme.navbarText}
            `}
          >
            Inicio
          </Link>


          {/* Todos los productos */}

          <Link
            to="/products"
            onClick={() => setOpen(false)}
            className={`
              block
              py-3
              text-lg
              transition-colors
              duration-300
              ${activeTheme.navbarText}
            `}
          >
            Todos los productos
          </Link>


          {/* =================================================
				CATEGORÍAS
			================================================= */}

			<div className="mt-8">

			  <h3
				className={`
				  text-xs
				  uppercase
				  tracking-wider
				  font-semibold
				  transition-colors
				  duration-300
				  ${activeTheme.navbarLogo}
				`}
			  >
				Categorías
			  </h3>

			  <div className="mt-4 space-y-2">

				{categories.map((category) => {

				  const key = category.name.toLowerCase().trim();
				  const config = categoryStyles[key];

				  return (
					<Link
					  key={category.name}
					  to={`/products?categoria=${category.name}`}
					  onClick={() => setOpen(false)}
					  className={`
						flex
						items-center
						gap-3
						rounded-lg
						px-3
						py-3
						transition-colors
						duration-300
						${activeTheme.navbarText}
						${config?.hover || activeTheme.navbarHover}
					  `}
					>

					  <span className="text-xl">
						{config?.icon || "📁"}
					  </span>

					  <span>
						{category.name}
					  </span>

					</Link>
				  );
				})}

			  </div>

			</div>


          {/* =================================================
              SEPARADOR
          ================================================= */}

          <hr className="my-8 border-stone-200" />


          {/* =================================================
              REDES SOCIALES
          ================================================= */}

          <SocialLinks mobile />

        </nav>

      </aside>
    </>
  );
}

export default MobileMenu;
