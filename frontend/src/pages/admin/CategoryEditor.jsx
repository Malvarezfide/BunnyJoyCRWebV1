import "../../styles/page.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CategoryForm from "../../components/admin/CategoryForm";

import {
  getCategories,
  createCategory,
  updateCategory,
} from "../../services/categoryService";

export default function CategoryEditor() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {

    async function load() {

      try {

        if (!id) {
          setLoading(false);
          return;
        }

        const categories = await getCategories();

        const found = categories.find(
          (c) => String(c.id) === String(id)
        );

        setCategory(found || null);

      } catch (err) {

        console.error("Error cargando categoría:", err);

      } finally {

        setLoading(false);

      }

    }

    load();

  }, [id]);

  async function handleSave(data) {

    try {

      if (id) {
        await updateCategory(id, data);
      } else {
        await createCategory(data);
      }

      navigate("/admin/categories");

    } catch (err) {

      console.error("Error guardando categoría:", err);

    }

  }

  if (loading) {
    return <h2>Cargando...</h2>;
  }

  return (

    <div className="page">

      <h1>
        {id ? "Editar categoría" : "Nueva categoría"}
      </h1>

      <CategoryForm
        initialData={category}
        onSubmit={handleSave}
        onCancel={() => navigate("/admin/categories")}
      />

    </div>

  );

}