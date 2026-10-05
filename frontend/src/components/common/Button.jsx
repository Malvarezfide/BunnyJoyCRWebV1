import { Link } from "react-router-dom";

export default function Button({
  children,
  onClick,
  to,
  type = "button",
  className = "",
  ...props
}) {
  const styles = `
    group
    inline-flex
    items-center
    justify-center
    gap-2
    px-5
    py-2.5
    rounded-full
    bg-rose-500
    text-sm
    font-semibold
    text-white
    shadow-md
    shadow-rose-500/20
    transition-all
    duration-200
    hover:bg-rose-600
    hover:shadow-lg
    hover:shadow-rose-500/30
    hover:-translate-y-0.5
    ${className}
  `;

  if (to) {
    return (
      <Link
        to={to}
        className={styles}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={styles}
      {...props}
    >
      {children}
    </button>
  );
}
