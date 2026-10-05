import { Link } from "react-router-dom";

import announcements from "../../config/announcements";


function Announcements() {

  const activeAnnouncements = announcements.filter(
    (announcement) => announcement.active
  );


  if (activeAnnouncements.length === 0) {
    return null;
  }


  return (
    <section className="max-w-6xl mx-auto px-6 py-12">

      {/* =====================================================
          TÍTULO
      ====================================================== */}

      <div className="text-center mb-8">

        <h2
          className="
            text-2xl
            sm:text-3xl
            font-bold
            text-gray-800
          "
        >
          📢 Noticias y novedades
        </h2>

        <p
          className="
            mt-2
            text-gray-500
          "
        >
          Entérate de nuestras últimas novedades
        </p>

      </div>


      {/* =====================================================
          ANUNCIOS
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
      >

        {activeAnnouncements.map((announcement) => (

          <article
            key={announcement.id}
            className="
              overflow-hidden
              rounded-2xl
              bg-white
              border
              border-gray-100
              shadow-sm
              transition
              duration-200
              hover:-translate-y-1
              hover:shadow-md
            "
          >

            {/* =================================================
                IMAGEN
            ================================================== */}

            <div
              className="
                aspect-[16/9]
                bg-gray-100
                overflow-hidden
              "
            >

              <img
                src={announcement.image}
                alt={announcement.title}
                className="
                  w-full
                  h-full
                  object-cover
                  transition
                  duration-300
                  hover:scale-105
                "
              />

            </div>


            {/* =================================================
                CONTENIDO
            ================================================== */}

            <div className="p-5">

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-2
                "
              >

                <span className="text-xl">
                  {announcement.icon}
                </span>

                <h3
                  className="
                    text-lg
                    font-semibold
                    text-gray-800
                  "
                >
                  {announcement.title}
                </h3>

              </div>


              <p
                className="
                  text-sm
                  leading-relaxed
                  text-gray-500
                "
              >
                {announcement.description}
              </p>


              {/* =================================================
                  ENLACE
              ================================================== */}

              {announcement.link && (
                <Link
                  to={announcement.link}
                  className="
                    inline-flex
                    items-center
                    mt-4
                    text-sm
                    font-semibold
                    text-rose-500
                    hover:text-rose-600
                    transition
                  "
                >
                  Ver más →
                </Link>
              )}

            </div>

          </article>

        ))}

      </div>

    </section>
  );
}


export default Announcements;
