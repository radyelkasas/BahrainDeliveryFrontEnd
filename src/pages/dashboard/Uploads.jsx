import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

// Services
import { uploadService } from "../../services/uploadService";

// Layout
import DashboardLayout from "../../layouts/DashboardLayout";

// Components
import { Card, Table, Pagination, Modal, Alert } from "../../components/ui";

const Uploads = () => {
  const { t } = useTranslation();

  // States
  const [uploads, setUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [dropActive, setDropActive] = useState(false);

  // Table columns configuration
  const columns = [
    {
      header: t("dashboard.uploads.filename"),
      accessor: "filename",
      render: (row) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 mr-3 bg-secondary-100 rounded">
            <img
              src={uploadService.getImageById(row._id)}
              alt={row.filename}
              className="h-10 w-10 object-cover rounded"
            />
          </div>
          <span className="truncate max-w-xs" title={row.filename}>
            {row.filename}
          </span>
        </div>
      ),
    },
    {
      header: t("dashboard.uploads.type"),
      accessor: "contentType",
      render: (row) => (
        <span className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded-full text-xs">
          {row.contentType}
        </span>
      ),
    },
    {
      header: t("dashboard.uploads.size"),
      accessor: "size",
      render: (row) => formatFileSize(row.size),
    },
    {
      header: t("dashboard.uploads.uploadedAt"),
      accessor: "uploadedAt",
      render: (row) => format(new Date(row.uploadedAt), "PP"),
    },
    {
      header: t("common.actions"),
      accessor: "actions",
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePreviewImage(row);
            }}
            className="text-primary-600 hover:text-primary-800"
            title={t("common.view")}
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
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteImage(row);
            }}
            className="text-red-600 hover:text-red-800"
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
              ></path>
            </svg>
          </button>
        </div>
      ),
    },
  ];

  // Format file size to readable format (KB, MB)
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Fetch uploads with pagination
  const fetchUploads = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await uploadService.getAllUploads(page);
      setUploads(response.data.images);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error("Error fetching uploads:", error);
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || t("common.errors.unexpected"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchUploads(page);
  };

  // Preview image
  const handlePreviewImage = (image) => {
    setSelectedImage(image);
    setIsPreviewModalOpen(true);
  };

  // Delete image
  const handleDeleteImage = async (image) => {
    try {
      setIsDeleting(true);
      await uploadService.deleteImage(image._id);

      // Refresh uploads list
      await fetchUploads(currentPage);

      // Show success alert
      setAlert({
        show: true,
        type: "success",
        message: t("dashboard.uploads.deleteSuccess"),
      });

      // Auto-hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, type: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Error deleting image:", error);
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || t("common.errors.unexpected"),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Upload image
  const handleUploadImage = async () => {
    if (!uploadFile) return;

    try {
      setIsLoading(true);
      await uploadService.uploadImage(uploadFile);

      // Close modal and reset file
      setIsUploadModalOpen(false);
      setUploadFile(null);

      // Refresh uploads list
      await fetchUploads(1); // Go to first page after upload

      // Show success alert
      setAlert({
        show: true,
        type: "success",
        message: t("dashboard.uploads.uploadSuccess"),
      });

      // Auto-hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, type: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Error uploading image:", error);
      setAlert({
        show: true,
        type: "error",
        message: error.response?.data?.message || t("common.errors.unexpected"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  // Handle drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDropActive(true);
  };

  const handleDragLeave = () => {
    setDropActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDropActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
    }
  };

  // Copy image URL to clipboard
  const copyImageUrlToClipboard = async () => {
    if (!selectedImage) return;

    const imageUrl = uploadService.getImageById(selectedImage._id);

    try {
      await navigator.clipboard.writeText(imageUrl);
      setAlert({
        show: true,
        type: "success",
        message: t("dashboard.uploads.urlCopied"),
      });

      // Auto-hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, type: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      setAlert({
        show: true,
        type: "error",
        message: t("common.errors.copyToClipboard"),
      });
    }
  };

  // Load uploads on component mount
  useEffect(() => {
    fetchUploads();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        {/* Header with title and upload button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-secondary-900">
            {t("dashboard.uploads.description")}
          </h1>
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => setIsUploadModalOpen(true)}
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            {t("dashboard.uploadNewFile")}
          </button>
        </div>

        {/* Alert component */}
        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onDismiss={() => setAlert({ show: false, type: "", message: "" })}
            className="mb-4"
          />
        )}

        {/* Uploads table */}
        <Card className="overflow-hidden">
          <Table
            columns={columns}
            data={uploads}
            isLoading={isLoading}
            noDataMessage={t("dashboard.uploads.noUploads")}
          />

          {/* Pagination */}
          {!isLoading && uploads.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </Card>

        {/* Upload Modal */}
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => {
            setIsUploadModalOpen(false);
            setUploadFile(null);
          }}
          title={t("dashboard.uploads.uploadNewImage")}
          footer={
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-secondary-300 rounded-md text-secondary-700 hover:bg-secondary-100"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadFile(null);
                }}
              >
                {t("common.cancel")}
              </button>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUploadImage}
                disabled={!uploadFile || isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    {t("common.uploading")}
                  </>
                ) : (
                  t("common.upload")
                )}
              </button>
            </div>
          }
        >
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dropActive
                ? "border-primary-500 bg-primary-50"
                : "border-secondary-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <svg
              className="mx-auto h-12 w-12 text-secondary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-1 text-sm text-secondary-600">
              {uploadFile
                ? uploadFile.name
                : t("dashboard.uploads.dragAndDrop")}
            </p>
            <div className="mt-4">
              <label
                htmlFor="file-upload"
                className="inline-flex cursor-pointer px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
              >
                {t("dashboard.uploads.selectFile")}
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-secondary-500">
              {t("dashboard.uploads.imageRequirements")}
            </p>

            {/* Image preview */}
            {uploadFile && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-secondary-900 mb-2">
                  {t("dashboard.uploads.preview")}
                </h4>
                <div className="mx-auto w-32 h-32 bg-secondary-100 rounded">
                  <img
                    src={URL.createObjectURL(uploadFile)}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded"
                  />
                </div>
                <div className="mt-2 text-xs text-secondary-500">
                  {formatFileSize(uploadFile.size)} · {uploadFile.type}
                </div>
              </div>
            )}
          </div>
        </Modal>

        {/* Preview Modal */}
        <Modal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          title={selectedImage?.filename || t("dashboard.uploads.imagePreview")}
          size="lg"
          footer={
            <div className="flex justify-between items-center">
              <div className="text-sm text-secondary-500">
                {selectedImage && (
                  <>
                    {formatFileSize(selectedImage.size)} ·{" "}
                    {format(new Date(selectedImage.uploadedAt), "PPpp")}
                  </>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  className="px-4 py-2 border border-secondary-300 rounded-md text-secondary-700 hover:bg-secondary-100 flex items-center"
                  onClick={copyImageUrlToClipboard}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  {t("dashboard.uploads.copyUrl")}
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                  onClick={() => {
                    handleDeleteImage(selectedImage);
                    setIsPreviewModalOpen(false);
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      {t("common.deleting")}
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
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
                      {t("common.delete")}
                    </>
                  )}
                </button>
              </div>
            </div>
          }
        >
          {selectedImage && (
            <div className="text-center">
              <img
                src={uploadService.getImageById(selectedImage._id)}
                alt={selectedImage.filename}
                className="max-h-96 max-w-full mx-auto rounded"
              />
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Uploads;
