import "./TagTable.css";

import DataTable from "./ui/DataTable";
import TableHeader from "./ui/TableHeader";
import Pagination from "./ui/Pagination";

import Button from "./ui/Button";

const columns = [
  "Nombre",
  "Productos",
  "Acciones",
];

export default function TagTable({
  tags,
  onEdit,
  onDelete,
}) {

  return (

    <DataTable>

      {/* =================================================
          DESKTOP
      ================================================= */}

      <div className="tag-table-desktop">

        <table>

          <TableHeader
            columns={columns}
          />

          <tbody>

            {tags.length === 0 ? (

              <tr>

                <td
                  colSpan={3}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No hay etiquetas registradas.
                </td>

              </tr>

            ) : (

              tags.map((tag) => (

                <tr
                  key={tag.id}
                >

                  <td>
                    {tag.name}
                  </td>

                  <td>
                    {tag.product_count ?? 0}
                  </td>

                  <td>

                    <div className="table-actions">

                      <Button
                        onClick={() =>
                          onEdit(tag)
                        }
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() =>
                          onDelete(tag)
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

      <div className="tag-table-mobile">

        {tags.length === 0 ? (

          <div className="tag-empty">
            No hay etiquetas registradas.
          </div>

        ) : (

          tags.map((tag) => (

            <article
              key={tag.id}
              className="tag-card"
            >

              <div className="tag-card__header">

                <h3>
                  {tag.name}
                </h3>

              </div>


              <div className="tag-card__body">

                <div className="tag-card__field">

                  <span>
                    Productos asociados
                  </span>

                  <strong>
                    {tag.product_count ?? 0}
                  </strong>

                </div>

              </div>


              <div className="tag-card__actions">

                <Button
                  onClick={() =>
                    onEdit(tag)
                  }
                >
                  Editar
                </Button>

                <Button
                  variant="danger"
                  onClick={() =>
                    onDelete(tag)
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
