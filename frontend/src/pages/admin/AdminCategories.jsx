import "../../styles/page.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCategories,
  deleteCategory,
} from "../../services/categoryService";

import CategoryTable from "../../components/admin/CategoryTable";
import SearchBar from "../../components/admin/ui/Searchbar";
import Button from "../../components/admin/ui/Button";

export default function AdminCategories() {

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id) {

    if (!window.confirm("¿Eliminar categoría?")) return;

    await deleteCategory(id);

    loadCategories();

  }

  return (

    <div className="page">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20
        }}
      >

        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <Button
          onClick={() => navigate("/admin/categories/new")}
        >
          + Nueva categoría
        </Button>

      </div>

      <CategoryTable
        categories={filtered}
        onEdit={(category) =>
          navigate(`/admin/categories/${category.id}`)
        }
        onDelete={handleDelete}
      />

    </div>

  );

}