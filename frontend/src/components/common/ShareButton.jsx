import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import {
  shareProduct,
  getWhatsAppShareUrl,
  getFacebookShareUrl,
  copyProductUrl,
} from "../../utils/shareProduct";

function ShareIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
      <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    </svg>
  );
}

function ShareButton({
  product,
  className = "",
  variant = "default",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 260,
  });

  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const isCompact = variant === "compact";
  const shareOptionsId = `share-options-${product.id}`;

  /*
   * =====================================================
   * CALCULAR POSICIÓN
   * =====================================================
   */
  function calculateMenuPosition() {
    if (!buttonRef.current || !menuRef.current) {
      return;
    }

    const buttonRect =
      buttonRef.current.getBoundingClientRect();

    const menuRect =
      menuRef.current.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const margin = 8;
    const gap = 8;

    const menuWidth = Math.min(
      260,
      viewportWidth - margin * 2
    );

    /*
     * =================================================
     * HORIZONTAL
     * =================================================
     *
     * Intentamos alinear el lado derecho del menú
     * con el lado derecho del botón.
     */
    let left =
      buttonRect.right - menuWidth;

    /*
     * Nunca permitimos que salga por la izquierda.
     */
    if (left < margin) {
      left = margin;
    }

    /*
     * Nunca permitimos que salga por la derecha.
     */
    if (
      left + menuWidth >
      viewportWidth - margin
    ) {
      left =
        viewportWidth -
        menuWidth -
        margin;
    }

    /*
     * =================================================
     * VERTICAL
     * =================================================
     *
     * Preferimos abrir hacia arriba.
     */
    let top =
      buttonRect.top -
      menuRect.height -
      gap;

    /*
     * Si no cabe arriba, intentamos ponerlo debajo.
     */
    if (top < margin) {
      top =
        buttonRect.bottom +
        gap;
    }

    /*
     * Si tampoco cabe debajo, lo ajustamos al viewport.
     */
    if (
      top + menuRect.height >
      viewportHeight - margin
    ) {
      top =
        viewportHeight -
        menuRect.height -
        margin;
    }

    /*
     * Última protección.
     */
    if (top < margin) {
      top = margin;
    }

    setPosition({
      top,
      left,
      width: menuWidth,
    });

    /*
     * IMPORTANTE:
     * Primero se calcula la posición.
     * Después hacemos visible el menú.
     *
     * Esto evita el efecto de que aparezca
     * inicialmente desde una esquina.
     */
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }

  /*
   * =====================================================
   * ABRIR / CERRAR
   * =====================================================
   */
  function handleShare() {
    if (isOpen) {
      closeMenu();
      return;
    }

    /*
     * Abrimos el menú pero todavía invisible.
     * Esto permite medirlo correctamente.
     */
    setIsVisible(false);
    setIsOpen(true);
  }

  function closeMenu() {
    setIsVisible(false);

    /*
     * Dejamos que termine mínimamente la transición
     * antes de desmontar el portal.
     */
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  }

  /*
   * =====================================================
   * CALCULAR DESPUÉS DE MONTAR
   * =====================================================
   */
  useEffect(() => {
    if (!isOpen || !isCompact) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      calculateMenuPosition();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isOpen, isCompact]);

  /*
   * =====================================================
   * CERRAR AL HACER SCROLL
   * =====================================================
   *
   * Para móvil preferimos que el menú desaparezca
   * al hacer scroll en lugar de intentar seguir
   * al botón.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleScroll() {
      closeMenu();
    }

    window.addEventListener(
      "scroll",
      handleScroll,
      true
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
        true
      );
    };
  }, [isOpen]);

  /*
   * =====================================================
   * RESIZE / ORIENTACIÓN
   * =====================================================
   */
  useEffect(() => {
    if (!isOpen || !isCompact) {
      return;
    }

    function handleResize() {
      /*
       * Al cambiar tamaño/orientación,
       * cerramos para evitar que el menú
       * quede desalineado.
       */
      closeMenu();
    }

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [isOpen, isCompact]);

  /*
   * =====================================================
   * CLICK FUERA + ESCAPE
   * =====================================================
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event) {
      const clickedButton =
        containerRef.current?.contains(
          event.target
        );

      const clickedMenu =
        menuRef.current?.contains(
          event.target
        );

      if (!clickedButton && !clickedMenu) {
        closeMenu();
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener(
      "mousedown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen]);

  /*
   * =====================================================
   * COMPARTIR NATIVO
   * =====================================================
   */
  async function handleNativeShare() {
    try {
      await shareProduct(product);
      closeMenu();
    } catch (error) {
      console.log(
        "Compartir cancelado:",
        error
      );
    }
  }

  /*
   * =====================================================
   * COPIAR ENLACE
   * =====================================================
   */
  async function handleCopy() {
    const success =
      await copyProductUrl(product);

    if (success) {
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
        closeMenu();
      }, 1200);
    }
  }

  /*
   * =====================================================
   * MENÚ COMPACTO
   * =====================================================
   */
  const compactMenu =
    isCompact && isOpen
      ? createPortal(
          <div
            ref={menuRef}
            id={shareOptionsId}
            role="dialog"
            aria-label="Opciones para compartir"
            style={{
              position: "fixed",
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
            }}
            className={`
              z-[9999]
              origin-bottom
              transition-all
              duration-150
              ease-out

              ${
                isVisible
                  ? "pointer-events-auto scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0"
              }
            `}
          >
            <div
              className="
                rounded-xl
                border
                border-gray-200
                bg-white
                p-3
                shadow-2xl
              "
            >

              {/* HEADER */}
              <div
                className="
                  mb-3
                  flex
                  items-center
                  justify-between
                  gap-2
                "
              >
                <p
                  className="
                    text-sm
                    font-semibold
                    text-gray-700
                  "
                >
                  Compartir mediante
                </p>

                <button
                  type="button"
                  onClick={closeMenu}
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-lg
                    leading-none
                    text-gray-400
                    transition
                    hover:bg-gray-100
                    hover:text-gray-700
                  "
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>

              {/* OPCIONES */}
              <div className="grid grid-cols-2 gap-2">

                {/* NATIVO */}
                {typeof navigator !== "undefined" &&
                  navigator.share && (
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="
                        rounded-lg
                        bg-gray-900
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-white
                        transition
                        hover:bg-black
                        active:scale-[0.98]
                      "
                    >
                      Compartir
                    </button>
                  )}

                {/* WHATSAPP */}
                <a
                  href={getWhatsAppShareUrl(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="
                    rounded-lg
                    bg-green-500
                    px-3
                    py-2
                    text-center
                    text-xs
                    font-medium
                    text-white
                    transition
                    hover:bg-green-600
                    active:scale-[0.98]
                  "
                >
                  WhatsApp
                </a>

                {/* FACEBOOK */}
                <a
                  href={getFacebookShareUrl(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="
                    rounded-lg
                    bg-blue-600
                    px-3
                    py-2
                    text-center
                    text-xs
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                    active:scale-[0.98]
                  "
                >
                  Facebook
                </a>

                {/* COPIAR */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="
                    rounded-lg
                    bg-gray-700
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-white
                    transition
                    hover:bg-gray-800
                    active:scale-[0.98]
                  "
                >
                  {copied
                    ? "✓ Copiado"
                    : "Copiar enlace"}
                </button>

              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {/* =================================================
          BOTÓN
      ================================================= */}
      <div
        ref={containerRef}
        className={`
          ${isCompact
            ? "shrink-0"
            : "w-full"
          }
          ${className}
        `}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={handleShare}
          aria-expanded={isOpen}
          aria-controls={shareOptionsId}
          aria-label="Compartir producto"
          className={`
            group
            flex
            items-center
            justify-center
            rounded-lg
            border
            transition-all
            duration-200

            ${
              isCompact
                ? "h-10 w-10 min-w-10"
                : "w-full gap-2 px-4 py-2.5 font-medium"
            }

            ${
              isOpen
                ? "border-gray-400 bg-gray-100 text-gray-900 shadow-sm"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50"
            }
          `}
        >
          {/* =================================================
              ICONO
          ================================================= */}
          <span
            className={`
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              transition-all
              duration-200

              ${
                isOpen
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
              }
            `}
          >
            <ShareIcon
              className={`
                h-4
                w-4
                transition-colors
                duration-200

                ${
                  isOpen
                    ? "text-white"
                    : "text-gray-600"
                }
              `}
            />
          </span>

          {!isCompact && (
            <>
              <span>
                Compartir producto
              </span>

              <span
                className={`
                  ml-1
                  text-[10px]
                  text-gray-400
                  transition-transform
                  duration-200
                  ${
                    isOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              >
                ▼
              </span>
            </>
          )}
        </button>
      </div>

      {/* MENÚ COMPACTO */}
      {compactMenu}

      {/* =================================================
          MENÚ NORMAL
      ================================================= */}
      {!isCompact && (
        <div
          id={shareOptionsId}
          className={`
            grid
            transition-all
            duration-200
            ease-out

            ${
              isOpen
                ? "mt-3 grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }
          `}
        >
          <div className="overflow-hidden">
            <div
              className="
                rounded-lg
                border
                border-gray-200
                bg-white
                p-4
                shadow-sm
              "
            >

              <p
                className="
                  mb-3
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Compartir mediante
              </p>

              <div className="grid grid-cols-2 gap-2">

                {typeof navigator !== "undefined" &&
                  navigator.share && (
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="
                        rounded-lg
                        bg-black
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-gray-800
                      "
                    >
                      Compartir...
                    </button>
                  )}

                <a
                  href={getWhatsAppShareUrl(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="
                    rounded-lg
                    bg-green-500
                    px-3
                    py-2
                    text-center
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-green-600
                  "
                >
                  WhatsApp
                </a>

                <a
                  href={getFacebookShareUrl(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="
                    rounded-lg
                    bg-blue-600
                    px-3
                    py-2
                    text-center
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  Facebook
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="
                    rounded-lg
                    bg-gray-700
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-gray-800
                  "
                >
                  {copied
                    ? "✓ Copiado"
                    : "Copiar enlace"}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShareButton;
