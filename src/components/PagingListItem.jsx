import React from "react";
import { Pagination } from "react-bootstrap";

export const PagingListItem = ({ handlePageChange, currentPage, totalPages }) => {
  return (
    <Pagination className="mt-3 justify-content-end">
      {[...Array(totalPages).keys()].map((page) => (
        <Pagination.Item
          key={page + 1}
          active={page + 1 === currentPage}
          onClick={() => handlePageChange(page + 1)}
        >
          {page + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};


