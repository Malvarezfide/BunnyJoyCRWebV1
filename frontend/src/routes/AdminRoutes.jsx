import { Routes, Route } from "react-router-dom";

import "../styles/global.css";

import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import ProductEditor from "../pages/admin/ProductEditor";
import AdminCategories from "../pages/admin/AdminCategories";
import CategoryEditor from "../pages/admin/CategoryEditor";
import AdminTags from "../pages/admin/AdminTags";
import TagEditor from "../pages/admin/TagEditor";

import AdminLayout from "../layouts/AdminLayout";
import PrivateRoute from "./PrivateRoute";

// Todo el panel admin vive en este módulo, que AppRoutes importa con
// React.lazy: el visitante del sitio público nunca descarga su JS ni su CSS.
// Las rutas son relativas a /admin.
export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<ProductEditor />} />
        <Route path="products/:id" element={<ProductEditor />} />

        <Route path="categories" element={<AdminCategories />} />
        <Route path="categories/new" element={<CategoryEditor />} />
        <Route path="categories/:id" element={<CategoryEditor />} />

        <Route path="tags" element={<AdminTags />} />
        <Route path="tags/new" element={<TagEditor />} />
        <Route path="tags/:id" element={<TagEditor />} />
      </Route>
    </Routes>
  );
}
