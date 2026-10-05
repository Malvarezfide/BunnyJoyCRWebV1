import "./CategoryForm.css";
import { useEffect, useState } from "react";

const initialState = {
  name: "",
  description: "",
  active: true,
};

export default function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialState,
        ...initialData,
      });
    } else {
      setForm(initialState);
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function submit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Ingrese un nombre");
      return;
    }

    onSubmit(form);
  }

  return (
    <form className="category-form" onSubmit={submit}>

      <div className="grid-form">

        <div className="col">

          <label>Nombre</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <label>Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <label style={{ display: "flex", gap: 8 }}>
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            Activo
          </label>

        </div>

      </div>

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