import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";

// Layout
import DashboardLayout from "../../layouts/DashboardLayout";

// Components
import {
  Input,
  Button,
  Card,
  Alert,
  Table,
  Pagination,
  Modal,
  Tabs,
  Badge,
  Select,
} from "../../components/ui";

// Services
import userService from "../../services/userService";
import companyService from "../../services/companyService";

// Validation schemas
import { userSchema, userUpdateSchema } from "../../utils/userValidation";
import api from "../../services/api";

// User form component for adding/editing
const UserForm = ({
  user,
  onSubmit,
  isLoading,
  isEdit = false,
  userType = "user",
}) => {
  const { t } = useTranslation();

  // Use the appropriate schema based on if we're editing or adding
  const schema = isEdit ? userUpdateSchema : userSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      password: "",
      role: user?.role || userType,
      isActive: user?.isActive !== undefined ? user.isActive : true,
    },
  });

  // Watch role field
  const selectedRole = watch("role");

  // Reset form when user changes
  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      password: "",
      role: user?.role || userType,
      isActive: user?.isActive !== undefined ? user.isActive : true,
    });
  }, [user, reset, userType]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={t("fields.name")}
        placeholder={t("fields.name")}
        error={errors.name}
        register={register}
        name="name"
      />

      <Input
        type="email"
        label={t("fields.email")}
        placeholder={t("fields.email")}
        error={errors.email}
        register={register}
        name="email"
      />

      <Input
        label={t("fields.phone")}
        placeholder={t("fields.phone")}
        error={errors.phone}
        register={register}
        name="phone"
      />

      <Input
        label={t("fields.address")}
        placeholder={t("fields.address")}
        error={errors.address}
        register={register}
        name="address"
      />

      {/* Password field (required for new users, optional for editing) */}
      <Input
        type="password"
        label={t("fields.password")}
        placeholder={
          isEdit
            ? t("fields.password") + " (" + t("common.optional") + ")"
            : t("fields.password")
        }
        error={errors.password}
        register={register}
        name="password"
      />

      {/* Role select field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          {t("fields.role")}
        </label>
        <select
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 border-secondary-300"
          {...register("role")}
        >
          <option value="user">{t("users.userRoles.user")}</option>
          <option value="company">{t("users.userRoles.company")}</option>
          <option value="admin">{t("users.userRoles.admin")}</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-danger-500">
            {t(errors.role.message)}
          </p>
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
          {isEdit ? t("common.save") : t("users.addUser")}
        </Button>
      </div>
    </form>
  );
};

// Company form component for adding/editing
const CompanyForm = ({ company, onSubmit, isLoading, isEdit = false }) => {
  const { t } = useTranslation();

  // Use the appropriate schema based on if we're editing or adding
  const schema = isEdit ? userUpdateSchema : userSchema; // You might want to create a specific schema for companies

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: company?.name || "",
      email: company?.email || "",
      phone: company?.phone || "",
      address: company?.address || "",
      password: "",
      isActive: company?.isActive !== undefined ? company.isActive : true,
    },
  });

  // Reset form when company changes
  useEffect(() => {
    reset({
      name: company?.name || "",
      email: company?.email || "",
      phone: company?.phone || "",
      address: company?.address || "",
      password: "",
      isActive: company?.isActive !== undefined ? company.isActive : true,
    });
  }, [company, reset]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      address: e.target.address.value,
      password: e.target.password.value,
      isActive: e.target.isActive.checked,
    };
    // If the password is empty, remove it from the data
    if (!data.password) {
      delete data.password;
    }
    console.log("data =>", data);

    console.log("Company form submitted with data:", data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <Input
        label={t("fields.name")}
        placeholder={t("fields.companyName")}
        error={errors.name}
        register={register}
        name="name"
      />

      <Input
        type="email"
        label={t("fields.email")}
        placeholder={t("fields.email")}
        error={errors.email}
        register={register}
        name="email"
      />

      <Input
        label={t("fields.phone")}
        placeholder={t("fields.phone")}
        error={errors.phone}
        register={register}
        name="phone"
      />

      <Input
        label={t("fields.address")}
        placeholder={t("fields.address")}
        error={errors.address}
        register={register}
        name="address"
      />

      {/* Password field (required for new companies, optional for editing) */}
      <Input
        type="password"
        label={t("fields.password")}
        placeholder={
          isEdit
            ? t("fields.password") + " (" + t("common.optional") + ")"
            : t("fields.password")
        }
        error={errors.password}
        register={register}
        name="password"
      />

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
          {isEdit ? t("common.save") : t("companies.addCompany")}
        </Button>
      </div>
    </form>
  );
};

