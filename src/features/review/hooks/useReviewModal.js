import { useState, useCallback } from "react";

export const useReviewModal = () => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openReviewModal = useCallback((reviewData) => {
    setSelectedReview(reviewData);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedReview(null);
  }, []);

  return {
    selectedReview,
    isModalOpen,
    openReviewModal,
    closeModal,
  };
};
