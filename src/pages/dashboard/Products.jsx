import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";

// Services
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import uploadService from "../../services/uploadService";

// Layout
import DashboardLayout from "../../layouts/DashboardLayout";

// Components
import {
  Button,
  Card,
  Alert,
  Table,
  Pagination,
  Modal,
  Input,
} from "../../components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Validation schemas
import {
  productSchema,
  productUpdateSchema,
} from "../../utils/productValidation";
import { useAuth } from "../../context/AuthContext";

// Product form component for adding/editing
const ProductForm = ({
  product,
  onSubmit,
  isLoading,
  isEdit = false,
  categories = [],
}) => {
  const { t } = useTranslation();

  const [imagePreview, setImagePreview] = useState(null);

  // Use the appropriate schema based on if we're editing or adding
  const schema = isEdit ? productUpdateSchema : productSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price ? product.price.toString() : "",
      stock: product?.stock ? product.stock.toString() : "",
      category: product?.category || "",
      image: "",
      isActive: product?.isActive !== undefined ? product.isActive : true,
    },
  });

  // Reset form when product changes
  useEffect(() => {
    reset({
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price ? product.price.toString() : "",
      stock: product?.stock ? product.stock.toString() : "",
      category: product?.category || "",
      image: "",
      isActive: product?.isActive !== undefined ? product.isActive : true,
    });

    // Set image preview if we're editing and there's an image
    if (isEdit && product?.image) {
      setImagePreview(uploadService.getImageById(product.image));
    } else {
      setImagePreview(null);
    }
  }, [product, reset, isEdit]);

  // Watch for image file changes
  const imageFile = watch("image");

  // Update image preview when a new file is selected
  useEffect(() => {
    if (imageFile && imageFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(imageFile[0]);
    }
  }, [imageFile]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name field - with explicit label rendering */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          {t("fields.name")}
        </label>
        <input
          type="text"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${
            errors.name ? "border-danger-500" : "border-secondary-300"
          }`}
          placeholder={t("fields.name")}
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-danger-500">
            {t(errors.name.message)}
          </p>
        )}
      </div>

      {/* Description field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          {t("fields.description")}
        </label>
        <textarea
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${
            errors.description ? "border-danger-500" : "border-secondary-300"
          }`}
          rows="4"
          {...register("description")}
          placeholder={t("fields.description")}
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-danger-500">
            {t(errors.description.message)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Price field - with explicit label rendering */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            {t("fields.price")}
          </label>
          <input
            type="number"
            step="0.01"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${
              errors.price ? "border-danger-500" : "border-secondary-300"
            }`}
            placeholder={t("fields.price")}
            {...register("price")}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-danger-500">
              {t(errors.price.message)}
            </p>
          )}
        </div>

        {/* Stock field - with explicit label rendering */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            {t("fields.stock")}
          </label>
          <input
            type="number"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${
              errors.stock ? "border-danger-500" : "border-secondary-300"
            }`}
            placeholder={t("fields.stock")}
            {...register("stock")}
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-danger-500">
              {t(errors.stock.message)}
            </p>
          )}
        </div>
      </div>

      {/* Category field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          {t("fields.category")}
        </label>
        <select
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${
            errors.category ? "border-danger-500" : "border-secondary-300"
          }`}
          {...register("category")}
        >
          <option value="">{t("products.selectCategory")}</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-danger-500">
            {t(errors.category.message)}
          </p>
        )}
      </div>

      {/* Image field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          {t("fields.image")}
        </label>
        <input
          type="file"
          accept="image/*"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${
            errors.image ? "border-danger-500" : "border-secondary-300"
          }`}
          {...register("image")}
        />
        {errors.image && (
          <p className="mt-1 text-sm text-danger-500">
            {t(errors.image.message)}
          </p>
        )}

        {/* Image preview */}
        {imagePreview && (
          <div className="mt-2">
            <p className="text-sm text-secondary-700 mb-1">
              {t("products.imagePreview")}
            </p>
            <div className="h-32 w-32 bg-secondary-100 rounded overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Active status */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          className="form-checkbox h-4 w-4 text-primary-600 transition duration-150 ease-in-out cursor-pointer"
          {...register("isActive")}
        />
        <span className="ml-2 text-sm text-secondary-700">
          {t("common.active")}
        </span>
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          {isEdit ? t("common.save") : t("products.addProduct")}
        </Button>
      </div>
    </form>
  );
};

