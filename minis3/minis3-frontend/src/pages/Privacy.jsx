import { Link } from "react-router-dom";

export default function Privacy() {
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
          Privacy Policy
        </h1>

        <p className="text-slate-400 mb-12">
          Last Updated: June 4, 2026
        </p>

        <div className="space-y-8 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              1. Introduction
            </h2>

            <p>
              Mini-S3 ("we", "our", or "us") respects your privacy and
              is committed to protecting your personal information.
              This Privacy Policy explains what information we collect,
              how we use it, and what rights you have regarding your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              2. Information We Collect
            </h2>

            <p className="mb-3">
              We may collect the following information:
            </p>

            <ul className="list-disc ml-6 space-y-2">
              <li>Email address and account credentials.</li>
              <li>Files and content uploaded to the platform.</li>
              <li>Usage and activity information.</li>
              <li>Technical information such as IP address, browser type, and device information.</li>
              <li>Log data necessary for security and operational purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              3. How We Use Information
            </h2>

            <p className="mb-3">
              We use collected information to:
            </p>

            <ul className="list-disc ml-6 space-y-2">
              <li>Provide and maintain the Service.</li>
              <li>Authenticate users and secure accounts.</li>
              <li>Store and manage uploaded files.</li>
              <li>Improve performance and reliability.</li>
              <li>Respond to support requests.</li>
              <li>Detect abuse, fraud, and security threats.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              4. File Storage
            </h2>

            <p>
              Files uploaded to Mini-S3 are stored solely for the purpose
              of providing storage and file management services. We do not
              claim ownership of your content. You remain the owner of all
              files and data uploaded to your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              5. Data Sharing
            </h2>

            <p className="mb-3">
              We do not sell your personal information.
            </p>

            <p>
              We may share information only when necessary to:
            </p>

            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Comply with legal obligations.</li>
              <li>Protect the security and integrity of the Service.</li>
              <li>Respond to lawful requests from authorities.</li>
              <li>Prevent fraud, abuse, or illegal activities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              6. Data Security
            </h2>

            <p>
              We implement reasonable administrative, technical, and
              organizational measures to protect your information.
              However, no internet-based service can guarantee absolute
              security, and users are encouraged to use strong passwords
              and maintain their own backups.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              7. Data Retention
            </h2>

            <p>
              We retain account information and uploaded content for as
              long as necessary to provide the Service, comply with legal
              obligations, resolve disputes, and enforce our agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              8. Cookies and Analytics
            </h2>

            <p>
              Mini-S3 may use cookies, local storage, and similar
              technologies to maintain sessions, remember preferences,
              improve functionality, and analyze service performance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              9. Your Rights
            </h2>

            <p className="mb-3">
              Depending on applicable law, you may have the right to:
            </p>

            <ul className="list-disc ml-6 space-y-2">
              <li>Access your personal information.</li>
              <li>Correct inaccurate information.</li>
              <li>Request deletion of your account and data.</li>
              <li>Object to certain processing activities.</li>
              <li>Request a copy of your stored information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              10. Children's Privacy
            </h2>

            <p>
              The Service is not intended for children under the age of 13.
              We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              11. Changes to This Policy
            </h2>

            <p>
              We may update this Privacy Policy periodically. Any changes
              will be posted on this page together with an updated revision
              date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">
              12. Contact Information
            </h2>

            <p>
              If you have questions regarding this Privacy Policy or your
              personal data, please contact the Mini-S3 support team using
              the contact methods provided within the Service.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}