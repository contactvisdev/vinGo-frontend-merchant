import Topbar from "@/components/layouts/AuthLayout/Topbar";
import BaseCard from "@/components/ui/Card/Card";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();
  return (
    <>
      <Topbar />
      <div className="container mx-auto px-4 pb-10">
        <div
          className="flex gap-2 items-center text-left mt-4 cursor-pointer w-fit"
          onClick={() => navigate(-1)}
        >
          <i className="pi pi-chevron-left" style={{ fontSize: "20px" }}></i>
          <p className="2xl:text-base lg:text-sm text-xs font-medium">Back</p>
        </div>

        <BaseCard title="Terms & Conditions" extraClassName="mt-4">
          <p className="tos-last-updated">Last Updated: February 1, 2025</p>

          <div className="tos-content">
            <p className="tos-intro">
              Welcome to VinGo Merchant. These Terms and Conditions govern your use
              of the VinGo Merchant platform and services. By accessing or using
              our platform, you agree to be bound by these terms. Please read
              them carefully.
            </p>

            <div className="tos-section">
              <h3 className="tos-heading">1. Definitions</h3>
              <ul className="tos-list">
                <li>
                  <strong>"Platform"</strong> refers to the VinGo Merchant
                  application, website, and related services.
                </li>
                <li>
                  <strong>"Merchant"</strong> refers to any business or
                  individual registered on the platform to sell products or
                  services.
                </li>
                <li>
                  <strong>"Customer"</strong> refers to any end-user who
                  purchases products or services through the platform.
                </li>
                <li>
                  <strong>"Services"</strong> refers to all features,
                  functionalities, and tools provided by the platform.
                </li>
              </ul>
            </div>

            <div className="tos-section">
              <h3 className="tos-heading">2. Account Registration</h3>
              <p>
                To use the platform, you must create an account by providing
                accurate and complete information. You are responsible for
                maintaining the confidentiality of your account credentials and
                for all activities that occur under your account.
              </p>
              <ul className="tos-list">
                <li>You must be at least 18 years old to register.</li>
                <li>
                  You agree to provide truthful, accurate, and up-to-date
                  information during the registration process.
                </li>
                <li>
                  You are responsible for safeguarding your password and must
                  notify us immediately of any unauthorized access.
                </li>
              </ul>
            </div>

            <div className="tos-section">
              <h3 className="tos-heading">3. Merchant Obligations</h3>
              <p>As a merchant on our platform, you agree to:</p>
              <ul className="tos-list">
                <li>
                  Provide accurate product descriptions, pricing, and
                  availability information.
                </li>
                <li>
                  Fulfill orders in a timely manner and maintain the quality of
                  products and services.
                </li>
                <li>
                  Comply with all applicable local, state, and federal laws and
                  regulations.
                </li>
                <li>
                  Maintain all required licenses, permits, and certifications
                  for your business operations.
                </li>
                <li>
                  Respond to customer inquiries and complaints promptly and
                  professionally.
                </li>
              </ul>
            </div>

            <div className="tos-section">
              <h3 className="tos-heading">4. Payments & Fees</h3>
              <p>
                The platform facilitates payment processing between customers
                and merchants. By using our payment services, you agree to the
                following:
              </p>
              <ul className="tos-list">
                <li>
                  A service fee may be deducted from each transaction as
                  outlined in your merchant agreement.
                </li>
                <li>
                  Payouts are processed according to the schedule specified in
                  your account settings.
                </li>
                <li>
                  You are responsible for reporting and paying all applicable
                  taxes on your earnings.
                </li>
                <li>
                  Refunds and chargebacks will be handled in accordance with our
                  refund policy.
                </li>
              </ul>
            </div>

            <div className="tos-section">
              <h3 className="tos-heading">5. Prohibited Activities</h3>
              <p>You agree not to engage in any of the following activities:</p>
              <ul className="tos-list">
                <li>
                  Selling counterfeit, illegal, or prohibited items on the
                  platform.
                </li>
                <li>
                  Manipulating reviews, ratings, or any other feedback
                  mechanisms.
                </li>
                <li>
                  Using the platform for fraudulent or deceptive practices.
                </li>
                <li>
                  Attempting to gain unauthorized access to any part of the
                  platform or its systems.
                </li>
                <li>
                  Engaging in any activity that disrupts or interferes with the
                  platform's functionality.
                </li>
              </ul>
            </div>

            <div className="tos-section">
              <h3 className="tos-heading">6. Intellectual Property</h3>
              <p>
                All content, trademarks, and intellectual property on the
                platform are owned by VinGo Merchant or its licensors. You may not
                copy, reproduce, distribute, or create derivative works from any
                content on the platform without prior written consent.
              </p>
            </div>

            <div className="tos-section">
              <h3 className="tos-heading">7. Privacy & Data Protection</h3>
              <p>
                We are committed to protecting your privacy and personal data.
                Our collection, use, and disclosure of personal information is
                governed by our Privacy Policy. By using the platform, you
                consent to our data practices as described in the Privacy
                Policy.
              </p>
            </div>

            <div className="tos-section">
              <h3 className="tos-heading">8. Limitation of Liability</h3>
              <p>
                To the fullest extent permitted by law, VinGo Merchant shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages arising out of or related to your use of the
                platform. Our total liability shall not exceed the amount of
                fees paid by you in the twelve (12) months preceding the claim.
              </p>
            </div>

            <div className="tos-section">
              <h3 className="tos-heading">9. Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account at any
                time, with or without notice, for conduct that we believe
                violates these Terms and Conditions or is harmful to other
                users, us, or third parties, or for any other reason at our sole
                discretion.
              </p>
            </div>

            <div className="tos-section">
              <h3 className="tos-heading">10. Changes to Terms</h3>
              <p>
                We may update these Terms and Conditions from time to time. We
                will notify you of any significant changes via email or through
                a notification on the platform. Your continued use of the
                platform after such changes constitutes your acceptance of the
                updated terms.
              </p>
            </div>

            <div className="tos-section">
              <h3 className="tos-heading">11. Contact Us</h3>
              <p>
                If you have any questions or concerns about these Terms and
                Conditions, please contact us at:
              </p>
              <div className="tos-contact">
                <p>
                  <strong>Email:</strong> support@VinGomerchant.com
                </p>
                <p>
                  <strong>Phone:</strong> +1 (800) 123-4567
                </p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </>
  );
}
