import "./ProductFilters.css";

export default function ProductFilters({
  filters,
  categories,
  onChange,
  onClear,
}) {
  const updateFilter = (key, value) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const removeFilter = (key) => {
    const defaultValues = {
      search: "",
      category: "",
      status: "",
      sort: "newest",
    };

    updateFilter(key, defaultValues[key]);
  };

  const selectedCategory = categories.find(
    (category) =>
      String(category.id) === String(filters.category)
  );

  const hasSearch = filters.search.trim() !== "";
  const hasCategory = filters.category !== "";
  const hasStatus = filters.status !== "";
  const hasSort = filters.sort !== "newest";

  const hasFilters =
    hasSearch ||
    hasCategory ||
    hasStatus ||
    hasSort;

  return (
    <div className="product-filters">

      {/* SELECTORES */}

      <div className="product-filter-selects">

        <select
          value={filters.category}
          onChange={(e) =>
            updateFilter(
              "category",
              e.target.value
            )
          }
        >
          <option value="">
            Todas las categorías
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


        <select
          value={filters.status}
          onChange={(e) =>
            updateFilter(
              "status",
              e.target.value
            )
          }
        >
          <option value="">
            Todos los estados
          </option>

          <option value="active">
            Activos
          </option>

          <option value="inactive">
            Inactivos
          </option>
        </select>


        <select
          value={filters.sort}
          onChange={(e) =>
            updateFilter(
              "sort",
              e.target.value
            )
          }
        >
          <option value="newest">
            Más recientes
          </option>

          <option value="name_asc">
            Nombre A-Z
          </option>

          <option value="name_desc">
            Nombre Z-A
          </option>

          <option value="price_asc">
            Precio menor
          </option>

          <option value="price_desc">
            Precio mayor
          </option>

          <option value="stock_asc">
            Menor stock
          </option>

          <option value="stock_desc">
            Mayor stock
          </option>
        </select>

      </div>


      {/* FILTROS ACTIVOS */}

      {hasFilters && (

        <div className="active-filters">

          <span className="active-filters-label">
            Filtros:
          </span>


          {hasSearch && (

            <button
              type="button"
              className="filter-chip"
              onClick={() =>
                removeFilter("search")
              }
            >
              Búsqueda: "{filters.search}"

              <span>
                ×
              </span>
            </button>

          )}


          {hasCategory && (

            <button
              type="button"
              className="filter-chip"
              onClick={() =>
                removeFilter("category")
              }
            >
              Categoría:{" "}
              {selectedCategory?.name ||
                "Seleccionada"}

              <span>
                ×
              </span>
            </button>

          )}


          {hasStatus && (

            <button
              type="button"
              className="filter-chip"
              onClick={() =>
                removeFilter("status")
              }
            >
              Estado:{" "}

              {filters.status === "active"
                ? "Activos"
                : "Inactivos"}

              <span>
                ×
              </span>
            </button>

          )}


          {hasSort && (

            <button
              type="button"
              className="filter-chip"
              onClick={() =>
                removeFilter("sort")
              }
            >
              Orden:{" "}

              {filters.sort === "name_asc" &&
                "Nombre A-Z"}

              {filters.sort === "name_desc" &&
                "Nombre Z-A"}

              {filters.sort === "price_asc" &&
                "Precio menor"}

              {filters.sort === "price_desc" &&
                "Precio mayor"}

              {filters.sort === "stock_asc" &&
                "Menor stock"}

              {filters.sort === "stock_desc" &&
                "Mayor stock"}

              <span>
                ×
              </span>
            </button>

          )}


          <button
            type="button"
            className="clear-filters"
            onClick={onClear}
          >
            Limpiar filtros
          </button>

        </div>

      )}

    </div>
  );
}
