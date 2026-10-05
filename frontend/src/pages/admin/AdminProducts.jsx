import "../../styles/page.css";
import "./AdminProducts.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProducts,
  deleteProduct,
  bulkUpdateProducts,
} from "../../services/productService";

import {
  getCategories,
} from "../../services/categoryService";

import ProductTable from "../../components/admin/ProductTable";
import ProductFilters from "../../components/admin/ProductFilters";
import ProductStats from "../../components/admin/ProductStats";

import SearchBar from "../../components/admin/ui/Searchbar";
import Button from "../../components/admin/ui/Button";
import ProductImport from "../../components/admin/ProductImport";
import BulkActions from "../../components/admin/BulkActions";
import BulkEditModal from "../../components/admin/BulkEditModal";


export default function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    sort: "newest",
  });

  const [page, setPage] = useState(1);
  
  const [selectedIds, setSelectedIds] = useState([]);

  const [showImport, setShowImport] = useState(false);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [bulkModal, setBulkModal] = useState(null);

  const [bulkValue, setBulkValue] = useState("");

  const [bulkLoading, setBulkLoading] = useState(false);

  const navigate = useNavigate();


  // =========================
  // CARGAR PRODUCTOS
  // =========================

  const loadProducts = async () => {

    try {

      const data = await getProducts();

      setProducts(data);

    } catch (err) {

      console.error(
        "Error cargando productos:",
        err
      );

    }

  };
  
  const toggleProductSelection = (id) => {
	  setSelectedIds((current) => {

		if (current.includes(id)) {

		  return current.filter(
			(selectedId) => selectedId !== id
		  );

		}

		return [
		  ...current,
		  id,
		];

	  });
	};
	
	
	const toggleSelectAll = () => {

	  const pageIds = paginatedProducts.map(
		(product) => product.id
	  );

	  const allSelected =
		pageIds.length > 0 &&
		pageIds.every((id) =>
		  selectedIds.includes(id)
		);

	  if (allSelected) {

		setSelectedIds((current) =>
		  current.filter(
			(id) => !pageIds.includes(id)
		  )
		);

	  } else {

		setSelectedIds((current) => [
		  ...new Set([
			...current,
			...pageIds,
		  ]),
		]);

	  }

	};
	
	const handleBulkDelete = async () => {

	  if (selectedIds.length === 0) {
		return;
	  }

	  const confirmed = window.confirm(
		`¿Eliminar ${selectedIds.length} productos seleccionados?`
	  );

	  if (!confirmed) {
		return;
	  }

	  try {

		await Promise.all(
		  selectedIds.map((id) =>
			deleteProduct(id)
		  )
		);

		setSelectedIds([]);

		await loadProducts();

	  } catch (err) {

		console.error(
		  "Error eliminando productos seleccionados:",
		  err
		);

	  }

	};


  // =========================
  // CARGAR CATEGORÍAS
  // =========================

  const loadCategories = async () => {

    try {

      const data = await getCategories();

      setCategories(data);

    } catch (err) {

      console.error(
        "Error cargando categorías:",
        err
      );

    }

  };
  
  
	  const openCategoryModal = () => {

	  setBulkValue("");

	  setBulkModal(
		"category"
	  );

	};
	
	
	const openPriceModal = () => {

	  setBulkValue("");

	  setBulkModal(
		"price"
	  );

	};
	
	
	const handleBulkActivate = async () => {

	  if (!selectedIds.length) {
		return;
	  }


	  const confirmed =
		window.confirm(
		  `¿Activar ${selectedIds.length} ${
			selectedIds.length === 1
			  ? "producto"
			  : "productos"
		  }?`
		);


	  if (!confirmed) {
		return;
	  }


	  try {

		setBulkLoading(true);


		await bulkUpdateProducts(
		  selectedIds,
		  "activate"
		);


		setSelectedIds([]);

		await loadProducts();

	  } catch (err) {

		console.error(
		  "Error activando productos:",
		  err
		);

		window.alert(
		  "No se pudieron activar los productos."
		);

	  } finally {

		setBulkLoading(false);

	  }

	};
	
	
	const handleBulkDeactivate = async () => {

	  if (!selectedIds.length) {
		return;
	  }


	  const confirmed =
		window.confirm(
		  `¿Desactivar ${selectedIds.length} ${
			selectedIds.length === 1
			  ? "producto"
			  : "productos"
		  }?`
		);


	  if (!confirmed) {
		return;
	  }


	  try {

		setBulkLoading(true);


		await bulkUpdateProducts(
		  selectedIds,
		  "deactivate"
		);


		setSelectedIds([]);

		await loadProducts();

	  } catch (err) {

		console.error(
		  "Error desactivando productos:",
		  err
		);

		window.alert(
		  "No se pudieron desactivar los productos."
		);

	  } finally {

		setBulkLoading(false);

	  }

	};


	const handleBulkModalConfirm = async () => {

	  if (!bulkModal) {
		return;
	  }


	  if (bulkModal === "category") {

		if (!bulkValue) {

		  window.alert(
			"Selecciona una categoría."
		  );

		  return;

		}

	  }


	  if (bulkModal === "price") {

		const price =
		  Number(bulkValue);


		if (
		  !Number.isFinite(price) ||
		  price < 0
		) {

		  window.alert(
			"Introduce un precio válido."
		  );

		  return;

		}

	  }


	  try {

		setBulkLoading(true);


		await bulkUpdateProducts(
		  selectedIds,
		  bulkModal,
		  bulkValue
		);


		setBulkModal(null);

		setBulkValue("");

		setSelectedIds([]);

		await loadProducts();

	  } catch (err) {

		console.error(
		  "Error en actualización masiva:",
		  err
		);

		window.alert(
		  "No se pudieron actualizar los productos."
		);

	  } finally {

		setBulkLoading(false);

	  }

	};
	
	
	const closeBulkModal = () => {

	  if (bulkLoading) {
		return;
	  }

	  setBulkModal(null);

	  setBulkValue("");

	};


	


  // =========================
  // CARGA INICIAL
  // =========================

  useEffect(() => {

    loadProducts();
    loadCategories();

  }, []);
  
  
  useEffect(() => {

    setSelectedIds([]);

  }, [
    filters.search,
    filters.category,
    filters.status,
    filters.sort,
    page,
  ]);


  // =========================
  // FILTRADO
  // =========================

  const filteredProducts = products
    .filter((product) => {

      const text =
        filters.search
          .toLowerCase()
          .trim();

      if (!text) {
        return true;
      }

      return (
        product.name
          ?.toLowerCase()
          .includes(text)

        ||

        product.category_name
          ?.toLowerCase()
          .includes(text)
      );

    })

    .filter((product) => {

      if (!filters.category) {
        return true;
      }

      return (
        String(product.category_id) ===
        String(filters.category)
      );

    })

    .filter((product) => {

      if (!filters.status) {
        return true;
      }

      if (filters.status === "active") {
        return product.active === true;
      }

      if (filters.status === "inactive") {
        return product.active === false;
      }

      return true;

    });


  // =========================
  // ORDENAMIENTO
  // =========================

  const sortedProducts = [...filteredProducts].sort(
    (a, b) => {

      switch (filters.sort) {

        case "name_asc":

          return (
            a.name || ""
          ).localeCompare(
            b.name || ""
          );


        case "name_desc":

          return (
            b.name || ""
          ).localeCompare(
            a.name || ""
          );


        case "price_asc":

          return (
            Number(a.price) || 0
          ) - (
            Number(b.price) || 0
          );


        case "price_desc":

          return (
            Number(b.price) || 0
          ) - (
            Number(a.price) || 0
          );


        case "stock_asc":

          return (
            Number(a.stock) || 0
          ) - (
            Number(b.stock) || 0
          );


        case "stock_desc":

          return (
            Number(b.stock) || 0
          ) - (
            Number(a.stock) || 0
          );
		 
		case "newest":

		  return (
			new Date(b.created_at) -
			new Date(a.created_at)
		  );


        default:

          return 0;

      }

    }
  );


  // =========================
  // PAGINACIÓN
  // =========================

  const totalPages = Math.ceil(
    sortedProducts.length /
    itemsPerPage
  );


  const paginatedProducts =
    sortedProducts.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
	
	useEffect(() => {

	  if (
		totalPages > 0 &&
		page > totalPages
	  ) {
		setPage(totalPages);
	  }

	}, [page, totalPages]);



  // =========================
  // REINICIAR PÁGINA
  // =========================

  useEffect(() => {

    setPage(1);

  }, [
    filters.search,
    filters.category,
    filters.status,
    filters.sort,
  ]);


  // =========================
  // LIMPIAR FILTROS
  // =========================

  const clearFilters = () => {

    setFilters({
      search: "",
      category: "",
      status: "",
      sort: "newest",
    });

  };


  // =========================
  // ELIMINAR
  // =========================

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "¿Eliminar producto?"
      )
    ) {
      return;
    }


    try {

      await deleteProduct(id);

      await loadProducts();

    } catch (err) {

      console.error(
        "Error eliminando producto:",
        err
      );

    }

  };


  return (

    <div className="page">


      {/* =========================
          HEADER
      ========================= */}

      <div className="products-page-header">

		  <div className="products-page-header__info">

			<h1>
			  Productos
			</h1>

			<p>
			  {sortedProducts.length === products.length
				? `${products.length} productos`
				: `${sortedProducts.length} de ${products.length} productos`}
			</p>

		  </div>


		  <div className="products-page-header__actions">

			<Button
			  onClick={() =>
				setShowImport(true)
			  }
			>
			  Importar JSON
			</Button>


			<Button
			  onClick={() =>
				navigate("/admin/products/new")
			  }
			>
			  + Nuevo producto
			</Button>

		  </div>

		</div>
	  
	  {/* ESTADÍSTICAS */}

	  <ProductStats
  	    products={products}
	  />


      {/* =========================
          IMPORTAR
      ========================= */}

      {showImport && (

        <ProductImport

          onComplete={async () => {

            setShowImport(false);

            await loadProducts();

          }}

          onCancel={() =>
            setShowImport(false)
          }

        />

      )}


      {/* =========================
          FILTROS
      ========================= */}

      <div className="product-toolbar">

		  <SearchBar
			value={filters.search}
			onChange={(value) =>
			  setFilters({
				...filters,
				search: value,
			  })
			}
		  />

		  <ProductFilters
			filters={filters}
			categories={categories}
			onChange={setFilters}
			onClear={clearFilters}
		  />

		</div>
		
		
	  {/* ACCIONES MASIVAS */}
	  <BulkActions
	  selectedCount={
		selectedIds.length
	  }
	  
	  onDelete={handleBulkDelete}

	  onActivate={
		handleBulkActivate
	  }

	  onDeactivate={
		handleBulkDeactivate
	  }

	  onChangeCategory={
		openCategoryModal
	  }

	  onChangePrice={
		openPriceModal
	  }

	  onClear={() =>
		setSelectedIds([])
	  }

	  loading={
		bulkLoading
	  }
	/>


      {/* =========================
          TABLE
      ========================= */}

      <ProductTable

	  products={paginatedProducts}

	  onEdit={(product) =>
		navigate(
		  `/admin/products/${product.id}`
		)
	  }

	  onDelete={handleDelete}

	  page={page}

	  totalPages={totalPages}

	  totalItems={sortedProducts.length}

	  itemsPerPage={itemsPerPage}

	  onPageChange={setPage}

	  selectedIds={selectedIds}

	  onToggleSelection={toggleProductSelection}

	  onToggleSelectAll={toggleSelectAll}

	/>
	
	
	{bulkModal && (

	  <BulkEditModal

		type={
		  bulkModal
		}

		selectedCount={
		  selectedIds.length
		}

		categories={
		  categories
		}

		value={
		  bulkValue
		}

		onChange={
		  setBulkValue
		}

		onConfirm={
		  handleBulkModalConfirm
		}

		onCancel={
		  closeBulkModal
		}

		loading={
		  bulkLoading
		}

	  />

	)}


    </div>

  );

}
