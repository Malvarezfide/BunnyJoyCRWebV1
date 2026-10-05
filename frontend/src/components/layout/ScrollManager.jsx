import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const positions = {};

function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();

  // Guardar continuamente la posición de la ruta actual
  useEffect(() => {
    const savePosition = () => {
      positions[location.key] = window.scrollY;
    };

    savePosition();

    window.addEventListener("scroll", savePosition);

    return () => {
      savePosition();
      window.removeEventListener("scroll", savePosition);
    };
  }, [location]);

  // Restaurar scroll después de renderizar
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        if (
          navigationType === "POP" &&
          positions[location.key] !== undefined
        ) {
          window.scrollTo({
            top: positions[location.key],
            behavior: "auto",
          });

          return;
        }

        window.scrollTo({
          top: 0,
          behavior: "auto",
        });

      });
    });
  }, [location, navigationType]);

  return null;
}

export default ScrollManager;