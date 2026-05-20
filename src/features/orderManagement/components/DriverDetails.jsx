import { CheckCheck, Bike, UserX } from "lucide-react";

export default function DriverDetails({ orderData }) {
  const driverDetails = orderData?.driverDetails || {};
  const driverName = driverDetails.driverName || null;
  const driverId = driverDetails.driverId || null;
  const driverPhone = driverDetails.contactNumber || null;
  const driverRating = driverDetails.rating || null;
  const driverProfilePic = driverDetails.profilePic || null;
  const totalReviews = driverDetails.totalReviews || 0;
  const recentCustomerFeedback = driverDetails.recentCustomerFeedback || null;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Bike size={20} className="text-primary" />
        Driver Details
      </h3>
      {driverName ? (
        <div className="space-y-5 flex-grow">
          <div className="flex items-center gap-3">
            {driverProfilePic ? (
              <img
                src={driverProfilePic}
                alt={driverName}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-base font-semibold">
                  {driverName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-gray-900">{driverName}</p>
              <p className="text-xs text-gray-500">
                ID #{driverId ? driverId.slice(-8) : "N/A"}
              </p>
            </div>
          </div>

          {driverPhone && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Contact
              </span>
              <span className="text-sm font-semibold">{driverPhone}</span>
            </div>
          )}

          {driverRating && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Rating
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-500">
                  {"★".repeat(Math.floor(driverRating))}
                  {"☆".repeat(5 - Math.floor(driverRating))}
                </span>
                <span className="text-sm font-semibold">
                  {driverRating.toFixed(1)}
                  {totalReviews > 0 && (
                    <span className="text-gray-400 font-normal">
                      {" "}
                      ({totalReviews})
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}

          {recentCustomerFeedback && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
              <div className="flex items-start gap-2">
                <CheckCheck size={16} className="text-green-600 shrink-0" />
                <p className="text-green-700 text-sm font-medium break-words min-w-0">
                  {recentCustomerFeedback}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center py-8 border-2 border-dashed border-gray-300/50 rounded-lg bg-gray-50/50">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <UserX size={28} className="text-gray-400" />
          </div>
          <p className="text-sm font-bold text-gray-500">
            No driver assigned yet
          </p>
        </div>
      )}
    </div>
  );
}
