/*
  Marcadores de posición que reservan el mismo espacio que el contenido
  real, para que la llegada de los datos no desplace el layout (CLS).
*/

export function CardSkeleton({ className = "h-[26rem]" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-2xl bg-white border border-gray-100 overflow-hidden ${className}`}
    >
      <div className="h-48 sm:h-52 bg-stone-100" />

      <div className="p-4 space-y-3">
        <div className="h-5 w-4/5 rounded bg-stone-100" />
        <div className="h-5 w-3/5 rounded bg-stone-100" />
        <div className="h-6 w-1/3 rounded bg-stone-100" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({
  count = 8,
  gridClassName = "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  cardClassName,
}) {
  return (
    <div className={gridClassName}>
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} className={cardClassName} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse mt-8 grid lg:grid-cols-2 gap-12">
      <div className="h-[600px] rounded-xl bg-stone-100" />

      <div className="space-y-6">
        <div className="h-10 w-3/4 rounded bg-stone-100" />
        <div className="h-6 w-1/4 rounded bg-stone-100" />
        <div className="h-10 w-1/3 rounded bg-stone-100" />
        <div className="h-32 rounded bg-stone-100" />
      </div>
    </div>
  );
}

export function SectionError({ onRetry, message = "No pudimos cargar esta sección." }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-rose-100 bg-rose-50 px-6 py-8 text-center"
    >
      <p className="text-gray-600">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-600 transition"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
