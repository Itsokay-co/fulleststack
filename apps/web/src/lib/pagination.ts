export type PaginationItem =
  | { type: "page"; pageNumber: number }
  | { type: "gap" };

export type PaginationOptions = {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
};

/**
 * Generates pagination items for UI display
 * @param options Pagination configuration options
 * @param options.currentPage Current active page number
 * @param options.totalPages Total number of pages
 * @param options.maxVisiblePages Maximum number of page items to display
 * @returns Array of pagination items to render
 */
export function generatePaginationItems({
  currentPage,
  totalPages,
  maxVisiblePages = 7,
}: PaginationOptions): PaginationItem[] {
  // Normalize inputs
  totalPages = Math.max(1, totalPages);
  currentPage = Math.max(1, Math.min(currentPage, totalPages));

  // For small total pages, just show all pages
  if (totalPages <= 1) {
    return [{ type: "page", pageNumber: 1 }];
  }

  // Handle maxVisiblePages=3 as a special case (first, current, last)
  if (maxVisiblePages === 3) {
    if (currentPage === 1) {
      return [
        { type: "page", pageNumber: 1 },
        { type: "page", pageNumber: 2 },
        { type: "page", pageNumber: totalPages },
      ];
    }
    else if (currentPage === totalPages) {
      return [
        { type: "page", pageNumber: 1 },
        { type: "page", pageNumber: totalPages - 1 },
        { type: "page", pageNumber: totalPages },
      ];
    }
    else {
      return [
        { type: "page", pageNumber: 1 },
        { type: "page", pageNumber: currentPage },
        { type: "page", pageNumber: totalPages },
      ];
    }
  }

  // If we don't need all pages or maxVisiblePages = 4,5
  if (totalPages <= maxVisiblePages) {
    const items: PaginationItem[] = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push({ type: "page", pageNumber: i });
    }
    return items;
  }

  // For 5 or more visible pages, we need a different strategy
  const items: PaginationItem[] = [];

  // Always include first page
  items.push({ type: "page", pageNumber: 1 });

  // Determine number of neighbors to show around current
  // We need 2 slots for first/last, and up to 2 slots for ellipses
  // This leaves maxVisiblePages - 4 for neighbors
  const neighborsCount = Math.max(0, Math.floor((maxVisiblePages - 4) / 2));

  // Start and end points for the middle section
  let startPage = Math.max(2, currentPage - neighborsCount);
  let endPage = Math.min(totalPages - 1, currentPage + neighborsCount);

  // Adjust neighbors if we're near the beginning or end
  if (currentPage - 2 < neighborsCount) {
    // Near beginning, show more on right
    endPage = Math.min(totalPages - 1, startPage + 2 * neighborsCount);
  }
  else if (totalPages - currentPage - 1 < neighborsCount) {
    // Near end, show more on left
    startPage = Math.max(2, endPage - 2 * neighborsCount);
  }

  // Add gap after first page if needed
  if (startPage > 2) {
    items.push({ type: "gap" });
  }

  // Add pages in the middle
  for (let i = startPage; i <= endPage; i++) {
    items.push({ type: "page", pageNumber: i });
  }

  // Add gap before last page if needed
  if (endPage < totalPages - 1) {
    items.push({ type: "gap" });
  }

  // Always include last page if it's not the first
  if (totalPages > 1) {
    items.push({ type: "page", pageNumber: totalPages });
  }

  // Final check to ensure we don't exceed maxVisiblePages
  if (items.length > maxVisiblePages) {
    // const priorityPages = new Set([1, currentPage, totalPages]);
    // const gapAdded = false;

    const newItems: PaginationItem[] = [];

    // Always keep first and last page
    newItems.push({ type: "page", pageNumber: 1 });

    // Add a gap if not starting with page 2
    if (currentPage > 2) {
      newItems.push({ type: "gap" });
    }

    // Add current page if it's not first or last
    if (currentPage > 1 && currentPage < totalPages) {
      newItems.push({ type: "page", pageNumber: currentPage });
    }

    // Add a gap if not ending with the last page
    if (currentPage < totalPages - 1) {
      newItems.push({ type: "gap" });
    }

    // Add last page
    newItems.push({ type: "page", pageNumber: totalPages });

    return newItems;
  }

  return items;
}
