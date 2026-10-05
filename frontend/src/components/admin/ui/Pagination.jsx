import "./Pagination.css";

export default function Pagination({
  page,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {

  if (totalPages <= 1) {
    return null;
  }

  const firstItem =
    (page - 1) * itemsPerPage + 1;

  const lastItem =
    Math.min(
      page * itemsPerPage,
      totalItems
    );

  return (
    <div className="pagination">

      <span className="pagination-info">
        Mostrando {firstItem}–{lastItem} de{" "}
        {totalItems} productos
      </span>


      <div className="pagination-controls">

        <button
          type="button"
          disabled={page === 1}
          onClick={() =>
            onPageChange(page - 1)
          }
        >
          ←
        </button>


        <span>
          Página {page} de {totalPages}
        </span>


        <button
          type="button"
          disabled={page === totalPages}
          onClick={() =>
            onPageChange(page + 1)
          }
        >
          →
        </button>

      </div>

    </div>
  );
}
