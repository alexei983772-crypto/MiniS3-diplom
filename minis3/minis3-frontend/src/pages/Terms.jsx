import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link
            to="/register"
            className="text-emerald-400 hover:text-emerald-300"
          >
            ← Back
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          Terms of Service
        </h1>

        <p className="text-slate-400 mb-12">
          Last Updated: June 4, 2026
        </p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. Description of Service
            </h2>

            <p>
              Mini-S3 provides cloud-based file storage,
              file management, and related services.
              We may modify, suspend, or discontinue
              parts of the Service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. Eligibility
            </h2>

            <p>
              You must be at least 13 years old to use
              the Service and have the legal capacity
              to agree to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. Account Registration
            </h2>

            <p>
              You are responsible for maintaining the
              security of your account credentials and
              for all activities that occur under your
              account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. Acceptable Use
            </h2>

            <ul className="list-disc ml-6 space-y-2">
              <li>
                Do not upload illegal or harmful content.
              </li>
              <li>
                Do not distribute malware or malicious
                software.
              </li>
              <li>
                Do not violate intellectual property
                rights.
              </li>
              <li>
                Do not attempt unauthorized access to
                systems or accounts.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. User Content
            </h2>

            <p>
              You retain ownership of your uploaded
              files. By uploading content, you grant
              Mini-S3 a limited license necessary to
              operate and provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Storage and Availability
            </h2>

            <p>
              We strive to provide reliable service but
              cannot guarantee uninterrupted access,
              permanent storage, or error-free
              operation. Users should maintain backups
              of important files.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Privacy
            </h2>

            <p>
              Your use of the Service is also governed
              by our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              8. Intellectual Property
            </h2>

            <p>
              The Mini-S3 platform, including its
              software, branding, design, and related
              materials, is protected by intellectual
              property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              9. Termination
            </h2>

            <p>
              We reserve the right to suspend or
              terminate accounts that violate these
              Terms or create security, legal, or
              operational risks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              10. Disclaimer of Warranties
            </h2>

            <p>
              THE SERVICE IS PROVIDED "AS IS" AND
              "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
              KIND.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              11. Limitation of Liability
            </h2>

            <p>
              Mini-S3 shall not be liable for data
              loss, lost profits, business interruption,
              or any indirect or consequential damages
              arising from the use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              12. Changes to These Terms
            </h2>

            <p>
              We may update these Terms from time to
              time. Continued use of the Service
              constitutes acceptance of any updates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              13. Contact
            </h2>

            <p>
              If you have any questions regarding these
              Terms, please contact the Mini-S3 support
              team.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}