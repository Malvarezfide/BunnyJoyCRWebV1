import "./CategoryTable.css";

import DataTable from "./ui/DataTable";
import TableHeader from "./ui/TableHeader";
import Pagination from "./ui/Pagination";

import Button from "./ui/Button";
import Badge from "./ui/Badge";

const columns = [
  "Nombre",
  "Descripción",
  "Estado",
  "Acciones",
];

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
}) {

  return (
    <DataTable>

      {/* =================================================
          DESKTOP
      ================================================= */}

      <div className="category-table-desktop">

        <table>

          <TableHeader
            columns={columns}
          />

          <tbody>

            {categories.length === 0 ? (

              <tr>

                <td
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No hay categorías registradas.
                </td>

              </tr>

            ) : (

              categories.map((category) => (

                <tr key={category.id}>

                  <td>
                    {category.name}
                  </td>

                  <td>
                    {category.description || "—"}
                  </td>

                  <td>
                    <Badge
                      active={category.active}
                    />
                  </td>

                  <td>

                    <div className="table-actions">

                      <Button
                        onClick={() =>
                          onEdit(category)
                        }
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() =>
                          onDelete(category.id)
                        }
                      >
                        Eliminar
                      </Button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>


      {/* =================================================
          MOBILE
      ================================================= */}

      <div className="category-table-mobile">

        {categories.length === 0 ? (

          <div className="category-empty">
            No hay categorías registradas.
          </div>

        ) : (

          categories.map((category) => (

            <article
              key={category.id}
              className="category-card"
            >

              <div className="category-card__header">

                <div className="category-card__title">

                  <h3>
                    {category.name}
                  </h3>

                  <Badge
                    active={category.active}
                  />

                </div>

              </div>


              <div className="category-card__body">

                <div className="category-card__field">

                  <span>
                    Descripción
                  </span>

                  <strong>
                    {category.description || "Sin descripción"}
                  </strong>

                </div>

              </div>


              <div className="category-card__actions">

                <Button
                  onClick={() =>
                    onEdit(category)
                  }
                >
                  Editar
                </Button>

                <Button
                  variant="danger"
                  onClick={() =>
                    onDelete(category.id)
                  }
                >
                  Eliminar
                </Button>

              </div>

            </article>

          ))

        )}

      </div>


      <Pagination />

    </DataTable>
  );
}
