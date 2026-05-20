import ClipLoader from "react-spinners/ClipLoader";
import { AuthCard } from "@/features/auth/components/Auth";
import ReviewPendingModal from "@/components/ui/Modal/ReviewPendingModal";
import DeleteConfirmationDialog from "@/components/ui/Modal/DeleteItem";
import useSelectCategory from "../../hooks/useSelectCategory";
import CategoryCard from "../../components/CategoryCard";
import BusinessCard from "../../components/BusinessCard";
import CategoryTabs from "../../components/CategoryTabs";

function CategoryList({
  categories,
  selectedId,
  onSelect,
  disabledCategoryNames = [],
}) {
  if (categories.length === 0) {
    return (
      <p className="text-center text-neutral-500 py-4">
        No categories available
      </p>
    );
  }
  
  return (
    <div className="w-full space-y-3">
      {categories.map((category) => (
        <CategoryCard
          key={category._id}
          category={category}
          isSelected={selectedId === category._id}
          onSelect={onSelect}
          disabled={disabledCategoryNames.includes(category.name)}
        />
      ))}
    </div>
  );
}

function BusinessList({ businesses, onBusinessClick, onDelete }) {
  return (
    <div className="w-full space-y-3 h-[300px] overflow-y-auto styled-scrollbar">
      {businesses.map((business) => (
        <BusinessCard
          key={business._id}
          business={business}
          onClick={onBusinessClick}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function EmptyCategoryMessage({
  categories,
  selectedId,
  onSelect,
  disabledCategoryNames,
}) {
  return (
    <div className="w-full space-y-3">
      <p className="text-sm text-neutral-500 mb-3 text-center">
        No existing businesses for this category. Select a category to create a
        new one.
      </p>
      <CategoryList
        categories={categories}
        selectedId={selectedId}
        onSelect={onSelect}
        disabledCategoryNames={disabledCategoryNames}
      />
    </div>
  );
}

function CardContent({
  loading,
  merchantExists,
  activeTab,
  hasBusinessesForActiveTab,
  categoryList,
  selectedCategory,
  currentCategoryBusinesses,
  role,
  handleCategorySelect,
  handleTabChange,
  handleBusinessClick,
  handleDeleteClick,
  getBusinessesForCategory,
  disabledCategoryNames = [],
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <ClipLoader color="#43ddc8" loading size={35} />
      </div>
    );
  }

  if (merchantExists && activeTab) {
    return (
      <div className="w-full">
        <CategoryTabs
          categories={categoryList}
          activeTab={activeTab}
          role={role}
          getBusinessCount={(id) => getBusinessesForCategory(id).length}
          onTabChange={handleTabChange}
          disabledCategoryNames={disabledCategoryNames}
        />

        {hasBusinessesForActiveTab ? (
          <BusinessList
            businesses={currentCategoryBusinesses}
            onBusinessClick={handleBusinessClick}
            onDelete={handleDeleteClick}
          />
        ) : (
          <EmptyCategoryMessage
            categories={categoryList}
            selectedId={selectedCategory?._id}
            onSelect={handleCategorySelect}
            disabledCategoryNames={disabledCategoryNames}
          />
        )}
      </div>
    );
  }

  return (
    <CategoryList
      categories={categoryList}
      selectedId={selectedCategory?._id}
      onSelect={handleCategorySelect}
      disabledCategoryNames={disabledCategoryNames}
    />
  );
}

export default function SelectCategory() {
  const {
    categoryList,
    selectedCategory,
    activeTab,
    merchantExists,
    role,
    loading,
    showReviewModal,
    currentCategoryBusinesses,
    hasBusinessesForActiveTab,
    handleCategorySelect,
    handleTabChange,
    handleBusinessClick,
    handleContinue,
    getBusinessesForCategory,
    setShowReviewModal,
    showDeleteModal,
    setShowDeleteModal,
    handleDeleteClick,
    handleConfirmDelete,
  } = useSelectCategory();

  const DISABLED_CATEGORIES = [];
  const HIDDEN_CATEGORIES = ["Liquor", "Stores"];
  const visibleCategoryList = categoryList.filter(
    (item) => !HIDDEN_CATEGORIES.includes(item.name),
  );

  const heading = merchantExists ? "Your Businesses" : "Select Your Category";
  const subheading = merchantExists ? "Manage or Create New" : "to Get Started";

  const cardHead =
    role === "staff"
      ? "Select Business"
      : merchantExists && hasBusinessesForActiveTab
        ? "Existing Businesses"
        : "Select Category";

  const btnLabel =
    merchantExists && hasBusinessesForActiveTab ? "Create New" : "Continue";

  return (
    <div className="home-container w-full h-full">
      <div className="home-content overflow-hidden md:overflow-visible flex flex-col items-center justify-center gap-[50px] md:gap-[70px] xl:gap-[200px] 2xl:gap-[150px] lg:flex-row lg:items-center lg:justify-center md:px-10 lg:px-20">
        <img
          src="/images/bg-image.webp"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="home-content__bg"
        />
        <div className="home-content__overlay" />

        <p className="text-center md:text-center text-3xl md:text-[34px] lg:text-[40px] 2xl:text-[60px] lg:text-left font-bold leading-tight 2xl:pr-8">
          {heading}
          <br /> {subheading}
        </p>

        <AuthCard
          Head={cardHead}
          role={role}
          BtnLabel={btnLabel}
          onClick={handleContinue}
          hideFooterMessage
          className="max-w-[600px] w-full"
        >
          <CardContent
            loading={loading}
            merchantExists={merchantExists}
            activeTab={activeTab}
            hasBusinessesForActiveTab={hasBusinessesForActiveTab}
            categoryList={visibleCategoryList}
            disabledCategoryNames={DISABLED_CATEGORIES}
            selectedCategory={selectedCategory}
            currentCategoryBusinesses={currentCategoryBusinesses}
            role={role}
            handleCategorySelect={handleCategorySelect}
            handleTabChange={handleTabChange}
            handleBusinessClick={handleBusinessClick}
            handleDeleteClick={handleDeleteClick}
            getBusinessesForCategory={getBusinessesForCategory}
          />
        </AuthCard>
      </div>

      <ReviewPendingModal
        visible={showReviewModal}
        onHide={() => setShowReviewModal(false)}
      />

      <DeleteConfirmationDialog
        visible={showDeleteModal}
        setVisible={setShowDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
