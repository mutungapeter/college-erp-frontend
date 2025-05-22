import React, { JSX } from "react";
import ContentSpinner from "../spinners/dataLoadingSpinner";

function renderCellValue(value: unknown): React.ReactNode {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value === null || value === undefined) {
    return "-";
  }

  // Optionally, format Date or Object
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  return JSON.stringify(value);
}

export interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (row: T) => React.ReactNode;
}
interface DataTableProps<T> {
  data: T[] | null;
  columns: Column<T>[];
  isLoading: boolean;
  error: unknown;
}
const DataTable = <T,>({
  data,
  columns,
  isLoading,
  error,
}: DataTableProps<T>): JSX.Element => {
  return (
    <div className="relative overflow-x-auto bg-white rounded-md border mt-5">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-white text-gray-600 uppercase border-b text-xs font-semibold border-gray-200 leading-normal">
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-4 py-3 text-xs text-left"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                <ContentSpinner />
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-red-500"
              >
                Error loading data
              </td>
            </tr>
          ) : data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b text-md font-thin border-gray-200 hover:bg-gray-100"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-3 py-2 text-left text-sm font-normal whitespace-nowrap"
                  >
                    {column.cell
                      ? column.cell(row)
                      : renderCellValue(row[column.accessor])}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    // </div>
  );
};

export default DataTable;
