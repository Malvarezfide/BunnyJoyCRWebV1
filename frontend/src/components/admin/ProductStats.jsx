import "./ProductStats.css";

export default function ProductStats({
  products,
}) {
  const total = products.length;

  const active = products.filter(
    (product) => product.active === true
  ).length;

  const inactive = products.filter(
    (product) => product.active === false
  ).length;

  return (
    <div className="product-stats">

      <div className="product-stat">
        <span className="product-stat-label">
          Total
        </span>

        <strong className="product-stat-value">
          {total}
        </strong>
      </div>


      <div className="product-stat">
        <span className="product-stat-label">
          Activos
        </span>

        <strong className="product-stat-value">
          {active}
        </strong>
      </div>


      <div className="product-stat">
        <span className="product-stat-label">
          Inactivos
        </span>

        <strong className="product-stat-value">
          {inactive}
        </strong>
      </div>

    </div>
  );
}
