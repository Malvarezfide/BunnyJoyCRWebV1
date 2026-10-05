import categoryStyles from "../../config/categoryStyles";

function CategoryBadge({ categoria, view = "large" }) {
  const key = (categoria?.nombre || categoria || "")
    .toLowerCase()
    .trim();

  const config = categoryStyles[key];

  const styles = {
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
    gray: "bg-gray-100 text-gray-700",
    purple: "bg-purple-100 text-purple-700",
    emerald: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
    pink: "bg-pink-100 text-pink-700",
    orange: "bg-orange-100 text-orange-700",
  };

  const sizeStyles =
    view === "grid"
      ? {
          container: "gap-1 px-1.5 py-0.5 text-[10px]",
          icon: "text-[10px]",
        }
      : {
          container: "gap-2 px-3 py-1 text-sm",
          icon: "text-base",
        };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        font-medium
        whitespace-nowrap
        ${sizeStyles.container}
        ${styles[config?.color] || styles.gray}
      `}
    >
      <span className={sizeStyles.icon}>
        {config?.icon || "📁"}
      </span>

      {categoria?.nombre || categoria}
    </span>
  );
}

export default CategoryBadge;
