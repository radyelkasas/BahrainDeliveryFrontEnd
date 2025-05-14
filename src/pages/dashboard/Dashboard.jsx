import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Layout
import DashboardLayout from "../../layouts/DashboardLayout";

// Components
import { Card, Alert } from "../../components/ui";
import Spinner from "../../components/ui/Spinner";

// Services
import dashboardService from "../../services/dashboardService";

// Auth context
import { useAuth } from "../../context/AuthContext";

// Icons
import {
  ShoppingBag,
  Clock,
  Check,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Truck,
  BarChart2,
  User,
  Settings,
} from "react-feather";
import { Link } from "react-router-dom";

// Animations constants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Stats card component
const StatsCard = ({ title, value, icon, color, percentChange }) => {
  return (
    <motion.div variants={itemVariants} className="h-full">
      <Card className="h-full overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>

            {percentChange !== undefined && (
              <div
                className={`mt-2 text-sm flex items-center ${
                  percentChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                <span className="mx-1">
                  {percentChange >= 0 ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingUp size={14} className="transform rotate-180" />
                  )}
                </span>
                <span>
                  {percentChange >= 0 ? "+" : ""}
                  {percentChange}% from last month
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color} text-white`}>{icon}</div>
        </div>
      </Card>
    </motion.div>
  );
};

// Order item component for recent orders
const OrderItem = ({ order, t }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={18} />;
      case "processing":
        return <ShoppingBag size={18} />;
      case "shipped":
        return <Truck size={18} />;
      case "delivered":
        return <Check size={18} />;
      case "cancelled":
        return <AlertTriangle size={18} />;
      default:
        return <Package size={18} />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <motion.div
      className="py-4 border-b border-gray-200 last:border-b-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`p-2 rounded-full mx-4 flex items-center justify-center ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {getStatusIcon(order.orderStatus)}
          </div>
          <div>
            <div className="flex items-center">
              <p className="text-gray-900 font-medium">
                {t("dashboard.order")} #{order._id.substr(-8)}
              </p>
              <span
                className={`mx-2 px-2 py-1 text-xs rounded-full ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                {t(`dashboard.${order.orderStatus}`)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {order.user ? order.user.name : t("dashboard.guestUser")} ·{" "}
              {formatDate(order.createdAt)}
            </p>
            <p className="text-sm font-medium mt-1">
              {t("dashboard.amount")}: ${order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="hidden md:block">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            {t("dashboard.viewDetails")}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Dashboard component
const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState("sales"); // 'sales' or 'orders'

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getDashboardOverview();
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(t("dashboard.errorFetchingData"));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Refresh data every 5 minutes
    const refreshInterval = setInterval(fetchDashboardData, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [t]);

  // Update date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format greeting based on time of day
  const getGreeting = () => {
    const hour = date.getHours();

    if (hour < 12) {
      return t("dashboard.goodMorning");
    } else if (hour < 18) {
      return t("dashboard.goodAfternoon");
    } else {
      return t("dashboard.goodEvening");
    }
  };

  // Format current date
  const formattedDate = new Intl.DateTimeFormat(t("locale", "en-US"), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  // Prepare chart data
  const prepareChartData = () => {
    if (!dashboardData) return [];

    return dashboardData.salesByMonth.filter(
      (item) => item.sales > 0 || item.orders > 0
    );
  };

  // Calculate month-over-month change for KPIs
  const calculateMoMChange = (currentMonthIndex) => {
    if (!dashboardData || !dashboardData.salesByMonth) return null;

    const salesByMonth = dashboardData.salesByMonth;
    const currentMonth = salesByMonth[currentMonthIndex];
    const previousMonthIndex =
      currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
    const previousMonth = salesByMonth[previousMonthIndex];

    // Calculate order change
    const orderChange =
      previousMonth.orders === 0
        ? 100
        : ((currentMonth.orders - previousMonth.orders) /
            previousMonth.orders) *
          100;

    // Calculate sales change
    const salesChange =
      previousMonth.sales === 0
        ? 100
        : ((currentMonth.sales - previousMonth.sales) / previousMonth.sales) *
          100;

    return {
      orderChange: Math.round(orderChange),
      salesChange: Math.round(salesChange),
    };
  };

  // Get current month
  const getCurrentMonthIndex = () => {
    return date.getMonth();
  };

  // Get change percentages
  const changes = calculateMoMChange(getCurrentMonthIndex());

  // Quick actions based on user role
  const getQuickActions = () => {
    const commonActions = [
      {
        title: t("dashboard.newOrder"),
        description: t("dashboard.createNewOrder"),
        icon: <ShoppingCart size={20} />,
        color: "bg-blue-100",
        textColor: "text-blue-600",
        path: "/orders",
      },
    ];

    // Admin-specific actions
    if (user?.role === "admin") {
      return [
        ...commonActions,
        {
          title: t("dashboard.manageUsers"),
          description: t("dashboard.viewAndManageUsers"),
          icon: <User size={20} />,
          color: "bg-purple-100",
          textColor: "text-purple-600",
          path: "/users",
        },
        {
          title: t("products.addProduct"),
          description: t("products.productManagement"),
          icon: <Package size={20} />,
          color: "bg-green-100",
          textColor: "text-green-600",
          path: "/products",
        },
      ];
    }

    // Company-specific actions
    return [
      ...commonActions,
      {
        title: t("dashboard.viewReports"),
        description: t("dashboard.checkStatistics"),
        icon: <BarChart2 size={20} />,
        color: "bg-green-100",
        textColor: "text-green-600",
        path: "/reports",
      },
      {
        title: t("dashboard.updateProfile"),
        description: t("dashboard.manageAccount"),
        icon: <User size={20} />,
        color: "bg-purple-100",
        textColor: "text-purple-600",
        path: "/profile",
      },
    ];
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen-content">
          <Spinner size="lg" color="text-blue-600" center />
          <p className="mt-4 text-gray-600">{t("dashboard.loading")}</p>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <Alert type="error" className="mb-4" message={error} />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          {t("dashboard.tryAgain")}
        </button>
      </DashboardLayout>
    );
  }

  // Format stats for display
  const formatStats = () => {
    if (!dashboardData) return [];

    const { orderStats, productStats, revenueStats } = dashboardData;

    return [
      {
        title: t("dashboard.totalOrders"),
        value: orderStats.totalOrders.toString(),
        icon: <ShoppingBag size={20} />,
        color: "bg-blue-500",
        percentChange: changes?.orderChange,
      },
      {
        title: t("dashboard.pendingOrders"),
        value: orderStats.pendingOrders.toString(),
        icon: <Clock size={20} />,
        color: "bg-yellow-500",
      },
      {
        title: t("dashboard.deliveredOrders"),
        value: orderStats.deliveredOrders.toString(),
        icon: <Check size={20} />,
        color: "bg-green-500",
      },
      {
        title: t("dashboard.totalRevenue"),
        value: `$${revenueStats.totalRevenue.toFixed(2)}`,
        icon: <DollarSign size={20} />,
        color: "bg-indigo-500",
        percentChange: changes?.salesChange,
      },
    ];
  };

  return (
    <DashboardLayout>
      {/* Welcome section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {user?.name || "Guest"}!
        </h1>
        <p className="text-gray-600 mt-1">{formattedDate}</p>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {formatStats().map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            percentChange={stat.percentChange}
          />
        ))}
      </motion.div>

      {/* Chart section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("dashboard.performanceOverview")}
          </h2>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeChart === "sales"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveChart("sales")}
            >
              {t("dashboard.sales")}
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeChart === "orders"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveChart("orders")}
            >
              {t("dashboard.orders")}
            </button>
          </div>
        </div>

        <Card className="p-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === "sales" ? (
                <LineChart
                  data={prepareChartData()}
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value}`, t("dashboard.sales")]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    name={t("dashboard.sales")}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              ) : (
                <BarChart
                  data={prepareChartData()}
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="orders"
                    name={t("dashboard.orders")}
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Recent orders section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t("dashboard.recentOrders")}
        </h2>

        <Card>
          {dashboardData?.recentOrders &&
          dashboardData.recentOrders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {dashboardData.recentOrders.slice(0, 5).map((order) => (
                <OrderItem key={order._id} order={order} t={t} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <Package size={48} className="mx-auto mb-4 text-gray-400" />
              <p>{t("dashboard.noRecentOrders")}</p>
            </div>
          )}

          {dashboardData?.recentOrders &&
            dashboardData.recentOrders.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  {t("dashboard.viewAllOrders")}
                  <svg
                    className="mx-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
        </Card>
      </motion.div>

      {/* Quick actions section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t("dashboard.quickActions")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {getQuickActions().map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="h-full"
              whileHover={{ y: -5 }}
            >
              <Link to={action.path} className="block h-full outline-none">
                <Card className="group h-full flex flex-col overflow-hidden rounded-xl border-2 border-gray-100 hover:border-blue-400 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-white transition-all duration-300 hover:shadow-lg">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 w-12 h-12 ${action.color} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transform transition-all duration-300 group-hover:scale-110`}
                      >
                        <span className={`${action.textColor} text-xl`}>
                          {action.icon}
                        </span>
                      </div>

                      <div className="mx-4 flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                          {action.description}
                        </p>
                      </div>

                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <span className="h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-md text-blue-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`h-1 w-full bg-gradient-to-r ${
                      action.color.includes("blue")
                        ? "from-blue-400 to-blue-600"
                        : action.color.includes("green")
                        ? "from-green-400 to-green-600"
                        : action.color.includes("purple")
                        ? "from-purple-400 to-purple-600"
                        : action.color.includes("yellow")
                        ? "from-yellow-400 to-yellow-600"
                        : action.color.includes("red")
                        ? "from-red-400 to-red-600"
                        : action.color.includes("gray")
                        ? "from-gray-400 to-gray-600"
                        : "from-blue-400 to-blue-600"
                    } transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out`}
                  ></div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
