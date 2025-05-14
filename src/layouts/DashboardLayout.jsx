import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

// Auth context
import { useAuth } from "../context/AuthContext";

// UI Components
import { Button, LanguageSwitcher } from "../components/ui";
import { Logo, LoadingSpinner } from "../components/common";

// Sidebar navigation item component
const NavItem = ({ to, icon, label, isActive }) => {
  const activeClass = isActive
    ? "bg-primary-700 text-white"
    : "text-primary-100 hover:bg-primary-700/50";

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${activeClass}`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

// Mobile menu button component
const MenuButton = ({ isOpen, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="p-2 text-secondary-600 rounded-md lg:hidden focus:outline-none"
      aria-label="Toggle menu"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );
};

// Dashboard layout component
const DashboardLayout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  console.log("DashboardLayout user", user.role);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to check if mobile view
  const isMobile = () => window.innerWidth < 1024;

  // Close sidebar when navigating to a new page on mobile
  useEffect(() => {
    if (isMobile()) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Initialize sidebar as closed on mobile
  useEffect(() => {
    setSidebarOpen(!isMobile());
  }, []);

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigation items
  const getNavItems = () => {
    const items = [
      {
        to: "/dashboard",
        label: t("dashboard.overview"),
        icon: (
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        ),
      },
    ];

    // Only add users navigation item if user is admin
    if (user.role === "admin") {
      items.push({
        to: "/users",
        label: t("dashboard.users"),
        icon: (
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
        ),
      });
    }

    // Add remaining navigation items
    items.push(
      {
        to: "/categories",
        label: t("dashboard.categories"),
        icon: (
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        ),
      },
      {
        to: "/products",
        label: t("dashboard.products"),
        icon: (
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        ),
      },
      {
        to: "/orders",
        label: t("dashboard.orders"),
        icon: (
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        ),
      },
      {
        to: "/uploads",
        label: t("dashboard.uploads.title"),
        icon: (
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        ),
      },
      {
        to: "/profile",
        label: t("dashboard.myProfile"),
        icon: (
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ),
      }
    );

    return items;
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner fullScreen message={t("common.loading")} />;
  }

  return (
    <div
      className="flex h-screen bg-secondary-100 overflow-hidden"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Sidebar for mobile - overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 ${
          i18n.language === "ar" ? "right-0" : "left-0"
        } w-64 bg-primary-600 text-white z-30 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
        initial={false}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-primary-700">
          <div className="flex items-center justify-between">
            <Link to="/dashboard">
              <Logo size="sm" className="text-white" />
            </Link>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-primary-700 lg:hidden"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* User info */}
        {user && (
          <div className="p-4 border-b border-primary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center">
                <span className="text-lg font-bold">
                  {user.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-primary-200">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {getNavItems().map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
            />
          ))}

          <hr className="my-4 border-primary-700" />

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-primary-100 rounded-lg hover:bg-primary-700/50 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>{t("auth.logout")}</span>
          </button>
        </nav>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <MenuButton isOpen={sidebarOpen} toggle={toggleSidebar} />
              <h1 className="ml-4 text-xl font-semibold text-secondary-800 hidden sm:block">
                {getNavItems().find((item) => item.to === location.pathname)
                  ?.label || t("dashboard.title")}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              {/* Any additional header actions can go here */}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
