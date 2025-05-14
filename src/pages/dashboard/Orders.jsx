import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";

// Services
import orderService from "../../services/orderService";

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
  Badge,
} from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

// Main orders page component
const Orders = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State variables
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [companies, setCompanies] = useState([]);

  // New state for expanded rows
  const [expandedRows, setExpandedRows] = useState({});

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Current order being viewed/updated
  const [currentOrder, setCurrentOrder] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [sortBy, setSortBy] = useState("-createdAt");

  const userRole = user?.role || "user";

  // Status values for form selection
  const orderStatusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const paymentStatusOptions = ["pending", "completed", "failed"];
  const paymentMethodOptions = ["cash_on_delivery", "payment_gateway"];
  const activeOptions = [
    { value: "", label: "All" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  // Form states for modals
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [newPaymentTransactionId, setNewPaymentTransactionId] = useState("");

  // Create a debounced version of fetchOrders for search
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      fetchOrders({ search: searchValue });
    }, 500),
    []
  );

  // Fetch orders and stats on component mount
  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
    if (userRole === "admin") {
      fetchCompanies();
    }
  }, [currentPage, user]);

  // Function to fetch companies
  const fetchCompanies = async () => {
    try {
      const response = await orderService.getCompanies();
      setCompanies(response.data.users || []);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  // Function to fetch order statistics
  const fetchOrderStats = async () => {
    try {
      const response = await orderService.getOrderStats();
      setOrderStats(response.data.stats);
    } catch (err) {
      console.error("Error fetching order stats:", err);
      // Don't set error since this is not critical for the main functionality
    }
  };

  // Function to fetch orders with pagination and filters
  const fetchOrders = async (additionalFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const filters = {
        status: statusFilter || undefined,
        paymentMethod: paymentMethodFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
        search: searchTerm || undefined,
        company:
          companyFilter || (userRole === "company" ? user.id : undefined),
        active: activeFilter || undefined,
        sort: sortBy || undefined,
        ...additionalFilters,
      };

      const response = await orderService.getAllOrders(
        currentPage,
        10,
        filters
      );

      console.log("Enhanced order data:", response);

      setOrders(response.data.orders);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Error fetching orders:", err);
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
    fetchOrders();
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPaymentMethodFilter("");
    setPaymentStatusFilter("");
    setCompanyFilter("");
    setActiveFilter("");
    setSortBy("-createdAt");
    setCurrentPage(1);
    fetchOrders({
      search: "",
      status: "",
      paymentMethod: "",
      paymentStatus: "",
      company: "",
      active: "",
      sort: "-createdAt",
    });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle order status change
  const handleStatusChange = async () => {
    if (!currentOrder || !newOrderStatus) return;

    setLoading(true);
    setError(null);

    try {
      await orderService.updateOrderStatus(currentOrder._id, newOrderStatus);
      setSuccess("orders.statusChanged");
      setIsStatusModalOpen(false);
      fetchOrders();
      fetchOrderStats();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error changing order status:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle payment status change
  const handlePaymentChange = async () => {
    if (!currentOrder || !newPaymentStatus) return;

    setLoading(true);
    setError(null);

    try {
      await orderService.updatePaymentStatus(currentOrder._id, {
        paymentStatus: newPaymentStatus,
        paymentTransactionId: newPaymentTransactionId,
      });
      setSuccess("orders.paymentStatusChanged");
      setIsPaymentModalOpen(false);
      fetchOrders();
      fetchOrderStats();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error changing payment status:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!currentOrder) return;

    setLoading(true);
    setError(null);

    try {
      await orderService.cancelOrder(currentOrder._id);
      setSuccess("orders.orderCancelled");
      setIsCancelModalOpen(false);
      fetchOrders();
      fetchOrderStats();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError(err.response?.data?.message || "errors.generic");
    } finally {
      setLoading(false);
    }
  };

  // Toggle expanded row
  const toggleExpandedRow = (orderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
  };

  // Handle payment method filter change
  const handlePaymentMethodFilterChange = (e) => {
    const value = e.target.value;
    setPaymentMethodFilter(value);
  };

  // Handle payment status filter change
  const handlePaymentStatusFilterChange = (e) => {
    const value = e.target.value;
    setPaymentStatusFilter(value);
  };

  // Handle company filter change
  const handleCompanyFilterChange = (e) => {
    const value = e.target.value;
    setCompanyFilter(value);
  };

  // Handle active filter change
  const handleActiveFilterChange = (e) => {
    const value = e.target.value;
    setActiveFilter(value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
  };

  // Format price with currency symbol
  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge class based on order status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning-100 text-warning-800";
      case "processing":
        return "bg-info-100 text-info-800";
      case "shipped":
        return "bg-primary-100 text-primary-800";
      case "delivered":
        return "bg-success-100 text-success-800";
      case "cancelled":
        return "bg-danger-100 text-danger-800";
      default:
        return "bg-secondary-100 text-secondary-800";
    }
  };

  // Get payment status badge class
  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-success-100 text-success-800";
      case "pending":
        return "bg-warning-100 text-warning-800";
      case "failed":
        return "bg-danger-100 text-danger-800";
      default:
        return "bg-secondary-100 text-secondary-800";
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "payment_gateway":
        return (
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
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            ></path>
          </svg>
        );
      case "cash_on_delivery":
        return (
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
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
        );
      default:
        return null;
    }
  };

  // Calculate progress percentage for order status
  const getOrderStatusProgress = (status) => {
    const statusMap = {
      pending: 0,
      processing: 25,
      shipped: 75,
      delivered: 100,
      cancelled: 0,
    };
    return statusMap[status] || 0;
  };

  // Summarize order items (e.g., "3 items: Water Cooler (2), Bottle (1)")
  const summarizeOrderItems = (items) => {
    if (!items || items.length === 0) return "No items";

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    // Get names of up to 2 products to show in the summary
    const productSummary = items
      .filter((item) => item.product)
      .slice(0, 2)
      .map((item) => `${item.product.name.split(" ")[0]} (${item.quantity})`)
      .join(", ");

    // If there are more than 2 products, add ellipsis
    const hasMore = items.length > 2 ? ` + ${items.length - 2} more` : "";

    return `${totalItems} item${
      totalItems > 1 ? "s" : ""
    }: ${productSummary}${hasMore}`;
  };

  // Calculate time elapsed since order was created
  const getTimeElapsed = (dateString) => {
    const orderDate = new Date(dateString);
    const now = new Date();
    const diffInMs = now - orderDate;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${
        Math.floor(diffInHours) !== 1 ? "s" : ""
      } ago`;
    } else {
      const diffInDays = diffInHours / 24;
      return `${Math.floor(diffInDays)} day${
        Math.floor(diffInDays) !== 1 ? "s" : ""
      } ago`;
    }
  };

  // Prepare order for view/update modals
  const prepareOrderForModal = (order) => {
    setCurrentOrder(order);
    setNewOrderStatus(order.orderStatus);
    setNewPaymentStatus(order.paymentStatus);
    setNewPaymentTransactionId(order.paymentTransactionId || "");
  };

  // Enhanced table columns configuration
  const columns = [
    {
      header: t("orders.orderInfo"),
      accessor: "id",
      width: "40%",
      render: (order) => (
        <div className="flex items-start gap-3">
          <div className="flex flex-col">
            {/* Order number and expand/collapse button */}
            <div className="flex items-center mb-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpandedRow(order._id);
                }}
                className="p-1 mx-2 text-secondary-500 hover:text-secondary-700 transition-all duration-200"
              >
                <svg
                  className={`w-5 h-5 transform transition-transform duration-200 ${
                    expandedRows[order._id] ? "rotate-90" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <span className="font-medium text-secondary-900 truncate w-32 md:w-auto">
                #{order._id.substr(order._id.length - 8)}
              </span>
              {order.notes && (
                <span
                  className="ml-2 text-info-500 cursor-help"
                  title={order.notes}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              )}
            </div>

            {/* Customer info */}
            <div className="flex items-center mb-1">
              <svg
                className="w-4 h-4 mr-1 text-secondary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-sm text-secondary-700">
                {order.user?.name || t("orders.guestUser")}
              </span>
            </div>

            {/* Date info */}
            <div className="flex text-sm text-secondary-500">
              <svg
                className="w-4 h-4 mr-1 text-secondary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="mx-2">{formatDate(order.createdAt)}</span>
              <span className="italic">
                ({getTimeElapsed(order.createdAt)})
              </span>
            </div>

            {/* Items summary */}
            <div className="mt-1 text-sm text-secondary-600">
              {summarizeOrderItems(order.items)}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: t("orders.status"),
      accessor: "orderStatus",
      width: "20%",
      render: (order) => (
        <div className="flex flex-col space-y-2">
          {/* Status badge */}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center ${getStatusBadgeClass(
              order.orderStatus
            )}`}
          >
            {t(`orders.statuses.${order.orderStatus}`)}
          </span>

          {/* Progress bar for order status */}
          {order.orderStatus !== "cancelled" && (
            <div className="w-full bg-secondary-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  order.orderStatus === "delivered"
                    ? "bg-success-500"
                    : order.orderStatus === "shipped"
                    ? "bg-primary-500"
                    : "bg-info-500"
                }`}
                style={{
                  width: `${getOrderStatusProgress(order.orderStatus)}%`,
                }}
              ></div>
            </div>
          )}

          {/* Delivery address preview */}
          <div className="text-xs text-secondary-500 truncate max-w-[200px]">
            <svg
              className="w-3 h-3 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {order.shippingAddress.split(",")[0]}
          </div>
        </div>
      ),
    },
    {
      header: t("orders.payment"),
      accessor: "payment",
      width: "20%",
      render: (order) => (
        <div className="flex flex-col space-y-2">
          {/* Payment method with icon */}
          <div className="flex items-center text-sm text-secondary-700">
            <span className="mx-2">
              {getPaymentMethodIcon(order.paymentMethod)}
            </span>
            <span>{t(`orders.paymentMethods.${order.paymentMethod}`)}</span>
          </div>

          {/* Payment status with animated badge */}
          <div className="flex items-center">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${getPaymentStatusBadgeClass(
                order.paymentStatus
              )} ${order.paymentStatus === "pending" ? "animate-pulse" : ""}`}
            >
              {order.paymentStatus === "completed" && (
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {order.paymentStatus === "failed" && (
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              {order.paymentStatus === "pending" && (
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {t(`orders.paymentStatuses.${order.paymentStatus}`)}
            </span>
          </div>

          {/* Transaction ID (shortened) */}
          {order.paymentTransactionId && (
            <div className="text-xs text-secondary-500">
              <span title={order.paymentTransactionId} className="cursor-help">
                ID: {order.paymentTransactionId.substr(0, 8)}...
              </span>
            </div>
          )}

          {/* Total amount with highlighting */}
          <div className="text-base font-bold text-secondary-900">
            {formatPrice(order.totalAmount)}
          </div>
        </div>
      ),
    },
    {
      header: t("common.actions"),
      accessor: "actions",
      width: "20%",
      render: (order) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              prepareOrderForModal(order);
              setIsViewModalOpen(true);
            }}
            className="p-2 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors duration-200"
            title={t("orders.viewOrder")}
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
              prepareOrderForModal(order);
              setIsStatusModalOpen(true);
            }}
            className="p-2 rounded-full bg-info-50 text-info-600 hover:bg-info-100 transition-colors duration-200"
            title={t("orders.updateStatus")}
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prepareOrderForModal(order);
              setIsPaymentModalOpen(true);
            }}
            className="p-2 rounded-full bg-success-50 text-success-600 hover:bg-success-100 transition-colors duration-200"
            title={t("orders.updatePayment")}
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          {order.orderStatus === "pending" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prepareOrderForModal(order);
                setIsCancelModalOpen(true);
              }}
              className="p-2 rounded-full bg-danger-50 text-danger-600 hover:bg-danger-100 transition-colors duration-200"
              title={t("orders.cancelOrder")}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      ),
    },
  ];

  // Render expanded row content
  const renderExpandedRowContent = (order) => {
    if (!expandedRows[order._id]) return null;

    return (
      <div className="px-4 py-4 bg-secondary-50 rounded-lg border-t border-secondary-200 overflow-x-auto">
        <div className="space-y-4">
          {/* Order items in a nice looking table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 text-sm">
              <thead className="bg-secondary-100">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    {t("orders.product")}
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    {t("orders.price")}
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    {t("orders.quantity")}
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    {t("orders.total")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-100">
                {order.items.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-secondary-50"}
                  >
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 mr-3 bg-secondary-100 rounded-full flex items-center justify-center">
                          {item.product ? (
                            <span className="text-xs text-secondary-700 font-medium">
                              {item.product.name.substring(0, 2)}
                            </span>
                          ) : (
                            <svg
                              className="h-4 w-4 text-secondary-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-secondary-900">
                            {item.product
                              ? item.product.name
                              : t("orders.unavailableProduct")}
                          </div>
                          <div className="text-xs text-secondary-500">
                            ID:{" "}
                            {item.product ? item.product._id.substr(-6) : "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary-100 text-secondary-800">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-secondary-100">
                  <td
                    colSpan="3"
                    className="px-3 py-2 text-right text-sm font-medium"
                  >
                    {t("orders.total")}
                  </td>
                  <td className="px-3 py-2 text-right text-sm font-bold">
                    {formatPrice(order.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Additional order details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {/* Shipping info */}
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="text-xs font-medium uppercase text-secondary-500 mb-2 border-b pb-1">
                {t("orders.shippingInfo")}
              </h4>
              <div className="space-y-1">
                <p className="flex items-start">
                  <svg
                    className="h-4 w-4 text-secondary-400 mr-1 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-secondary-700 break-words">
                    {order.shippingAddress}
                  </span>
                </p>
                <p className="flex items-center">
                  <svg
                    className="h-4 w-4 text-secondary-400 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-secondary-700">
                    {order.contactNumber}
                  </span>
                </p>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="text-xs font-medium uppercase text-secondary-500 mb-2 border-b pb-1">
                {t("orders.paymentInfo")}
              </h4>
              <div className="space-y-1">
                <p className="flex items-center">
                  <svg
                    className="h-4 w-4 text-secondary-400 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span className="text-secondary-700">
                    {t(`orders.paymentMethods.${order.paymentMethod}`)}
                  </span>
                </p>
                <p className="flex items-center">
                  <svg
                    className="h-4 w-4 text-secondary-400 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span
                    className={`text-sm ${
                      order.paymentStatus === "completed"
                        ? "text-success-600 font-medium"
                        : order.paymentStatus === "failed"
                        ? "text-danger-600"
                        : "text-warning-600"
                    }`}
                  >
                    {t(`orders.paymentStatuses.${order.paymentStatus}`)}
                  </span>
                </p>
                {order.paymentTransactionId && (
                  <p className="flex items-center">
                    <svg
                      className="h-4 w-4 text-secondary-400 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-secondary-700 text-xs font-mono">
                      {order.paymentTransactionId}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Customer info */}
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="text-xs font-medium uppercase text-secondary-500 mb-2 border-b pb-1">
                {t("orders.customerInfo")}
              </h4>
              <div className="space-y-1">
                <p className="flex items-center">
                  <svg
                    className="h-4 w-4 text-secondary-400 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-secondary-700">
                    {order.user ? order.user.name : t("orders.guestUser")}
                  </span>
                </p>
                {order.user && (
                  <p className="flex items-center">
                    <svg
                      className="h-4 w-4 text-secondary-400 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-secondary-700">
                      {order.user.email}
                    </span>
                  </p>
                )}
                {order.notes && (
                  <p className="flex items-start mt-2">
                    <svg
                      className="h-4 w-4 text-secondary-400 mr-1 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <span className="text-secondary-700 italic">
                      "{order.notes}"
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                prepareOrderForModal(order);
                setIsViewModalOpen(true);
              }}
            >
              {t("orders.viewDetails")}
            </Button>

            <Button
              variant={
                order.orderStatus === "delivered" ? "success" : "primary"
              }
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                prepareOrderForModal(order);
                setIsStatusModalOpen(true);
              }}
            >
              {t("orders.updateStatus")}
            </Button>

            {order.orderStatus === "pending" && (
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  prepareOrderForModal(order);
                  setIsCancelModalOpen(true);
                }}
              >
                {t("orders.cancelOrder")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">
              {t("orders.orderManagement")}
            </h1>
            <p className="mt-1 text-secondary-500">{t("orders.ordersList")}</p>
          </div>
        </div>

        {/* Enhanced Order Stats with animations and icons */}
        {orderStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-500">
                    {t("orders.totalOrders")}
                  </p>
                  <p className="text-xl font-bold">{orderStats.totalOrders}</p>
                  <div className="flex items-center mt-1 text-xs text-secondary-500">
                    <Badge color="primary" className="mx-2">
                      {orderStats.ordersByStatus?.find(
                        (s) => s.status === "pending"
                      )?.count || 0}{" "}
                      pending
                    </Badge>
                    <Badge color="success">
                      {orderStats.ordersByStatus?.find(
                        (s) => s.status === "delivered"
                      )?.count || 0}{" "}
                      delivered
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-success-100 text-success-600 mr-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-500">
                    {t("orders.totalRevenue")}
                  </p>
                  <p className="text-xl font-bold">
                    {formatPrice(orderStats.totalRevenue)}
                  </p>
                  <div className="w-full h-1 bg-secondary-100 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-success-500"
                      style={{
                        width: `${
                          (orderStats.paymentsByStatus?.find(
                            (s) => s.status === "completed"
                          )?.amount /
                            orderStats.totalRevenue) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-secondary-500 mt-1">
                    {Math.round(
                      (orderStats.paymentsByStatus?.find(
                        (s) => s.status === "completed"
                      )?.amount /
                        orderStats.totalRevenue) *
                        100
                    )}
                    % collected
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-info-100 text-info-600 mr-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-500">
                    {t("orders.avgOrderValue")}
                  </p>
                  <p className="text-xl font-bold">
                    {formatPrice(orderStats.avgOrderValue)}
                  </p>
                  <div className="flex items-center mt-1">
                    <svg
                      className="w-4 h-4 text-info-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span className="text-xs text-info-600 ml-1">
                      +12% vs previous period
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-warning-100 text-warning-600 mr-4 relative">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  {(orderStats.paymentsByStatus?.find(
                    (s) => s.status === "failed"
                  )?.count || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-danger-500 text-white text-xs font-bold rounded-full">
                      {orderStats.paymentsByStatus?.find(
                        (s) => s.status === "failed"
                      )?.count || 0}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-500">
                    {t("orders.paymentIssues")}
                  </p>
                  <p className="text-xl font-bold">
                    {orderStats.paymentsByStatus?.find(
                      (s) => s.status === "failed"
                    )?.count || 0}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-secondary-600">
                      {formatPrice(
                        orderStats.paymentsByStatus?.find(
                          (s) => s.status === "failed"
                        )?.amount || 0
                      )}{" "}
                      in failed payments
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

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

        {/* Filters Section - Updated to match the image */}
        <Card className="mb-6 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{t("common.filters")}</h3>
          </div>

          <div className={`${isFiltersExpanded ? "block" : "block"}`}>
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                {t("common.search")}
              </label>
              <Input
                type="text"
                placeholder={t("orders.searchPlaceholder")}
                value={searchTerm}
                onChange={handleSearchChange}
                icon={
                  <svg
                    className="h-5 w-5 text-secondary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
              {/* Active Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  {t("common.active")}
                </label>
                <select
                  value={activeFilter}
                  onChange={handleActiveFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                >
                  {activeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Filter */}
              {userRole === "admin" && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    {t("common.company")}
                  </label>
                  <select
                    value={companyFilter}
                    onChange={handleCompanyFilterChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                  >
                    <option value="">{t("common.all")}</option>
                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  {t("orders.status")}
                </label>
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                >
                  <option value="">{t("common.all")}</option>
                  {orderStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {t(`orders.statuses.${status}`)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  {t("orders.paymentMethod")}
                </label>
                <select
                  value={paymentMethodFilter}
                  onChange={handlePaymentMethodFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                >
                  <option value="">{t("common.all")}</option>
                  {paymentMethodOptions.map((method) => (
                    <option key={method} value={method}>
                      {t(`orders.paymentMethods.${method}`)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Status Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  {t("orders.paymentStatus")}
                </label>
                <select
                  value={paymentStatusFilter}
                  onChange={handlePaymentStatusFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                >
                  <option value="">{t("common.all")}</option>
                  {paymentStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {t(`orders.paymentStatuses.${status}`)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  {t("common.sortBy")}
                </label>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                >
                  <option value="-createdAt">{t("orders.newest")}</option>
                  <option value="createdAt">{t("orders.oldest")}</option>
                  <option value="-totalAmount">
                    {t("orders.highestAmount")}
                  </option>
                  <option value="totalAmount">
                    {t("orders.lowestAmount")}
                  </option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="primary" onClick={applyFilters}>
                {t("common.applyFilters")}
              </Button>
              <Button variant="danger" size="sm" onClick={resetFilters}>
                {t("common.reset")}
              </Button>
            </div>
          </div>
        </Card>

        {/* Orders table */}
        <Card className="overflow-hidden mb-6">
          <Table
            columns={columns}
            data={orders}
            isLoading={loading}
            noDataMessage={t("orders.noOrders")}
            onRowClick={(order) => {
              prepareOrderForModal(order);
              setIsViewModalOpen(true);
            }}
            renderExpandedRow={(order) =>
              expandedRows[order._id] && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-0 border-b border-secondary-200"
                  >
                    {renderExpandedRowContent(order)}
                  </td>
                </tr>
              )
            }
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

      {/* View order modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={t("orders.orderDetails")}
        size="lg"
      >
        {currentOrder && (
          <div className="space-y-6">
            {/* Order header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h3 className="text-lg font-bold">
                  {t("orders.orderNumber")}: #{currentOrder._id}
                </h3>
                <p className="text-sm text-secondary-500">
                  {formatDate(currentOrder.createdAt)}
                </p>
              </div>
              <div className="mt-3 md:mt-0 flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(
                    currentOrder.orderStatus
                  )}`}
                >
                  {t(`orders.statuses.${currentOrder.orderStatus}`)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusBadgeClass(
                    currentOrder.paymentStatus
                  )}`}
                >
                  {t(`orders.paymentStatuses.${currentOrder.paymentStatus}`)}
                </span>
              </div>
            </div>

            {/* Order info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer info */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">{t("orders.customerInfo")}</h4>
                <div className="space-y-2">
                  <p>
                    <span className="text-secondary-500">
                      {t("orders.name")}:
                    </span>{" "}
                    {currentOrder.user?.name || t("orders.guestUser")}
                  </p>
                  <p>
                    <span className="text-secondary-500">
                      {t("orders.email")}:
                    </span>{" "}
                    {currentOrder.user?.email || "-"}
                  </p>
                  <p>
                    <span className="text-secondary-500">
                      {t("orders.phone")}:
                    </span>{" "}
                    {currentOrder.contactNumber || "-"}
                  </p>
                </div>
              </div>

              {/* Shipping info */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">{t("orders.shippingInfo")}</h4>
                <div className="space-y-2">
                  <p>
                    <span className="text-secondary-500">
                      {t("orders.address")}:
                    </span>{" "}
                    {currentOrder.shippingAddress || "-"}
                  </p>
                  <p>
                    <span className="text-secondary-500">
                      {t("orders.paymentMethod")}:
                    </span>{" "}
                    {t(`orders.paymentMethods.${currentOrder.paymentMethod}`)}
                  </p>
                  {currentOrder.paymentTransactionId && (
                    <p>
                      <span className="text-secondary-500">
                        {t("orders.transactionId")}:
                      </span>{" "}
                      {currentOrder.paymentTransactionId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order items */}
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-secondary-200">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      {t("orders.product")}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      {t("orders.price")}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      {t("orders.quantity")}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      {t("orders.total")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {currentOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {item.product?.imageUrl && (
                            <img
                              src={item.product?.imageUrl}
                              alt={item.product?.name}
                              className="h-10 w-10 object-cover rounded mr-3"
                            />
                          )}
                          <span className="text-sm font-medium">
                            {item.product?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        {formatPrice(item?.price)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-secondary-50">
                    <td
                      colSpan="3"
                      className="px-4 py-3 text-right text-sm font-medium"
                    >
                      {t("orders.subtotal")}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium">
                      {formatPrice(currentOrder.totalAmount)}
                    </td>
                  </tr>
                  <tr className="bg-secondary-50">
                    <td
                      colSpan="3"
                      className="px-4 py-3 text-right text-sm font-medium"
                    >
                      {t("orders.total")}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold">
                      {formatPrice(currentOrder.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Notes */}
            {currentOrder.notes && (
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{t("orders.notes")}</h4>
                <p className="text-sm">{currentOrder.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Update status modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={t("orders.updateStatus")}
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
              variant="primary"
              loading={loading}
              onClick={handleStatusChange}
            >
              {t("common.update")}
            </Button>
          </div>
        }
      >
        {currentOrder && (
          <div>
            <p className="mb-4 text-secondary-700">
              {t("orders.currentStatus")}:
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                  currentOrder.orderStatus
                )}`}
              >
                {t(`orders.statuses.${currentOrder.orderStatus}`)}
              </span>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                {t("orders.newStatus")}
              </label>
              <select
                value={newOrderStatus}
                onChange={(e) => setNewOrderStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              >
                {orderStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {t(`orders.statuses.${status}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>

      {/* Update payment modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={t("orders.updatePayment")}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsPaymentModalOpen(false)}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant="primary"
              loading={loading}
              onClick={handlePaymentChange}
            >
              {t("common.update")}
            </Button>
          </div>
        }
      >
        {currentOrder && (
          <div>
            <p className="mb-4 text-secondary-700">
              {t("orders.currentPaymentStatus")}:
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs ${getPaymentStatusBadgeClass(
                  currentOrder.paymentStatus
                )}`}
              >
                {t(`orders.paymentStatuses.${currentOrder.paymentStatus}`)}
              </span>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                {t("orders.newPaymentStatus")}
              </label>
              <select
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              >
                {paymentStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {t(`orders.paymentStatuses.${status}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                {t("orders.paymentTransactionId")}
              </label>
              <input
                type="text"
                value={newPaymentTransactionId}
                onChange={(e) => setNewPaymentTransactionId(e.target.value)}
                placeholder={t("orders.transactionIdPlaceholder")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel order confirmation modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title={t("orders.cancelOrder")}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsCancelModalOpen(false)}
            >
              {t("common.cancel")}
            </Button>

            <Button
              variant="danger"
              loading={loading}
              onClick={handleCancelOrder}
            >
              {t("orders.confirmCancel")}
            </Button>
          </div>
        }
      >
        <p className="text-secondary-700">
          {t("orders.cancelOrderConfirmation")}
        </p>
      </Modal>
    </DashboardLayout>
  );
};

export default Orders;
