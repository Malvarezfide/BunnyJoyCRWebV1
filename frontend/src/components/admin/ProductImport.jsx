import "./ProductImport.css";
import { useState } from "react";

import {
  importProducts
} from "../../services/productService";

import Button from "./ui/Button";


export default function ProductImport({
  onComplete,
  onCancel,
}) {

  const [jsonText, setJsonText] = useState("");

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [result, setResult] = useState(null);


  /*
   * VALIDAR JSON
   */
  const handleValidate = () => {

    setError("");
    setResult(null);
    setProducts([]);


    if (!jsonText.trim()) {

      setError(
        "Debe ingresar el JSON de los productos."
      );

      return;
    }


    try {

      const data = JSON.parse(
        jsonText
      );


      if (!Array.isArray(data)) {

        throw new Error(
          "El JSON debe contener un array de productos."
        );
      }


      if (data.length === 0) {

        throw new Error(
          "El JSON no contiene productos."
        );
      }


      const invalidProducts =
        data.filter(
          (product) =>
            !product.nombre
        );


      if (invalidProducts.length > 0) {

        throw new Error(
          `Hay ${invalidProducts.length} productos sin nombre.`
        );
      }


      setProducts(data);

    } catch (err) {

      setError(
        err.message ||
        "El JSON no es válido."
      );
    }

  };


  /*
   * IMPORTAR
   */
  const handleImport = async () => {

    if (!products.length) {

      setError(
        "Primero debe validar el JSON."
      );

      return;
    }


    const confirmed =
      window.confirm(
        `¿Desea importar ${products.length} productos?`
      );


    if (!confirmed) {
      return;
    }


    setLoading(true);
    setError("");
    setResult(null);


    try {

      const data =
        await importProducts(
          products
        );


      setResult(data);


      if (data.success) {

        await onComplete?.(data);

      }

    } catch (err) {

      setError(
        err.message ||
        "Error durante la importación."
      );

    } finally {

      setLoading(false);
    }

  };


  return (

    <div className="product-import">

      <div className="product-import__header">

        <h2>
          Importar productos
        </h2>

        <button
          type="button"
          onClick={onCancel}
        >
          ×
        </button>

      </div>


      <p>
        Pegue aquí el JSON de sus productos.
      </p>


      <textarea
        value={jsonText}
        onChange={(e) => {

          setJsonText(
            e.target.value
          );

          setProducts([]);
          setError("");
          setResult(null);

        }}
        placeholder={`[
  {
    "id": 101,
    "slug": "molde-campana-y-hoja-navidena",
    "nombre": "Molde de Campana y Hoja Navideña",
    "categoria": "moldes",
    "etiquetas": [
      "silicona",
      "navidad"
    ],
    "precio": 1500,
    "activo": true,
    "estado": "Disponible",
    "destacado": false,
    "imagen": [
      "/images/categorias/moldes/molde-campana-y-hoja-navidena.jpg"
    ],
    "descripcion": "Descripción del producto."
  }
]`}
        rows={18}
        className="product-import__textarea"
      />


      <div className="product-import__validate">

        <Button
          type="button"
          onClick={handleValidate}
          disabled={loading}
        >
          Validar JSON
        </Button>

      </div>


      {products.length > 0 && (

        <div className="product-import__preview">

          <h3>
            JSON válido
          </h3>

          <p>

            Se encontraron{" "}

            <strong>
              {products.length}
            </strong>{" "}

            productos.

          </p>


          <div className="product-import__products">

            {products
              .slice(0, 5)
              .map((product, index) => (

                <div
                  key={
                    product.id ||
                    index
                  }
                >

                  <strong>
                    {product.nombre}
                  </strong>

                  {product.categoria && (

                    <small>
                      {" — "}
                      {product.categoria}
                    </small>

                  )}

                </div>

              ))}


            {products.length > 5 && (

              <small>

                ...
                {products.length - 5}
                {" "}
                productos más

              </small>

            )}

          </div>

        </div>

      )}


      {error && (

        <div className="product-import__error">
          {error}
        </div>

      )}


      {result && (

		  <div className="product-import__result">

			<strong>
			  Importación completada
			</strong>

			<div>
			  Importados: {result.imported}
			</div>

			<div>
			  Omitidos: {result.skipped}
			</div>


			{result.errors?.length > 0 && (

			  <div
				style={{
				  marginTop: "15px",
				  color: "#b91c1c",
				}}
			  >

				<strong>
				  Errores:
				</strong>


				{result.errors.map((item, index) => (

				  <div
					key={index}
					style={{
					  marginTop: "8px",
					}}
				  >

					<strong>
					  {item.nombre}
					</strong>

					<div>
					  {item.error}
					</div>

				  </div>

				))}

			  </div>

			)}

		  </div>

		)}


      <div className="product-import__actions">

        <Button
          type="button"
          onClick={handleImport}
          disabled={
            loading ||
            products.length === 0
          }
        >

          {loading
            ? "Importando..."
            : `Importar ${
                products.length || ""
              } productos`}

        </Button>


        <Button
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>

      </div>

    </div>
  );
}