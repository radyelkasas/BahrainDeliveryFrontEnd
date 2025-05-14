import { useTranslation } from 'react-i18next';

// Table component with sorting, filtering, etc.
const Table = ({
  columns,
  data,
  isLoading = false,
  noDataMessage,
  onRowClick,
  className = '',
}) => {
  const { t } = useTranslation();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-white rounded-lg shadow">
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
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-secondary-900">
          {noDataMessage || t('common.noData')}
        </h3>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-secondary-200">
        <thead className="bg-secondary-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider whitespace-nowrap"
                style={{ width: column.width || 'auto' }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-secondary-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${onRowClick ? 'cursor-pointer hover:bg-secondary-50' : ''}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`}
                >
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
