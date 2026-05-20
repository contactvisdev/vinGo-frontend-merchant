import { useParams } from "react-router-dom";
import { useGetTermsPoliciesQuery } from "@/store/api/termsPolicyApi";
import AutoSkeleton from "@/components/ui/Skeleton/AutoSkeleton";

const TermsConditions = () => {
  const { userType } = useParams(); 
  
  const titles = {
    customer: "Customer Terms & Conditions",
    merchant: "Merchant Terms & Conditions",
    driver: "Driver Terms & Conditions"
  };

  const { data, isLoading, error } = useGetTermsPoliciesQuery({
    type: "terms_conditions",
    userType: userType
  });

  const terms = data?.find(item => item.isActive && item.type === "terms_conditions");

  return (
    <AutoSkeleton loading={isLoading} config={{ animation: "pulse", borderRadius: 8 }}>
      <div className="min-h-screen bg-white pt-6 pb-12">
        <div className="max-w-4xl mx-auto px-4">
    
          {/* Page Title */}
          <h1 className="font-headline text-4xl font-extrabold mb-8 text-gray-900">
            {titles[userType] || "Terms & Conditions"}
          </h1>

          {/* Content wrapper */}
          <div className="space-y-16">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <p className="text-red-600 text-lg">Error loading terms & conditions. Please try again later.</p>
              </div>
            )}
            
            {!error && !terms && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                <p className="text-gray-600 text-lg">No terms & conditions available.</p>
              </div>
            )}
            
            {terms?.content && (
              <div 
                className="terms-conditions-content prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: terms.content }}
              />
            )}
          </div>
        </div>
      </div>
    </AutoSkeleton>
  );
};

export default TermsConditions;
