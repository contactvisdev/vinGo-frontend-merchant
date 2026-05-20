import { useParams } from "react-router-dom";
import { useGetTermsPoliciesQuery } from "@/store/api/termsPolicyApi";
import AutoSkeleton from "@/components/ui/Skeleton/AutoSkeleton";

const PrivacyPolicy = () => {
  const { userType } = useParams(); 
  
  const titles = {
    customer: "Customer Privacy Policy",
    merchant: "Merchant Privacy Policy",
    driver: "Driver Privacy Policy"
  };

  const { data, isLoading, error } = useGetTermsPoliciesQuery({
    type: "privacy_policy",
    userType: userType
  });

  const policy = data?.find(item => item.isActive && item.type === "privacy_policy");

  return (
    <AutoSkeleton loading={isLoading} config={{ animation: "pulse", borderRadius: 8 }}>
      <div className="min-h-screen bg-white pt-6 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Page Title */}
          <h1 className="font-headline text-4xl font-extrabold mb-8 text-gray-900">
            {titles[userType] || "Privacy Policy"}
          </h1>

          {/* Content wrapper */}
          <div className="space-y-16">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <p className="text-red-600 text-lg">Error loading privacy policy. Please try again later.</p>
              </div>
            )}
            
            {!error && !policy && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                <p className="text-gray-600 text-lg">No privacy policy available.</p>
              </div>
            )}
            
            {policy?.content && (
              <div 
                className="privacy-policy-content prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: policy.content }}
              />
            )}
          </div>
        </div>
      </div>
    </AutoSkeleton>
  );
};

export default PrivacyPolicy;
