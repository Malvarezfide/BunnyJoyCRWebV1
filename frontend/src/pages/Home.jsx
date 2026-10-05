import { Link } from "react-router-dom";

import FeaturedProducts from "../components/home/FeaturedProducts";
import QuickCategories from "../components/home/QuickCategories";
import OpeningHours from "../components/home/OpeningHours";
import Announcements from "../components/home/Announcements";
import RecentProducts from "../components/home/RecentProducts";

import usePageMeta, { defaultMeta } from "../hooks/usePageMeta";
import { useHome } from "../services/site/productService";

import site from "../config/site";

import { activeTheme } from "../config/seasons";


function Home() {

  const theme = activeTheme;

  usePageMeta({ ...defaultMeta, path: "/" });

  // UNA petición para toda la portada (novedades + destacados).
  const { recent, featured, status, reload } = useHome();


  return (
    <main>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className={`
          relative
          overflow-hidden
          bg-cover
          ${theme.hero}
        `}
        style={{
          backgroundImage: theme.heroImage
            ? `url(${theme.heroImage})`
            : undefined,

          backgroundPosition: theme.heroPosition,
        }}
      >

        {/* =================================================
            OVERLAY
        ================================================== */}

        <div
          className={`
            absolute
            inset-0
            ${theme.overlay}
          `}
        />


        {/* =================================================
            CONTENIDO DEL HERO
        ================================================== */}

        <div
          className="
            relative
            max-w-6xl
            mx-auto
            px-6
            py-24
            text-center
          "
        >

          <h1
            className="
              text-4xl
              sm:text-5xl
              md:text-6xl
              font-bold
              text-gray-800
            "
          >
            {site.name} {theme.emoji}
          </h1>
		  

          <p
            className="
              mt-6
              text-lg
              sm:text-xl
              text-gray-600
              max-w-3xl
              mx-auto
            "
          >
            {theme.title}
          </p>


          {/* =================================================
              BOTONES
          ================================================== */}

          <div
            className="
              mt-10
              flex
              flex-col
              sm:flex-row
              justify-center
              items-center
              gap-4
            "
          >

            {/* CATÁLOGO */}

            <Link
              to="/products"
              className={`
                w-full
                sm:w-auto
                text-center
                text-white
                px-8
                py-3
                rounded-xl
                transition
                shadow-sm
                ${theme.primaryButton}
              `}
            >
              Explorar catálogo
            </Link>


            {/* WHATSAPP */}

            <a
              href={`https://wa.me/${site.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                w-full
                sm:w-auto
                text-center
                border
                px-8
                py-3
                rounded-xl
                transition
                bg-white/70
                ${theme.secondaryButton}
              `}
            >
              WhatsApp
            </a>


            {/* FACEBOOK */}

            {site.social.facebook && (
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  w-full
                  sm:w-auto
                  text-center
                  border
                  px-8
                  py-3
                  rounded-xl
                  transition
                  bg-white/70
                  ${theme.secondaryButton}
                `}
              >
                Facebook
              </a>
            )}

          </div>

        </div>

      </section>
	  
	  {/* =====================================================
          CATEGORÍAS RÁPIDAS
      ====================================================== */}

      <QuickCategories />

    {/* =====================================================
          HORARIOS
      ====================================================== */}

      <OpeningHours
        hours={site.hours}
        theme={theme}
      />

    {/* =====================================================
      NOVEDADES
      ====================================================== */}

      <RecentProducts
        products={recent}
        status={status}
        onRetry={reload}
      />

	  {/* =====================================================
          NOTICIAS / ANUNCIOS
      ====================================================== */}
	  
	  <Announcements />


      {/* =====================================================
          PRODUCTOS DESTACADOS
      ====================================================== */}

      <FeaturedProducts
        products={featured}
        status={status}
        onRetry={reload}
      />

    </main>
  );
}


export default Home;
