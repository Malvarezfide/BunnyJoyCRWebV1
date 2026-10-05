import { useEffect, useRef, useState } from "react";

const TagSelector = ({
  tags = [],
  value = [],
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);

  const selectedIds = value.map(Number);

  const selectedTags = tags.filter((tag) =>
    selectedIds.includes(Number(tag.id))
  );

  const filteredTags = tags.filter((tag) =>
    tag.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Cerrar el selector al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Seleccionar / deseleccionar etiqueta
  const toggleTag = (tagId) => {
    const id = Number(tagId);

    if (selectedIds.includes(id)) {
      onChange(
        selectedIds.filter(
          (selectedId) => selectedId !== id
        )
      );
    } else {
      onChange([
        ...selectedIds,
        id,
      ]);
    };
  };

  // Quitar etiqueta desde el chip
  const removeTag = (tagId) => {
    const id = Number(tagId);

    onChange(
      selectedIds.filter(
        (selectedId) => selectedId !== id
      )
    );
  };

  return (
    <div
      className="tag-selector"
      ref={containerRef}
    >
      <label>Etiquetas</label>

      {/* ETIQUETAS SELECCIONADAS */}
      <div
        className="tag-input"
        onClick={() => setOpen(true)}
      >
        {selectedTags.length === 0 ? (
          <span className="tag-placeholder">
            Selecciona una o más etiquetas...
          </span>
        ) : (
          selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="tag-chip"
            >
              {tag.name}

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  removeTag(tag.id);
                }}
                aria-label={`Quitar ${tag.name}`}
              >
                ×
              </button>
            </span>
          ))
        )}

        <span className="tag-arrow">
          ▾
        </span>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="tag-dropdown">

          {/* BUSCADOR */}
          <div className="tag-search">
            <input
              type="text"
              placeholder="Buscar etiqueta..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              autoFocus
            />
          </div>

          {/* LISTA DE ETIQUETAS */}
          <div className="tag-options">
            {filteredTags.length === 0 ? (
              <div className="tag-empty">
                No se encontraron etiquetas.
              </div>
            ) : (
              filteredTags.map((tag) => {
                const selected =
                  selectedIds.includes(
                    Number(tag.id)
                  );

                return (
                  <button
                    type="button"
                    key={tag.id}
                    className={`tag-option ${
                      selected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      toggleTag(tag.id)
                    }
                  >
                    <span className="tag-check">
                      {selected ? "✓" : ""}
                    </span>

                    <span>
                      {tag.name}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* CONTADOR */}
          <div className="tag-footer">
            {selectedTags.length === 0
              ? "Ninguna etiqueta seleccionada"
              : `${selectedTags.length} ${
                  selectedTags.length === 1
                    ? "etiqueta"
                    : "etiquetas"
                } seleccionada${
                  selectedTags.length === 1
                    ? ""
                    : "s"
                }`}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
