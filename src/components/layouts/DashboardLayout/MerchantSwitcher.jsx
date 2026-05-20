import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Store } from "lucide-react";
import { setBusinessProfile } from "@/store/businessProfileSlice";
import { useGetMerchantsByOwnerQuery } from "@/store/api/merchantApi";

const MerchantSwitcher = React.memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const ownerId = useSelector((state) => state?.ownerProfile?.profile?._id);
  const currentMerchantId = useSelector((state) => state?.businessProfile?.profile?._id);

  const { data: allMerchants = [] } = useGetMerchantsByOwnerQuery(ownerId, {
    skip: !ownerId,
  });

  const switchableMerchants = useMemo(
    () =>
      allMerchants.filter(
        (m) =>
          m.isProfileCompleted &&
          m.isDocumentVerified &&
          m._id !== currentMerchantId,
      ),
    [allMerchants, currentMerchantId],
  );

  const grouped = useMemo(() => {
    const groups = {};
    for (const merchant of switchableMerchants) {
      const category = merchant.categoryName || "Other";
      if (!groups[category]) groups[category] = [];
      groups[category].push(merchant);
    }
    return groups;
  }, [switchableMerchants]);

  const categoryNames = Object.keys(grouped);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitch = useCallback(
    (merchant) => {
      dispatch(setBusinessProfile(merchant));
      setOpen(false);
      navigate("/dashboard");
    },
    [dispatch, navigate],
  );

  if (switchableMerchants.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Switch business"
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Store size={22} className="text-gray-700" />
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {switchableMerchants.length}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg z-50 border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Switch Business</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {categoryNames.map((category) => (
              <div key={category}>
                <div className="px-4 py-1.5 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {category}
                </div>
                {grouped[category].map((merchant) => (
                  <button
                    key={merchant._id}
                    type="button"
                    onClick={() => handleSwitch(merchant)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50"
                  >
                    {merchant.business?.branding?.storeLogo ? (
                      <img
                        src={merchant.business.branding.storeLogo}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                        <Store size={14} className="text-gray-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {merchant.business?.businessName || "Unnamed Business"}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {merchant.status}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

MerchantSwitcher.displayName = "MerchantSwitcher";

export default MerchantSwitcher;
