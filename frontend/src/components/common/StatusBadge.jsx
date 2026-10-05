function StatusBadge({ estado, view = "large" }) {
  const styles = {
    Disponible: "bg-green-200 text-green-700",
    Agotado: "bg-red-200 text-red-600",
    Oferta: "bg-yellow-200 text-yellow-700",
  };

  const sizeStyles =
    view === "grid"
      ? "text-[10px] px-1.5 py-0.5"
      : "text-sm px-3 py-1";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        font-semibold
        whitespace-nowrap
        ${sizeStyles}
        ${styles[estado] || "bg-gray-200 text-gray-600"}
      `}
    >
      {estado}
    </span>
  );
}

export default StatusBadge;