// User/Company view component
const EntityView = ({ entity, entityType }) => {
  const { t } = useTranslation();

  if (!entity) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-secondary-500">
            {t("fields.name")}
          </h3>
          <p className="mt-1 text-sm text-secondary-900">{entity.name}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-secondary-500">
            {t("fields.email")}
          </h3>
          <p className="mt-1 text-sm text-secondary-900">{entity.email}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-secondary-500">
            {t("fields.phone")}
          </h3>
          <p className="mt-1 text-sm text-secondary-900">{entity.phone}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-secondary-500">
            {t("fields.address")}
          </h3>
          <p className="mt-1 text-sm text-secondary-900">{entity.address}</p>
        </div>

        {entityType === "user" && (
          <div>
            <h3 className="text-sm font-medium text-secondary-500">
              {t("fields.role")}
            </h3>
            <p className="mt-1 text-sm text-secondary-900">
              {t(`users.userRoles.${entity.role}`)}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-secondary-500">
            {t("fields.status")}
          </h3>
          <p className="mt-1 text-sm">
            {entity.isActive ? (
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
      </div>
    </div>
  );
};

// Main users page component
const Users = () => {
  const { t } = useTranslation();

  // State for active tab
  const [activeTab, setActiveTab] = useState("users");

  // State variables for users
  const [users, setUsers] = useState([]);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);

  // State variables for companies
  const [companies, setCompanies] = useState([]);
  const [companiesTotalPages, setCompaniesTotalPages] = useState(1);
  const [companiesCurrentPage, setCompaniesCurrentPage] = useState(1);

  // State variables for company users
  const [companyUsers, setCompanyUsers] = useState([]);
  const [companyUsersLoading, setCompanyUsersLoading] = useState(false);
  const [isCompanyUsersModalOpen, setIsCompanyUsersModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Common state variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Current entity being edited/viewed/deleted
  const [currentEntity, setCurrentEntity] = useState(null);

  // Search terms
  const [usersSearchTerm, setUsersSearchTerm] = useState("");
  const [companiesSearchTerm, setCompaniesSearchTerm] = useState("");

  // Filter states
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch users on component mount and when page or search changes
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [usersCurrentPage, activeTab]);

  // Fetch companies on component mount and when page or search changes
  useEffect(() => {
    if (activeTab === "companies") {
      fetchCompanies();
    }
  }, [companiesCurrentPage, activeTab]);

  // Create debounced search functions
  const debouncedUserSearch = debounce(() => {
    if (activeTab === "users") {
      setUsersCurrentPage(1);
      fetchUsers();
    }
  }, 500);

  const debouncedCompanySearch = debounce(() => {
    if (activeTab === "companies") {
      setCompaniesCurrentPage(1);
      fetchCompanies();
    }
  }, 500);

  // Effect for user search
  useEffect(() => {
    debouncedUserSearch();
    return () => debouncedUserSearch.cancel();
  }, [usersSearchTerm, userRoleFilter, statusFilter]);

  // Effect for company search
  useEffect(() => {
    debouncedCompanySearch();
    return () => debouncedCompanySearch.cancel();
  }, [companiesSearchTerm, statusFilter]);

  // Function to fetch company users
  const fetchCompanyUsers = async (companyId) => {
    setCompanyUsersLoading(true);
    setError(null);

    try {
      const response = await api.get(`/admin/companies/${companyId}/users`);
      setCompanyUsers(response.data.users || []);
    } catch (err) {
      console.error("Error fetching company users:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setCompanyUsersLoading(false);
    }
  };

  // Handle view company users
  const handleViewCompanyUsers = (company) => {
    setSelectedCompany(company);
    fetchCompanyUsers(company._id);
    setIsCompanyUsersModalOpen(true);
  };

  // Function to fetch users with pagination and search
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query params
      const queryParams = new URLSearchParams({
        page: usersCurrentPage,
        limit: 10,
      });

      if (usersSearchTerm) {
        queryParams.append("search", usersSearchTerm);
      }

      if (userRoleFilter !== "all") {
        queryParams.append("role", userRoleFilter);
      }

      if (statusFilter !== "all") {
        queryParams.append("active", statusFilter === "active");
      }

      const response = await userService.getAllUsers(queryParams.toString());
      setUsers(response.data.users);
      setUsersTotalPages(response.totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch companies with pagination and search
  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query params
      const queryParams = new URLSearchParams({
        page: companiesCurrentPage,
        limit: 10,
      });

      if (companiesSearchTerm) {
        queryParams.append("search", companiesSearchTerm);
      }

      if (statusFilter !== "all") {
        queryParams.append("isActive", statusFilter === "active");
      }

      const response = await companyService.getAllCompanies(
        queryParams.toString()
      );
      setCompanies(response.data.companies);
      setCompaniesTotalPages(response.totalPages);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handleUserPageChange = (page) => {
    setUsersCurrentPage(page);
  };

  const handleCompanyPageChange = (page) => {
    setCompaniesCurrentPage(page);
  };

  // Handle add user
  const handleAddUser = async (data) => {
    setLoading(true);
    setError(null);

    try {
      await userService.createUser(data);
      setSuccess("users.userAdded");
      setIsAddModalOpen(false);
      fetchUsers();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding user:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle add company
  const handleAddCompany = async (data) => {
    setLoading(true);
    setError(null);

    try {
      await companyService.createCompany(data);
      setSuccess("companies.companyAdded");
      setIsAddModalOpen(false);
      fetchCompanies();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding company:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit user
  const handleEditUser = async (data) => {
    if (!currentEntity) return;

    setLoading(true);
    setError(null);

    try {
      // If password is empty, remove it from the data
      if (!data.password) {
        delete data.password;
      }

      await userService.updateUser(currentEntity._id, data);
      setSuccess("users.userUpdated");
      setIsEditModalOpen(false);
      fetchUsers();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit company
  const handleEditCompany = async (data) => {
    if (!currentEntity) return;

    setLoading(true);
    setError(null);

    try {
      // If password is empty, remove it from the data
      if (!data.password) {
        delete data.password;
      }

      await companyService.updateCompany(currentEntity._id, data);
      setSuccess("companies.companyUpdated");
      setIsEditModalOpen(false);
      fetchCompanies();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating company:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!currentEntity) return;

    setLoading(true);
    setError(null);

    try {
      await userService.deleteUser(currentEntity._id);
      setSuccess("users.userDeleted");
      setIsDeleteModalOpen(false);
      fetchUsers();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete company
  const handleDeleteCompany = async () => {
    if (!currentEntity) return;

    setLoading(true);
    setError(null);

    try {
      await companyService.deleteCompany(currentEntity._id);
      setSuccess("companies.companyDeleted");
      setIsDeleteModalOpen(false);
      fetchCompanies();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting company:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle status change for user
  const handleUserStatusChange = async () => {
    if (!currentEntity) return;

    setLoading(true);
    setError(null);

    try {
      await userService.changeUserStatus(
        currentEntity._id,
        !currentEntity.isActive
      );
      setSuccess("users.statusChanged");
      setIsStatusModalOpen(false);
      fetchUsers();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error changing user status:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle status change for company
  const handleCompanyStatusChange = async () => {
    if (!currentEntity) return;

    setLoading(true);
    setError(null);

    try {
      await companyService.changeCompanyStatus(
        currentEntity._id,
        !currentEntity.isActive
      );
      setSuccess("companies.statusChanged");
      setIsStatusModalOpen(false);
      fetchCompanies();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error changing company status:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle search inputs
  const handleUserSearch = (e) => {
    setUsersSearchTerm(e.target.value);
  };

  const handleCompanySearch = (e) => {
    setCompaniesSearchTerm(e.target.value);
  };

  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    setUserRoleFilter(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // User table columns configuration
  const userColumns = [
    {
      header: t("fields.name"),
      accessor: "name",
      width: "20%",
    },
    {
      header: t("fields.email"),
      accessor: "email",
      width: "25%",
    },
    {
      header: t("fields.phone"),
      accessor: "phone",
      width: "15%",
    },
    {
      header: t("fields.role"),
      accessor: "role",
      width: "10%",
      render: (user) => (
        <Badge
          variant={
            user.role === "admin"
              ? "primary"
              : user.role === "company"
              ? "warning"
              : "secondary"
          }
        >
          {t(`users.userRoles.${user.role}`)}
        </Badge>
      ),
    },
    {
      header: t("fields.status"),
      accessor: "isActive",
      width: "10%",
      render: (user) =>
        user.isActive ? (
          <Badge variant="success">{t("common.active")}</Badge>
        ) : (
          <Badge variant="danger">{t("common.inactive")}</Badge>
        ),
    },
    {
      header: t("common.actions"),
      accessor: "actions",
      width: "20%",
      render: (user) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentEntity(user);
              setIsViewModalOpen(true);
            }}
            className="p-1 text-primary-600 hover:text-primary-900"
            title={t("users.viewUser")}
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
              setCurrentEntity(user);
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
              setCurrentEntity(user);
              setIsStatusModalOpen(true);
            }}
            className={`p-1 ${
              user.isActive
                ? "text-warning-600 hover:text-warning-900"
                : "text-success-600 hover:text-success-900"
            }`}
            title={
              user.isActive
                ? t("users.deactivateUser")
                : t("users.activateUser")
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
              setCurrentEntity(user);
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

  // Company table columns configuration
  const companyColumns = [
    {
      header: t("fields.name"),
      accessor: "name",
      width: "20%",
    },
    {
      header: t("fields.email"),
      accessor: "email",
      width: "20%",
    },
    {
      header: t("fields.phone"),
      accessor: "phone",
      width: "15%",
    },
    {
      header: t("fields.status"),
      accessor: "isActive",
      width: "15%",
      render: (company) =>
        company.isActive ? (
          <Badge variant="success">{t("common.active")}</Badge>
        ) : (
          <Badge variant="danger">{t("common.inactive")}</Badge>
        ),
    },
    {
      header: t("common.actions"),
      accessor: "actions",
      width: "30%",
      render: (company) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentEntity(company);
              setIsViewModalOpen(true);
            }}
            className="p-1 text-primary-600 hover:text-primary-900"
            title={t("companies.viewCompany")}
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
              setCurrentEntity(company);
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

          {/* New button for viewing company users */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewCompanyUsers(company);
            }}
            className="p-1 text-indigo-600 hover:text-indigo-900"
            title={t("companies.viewCompanyUsers")}
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentEntity(company);
              setIsStatusModalOpen(true);
            }}
            className={`p-1 ${
              company.isActive
                ? "text-warning-600 hover:text-warning-900"
                : "text-success-600 hover:text-success-900"
            }`}
            title={
              company.isActive
                ? t("companies.deactivateCompany")
                : t("companies.activateCompany")
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
              setCurrentEntity(company);
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

  // Company users columns configuration
  const companyUsersColumns = [
    {
      header: t("fields.name"),
      accessor: "name",
      width: "25%",
    },
    {
      header: t("fields.email"),
      accessor: "email",
      width: "30%",
    },
    {
      header: t("fields.phone"),
      accessor: "phone",
      width: "20%",
    },
    {
      header: t("fields.status"),
      accessor: "isActive",
      width: "15%",
      render: (user) =>
        user.isActive ? (
          <Badge variant="success">{t("common.active")}</Badge>
        ) : (
          <Badge variant="danger">{t("common.inactive")}</Badge>
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
              {activeTab === "users"
                ? t("users.userManagement")
                : t("companies.companyManagement")}
            </h1>
            <p className="mt-1 text-secondary-500">
              {activeTab === "users"
                ? t("users.usersList")
                : t("companies.companiesList")}
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
            {activeTab === "users"
              ? t("users.addUser")
              : t("companies.addCompany")}
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

        {/* Tabs navigation */}
        <Tabs
          tabs={[
            { id: "users", label: t("users.users") },
            { id: "companies", label: t("companies.companies") },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        {/* Users Tab Content */}
        {activeTab === "users" && (
          <>
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="relative flex-1">
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
                  placeholder={t("users.searchUsers")}
                  value={usersSearchTerm}
                  onChange={handleUserSearch}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Role filter */}
              <div className="w-full sm:w-48">
                <Select
                  placeholder={t("users.filterByRole")}
                  value={userRoleFilter}
                  onChange={handleRoleFilterChange}
                  options={[
                    { value: "all", label: t("common.all") },
                    { value: "user", label: t("users.userRoles.user") },
                    { value: "company", label: t("users.userRoles.company") },
                    { value: "admin", label: t("users.userRoles.admin") },
                  ]}
                />
              </div>

              {/* Status filter */}
              <div className="w-full sm:w-48">
                <Select
                  placeholder={t("users.filterByStatus")}
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  options={[
                    { value: "all", label: t("common.all") },
                    { value: "active", label: t("common.active") },
                    { value: "inactive", label: t("common.inactive") },
                  ]}
                />
              </div>
            </div>

            {/* Users table */}
            <Card className="overflow-hidden mb-6">
              <Table
                columns={userColumns}
                data={users}
                isLoading={loading}
                noDataMessage={t("common.noData")}
                onRowClick={(user) => {
                  setCurrentEntity(user);
                  setIsViewModalOpen(true);
                }}
              />

              {/* Pagination */}
              {usersTotalPages > 1 && (
                <Pagination
                  currentPage={usersCurrentPage}
                  totalPages={usersTotalPages}
                  onPageChange={handleUserPageChange}
                />
              )}
            </Card>
          </>
        )}

        {/* Companies Tab Content */}
        {activeTab === "companies" && (
          <>
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="relative flex-1">
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
                  placeholder={t("companies.searchCompanies")}
                  value={companiesSearchTerm}
                  onChange={handleCompanySearch}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Status filter */}
              <div className="w-full sm:w-48">
                <Select
                  placeholder={t("companies.filterByStatus")}
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  options={[
                    { value: "all", label: t("common.all") },
                    { value: "active", label: t("common.active") },
                    { value: "inactive", label: t("common.inactive") },
                  ]}
                />
              </div>
            </div>

            {/* Companies table */}
            <Card className="overflow-hidden mb-6">
              <Table
                columns={companyColumns}
                data={companies}
                isLoading={loading}
                noDataMessage={t("common.noData")}
                onRowClick={(company) => {
                  setCurrentEntity(company);
                  setIsViewModalOpen(true);
                }}
              />

              {/* Pagination */}
              {companiesTotalPages > 1 && (
                <Pagination
                  currentPage={companiesCurrentPage}
                  totalPages={companiesTotalPages}
                  onPageChange={handleCompanyPageChange}
                />
              )}
            </Card>
          </>
        )}
      </div>

      {/* Add user modal */}
      <Modal
        isOpen={isAddModalOpen && activeTab === "users"}
        onClose={() => setIsAddModalOpen(false)}
        title={t("users.addUser")}
        size="md"
      >
        <UserForm onSubmit={handleAddUser} isLoading={loading} />
      </Modal>

      {/* Add company modal */}
      <Modal
        isOpen={isAddModalOpen && activeTab === "companies"}
        onClose={() => {
          setIsAddModalOpen(false);
          setCurrentEntity(null);
        }}
        title={t("companies.addCompany")}
        size="md"
      >
        <CompanyForm
          onSubmit={(formData) => {
            console.log("Form data for adding company:", formData);
            handleAddCompany(formData);
          }}
          isLoading={loading}
        />
      </Modal>

      {/* Edit user modal */}
      <Modal
        isOpen={isEditModalOpen && activeTab === "users"}
        onClose={() => setIsEditModalOpen(false)}
        title={t("users.editUser")}
        size="md"
      >
        <UserForm
          user={currentEntity}
          onSubmit={handleEditUser}
          isLoading={loading}
          isEdit
        />
      </Modal>

      {/* Edit company modal */}
      <Modal
        isOpen={isEditModalOpen && activeTab === "companies"}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentEntity(null);
        }}
        title={t("companies.editCompany")}
        size="md"
      >
        <CompanyForm
          company={currentEntity}
          onSubmit={(formData) => {
            console.log("Form data for editing company:", formData);
            handleEditCompany(formData);
          }}
          isLoading={loading}
          isEdit
        />
      </Modal>

      {/* View user modal */}
      <Modal
        isOpen={isViewModalOpen && activeTab === "users"}
        onClose={() => setIsViewModalOpen(false)}
        title={t("users.userDetails")}
        size="md"
      >
        <EntityView entity={currentEntity} entityType="user" />
      </Modal>

      {/* View company modal */}
      <Modal
        isOpen={isViewModalOpen && activeTab === "companies"}
        onClose={() => setIsViewModalOpen(false)}
        title={t("companies.companyDetails")}
        size="md"
      >
        <EntityView entity={currentEntity} entityType="company" />
      </Modal>

      {/* Delete user confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen && activeTab === "users"}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t("users.deleteUser")}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant="danger"
              loading={loading}
              onClick={handleDeleteUser}
            >
              {t("common.delete")}
            </Button>
          </div>
        }
      >
        <p className="text-secondary-700">
          {t("users.deleteUserConfirmation")}
        </p>
      </Modal>

      {/* Delete company confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen && activeTab === "companies"}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t("companies.deleteCompany")}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant="danger"
              loading={loading}
              onClick={handleDeleteCompany}
            >
              {t("common.delete")}
            </Button>
          </div>
        }
      >
        <p className="text-secondary-700">
          {t("companies.deleteCompanyConfirmation")}
        </p>
      </Modal>

      {/* Change user status confirmation modal */}
      <Modal
        isOpen={isStatusModalOpen && activeTab === "users"}
        onClose={() => setIsStatusModalOpen(false)}
        title={
          currentEntity?.isActive
            ? t("users.deactivateUser")
            : t("users.activateUser")
        }
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsStatusModalOpen(false)}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant={currentEntity?.isActive ? "warning" : "success"}
              loading={loading}
              onClick={handleUserStatusChange}
            >
              {currentEntity?.isActive
                ? t("users.deactivateUser")
                : t("users.activateUser")}
            </Button>
          </div>
        }
      >
        <p className="text-secondary-700">
          {t("users.statusChangeConfirmation")}
        </p>
      </Modal>

      {/* Change company status confirmation modal */}
      <Modal
        isOpen={isStatusModalOpen && activeTab === "companies"}
        onClose={() => setIsStatusModalOpen(false)}
        title={
          currentEntity?.isActive
            ? t("companies.deactivateCompany")
            : t("companies.activateCompany")
        }
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsStatusModalOpen(false)}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant={currentEntity?.isActive ? "warning" : "success"}
              loading={loading}
              onClick={handleCompanyStatusChange}
            >
              {currentEntity?.isActive
                ? t("companies.deactivateCompany")
                : t("companies.activateCompany")}
            </Button>
          </div>
        }
      >
        <p className="text-secondary-700">
          {t("companies.statusChangeConfirmation")}
        </p>
      </Modal>

      {/* Company users modal */}
      <Modal
        isOpen={isCompanyUsersModalOpen}
        onClose={() => setIsCompanyUsersModalOpen(false)}
        title={
          selectedCompany
            ? `${t("companies.companyUsers")} - ${selectedCompany.name}`
            : t("companies.companyUsers")
        }
        size="lg"
      >
        <Card className="overflow-hidden">
          <Table
            columns={companyUsersColumns}
            data={companyUsers}
            isLoading={companyUsersLoading}
            noDataMessage={t("companies.noCompanyUsers")}
          />
        </Card>
      </Modal>
    </DashboardLayout>
  );
};

export default Users;
