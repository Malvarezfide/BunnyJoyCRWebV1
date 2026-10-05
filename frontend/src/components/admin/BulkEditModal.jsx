import "./BulkEditModal.css";

export default function BulkEditModal({
  type,
  selectedCount,
  categories,
  value,
  onChange,
  onConfirm,
  onCancel,
  loading,
}) {

  const isCategory =
    type === "category";

  const title =
    isCategory
      ? "Cambiar categoría"
      : "Cambiar precio";


  return (
    <div className="bulk-modal-overlay">

      <div className="bulk-modal">

        <div className="bulk-modal-header">

          <h2>
            {title}
          </h2>

          <button
            type="button"
            className="bulk-modal-close"
            onClick={onCancel}
            disabled={loading}
            aria-label="Cerrar"
          >
            ×
          </button>

        </div>


        <div className="bulk-modal-body">

          <p className="bulk-modal-description">
            Se modificará esta propiedad en{" "}
            <strong>
              {selectedCount}
            </strong>{" "}
            {selectedCount === 1
              ? "producto."
              : "productos."}
          </p>


          {isCategory ? (

            <div className="bulk-field">

              <label htmlFor="bulk-category">
                Nueva categoría
              </label>

              <select
                id="bulk-category"
                value={value}
                onChange={(e) =>
                  onChange(e.target.value)
                }
                disabled={loading}
              >

                <option value="">
                  Seleccionar categoría
                </option>

                {categories.map((category) => (

                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>

                ))}

              </select>

            </div>

          ) : (

            <div className="bulk-field">

              <label htmlFor="bulk-price">
                Nuevo precio
              </label>

              <input
                id="bulk-price"
                type="number"
                min="0"
                step="0.01"
                value={value}
                onChange={(e) =>
                  onChange(e.target.value)
                }
                disabled={loading}
                placeholder="Ej. 15000"
              />

            </div>

          )}

        </div>


        <div className="bulk-modal-footer">

          <button
            type="button"
            className="bulk-modal-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>


          <button
            type="button"
            className="bulk-modal-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Aplicando..."
              : "Aplicar cambios"}
          </button>

        </div>

      </div>

    </div>
  );
}
