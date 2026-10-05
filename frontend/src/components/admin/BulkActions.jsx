import "./BulkActions.css";

import Button from "./ui/Button";

export default function BulkActions({
  selectedCount,
  onActivate,
  onDeactivate,
  onChangeCategory,
  onChangePrice,
  onClear,
  loading,
}) {

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="bulk-actions">

      <div className="bulk-actions-info">

        <strong>
          {selectedCount}
        </strong>

        <span>
          {selectedCount === 1
            ? " producto seleccionado"
            : " productos seleccionados"}
        </span>

      </div>


      <div className="bulk-actions-buttons">

        <Button
          onClick={onActivate}
          disabled={loading}
        >
          Activar
        </Button>


        <Button
          onClick={onDeactivate}
          disabled={loading}
        >
          Desactivar
        </Button>


        <Button
          onClick={onChangeCategory}
          disabled={loading}
        >
          Cambiar categoría
        </Button>


        <Button
          onClick={onChangePrice}
          disabled={loading}
        >
          Cambiar precio
        </Button>


        <button
          type="button"
          className="bulk-clear"
          onClick={onClear}
          disabled={loading}
        >
          Cancelar
        </button>

      </div>

    </div>
  );
}
