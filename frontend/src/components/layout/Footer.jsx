import { Link } from "react-router-dom";
import site from "../../config/site";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">

        {/* Marca */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            🐰 {site.name}
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-400">
            Venta de implementos para elaborar velas artesanales
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Navegación
          </h3>

          <ul className="space-y-2">

            <li>
              <Link
                to="/"
                className="hover:text-rose-400 transition"
              >
                Inicio
              </Link>
            </li>

            <li>
              <Link
                to="/products"
                className="hover:text-rose-400 transition"
              >
                Productos
              </Link>
            </li>

          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Contacto
          </h3>

          <div className="space-y-3">

            <a
              href={`https://wa.me/${site.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-green-400 transition"
            >
              💬 WhatsApp
            </a>
			
			{/* Facebook */}
            {site.social.facebook && (
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-blue-400 transition"
              >
                💙 Facebook
              </a>
            )}

            <a
              href="mailto:bunnyjoycr@gmail.com"
              className="block hover:text-rose-400 transition"
            >
              📧 bunnyjoycr@gmail.com
            </a>

            <p>
              📍 Heredia, Costa Rica
            </p>

          </div>
        </div>

      </div>

      <div className="border-t border-stone-700 py-5 text-center text-sm text-gray-500">
        © {currentYear} {site.name}.
      </div>
    </footer>
  );
}

export default Footer;