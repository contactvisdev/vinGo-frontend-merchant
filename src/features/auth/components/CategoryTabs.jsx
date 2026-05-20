export default function CategoryTabs({
  categories,
  activeTab,
  role,
  getBusinessCount,
  onTabChange,
  disabledCategoryNames = [],
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 border-b border-neutral-200 pb-3">
      {categories.map((category) => {
        const count = getBusinessCount(category._id);
        if (role === "staff" && count === 0) return null;

        const isActive = activeTab === category._id;
        const isDisabled = disabledCategoryNames.includes(category.name);

        return (
          <button
            key={category._id}
            type="button"
            disabled={isDisabled}
            onClick={() => !isDisabled && onTabChange(category._id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isDisabled
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-60 pointer-events-none"
                : `cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`
            }`}
          >
            {category.name}
            {count > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-neutral-300 text-neutral-700"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
