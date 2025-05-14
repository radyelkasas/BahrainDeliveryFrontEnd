import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";

// Services
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
  Spinner,
  Badge,
  Dropdown,
  Tooltip,
} from "../../components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Validation schemas
import {
  categorySchema,
  categoryUpdateSchema,
} from "../../utils/categoryValidation";

// Icons
import {
  Plus as PlusIcon,
  Eye as EyeIcon,
  Edit as PencilIcon,
  Trash2 as TrashIcon,
  Lock as LockClosedIcon,
  Unlock as LockOpenIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Image as PhotographIcon,
  RefreshCw as RefreshIcon,
} from "react-feather";
import { useAuth } from "../../context/AuthContext";

/**
 * CategoryForm Component
 *
 * Handles the form for creating and editing categories with image preview,
 * form validation, and appropriate state management.
 *
 * @param {Object} props - Component props
 * @param {Object} props.category - Category data for editing (optional)
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Boolean} props.isLoading - Loading state
 * @param {Boolean} props.isEdit - Whether form is in edit mode
 */
const CategoryForm = ({ category, onSubmit, isLoading, isEdit = false }) => {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Use the appropriate schema based on if we're editing or adding
  const schema = isEdit ? categoryUpdateSchema : categorySchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    setValue,
    watch,
    control,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      image: "",
      isActive: category?.isActive !== undefined ? category.isActive : true,
    },
    mode: "onChange", // Validate on change for better user experience
  });

  // Reset form when category changes
  useEffect(() => {
    reset({
      name: category?.name || "",
      description: category?.description || "",
      image: "",
      isActive: category?.isActive !== undefined ? category.isActive : true,
    });

    // Set image preview if we're editing and there's an image
    if (isEdit && category?.image) {
      setImagePreview(uploadService.getImageById(category.image));
    } else {
      setImagePreview(null);
    }

    // Reset upload progress
    setUploadProgress(0);
  }, [category, reset, isEdit]);

  // Watch for image file changes
  const imageFile = watch("image");

  // Update image preview when a new file is selected
  useEffect(() => {
    if (imageFile && imageFile[0]) {
      // Validate file size
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (imageFile[0].size > MAX_FILE_SIZE) {
        setValue("image", "", { shouldValidate: true });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(imageFile[0]);

      // Simulate upload progress for better UX
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [imageFile, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label={t("fields.name")}
        placeholder={t("fields.name")}
        error={errors.name}
        register={register}
        name="name"
        autoFocus
        required
      />

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

      <div className="mb-4">
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          {t("fields.image")}
        </label>

        {/* Image upload area with drag and drop */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-300 
            ${errors.image ? "border-danger-500" : "border-secondary-300"} 
            ${imagePreview ? "bg-secondary-50" : "bg-white"}
            hover:bg-secondary-50 cursor-pointer`}
          onClick={() => document.getElementById("image-upload").click()}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            {...register("image")}
          />

          <div className="flex flex-col items-center justify-center py-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-40 object-cover rounded shadow-md"
                />
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    className="p-1 bg-white rounded-full shadow-md text-danger-500 hover:text-danger-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setValue("image", "", { shouldValidate: true });
                      setImagePreview(null);
                      setUploadProgress(0);
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <PhotographIcon className="w-12 h-12 text-secondary-400" />
                <p className="mt-2 text-sm text-secondary-600">
                  {t("categories.dragAndDrop")}
                </p>
                <p className="text-xs text-secondary-500">
                  {t("categories.imageRequirements")}
                </p>
              </>
            )}

            {/* Upload progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full mt-4 px-4">
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-center text-secondary-500">
                  {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>

        {errors.image && (
          <p className="mt-1 text-sm text-danger-500">
            {t(errors.image.message)}
          </p>
        )}
      </div>

      {/* Active status */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-primary-600 transition duration-150 ease-in-out cursor-pointer rounded"
          {...register("isActive")}
          id="isActive"
        />
        <label
          htmlFor="isActive"
          className="ml-2 text-sm text-secondary-700 cursor-pointer"
        >
          {t("common.active")}
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => reset()}
          disabled={!isDirty || isLoading}
        >
          {t("common.reset")}
        </Button>
        <Button
          type="submit"
          loading={isLoading}
          disabled={!isDirty || !isValid}
        >
          {isEdit ? t("common.save") : t("categories.addCategory")}
        </Button>
      </div>
    </form>
  );
};

/**
 * CategoryView Component
 *
 * Displays detailed information about a selected category
 * including its image, name, description, and status.
 *
 * @param {Object} props - Component props
 * @param {Object} props.category - Category data to display
 */
const CategoryView = ({ category }) => {
  const { t } = useTranslation();

  if (!category) return <Spinner size="lg" />;

  return (
    <div className="space-y-6">
      {/* Category image */}
      {category.image && (
        <div className="text-center mb-4">
          <img
            src={uploadService.getImageById(category.image)}
            alt={category.name}
            className="h-40 w-40 object-cover rounded-lg shadow-lg mx-auto"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-secondary-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary-500 mb-1">
            {t("fields.name")}
          </h3>
          <p className="text-lg font-semibold text-secondary-900">
            {category.name}
          </p>
        </div>

        <div className="bg-secondary-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-secondary-500 mb-1">
            {t("fields.status")}
          </h3>
          <div className="mt-1">
            {category.isActive ? (
              <Badge color="success">{t("common.active")}</Badge>
            ) : (
              <Badge color="danger">{t("common.inactive")}</Badge>
            )}
          </div>
        </div>

        <div className="bg-secondary-50 rounded-lg p-4 md:col-span-2">
          <h3 className="text-sm font-medium text-secondary-500 mb-1">
            {t("fields.description")}
          </h3>
          <p className="text-secondary-900 whitespace-pre-line">
            {category.description || t("common.noDescription")}
          </p>
        </div>

        <div className="bg-secondary-50 rounded-lg p-4 md:col-span-2">
          <h3 className="text-sm font-medium text-secondary-500 mb-1">
            {t("fields.metadata")}
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-xs text-secondary-500">
                {t("fields.createdAt")}
              </p>
              <p className="text-sm text-secondary-900">
                {category.createdAt
                  ? new Date(category.createdAt).toLocaleDateString()
                  : t("common.notAvailable")}
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary-500">
                {t("fields.updatedAt")}
              </p>
              <p className="text-sm text-secondary-900">
                {category.updatedAt
                  ? new Date(category.updatedAt).toLocaleDateString()
                  : t("common.notAvailable")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Categories Component
 *
 * Main component for category management with advanced features:
 * - Server-side search and filtering
 * - Optimized API calls with debounce
 * - Responsive table with optimized rendering
 * - Enhanced UI/UX with tooltips and confirmations
 * - Loading states and error handling
 */
const Categories = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State variables
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
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

  // Current category being edited/viewed/deleted
  const [currentCategory, setCurrentCategory] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState(null); // null = all, true = active, false = inactive
  const [isFetching, setIsFetching] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  // Debounced search function to limit API calls
  const debouncedSearch = useCallback(
    debounce((term) => {
      setCurrentPage(1); // Reset to first page on search
      fetchCategories(1, pageSize, activeFilter, term);
    }, 500),
    [activeFilter, pageSize]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  console.log("User :", user.id);

  // Function to fetch categories with pagination, filters and search
  const fetchCategories = useCallback(
    async (
      page = currentPage,
      limit = pageSize,
      active = activeFilter,
      search = searchTerm
    ) => {
      setIsFetching(true);
      setError(null);

      try {
        // If user is a company, pass user.id to the function
        const response = await categoryService.getAllCategories(
          page,
          limit,
          active,
          search,
          user.role === "company" ? user.id : null
        );

        setCategories(response.data.categories);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);

        // Update state only if the current values in state don't match the requested parameters
        if (page !== currentPage) setCurrentPage(page);
        if (limit !== pageSize) setPageSize(limit);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.response?.data?.message || "errors.generic");
      } finally {
        setIsFetching(false);
        setLoading(false);
      }
    },
    [currentPage, pageSize, activeFilter, searchTerm, user]
  );

  // Fetch categories on component mount and when filters change
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchCategories(page, pageSize, activeFilter, searchTerm);
  };

  // Handle add category
  const handleAddCategory = async (data) => {
    setLoading(true);
    setError(null);

    try {
      let imageId = null;

      if (data.image && data.image[0]) {
        const imageResponse = await uploadService.uploadImage(data.image[0]);
        imageId = imageResponse.data.image._id;
      }

      const categoryData = {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        image: imageId,
        // Add company ID to category data when user is a company
        ...(user.role === "company" && { company: user.id }),
      };

      await categoryService.createCategory(categoryData);
      setSuccess("categories.categoryAdded");
      setIsAddModalOpen(false);
      fetchCategories();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding category:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit category
  const handleEditCategory = async (data) => {
    if (!currentCategory) return;

    setLoading(true);
    setError(null);

    try {
      let imageId = currentCategory.image;

      if (data.image && data.image[0]) {
        const imageResponse = await uploadService.uploadImage(data.image[0]);
        imageId = imageResponse.data.image._id;
      }

      const categoryData = {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        image: imageId,
        // Preserve company ID when user is a company
        ...(user.role === "company" && { company: user.id }),
      };

      await categoryService.updateCategory(currentCategory._id, categoryData);
      setSuccess("categories.categoryUpdated");
      setIsEditModalOpen(false);
      fetchCategories();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating category:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    if (!currentCategory) return;

    setLoading(true);
    setError(null);

    try {
      await categoryService.deleteCategory(currentCategory._id);
      setSuccess("categories.categoryDeleted");
      setIsDeleteModalOpen(false);
      fetchCategories();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async () => {
    if (!currentCategory) return;

    setLoading(true);
    setError(null);

    try {
      await categoryService.changeCategoryStatus(
        currentCategory._id,
        !currentCategory.isActive
      );
      setSuccess("categories.statusChanged");
      setIsStatusModalOpen(false);
      fetchCategories();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error changing category status:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle active filter change
  const handleActiveFilterChange = (value) => {
    setActiveFilter(value);
    fetchCategories(1, pageSize, value, searchTerm);
  };

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    fetchCategories(1, size, activeFilter, searchTerm);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchCategories(currentPage, pageSize, activeFilter, searchTerm);
  };

  // Table columns configuration - memoized to prevent unnecessary re-renders
  const columns = useMemo(
    () => [
      {
        header: t("fields.image"),
        accessor: "image",
        width: "10%",
        render: (category) => (
          <div className="flex items-center justify-center">
            {category.image ? (
              <img
                src={uploadService.getImageById(category.image)}
                alt={category.name}
                className="h-12 w-12 object-cover rounded-lg shadow-sm"
              />
            ) : (
              <div className="h-12 w-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <PhotographIcon className="h-6 w-6 text-secondary-400" />
              </div>
            )}
          </div>
        ),
      },
      {
        header: t("fields.name"),
        accessor: "name",
        width: "25%",
        render: (category) => (
          <div className="font-medium text-secondary-900">{category.name}</div>
        ),
      },
      {
        header: t("fields.description"),
        accessor: "description",
        width: "35%",
        render: (category) => (
          <Tooltip content={category.description || t("common.noDescription")}>
            <div
              className="truncate max-w-xs text-secondary-600"
              title={category.description}
            >
              {category.description || t("common.noDescription")}
            </div>
          </Tooltip>
        ),
      },
      {
        header: t("fields.status"),
        accessor: "isActive",
        width: "10%",
        render: (category) =>
          category.isActive ? (
            <Badge
              color="success"
              icon={<LockOpenIcon className="w-3 h-3 mr-1" />}
            >
              {t("common.active")}
            </Badge>
          ) : (
            <Badge
              color="danger"
              icon={<LockClosedIcon className="w-3 h-3 mr-1" />}
            >
              {t("common.inactive")}
            </Badge>
          ),
      },
      {
        header: t("common.actions"),
        accessor: "actions",
        width: "20%",
        render: (category) => (
          <div className="flex space-x-2">
            <Tooltip content={t("categories.viewCategory")}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentCategory(category);
                  setIsViewModalOpen(true);
                }}
                className="p-1.5 bg-primary-50 rounded-full text-primary-600 hover:text-primary-900 hover:bg-primary-100 transition-colors"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
            </Tooltip>

            <Tooltip content={t("common.edit")}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentCategory(category);
                  setIsEditModalOpen(true);
                }}
                className="p-1.5 bg-secondary-50 rounded-full text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-colors"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
            </Tooltip>

            <Tooltip
              content={
                category.isActive
                  ? t("categories.deactivateCategory")
                  : t("categories.activateCategory")
              }
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentCategory(category);
                  setIsStatusModalOpen(true);
                }}
                className={`p-1.5 rounded-full transition-colors ${
                  category.isActive
                    ? "bg-warning-50 text-warning-600 hover:text-warning-900 hover:bg-warning-100"
                    : "bg-success-50 text-success-600 hover:text-success-900 hover:bg-success-100"
                }`}
              >
                {category.isActive ? (
                  <LockClosedIcon className="w-5 h-5" />
                ) : (
                  <LockOpenIcon className="w-5 h-5" />
                )}
              </button>
            </Tooltip>

            <Tooltip content={t("common.delete")}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentCategory(category);
                  setIsDeleteModalOpen(true);
                }}
                className="p-1.5 bg-danger-50 rounded-full text-danger-600 hover:text-danger-900 hover:bg-danger-100 transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ],
    [t]
  );

  // Page sizes dropdown options
  const pageSizeOptions = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 25, label: "25" },
    { value: 50, label: "50" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              {t("categories.categoryManagement")}
            </h1>
            <p className="mt-1 text-secondary-500">
              {t("categories.categoriesList")}{" "}
              {totalItems > 0 && `(${totalItems})`}
            </p>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="sm:self-end"
            icon={<PlusIcon className="w-5 h-5 mr-2" />}
          >
            {t("categories.addCategory")}
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

        {/* Search and filters - Enhanced version */}
        <Card className="mb-6 overflow-visible">
          <div className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search box with improved styling */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  type="text"
                  placeholder={t("categories.searchCategories")}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 shadow-sm"
                />
                {isFetching && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Spinner size="sm" />
                  </div>
                )}
              </div>

              {/* Controls group with improved layout and dropdown positioning */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Status filter with enhanced styling */}
                <div className="flex items-center w-full sm:w-auto">
                  <FilterIcon className="w-5 h-5 text-secondary-400 mr-2 hidden sm:block" />
                  <div className="flex rounded-lg overflow-hidden border border-secondary-300 shadow-sm w-full sm:w-auto">
                    <button
                      onClick={() => handleActiveFilterChange(null)}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        activeFilter === null
                          ? "bg-primary-100 text-primary-800"
                          : "bg-white text-secondary-700 hover:bg-secondary-50"
                      }`}
                    >
                      {t("common.all")}
                    </button>
                    <button
                      onClick={() => handleActiveFilterChange(true)}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        activeFilter === true
                          ? "bg-primary-100 text-primary-800"
                          : "bg-white text-secondary-700 hover:bg-secondary-50"
                      }`}
                    >
                      {t("common.active")}
                    </button>
                    <button
                      onClick={() => handleActiveFilterChange(false)}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        activeFilter === false
                          ? "bg-primary-100 text-primary-800"
                          : "bg-white text-secondary-700 hover:bg-secondary-50"
                      }`}
                    >
                      {t("common.inactive")}
                    </button>
                  </div>
                </div>

                {/* Page size selector with fixed dropdown */}
                <div className="relative z-10 flex items-center w-full sm:w-auto">
                  <span className="text-sm font-medium text-secondary-600 mr-2">
                    {t("common.show")}:
                  </span>
                  <div className="w-24 h-full">
                    <Dropdown
                      options={pageSizeOptions}
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      menuPlacement="bottom"
                      className="shadow-sm"
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        control: (base) => ({
                          ...base,
                          minHeight: "38px",
                          borderColor: "#D1D5DB",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: "#9CA3AF",
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          zIndex: 9999,
                        }),
                      }}
                    />
                  </div>
                </div>

                {/* Refresh button with enhanced styling */}
                <Tooltip content={t("common.refresh")}>
                  <button
                    onClick={handleRefresh}
                    className="p-2 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-colors shadow-sm border border-secondary-200"
                    disabled={loading}
                  >
                    <RefreshIcon
                      className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                    />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </Card>

        {/* Categories table with enhanced features */}
        <Card className="overflow-hidden mb-6">
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <Spinner size="lg" />
            </div>
          )}

          <Table
            columns={columns}
            data={categories}
            isLoading={loading}
            noDataMessage={t("categories.noCategories")}
            onRowClick={(category) => {
              setCurrentCategory(category);
              setIsViewModalOpen(true);
            }}
            rowClassName={(category) =>
              `cursor-pointer transition-colors ${
                !category.isActive ? "bg-secondary-50" : ""
              }`
            }
            isStriped
            isBordered
            isHoverable
          />

          {/* Enhanced pagination with information */}
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border-t border-secondary-200">
            <div className="text-sm text-secondary-500 mb-4 md:mb-0">
              {t("common.showing")}{" "}
              <span className="font-medium">{categories.length}</span>{" "}
              {t("common.of")} <span className="font-medium">{totalItems}</span>{" "}
              {t("categories.categories")}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showFirstLast
                showPrevNext
              />
            )}
          </div>
        </Card>
      </div>

      {/* Add category modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t("categories.addCategory")}
        size="md"
      >
        <CategoryForm onSubmit={handleAddCategory} isLoading={loading} />
      </Modal>

      {/* Edit category modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t("categories.editCategory")}
        size="md"
      >
        <CategoryForm
          category={currentCategory}
          onSubmit={handleEditCategory}
          isLoading={loading}
          isEdit
        />
      </Modal>

      {/* View category modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={t("categories.categoryDetails")}
        size="md"
      >
        <CategoryView category={currentCategory} />

        <div className="flex justify-end mt-6 gap-3">
          <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
            {t("common.close")}
          </Button>

          {currentCategory && (
            <Button
              variant="primary"
              onClick={() => {
                setIsViewModalOpen(false);
                setIsEditModalOpen(true);
              }}
            >
              {t("common.edit")}
            </Button>
          )}
        </div>
      </Modal>

      {/* Delete category confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t("categories.deleteCategory")}
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
              onClick={handleDeleteCategory}
            >
              {t("common.delete")}
            </Button>
          </div>
        }
      >
        <div className="p-4 bg-danger-50 rounded-lg mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-danger-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0v-4a1 1 0 112 0zm0-4a1 1 0 10-2 0 1 1 0 002 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-danger-700">
                {t("categories.deleteCategoryConfirmation")}
              </p>
              {currentCategory && (
                <p className="mt-2 text-sm font-medium text-danger-800">
                  "{currentCategory.name}"
                </p>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Change status confirmation modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={
          currentCategory?.isActive
            ? t("categories.deactivateCategory")
            : t("categories.activateCategory")
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
              variant={currentCategory?.isActive ? "warning" : "success"}
              loading={loading}
              onClick={handleStatusChange}
            >
              {currentCategory?.isActive
                ? t("categories.deactivate")
                : t("categories.activate")}
            </Button>
          </div>
        }
      >
        <div
          className={`p-4 ${
            currentCategory?.isActive ? "bg-warning-50" : "bg-success-50"
          } rounded-lg mb-4`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className={`h-5 w-5 ${
                  currentCategory?.isActive
                    ? "text-warning-400"
                    : "text-success-400"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0v-4a1 1 0 112 0zm0-4a1 1 0 10-2 0 1 1 0 002 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p
                className={`text-sm ${
                  currentCategory?.isActive
                    ? "text-warning-700"
                    : "text-success-700"
                }`}
              >
                {t("categories.statusChangeConfirmation")}
              </p>
              {currentCategory && (
                <p
                  className={`mt-2 text-sm font-medium ${
                    currentCategory?.isActive
                      ? "text-warning-800"
                      : "text-success-800"
                  }`}
                >
                  "{currentCategory.name}"
                </p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Categories;