// Product view component
const ProductView = ({ product, categoryName }) => {
  const { t } = useTranslation();

  if (!product) return null;

  return (
    <div className="space-y-4">
      {/* Product image */}
      {product.imageUrl && (
        <div className="text-center mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-32 w-32 object-cover rounded mx-auto"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-secondary-500">
            {t("fields.name")}
          </h3>
          <p className="mt-1 text-sm text-secondary-900">{product.name}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-secondary-500">
            {t("fields.price")}
          </h3>
          <p className="mt-1 text-sm text-secondary-900">${product.price}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-secondary-500">
            {t("fields.stock")}
          </h3>
          <p className="mt-1 text-sm text-secondary-900">{product.stock}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-secondary-500">
            {t("fields.category")}
          </h3>
          <p className="mt-1 text-sm text-secondary-900">{categoryName}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-secondary-500">
            {t("fields.status")}
          </h3>
          <p className="mt-1 text-sm">
            {product.isActive ? (
              <span className="bg-success-100 text-success-800 px-2 py-1 rounded-full text-xs">
                {t("common.active")}
              </span>
            ) : (
              <span className="bg-danger-100 text-danger-800 px-2 py-1 rounded-full text-xs">
                {t("common.inactive")}
              </span>
            )}
          </p>
        </div>

        <div className="col-span-2">
          <h3 className="text-sm font-medium text-secondary-500">
            {t("fields.description")}
          </h3>
          <p className="mt-1 text-sm text-secondary-900">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main products page component
const Products = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State variables
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Current product being edited/viewed/deleted
  const [currentProduct, setCurrentProduct] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState(null); // null = all, true = active, false = inactive
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("");

  // Create a debounced version of fetchProducts for search
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      fetchProducts({ search: searchValue });
    }, 500),
    []
  );

  // Fetch categories and products on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [currentPage, user]);

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories(
        1,
        100,
        true,
        "", // No search term for categories
        user.role === "company" ? user.id : null
      );
      setCategories(response.data.categories);

      // Create a map of category id to name for easy lookup
      const catMap = {};
      response.data.categories.forEach((cat) => {
        catMap[cat._id] = cat.name;
      });
      setCategoryMap(catMap);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.response?.data?.message || "errors.generic");
    }
  };

  // Function to fetch products with pagination and filters
  const fetchProducts = async (additionalFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const filters = {
        active: activeFilter,
        category: categoryFilter || undefined,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined,
        search: searchTerm || undefined,
        sort: sortBy || undefined,
        // Add company ID to filters when user is a company
        ...(user.role === "company" && { company: user.id }),
        ...additionalFilters,
      };

      const response = await productService.getAllProducts(
        currentPage,
        10,
        filters
      );
      setProducts(response.data.products);
      setTotalPages(response.totalPages);
      console.log("Fetched products:", response);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle search change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setActiveFilter(null);
    setCategoryFilter("");
    setPriceRange({ min: "", max: "" });
    setSortBy("");
    setCurrentPage(1);
    fetchProducts({
      search: "",
      active: null,
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
    });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle add product
  const handleAddProduct = async (data) => {
    setLoading(true);
    setError(null);

    try {
      let imageId = null;

      if (data.image && data.image[0]) {
        const imageResponse = await uploadService.uploadImage(data.image[0]);
        imageId = imageResponse.data.image.id;
      }

      const productData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.stock, 10),
        category: data.category,
        isActive: data.isActive,
        image: imageId,
        // Add company ID when user is a company
        ...(user.role === "company" && { company: user.id }),
      };

      await productService.createProduct(productData);
      setSuccess("products.productAdded");
      setIsAddModalOpen(false);
      fetchProducts();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit product
  const handleEditProduct = async (data) => {
    if (!currentProduct) return;

    setLoading(true);
    setError(null);

    try {
      let imageId = currentProduct.image;

      if (data.image && data.image[0]) {
        const imageResponse = await uploadService.uploadImage(data.image[0]);
        imageId = imageResponse.data.image._id;
      }

      const productData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.stock, 10),
        category: data.category,
        isActive: data.isActive,
        image: imageId,
        // Preserve company ID when user is a company
        ...(user.role === "company" && { company: user.id }),
      };

      await productService.updateProduct(currentProduct._id, productData);
      setSuccess("products.productUpdated");
      setIsEditModalOpen(false);
      fetchProducts();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!currentProduct) return;

    setLoading(true);
    setError(null);

    try {
      await productService.deleteProduct(currentProduct._id);
      setSuccess("products.productDeleted");
      setIsDeleteModalOpen(false);
      fetchProducts();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async () => {
    if (!currentProduct) return;

    setLoading(true);
    setError(null);

    try {
      await productService.changeProductStatus(
        currentProduct._id,
        !currentProduct.isActive
      );
      setSuccess("products.statusChanged");
      setIsStatusModalOpen(false);
      fetchProducts();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error changing product status:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle active filter change
  const handleActiveFilterChange = (value) => {
    setActiveFilter(value);
    setCurrentPage(1);
    fetchProducts({ active: value });
  };

  // Handle category filter change
  const handleCategoryFilterChange = (e) => {
    const value = e.target.value;
    setCategoryFilter(value);
    setCurrentPage(1);
    fetchProducts({ category: value });
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    setCurrentPage(1);
    fetchProducts({ sort: value });
  };

  // Handle price range change
  const handlePriceRangeChange = (field) => (e) => {
    setPriceRange({ ...priceRange, [field]: e.target.value });
  };

  // Format price with currency symbol
  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Table columns configuration
  const columns = [
    {
      header: t("fields.image"),
      accessor: "image",
      width: "8%",
      render: (product) => (
        <div className="flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product?.imageUrl}
              alt={product.name}
              className="h-10 w-10 object-cover rounded"
            />
          ) : (
            <div className="h-10 w-10 bg-secondary-200 rounded flex items-center justify-center">
              <svg
                className="h-6 w-6 text-secondary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      ),
    },
    {
      header: t("fields.name"),
      accessor: "name",
      width: "20%",
    },
    {
      header: t("fields.price"),
      accessor: "price",
      width: "10%",
      render: (product) => formatPrice(product.price),
    },
    {
      header: t("fields.stock"),
      accessor: "stock",
      width: "10%",
    },
    {
      header: t("fields.category"),
      accessor: "category",
      width: "15%",
      render: (product) => product.category?.name || "-",
    },
    {
      header: t("fields.status"),
      accessor: "isActive",
      width: "10%",
      render: (product) =>
        product.isActive ? (
          <span className="bg-success-100 text-success-800 px-2 py-1 rounded-full text-xs">
            {t("common.active")}
          </span>
        ) : (
          <span className="bg-danger-100 text-danger-800 px-2 py-1 rounded-full text-xs">
            {t("common.inactive")}
          </span>
        ),
    },
    {
      header: t("common.actions"),
      accessor: "actions",
      width: "15%",
      render: (product) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentProduct(product);
              setIsViewModalOpen(true);
            }}
            className="p-1 text-primary-600 hover:text-primary-900"
            title={t("products.viewProduct")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentProduct(product);
              setIsEditModalOpen(true);
            }}
            className="p-1 text-secondary-600 hover:text-secondary-900"
            title={t("common.edit")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentProduct(product);
              setIsStatusModalOpen(true);
            }}
            className={`p-1 ${
              product.isActive
                ? "text-warning-600 hover:text-warning-900"
                : "text-success-600 hover:text-success-900"
            }`}
            title={
              product.isActive
                ? t("products.deactivateProduct")
                : t("products.activateProduct")
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentProduct(product);
              setIsDeleteModalOpen(true);
            }}
            className="p-1 text-danger-600 hover:text-danger-900"
            title={t("common.delete")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              {t("products.productManagement")}
            </h1>
            <p className="mt-1 text-secondary-500">
              {t("products.productsList")}
            </p>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="sm:self-end"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {t("products.addProduct")}
          </Button>
        </div>

        {/* Success and error alerts */}
        {error && (
          <Alert
            type="error"
            dismissible
            onDismiss={() => setError(null)}
            className="mb-4"
          >
            {t(error)}
          </Alert>
        )}

        {success && (
          <Alert
            type="success"
            dismissible
            onDismiss={() => setSuccess(null)}
            className="mb-4"
          >
            {t(success)}
          </Alert>
        )}

        {/* Enhanced Filters panel */}
        <Card className="mb-6 overflow-hidden">
          <div className="border-b border-secondary-200">
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <h2 className="text-lg font-medium text-secondary-900">
                  {t("products.filters")}
                </h2>
              </div>
              <svg
                className={`w-5 h-5 text-secondary-500 transform transition-transform duration-200 ${
                  isFiltersExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Search bar - always visible */}
          <div className="p-4 bg-secondary-50 border-b border-secondary-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-secondary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder={t("products.searchPlaceholder")}
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-3 w-full border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      fetchProducts({ search: "" });
                    }}
                    className="text-secondary-400 hover:text-secondary-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Expandable filter options */}
          {isFiltersExpanded && (
            <div className="p-4 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status filter */}
                <div>
                  <h3 className="text-sm font-medium text-secondary-700 mb-2">
                    {t("products.filterByStatus")}
                  </h3>
                  <div className="bg-secondary-100 rounded-lg overflow-hidden">
                    <div className="flex divide-x divide-secondary-200">
                      <button
                        onClick={() => handleActiveFilterChange(null)}
                        className={`flex-1 px-3 py-2 text-sm ${
                          activeFilter === null
                            ? "bg-primary-100 text-primary-800 font-medium"
                            : "bg-white text-secondary-700 hover:bg-secondary-50"
                        }`}
                      >
                        {t("products.allProducts")}
                      </button>
                      <button
                        onClick={() => handleActiveFilterChange(true)}
                        className={`flex-1 px-3 py-2 text-sm ${
                          activeFilter === true
                            ? "bg-primary-100 text-primary-800 font-medium"
                            : "bg-white text-secondary-700 hover:bg-secondary-50"
                        }`}
                      >
                        {t("common.active")}
                      </button>
                      <button
                        onClick={() => handleActiveFilterChange(false)}
                        className={`flex-1 px-3 py-2 text-sm ${
                          activeFilter === false
                            ? "bg-primary-100 text-primary-800 font-medium"
                            : "bg-white text-secondary-700 hover:bg-secondary-50"
                        }`}
                      >
                        {t("common.inactive")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category filter */}
                <div>
                  <h3 className="text-sm font-medium text-secondary-700 mb-2">
                    {t("products.filterByCategory")}
                  </h3>
                  <select
                    value={categoryFilter}
                    onChange={handleCategoryFilterChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundSize: "1.5em 1.5em",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <option value="">{t("products.allCategories")}</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort by */}
                <div>
                  <h3 className="text-sm font-medium text-secondary-700 mb-2">
                    {t("products.sortBy")}
                  </h3>
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundSize: "1.5em 1.5em",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <option value="">{t("products.defaultSort")}</option>

                    <option value="price">{t("products.priceLowHigh")}</option>
                    <option value="-price">{t("products.priceHighLow")}</option>
                    <option value="name">{t("products.nameAZ")}</option>
                    <option value="-name">{t("products.nameZA")}</option>
                    <option value="createdAt">{t("products.oldest")}</option>
                    <option value="-createdAt">{t("products.newest")}</option>
                  </select>
                </div>
              </div>

              {/* Price range filter */}
              <div>
                <h3 className="text-sm font-medium text-secondary-700 mb-2">
                  {t("products.priceRange")}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-secondary-500">$</span>
                    </div>
                    <input
                      type="number"
                      placeholder={t("products.minPrice")}
                      value={priceRange.min}
                      onChange={handlePriceRangeChange("min")}
                      className="pl-8 pr-4 py-2 w-full border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <span className="text-secondary-500">-</span>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-secondary-500">$</span>
                    </div>
                    <input
                      type="number"
                      placeholder={t("products.maxPrice")}
                      value={priceRange.max}
                      onChange={handlePriceRangeChange("max")}
                      className="pl-8 pr-4 py-2 w-full border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Filter actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-secondary-200">
                <Button
                  variant="secondary"
                  onClick={resetFilters}
                  className="text-sm"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {t("products.resetFilters")}
                </Button>
                <Button onClick={applyFilters} className="text-sm">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  {t("products.applyFilters")}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Active filters indicators */}
        {(activeFilter !== null ||
          categoryFilter ||
          priceRange.min ||
          priceRange.max ||
          sortBy) && (
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-secondary-600">
              {t("products.activeFilters")}:
            </span>

            {activeFilter !== null && (
              <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                {activeFilter ? t("common.active") : t("common.inactive")}
                <button
                  className="ml-2 text-primary-500 hover:text-primary-700"
                  onClick={() => {
                    setActiveFilter(null);
                    fetchProducts({ active: null });
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            )}

            {categoryFilter && (
              <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                {categoryMap[categoryFilter] || t("products.category")}
                <button
                  className="ml-2 text-primary-500 hover:text-primary-700"
                  onClick={() => {
                    setCategoryFilter("");
                    fetchProducts({ category: "" });
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            )}

            {(priceRange.min || priceRange.max) && (
              <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                {priceRange.min && priceRange.max
                  ? `${priceRange.min} - ${priceRange.max}`
                  : priceRange.min
                  ? `>= ${priceRange.min}`
                  : `<= ${priceRange.max}`}
                <button
                  className="ml-2 text-primary-500 hover:text-primary-700"
                  onClick={() => {
                    setPriceRange({ min: "", max: "" });
                    fetchProducts({ minPrice: "", maxPrice: "" });
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            )}

            {sortBy && (
              <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                {t("products.sortedBy")}:
                {sortBy === "name.asc" && t("products.nameAZ")}
                {sortBy === "name.desc" && t("products.nameZA")}
                {sortBy === "price.asc" && t("products.priceLowHigh")}
                {sortBy === "price.desc" && t("products.priceHighLow")}
                {sortBy === "stock.asc" && t("products.stockLowHigh")}
                {sortBy === "stock.desc" && t("products.stockHighLow")}
                {sortBy === "createdAt.desc" && t("products.newest")}
                {sortBy === "createdAt.asc" && t("products.oldest")}
                <button
                  className="ml-2 text-primary-500 hover:text-primary-700"
                  onClick={() => {
                    setSortBy("");
                    fetchProducts({ sort: "" });
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            )}

            <button
              className="text-secondary-600 hover:text-secondary-900 text-sm underline ml-auto"
              onClick={resetFilters}
            >
              {t("products.clearAll")}
            </button>
          </div>
        )}

        {/* Products table */}
        <Card className="overflow-hidden mb-6">
          <Table
            columns={columns}
            data={products}
            isLoading={loading}
            noDataMessage={t("products.noProducts")}
            onRowClick={(product) => {
              setCurrentProduct(product);
              setIsViewModalOpen(true);
            }}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </Card>
      </div>

      {/* Add product modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t("products.addProduct")}
        size="md"
      >
        <ProductForm
          onSubmit={handleAddProduct}
          isLoading={loading}
          categories={categories}
        />
      </Modal>

      {/* Edit product modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t("products.editProduct")}
        size="md"
      >
        <ProductForm
          product={currentProduct}
          onSubmit={handleEditProduct}
          isLoading={loading}
          isEdit
          categories={categories}
        />
      </Modal>

      {/* View product modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={t("products.productDetails")}
        size="md"
      >
        <ProductView
          product={currentProduct}
          categoryName={
            currentProduct ? categoryMap[currentProduct.category] : ""
          }
        />
      </Modal>

      {/* Delete product confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t("products.deleteProduct")}
        size="sm"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant="danger"
              loading={loading}
              onClick={handleDeleteProduct}
            >
              {t("common.delete")}
            </Button>
          </div>
        }
      >
        <p className="text-secondary-700">
          {t("products.deleteProductConfirmation")}
        </p>
      </Modal>

      {/* Change status confirmation modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={
          currentProduct?.isActive
            ? t("products.deactivateProduct")
            : t("products.activateProduct")
        }
        size="sm"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsStatusModalOpen(false)}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant={currentProduct?.isActive ? "warning" : "success"}
              loading={loading}
              onClick={handleStatusChange}
            >
              {currentProduct?.isActive
                ? t("products.deactivateProduct")
                : t("products.activateProduct")}
            </Button>
          </div>
        }
      >
        <p className="text-secondary-700">
          {t("products.statusChangeConfirmation")}
        </p>
      </Modal>
    </DashboardLayout>
  );
};

export default Products;
