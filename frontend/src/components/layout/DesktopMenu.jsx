import { NavLink } from "react-router-dom";

import CategoriesMenu from "./CategoriesMenu";
import SocialLinks from "./SocialLinks";

import { activeTheme } from "../../config/seasons";

function DesktopMenu() {
  return (
    <nav className="hidden lg:flex items-center gap-8">

      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? activeTheme.navbarActive
            : activeTheme.navbarText
        }
      >
        Inicio
      </NavLink>

      <CategoriesMenu />

      <SocialLinks />

    </nav>
  );
}

export default DesktopMenu;
