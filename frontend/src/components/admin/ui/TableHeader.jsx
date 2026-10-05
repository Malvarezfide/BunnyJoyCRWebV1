export default function TableHeader({
  columns,
  selectable = false,
  allSelected = false,
  onToggleSelectAll,
}) {

  return (
    <thead>

      <tr>

        {selectable && (

          <th className="selection-column">

            <input
              type="checkbox"
              checked={allSelected}
              onChange={onToggleSelectAll}
              aria-label="Seleccionar todos los productos"
            />

          </th>

        )}


        {columns.map((column) => (

          <th key={column}>
            {column}
          </th>

        ))}

      </tr>

    </thead>
  );
}
