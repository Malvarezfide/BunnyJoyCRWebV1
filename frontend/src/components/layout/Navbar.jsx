import { Link } from "react-router-dom";

import logo from "../../assets/logo.webp";

import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

import {
  activeTheme,
  ACTIVE_SEASON,
} from "../../config/seasons";

function Navbar() {
  return (
    <header
      className={`
        fixed
        top-0
        left-0
        w-full
        z-50
        ${activeTheme.navbar}
      `}
    >

      {/* ==================================================
          DECORACIÓN PATRIÓTICA
      ================================================== */}

		{activeTheme.navbarDecoration && (
		  <div
			className="
			  absolute
			  bottom-0
			  left-0
			  w-full
			  h-[58px]
			  overflow-hidden
			  pointer-events-none
			  z-0
			"
		  >
			<img
			  src={activeTheme.navbarDecoration}
			  alt=""
			  aria-hidden="true"
			  className="
				absolute
				left-1/2
				bottom-[-72px]
				-translate-x-1/2

				w-[1050px]
				h-auto
				max-w-none

				md:w-[1450px]
				md:bottom-[-82px]

				lg:w-[1750px]
				lg:bottom-[-92px]

				xl:w-[1950px]
				xl:bottom-[-100px]

				select-none
			  "
			/>
		  </div>
		)}


      {/* ==================================================
          CONTENIDO
      ================================================== */}

      <div
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          h-20
          px-4
          md:px-6
		  pb-1
          flex
          items-center
          justify-between
        "
      >

        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          to="/"
          className="
            flex
            items-center
            gap-3
            flex-shrink-0
            group
          "
        >

          <div className="relative">

            <img
              src={logo}
              alt="Logo BunnyJoy"
              width={56}
              height={56}
              className="
                w-14
                h-14
                object-contain
                transition-transform
                duration-300
                group-hover:scale-105
              "
            />

            {ACTIVE_SEASON === "independence" && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  text-sm
                  drop-shadow-sm
                "
              >
                🇨🇷
              </span>
            )}

          </div>


          <div className="flex flex-col leading-none">

            <span
              className={`
                text-2xl
                font-bold
                ${activeTheme.navbarLogo}
              `}
            >
              BunnyJoy
            </span>


            {ACTIVE_SEASON === "independence" && (
              <span
                className="
                  mt-1
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-red-500
                  font-semibold
                "
              >
                Costa Rica
              </span>
            )}

          </div>

        </Link>


        {/* ==================================================
            ESCRITORIO
        ================================================== */}

        <DesktopMenu />


        {/* ==================================================
            MÓVIL
        ================================================== */}

        <MobileMenu />

      </div>

    </header>
  );
}

export default Navbar;
