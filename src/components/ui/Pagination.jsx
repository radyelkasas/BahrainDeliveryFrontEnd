import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "react-feather";

// Enhanced Pagination component with animations
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.language === "ar-SA";

  // Calculate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show a subset of pages with ellipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Animation variants for the pagination container
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  // Animation variants for the pagination buttons
  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className={`flex items-center justify-between px-6 py-4 bg-white border-t border-secondary-200 rounded-b-lg shadow-sm ${className}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <motion.p
            className="text-sm text-secondary-600 bg-secondary-50 px-4 py-2 rounded-full shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t("pagination.showing")}{" "}
            <span className="font-semibold text-primary-600">
              {currentPage === 1 ? 1 : (currentPage - 1) * 10 + 1}
            </span>{" "}
            {t("pagination.to")}{" "}
            <span className="font-semibold text-primary-600">
              {Math.min(currentPage * 10, totalPages * 10)}
            </span>{" "}
            {t("pagination.of")}{" "}
            <span className="font-semibold text-primary-600">
              {totalPages * 10}
            </span>{" "}
            {t("pagination.results")}
          </motion.p>
        </div>
        <motion.div
          className="mt-4 sm:mt-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <nav
            className="relative z-0 inline-flex rounded-lg shadow-md overflow-hidden"
            aria-label="Pagination"
          >
            {/* Previous Page Button */}
            <motion.button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-3 py-2 border-r border-secondary-200 text-sm font-medium ${
                currentPage === 1
                  ? "bg-secondary-50 text-secondary-400 cursor-not-allowed"
                  : "bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
              }`}
              whileHover={
                currentPage !== 1 ? { backgroundColor: "#EBF5FF" } : {}
              }
              whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
              variants={itemVariants}
            >
              <span className="sr-only">{t("pagination.previous")}</span>
              <ChevronLeft
                className={`${isRTL ? "transform rotate-180" : ""}`}
                size={16}
              />
            </motion.button>

            {/* Page Numbers */}
            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <motion.span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 border-r border-secondary-200 bg-white text-sm font-medium text-secondary-700"
                    variants={itemVariants}
                  >
                    <span className="transform translate-y-[-2px]">•••</span>
                  </motion.span>
                );
              }

              return (
                <motion.button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border-r border-secondary-200 text-sm font-medium transition-all duration-200 ${
                    page === currentPage
                      ? "bg-primary-600 text-white font-semibold hover:bg-primary-700"
                      : "bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-600"
                  }`}
                  whileHover={{
                    backgroundColor:
                      page === currentPage ? "#3B82F6" : "#EBF5FF",
                  }}
                  whileTap={{ scale: 0.95 }}
                  variants={itemVariants}
                >
                  {page}
                </motion.button>
              );
            })}

            {/* Next Page Button */}
            <motion.button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                currentPage === totalPages
                  ? "bg-secondary-50 text-secondary-400 cursor-not-allowed"
                  : "bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
              }`}
              whileHover={
                currentPage !== totalPages ? { backgroundColor: "#EBF5FF" } : {}
              }
              whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
              variants={itemVariants}
            >
              <span className="sr-only">{t("pagination.next")}</span>
              <ChevronRight
                className={`${isRTL ? "transform rotate-180" : ""}`}
                size={16}
              />
            </motion.button>
          </nav>
        </motion.div>
      </div>

      {/* Mobile pagination (simplified) */}
      <div className="flex items-center justify-between w-full sm:hidden">
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center px-4 py-2 border border-secondary-300 rounded-md shadow-sm text-sm font-medium ${
            currentPage === 1
              ? "bg-secondary-50 text-secondary-400 cursor-not-allowed"
              : "bg-white text-secondary-700 hover:bg-primary-50"
          }`}
          whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
          whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
        >
          {t("pagination.previous")}
        </motion.button>

        <motion.span
          className="text-sm text-secondary-700 bg-secondary-50 px-3 py-1 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {currentPage} / {totalPages}
        </motion.span>

        <motion.button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center px-4 py-2 border border-secondary-300 rounded-md shadow-sm text-sm font-medium ${
            currentPage === totalPages
              ? "bg-secondary-50 text-secondary-400 cursor-not-allowed"
              : "bg-white text-secondary-700 hover:bg-primary-50"
          }`}
          whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
          whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
        >
          {t("pagination.next")}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Pagination;
