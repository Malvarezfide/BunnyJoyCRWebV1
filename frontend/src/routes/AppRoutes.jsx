import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Todo se carga de forma perezosa y por separado:
//   - sitio público: su CSS (Tailwind) nunca llega al admin
//   - admin: su JS/CSS nunca llegan al visitante del sitio público
const PublicLayout = lazy(() => import("../layouts/PublicLayout"));
const Home = lazy(() => import("../pages/Home"));
const Products = lazy(() => import("../pages/Products"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const NotFound = lazy(() => import("../pages/NotFound"));

const Login = lazy(() => import("../pages/admin/Login"));
const AdminRoutes = lazy(() => import("./AdminRoutes"));


export default function AppRoutes() {

  return (

    <BrowserRouter>

      <Suspense fallback={null}>

        <Routes>

          {/* SITIO PÚBLICO */}

          <Route element={<PublicLayout />}>

            <Route path="/" element={<Home />} />

            <Route path="/products" element={<Products />} />

            <Route path="/product/:slug" element={<ProductDetail />} />

            <Route path="*" element={<NotFound />} />

          </Route>


          {/* ADMIN */}

          <Route path="/login" element={<Login />} />

          <Route path="/admin/*" element={<AdminRoutes />} />

        </Routes>

      </Suspense>

    </BrowserRouter>

  );

}
