// ============================================================
// TEMPORADA ACTIVA
// ============================================================
//
// Cambia solamente esta línea para cambiar el diseño.
//
// Opciones:
// "default"
// "christmas"
// "halloween"
// "valentine"
// "independence"
//
// ============================================================

export const ACTIVE_SEASON = "christmas";


// ============================================================
// CONFIGURACIÓN DE TEMPORADAS
// ============================================================

export const seasons = {

  // ==========================================================
  // NORMAL
  // ==========================================================

  default: {
    name: "Normal",
    emoji: "🐰",

    heroImage: null,

    hero:
      "bg-gradient-to-br from-rose-100 to-orange-50",

    heroPosition:
      "center",

    overlay:
      "bg-white/20",

    title:
      "Moldes e implementos para elaborar velas artesanales en Costa Rica.",

    primaryButton:
      "bg-rose-500 hover:bg-rose-600",

    secondaryButton:
      "border-rose-500 text-rose-500 hover:bg-rose-50",

    accent:
      "bg-rose-400",

    closedText:
      "text-rose-500",


    // ========================================================
    // NAVBAR
    // ========================================================

    navbar:
      "bg-white/90 backdrop-blur-md shadow-sm",

    navbarLogo:
      "text-rose-500",

    navbarText:
      "text-stone-700 hover:text-rose-500",

    navbarActive:
      "text-rose-500 font-semibold",

    navbarHover:
      "hover:bg-rose-50",

    mobileHeader:
      "border-stone-200",

    navbarDecoration:
      null,
  },


  // ==========================================================
  // NAVIDAD
  // ==========================================================

  christmas: {
    name: "Navidad",
    emoji: "🎄",

    heroImage:
      "/images/seasons/christmas.webp",

    hero:
      "bg-gradient-to-br from-green-100 via-white to-red-100",

    heroPosition:
      "center",

    overlay:
      "bg-white/40",

    title:
      "Crea velas únicas y especiales para esta Navidad.",

    primaryButton:
      "bg-red-600 hover:bg-red-700",

    secondaryButton:
      "border-red-500 text-red-600 hover:bg-red-50",

    accent:
      "bg-red-500",

    closedText:
      "text-red-600",


    // ========================================================
    // NAVBAR
    // ========================================================

    navbar:
      "bg-white/95 backdrop-blur-md shadow-sm",

    navbarLogo:
      "text-red-600",

    navbarText:
      "text-stone-700 hover:text-red-600",

    navbarActive:
      "text-red-600 font-semibold",

    navbarHover:
      "hover:bg-red-50",

    mobileHeader:
      "border-red-100",

    navbarDecoration:
      null,
  },


  // ==========================================================
  // HALLOWEEN
  // ==========================================================

  halloween: {
    name: "Halloween",
    emoji: "🎃",

    heroImage:
      "/images/seasons/halloween.webp",

    hero:
      "bg-gradient-to-br from-orange-100 via-orange-50 to-purple-100",

    heroPosition:
      "center",

    overlay:
      "bg-black/25",

    title:
      "Crea velas terroríficamente increíbles este Halloween.",

    primaryButton:
      "bg-orange-500 hover:bg-orange-600",

    secondaryButton:
      "border-orange-500 text-orange-600 hover:bg-orange-50",

    accent:
      "bg-orange-500",

    closedText:
      "text-orange-600",


    // ========================================================
    // NAVBAR
    // ========================================================

    navbar:
      "bg-zinc-950/95 backdrop-blur-md shadow-lg",

    navbarLogo:
      "text-orange-400",

    navbarText:
      "text-white/90 hover:text-orange-400",

    navbarActive:
      "text-orange-400 font-semibold",

    navbarHover:
      "hover:bg-orange-500/10",

    mobileHeader:
      "border-orange-500/30",

    navbarDecoration:
      null,
  },


  // ==========================================================
  // SAN VALENTÍN
  // ==========================================================

  valentine: {
    name: "San Valentín",
    emoji: "💕",

    heroImage:
      "/images/seasons/valentine.webp",

    hero:
      "bg-gradient-to-br from-pink-100 via-rose-50 to-red-100",

    heroPosition:
      "center",

    overlay:
      "bg-white/35",

    title:
      "Crea velas especiales para celebrar el amor.",

    primaryButton:
      "bg-rose-500 hover:bg-rose-600",

    secondaryButton:
      "border-rose-500 text-rose-500 hover:bg-rose-50",

    accent:
      "bg-rose-400",

    closedText:
      "text-rose-500",


    // ========================================================
    // NAVBAR
    // ========================================================

    navbar:
      "bg-white/95 backdrop-blur-md shadow-sm",

    navbarLogo:
      "text-rose-500",

    navbarText:
      "text-stone-700 hover:text-rose-500",

    navbarActive:
      "text-rose-500 font-semibold",

    navbarHover:
      "hover:bg-rose-50",

    mobileHeader:
      "border-rose-100",

    navbarDecoration:
      null,
  },


  // ==========================================================
  // FIESTAS PATRIAS - COSTA RICA
  // ==========================================================

	  independence: {
	  name: "Fiestas Patrias",
	  emoji: "🇨🇷",

	  heroImage:
		"/images/seasons/independence.webp",

	  hero:
		"bg-gradient-to-br from-blue-100 via-white to-red-100",

	  heroPosition:
		"center",

	  overlay:
		"bg-white/35",

	  title:
		"Celebremos Costa Rica con creatividad y velas artesanales.",

	  primaryButton:
		"bg-blue-600 hover:bg-blue-700",

	  secondaryButton:
		"border-blue-500 text-blue-600 hover:bg-blue-50",

	  accent:
		"bg-blue-500",

	  closedText:
		"text-red-600",

	  navbar:
		"bg-white/95 backdrop-blur-md shadow-sm",

	  navbarLogo:
		"text-blue-700",

	  navbarText:
		"text-stone-700 hover:text-blue-600",

	  navbarActive:
		"text-blue-600 font-semibold",

	  navbarHover:
		"hover:bg-blue-50",

	  mobileHeader:
		"border-blue-100",

	  navbarDecoration:
		"/images/seasons/independence-navbar.webp",
	},

};


// ============================================================
// TEMA ACTIVO
// ============================================================

export const activeTheme =
  seasons[ACTIVE_SEASON] || seasons.default;
