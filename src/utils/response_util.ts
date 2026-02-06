/**
 * Repsonse util
 * @description Generates a paginated response object.
 * @author : sarathavs
 */
interface PaginationMetadata {
  total: number;
  limit: number;
  offset: number;
  totalPages: number;
  currentPage: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

/**
 * Generates a paginated response object.
 * @param data - The array of items to include in the response.
 * @param total - The total number of items matching the query.
 * @param limit - The limit of items per page.
 * @param offset - The offset of items for pagination.
 * @returns The response object containing data and pagination metadata.
 */
export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  limit: number,
  offset: number
): PaginatedResponse<T> => {
  const pagination = {
    total,
    limit,
    offset,
    totalPages: Math.ceil(total / limit),
    currentPage: Math.floor(offset / limit) + 1,
  };

  return {
    data,
    pagination,
  };
};
