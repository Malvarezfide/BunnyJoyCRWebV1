import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ProductGallery({ product }) {
    const [index, setIndex] = useState(0);
    const [showMobileControls, setShowMobileControls] = useState(true);
    const touchStartX = useRef(0);
    const hideControlsTimer = useRef(null);

    const images = Array.isArray(product.imagen) && product.imagen.length
        ? product.imagen
        : [null];

    const nextImage = () =>
        setIndex((prev) => (prev + 1) % images.length);

    const prevImage = () =>
        setIndex((prev) => (prev - 1 + images.length) % images.length);

    // Oculta los controles después de 3 segundos en móvil
    const resetMobileControls = () => {
        setShowMobileControls(true);

        clearTimeout(hideControlsTimer.current);

        hideControlsTimer.current = setTimeout(() => {
            setShowMobileControls(false);
        }, 3000);
    };

    useEffect(() => {
        resetMobileControls();

        return () => {
            clearTimeout(hideControlsTimer.current);
        };
    }, []);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        resetMobileControls();
    };

    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const distance = touchStartX.current - touchEndX;

        if (distance > 50) {
            nextImage();
        } else if (distance < -50) {
            prevImage();
        }

        resetMobileControls();
    };

    return (
        <div className="space-y-4">
            <div
                className="group relative h-[600px] bg-stone-100 rounded-xl overflow-hidden touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={resetMobileControls}
            >
                {images[index] ? (
                    <img
                        src={images[index]}
                        alt={product.nombre}
                        width={800}
                        height={600}
                        fetchPriority={index === 0 ? "high" : undefined}
                        decoding="async"
                        className="w-full h-full object-contain select-none"
                        draggable={false}
                    />
                ) : (
                    <div
                        aria-hidden="true"
                        className="w-full h-full flex items-center justify-center text-7xl"
                    >
                        🐰
                    </div>
                )}

                {images.length > 1 && (
                    <>
                        {/* Anterior */}
                        <button
                            onClick={prevImage}
                            className={`
                                absolute left-4 top-1/2 -translate-y-1/2
                                bg-white/60 backdrop-blur-md
                                hover:bg-white
                                transition-all duration-500
                                rounded-full p-3 shadow-lg

                                opacity-0 pointer-events-none

                                md:opacity-0
                                md:pointer-events-auto
                                md:group-hover:opacity-100

                                ${
                                    showMobileControls
                                        ? "max-md:opacity-60 max-md:pointer-events-auto"
                                        : ""
                                }
                            `}
                            aria-label="Imagen anterior"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        {/* Siguiente */}
                        <button
                            onClick={nextImage}
                            className={`
                                absolute right-4 top-1/2 -translate-y-1/2
                                bg-white/60 backdrop-blur-md
                                hover:bg-white
                                transition-all duration-500
                                rounded-full p-3 shadow-lg

                                opacity-0 pointer-events-none

                                md:opacity-0
                                md:pointer-events-auto
                                md:group-hover:opacity-100

                                ${
                                    showMobileControls
                                        ? "max-md:opacity-60 max-md:pointer-events-auto"
                                        : ""
                                }
                            `}
                            aria-label="Imagen siguiente"
                        >
                            <ChevronRight size={24} />
                        </button>

                        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                            {index + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>

            {images.length > 1 && (
                <div className="flex flex-wrap justify-center gap-3">
                    {images.map((image, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`rounded-xl overflow-hidden transition-all duration-200 ${
                                i === index
                                    ? "ring-2 ring-rose-500 scale-105"
                                    : "opacity-70 hover:opacity-100 hover:scale-105"
                            }`}
                        >
                            <img
                                src={image}
                                alt={`${product.nombre} ${i + 1}`}
                                width={80}
                                height={80}
                                loading="lazy"
                                decoding="async"
                                className="w-20 h-20 object-cover"
                                draggable={false}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductGallery;
