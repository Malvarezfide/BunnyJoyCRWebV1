import "./ProductForm.css";
import TagSelector from "./TagSelector";
import { useEffect, useState } from "react";
import { ImageGallery } from "./images";
import { mapExistingImages } from "./images/imageUtils";

const initialState = {
  name: "",
  slug: "",
  description: "",
  price: "",
  category_id: "",
  stock: "",
  status: "Disponible",
  featured: false,
  active: true,
  tag_ids: [],
  images: [],
};


/**
 * Convierte un nombre en un slug.
 *
 * Ejemplo:
 *
 * "Molde de Campana y Hoja Navideña"
 * =>
 * "molde-de-campana-y-hoja-navidena"
 */
function generateSlug(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}


export default function ProductForm({
  initialData,
  categories = [],
  tags = [],
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initialState);


  useEffect(() => {

    if (initialData) {

      setForm({
        ...initialState,
        ...initialData,

        images: mapExistingImages(
          initialData.images || [],
          "/media"
        ),

        category_id:
          initialData.category_id || "",

        tag_ids:
          Array.isArray(initialData.tag_ids)
            ? initialData.tag_ids.map(Number)
            : [],

        status:
          initialData.status || "Disponible",

        featured:
          Boolean(initialData.featured),

        active:
          Boolean(initialData.active),
      });

    } else {

      setForm(initialState);
	
	}

  }, [initialData]);


  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;


    setForm((prev) => {

      const updated = {
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : value,
      };


      /*
        Si estamos creando un producto,
        generar automáticamente el slug
        a partir del nombre.
      */
      if (
        name === "name" &&
        !initialData
      ) {
        updated.slug = generateSlug(value);
      }


      return updated;

    });

  };


  const handleTagsChange = (selectedIds) => {
    setForm((prev) => ({
      ...prev,
      tag_ids: selectedIds,
    }));
  };



  const handleSubmit = (e) => {

    e.preventDefault();


    if (!form.name.trim()) {
      return alert(
        "Debe ingresar un nombre."
      );
    }


    if (!form.slug) {
      return alert(
        "No se pudo generar el slug."
      );
    }


    if (Number(form.price) <= 0) {
      return alert(
        "Precio inválido."
      );
    }


    if (Number(form.stock) < 0) {
      return alert(
        "Stock inválido."
      );
    }


    if (!form.category_id) {
      return alert(
        "Debe seleccionar una categoría."
      );
    }


    onSubmit({

      ...form,

      name:
        form.name.trim(),

      slug:
        form.slug,

      description:
        form.description.trim(),

      price:
        Number(form.price),

      stock:
        Number(form.stock),

      category_id:
        Number(form.category_id),

      active:
        Boolean(form.active),

      featured:
        Boolean(form.featured),

      status:
        form.status,

      tag_ids:
        form.tag_ids.map(Number),

    });

  };


  return (
    <form
      className="product-form"
      onSubmit={handleSubmit}
    >


      <div className="grid-form">

        {/* IZQUIERDA */}
        <div className="form-section">
		
		<div className="section-header">
		  <h3>Información del producto</h3>
		  <p>Datos generales del producto.</p>
		</div>


          {/* NOMBRE */}
          <label>
            Nombre
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre del producto"
          />


          {/* DESCRIPCIÓN */}
          <label>
            Descripción
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción del producto"
          />


          {/* PRECIO */}
          <label>
            Precio
          </label>

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            min="0"
            step="0.01"
          />


          {/* CATEGORÍA */}
          <label>
            Categoría
          </label>

          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
          >

            <option value="">
              Seleccione una categoría...
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


          {/* STOCK */}
          <label>
            Stock
          </label>

          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            min="0"
          />


          {/* ESTADO */}
          <label>
            Estado
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >

            <option value="Disponible">
              Disponible
            </option>

            <option value="Agotado">
              Agotado
            </option>

            <option value="Próximamente">
              Próximamente
            </option>

            <option value="Descontinuado">
              Descontinuado
            </option>

          </select>


          {/* ETIQUETAS */}
		  <TagSelector
		    tags={tags}
		    value={form.tag_ids}
		    onChange={handleTagsChange}
		  />


          {/* OPCIONES */}
			<div className="form-options">

			  {/* ACTIVO */}
			  <label className="switch-row">
				<span className="switch-info">
				  <span className="switch-title">
					Activo
				  </span>

				  <span className="switch-description">
					El producto está disponible en la tienda.
				  </span>
				</span>

				<span className="switch">
				  <input
					type="checkbox"
					name="active"
					checked={form.active}
					onChange={handleChange}
				  />

				  <span className="switch-slider"></span>
				</span>
			  </label>


			  {/* DESTACADO */}
			  <label className="switch-row">
				<span className="switch-info">
				  <span className="switch-title">
					Producto destacado
				  </span>

				  <span className="switch-description">
					Mostrar el producto como destacado.
				  </span>
				</span>

				<span className="switch">
				  <input
					type="checkbox"
					name="featured"
					checked={form.featured}
					onChange={handleChange}
				  />

				  <span className="switch-slider"></span>
				</span>
			  </label>

			</div>

        </div>


        {/* DERECHA */}
        <div className="form-section">
		
		<div className="section-header">
		  <h3>Imágenes</h3>
		  <p>Administra las imágenes del producto.</p>
		</div>


          <label>
            Imágenes
          </label>

          <ImageGallery
            value={form.images}
            onChange={(images) =>
              setForm((prev) => ({
                ...prev,
                images,
              }))
            }
          />

        </div>

      </div>


      {/* ACCIONES */}
      <div className="form-actions">

        <button type="submit">
          Guardar
        </button>

        <button
          type="button"
          onClick={onCancel}
        >
          Cancelar
        </button>

      </div>

    </form>
  );
}