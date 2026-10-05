import "./ProductTable.css";

import DataTable from "./ui/DataTable";
import TableHeader from "./ui/TableHeader";
import Pagination from "./ui/Pagination";

import { getImageUrl } from "./images/imageUtils";
import { formatPrice } from "../../utils/formatPrice";

import Button from "./ui/Button";
import Badge from "./ui/Badge";


const columns = [
  "Imagen",
  "Nombre",
  "Categoría",
  "Precio",
  "Stock",
  "Estado",
  "Acciones",
];


export default function ProductTable({
  products,
  onEdit,
  onDelete,
  page,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  selectedIds,
  onToggleSelection,
  onToggleSelectAll,
}) {

  const allSelected =
    products.length > 0 &&
    products.every((product) =>
      selectedIds.includes(product.id)
    );


  return (
    <DataTable>

      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="product-table-desktop">

        <table>

          <TableHeader
            columns={columns}
            selectable={true}
            allSelected={allSelected}
            onToggleSelectAll={onToggleSelectAll}
          />


          <tbody>

            {products.length === 0 ? (

              <tr>

                <td
                  colSpan={8}
                  className="product-table-empty"
                >
                  No hay productos que coincidan
                  con los filtros.
                </td>

              </tr>

            ) : (

              products.map((product) => (

                <tr key={product.id}>

                  {/* SELECCIÓN */}

                  <td className="selection-column">

                    <input
                      type="checkbox"
                      checked={selectedIds.includes(
                        product.id
                      )}
                      onChange={() =>
                        onToggleSelection(
                          product.id
                        )
                      }
                      aria-label={`Seleccionar ${product.name}`}
                    />

                  </td>


                  {/* IMAGEN */}

                  <td>

                    {product.images &&
                    product.images.length > 0 ? (

                      <div className="product-image-wrapper">

                        <img
                          className="product-image"
                          src={getImageUrl(
                            product.images[0]
                          )}
                          alt={product.name}
                        />

                        {product.images.length > 1 && (

                          <small>
                            +{product.images.length - 1} imágenes
                          </small>

                        )}

                      </div>

                    ) : (

                      <div className="no-image">
                        Sin imagen
                      </div>

                    )}

                  </td>


                  {/* NOMBRE */}

                  <td>
                    {product.name}
                  </td>


                  {/* CATEGORÍA */}

                  <td>
                    {product.category_name ||
                      "Sin categoría"}
                  </td>


                  {/* PRECIO */}

                  <td>
                    {formatPrice(product.price)}
                  </td>


                  {/* STOCK */}

                  <td>
                    {product.stock ?? 0}
                  </td>


                  {/* ESTADO */}

                  <td>

                    <Badge
                      active={product.active}
                      label={product.status}
                    />

                  </td>


                  {/* ACCIONES */}

                  <td>

                    <div className="table-actions">

                      <Button
                        onClick={() =>
                          onEdit(product)
                        }
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() =>
                          onDelete(product.id)
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


      {/* =====================================================
          MOBILE CARDS
      ===================================================== */}

      <div className="product-table-mobile">

        {products.length === 0 ? (

          <div className="product-mobile-empty">
            No hay productos que coincidan
            con los filtros.
          </div>

        ) : (

          <>
            {/* SELECCIONAR TODOS */}

            <div className="product-mobile-select-all">

              <label>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Seleccionar todos los productos"
                />

                <span>
                  {allSelected
                    ? "Deseleccionar todos"
                    : "Seleccionar todos"}
                </span>
              </label>

              <span className="product-mobile-count">
                {selectedIds.length} seleccionados
              </span>

            </div>


            {/* PRODUCT CARDS */}

            {products.map((product) => (

              <article
                key={product.id}
                className="product-mobile-card"
              >

                {/* CARD HEADER */}

                <div className="product-mobile-card__header">

                  <label className="product-mobile-select">

                    <input
                      type="checkbox"
                      checked={selectedIds.includes(
                        product.id
                      )}
                      onChange={() =>
                        onToggleSelection(
                          product.id
                        )
                      }
                      aria-label={`Seleccionar ${product.name}`}
                    />

                    <span>
                      Seleccionar
                    </span>

                  </label>


                  <Badge
                    active={product.active}
                    label={product.status}
                  />

                </div>


                {/* PRODUCT */}

                <div className="product-mobile-card__product">

                  {product.images &&
                  product.images.length > 0 ? (

                    <img
                      className="product-mobile-image"
                      src={getImageUrl(
                        product.images[0]
                      )}
                      alt={product.name}
                    />

                  ) : (

                    <div className="product-mobile-image no-image">
                      Sin imagen
                    </div>

                  )}


                  <div className="product-mobile-info">

                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      {product.category_name ||
                        "Sin categoría"}
                    </p>

                  </div>

                </div>


                {/* DETAILS */}

                <div className="product-mobile-details">

                  <div>
                    <span>
                      Precio
                    </span>

                    <strong>
                      {formatPrice(
                        product.price
                      )}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Stock
                    </span>

                    <strong>
                      {product.stock ?? 0}
                    </strong>
                  </div>

                </div>


                {/* ACTIONS */}

                <div className="product-mobile-actions">

                  <Button
                    onClick={() =>
                      onEdit(product)
                    }
                  >
                    Editar
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() =>
                      onDelete(product.id)
                    }
                  >
                    Eliminar
                  </Button>

                </div>

              </article>

            ))}

          </>

        )}

      </div>


      {/* PAGINATION */}

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />

    </DataTable>
  );
}
