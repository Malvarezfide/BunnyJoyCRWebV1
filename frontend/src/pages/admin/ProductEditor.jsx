import "../../styles/page.css";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import ProductForm
  from "../../components/admin/ProductForm";

import {
  getProduct,
  createProduct,
  updateProduct,
} from "../../services/productService";

import {
  getPendingUploads,
  extractImageNames
} from "../../components/admin/images/imageUtils";

import {
  uploadImages
} from "../../services/uploadService";

import {
  getCategories
} from "../../services/categoryService";

import {
  getTags
} from "../../services/tagService";


export default function ProductEditor() {

  const navigate =
    useNavigate();

  const { id } =
    useParams();


  const [loading, setLoading] =
    useState(true);

  const [product, setProduct] =
    useState(null);

  const [categories, setCategories] =
    useState([]);

  const [tags, setTags] =
    useState([]);


  /*
    =========================
    CARGAR DATOS
    =========================
  */

  useEffect(() => {

    async function load() {

      try {

        const [
          cats,
          availableTags
        ] = await Promise.all([

          getCategories(),

          getTags(),

        ]);


        setCategories(cats);

        setTags(availableTags);


        /*
          =========================
          NUEVO PRODUCTO
          =========================
        */

        if (!id) {

          setLoading(false);

          return;

        }


        /*
          =========================
          EDITAR PRODUCTO
          =========================
        */

        const found =
		  await getProduct(id);

		setProduct(
		  found
		);

      } catch (error) {

        console.error(
          "Error cargando editor:",
          error
        );

      } finally {

        setLoading(false);

      }

    }


    load();

  }, [id]);


  /*
    =========================
    GUARDAR PRODUCTO
    =========================
  */

  async function handleSave(data) {

    try {

      /*
        =========================
        IMÁGENES ACTUALES
        =========================
      */

      let images =
        data.images || [];


      /*
        =========================
        SUBIR IMÁGENES NUEVAS
        =========================
      */

      const pending =
        getPendingUploads(images);


      if (pending.length) {

        const response =
          await uploadImages(
            pending.map(
              image => image.file
            )
          );


        let index = 0;


        images =
          images.map(image => {

            if (image.file) {

              return {

                ...image,

                filename:
                  response
                    .files[index++]
                    .filename,

                uploaded: true,

                file: null,

                existing: true,

              };

            }


            return image;

          });

      }


      /*
        =========================
        IMÁGENES ORIGINALES
        =========================
      */

      const originalImages =
        Array.isArray(product?.images)
          ? product.images.filter(
              image =>
                typeof image === "string"
            )
          : [];


      /*
        =========================
        IMÁGENES ACTUALES
        =========================
      */

      const currentImages =
        extractImageNames(images);


      /*
        =========================
        NORMALIZAR IMÁGENES
        =========================
      */

      const normalizedOriginalImages =
        originalImages.filter(Boolean);

      const normalizedCurrentImages =
        currentImages.filter(Boolean);


      /*
        =========================
        TAGS ORIGINALES
        =========================
      */

      const originalTagIds =
        Array.isArray(
          product?.tag_ids
        )
          ? product.tag_ids
              .map(Number)
              .filter(
                Number.isInteger
              )
              .sort(
                (a, b) => a - b
              )
          : [];


      /*
        =========================
        TAGS ACTUALES
        =========================
      */

      const currentTagIds =
        Array.isArray(
          data.tag_ids
        )
          ? data.tag_ids
              .map(Number)
              .filter(
                Number.isInteger
              )
              .sort(
                (a, b) => a - b
              )
          : [];


      /*
        =========================
        DETECTAR CAMBIOS
        =========================
      */

      const imagesChanged =
        JSON.stringify(
          normalizedOriginalImages
        ) !==
        JSON.stringify(
          normalizedCurrentImages
        );


      const tagsChanged =
        JSON.stringify(
          originalTagIds
        ) !==
        JSON.stringify(
          currentTagIds
        );


      /*
        =========================
        PAYLOAD BASE
        =========================

        No enviamos imágenes ni tags
        salvo que realmente hayan
        cambiado.
      */

      const payload = {
        ...data,
      };


      /*
        =========================
        IMÁGENES
        =========================
      */

      if (imagesChanged) {

        payload.images =
          normalizedCurrentImages;

      } else {

        delete payload.images;

      }


      /*
        =========================
        TAGS
        =========================
      */

      if (tagsChanged) {

        payload.tag_ids =
          currentTagIds;

      } else {

        delete payload.tag_ids;

      }


      /*
        =========================
        ACTUALIZAR
        =========================
      */

      if (id) {

        await updateProduct(
          id,
          payload
        );

      }


      /*
        =========================
        CREAR
        =========================
      */

      else {

        /*
          Al crear siempre enviamos
          imágenes y tags.
        */

        payload.images =
          normalizedCurrentImages;

        payload.tag_ids =
          currentTagIds;


        await createProduct(
          payload
        );

      }


      /*
        =========================
        REDIRECCIÓN
        =========================
      */

      navigate(
        "/admin/products"
      );

    } catch (error) {

      console.error(
        "Error guardando producto:",
        error
      );


      alert(
        error.message ||
        "No se pudo guardar el producto."
      );

    }

  }


  /*
    =========================
    LOADING
    =========================
  */

  if (loading) {

    return (
      <h2>
        Cargando...
      </h2>
    );

  }


  /*
    =========================
    RENDER
    =========================
  */

  return (

    <div className="page">

      <h1>

        {id
          ? "Editar producto"
          : "Nuevo producto"}

      </h1>


      <ProductForm

        initialData={product}

        categories={categories}

        tags={tags}

        onSubmit={handleSave}

        onCancel={() =>
          navigate(
            "/admin/products"
          )
        }

      />

    </div>

  );

}