import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-background-dark text-text-main dark:text-white p-6 md:p-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4 border-gray-200 dark:border-gray-800">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: May 25, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">1. Introduction</h2>
        <p className="leading-relaxed mb-4">
          Welcome to <strong>Auto Bhaiya</strong>, a product developed and managed by <strong>NAKPRC</strong>.
          We are committed to protecting your privacy and ensuring the security of your personal information.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">2. Information We Collect</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">A. Personal Identification Information</h3>
            <p className="leading-relaxed">
              We collect personal information that you provide to us, including but not limited to your name, phone number, and email address.
              To streamline onboarding, we utilize <strong>Truecaller Authentication</strong>. By using this feature, you agree that we may access your Truecaller profile information to verify your identity.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">B. Location Data (GPS)</h3>
            <p className="leading-relaxed">
              Auto Bhaiya provides essential transport and school support services. To facilitate real-time tracking, route optimization, and safety, we collect precise <strong>GPS location data</strong> from your device.
              <br />
              <span className="text-sm italic text-gray-600 dark:text-gray-400">
                Compliance Note: This data is collected and processed in accordance with Google Play and Apple App Store policies regarding background location access.
              </span>
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">C. Device and Usage Data</h3>
            <p className="leading-relaxed">
              We automatically collect information about your device, including IP address, device type, operating system, and app usage statistics to improve our service performance.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">3. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
          <li>To provide and maintain the Auto Bhaiya transport management services.</li>
          <li>To support school transport coordination and ensure student safety.</li>
          <li>To verify identities via Truecaller and prevent fraudulent accounts.</li>
          <li>To optimize routes and provide accurate ETA for transport services.</li>
          <li>To comply with legal obligations and app store requirements.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">4. Data Sharing and Third-Party Services</h2>
        <p className="leading-relaxed mb-4">
          We do not sell your personal data. However, we may share information with trusted third-party services necessary for the app's operation:
        </p>
        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
          <li><strong>Truecaller:</strong> For identity verification and authentication.</li>
          <li><strong>Google Maps / Mapbox:</strong> For location services and route visualization.</li>
          <li><strong>Cloud Infrastructure:</strong> For secure storage of application data.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">5. Data Retention and Deletion</h2>
        <p className="leading-relaxed mb-4">
          We retain your information for as long as your account is active or as needed to provide you services.
        </p>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium mb-2">Account Deletion Rights</h3>
          <p className="text-sm leading-relaxed">
            In compliance with App Store and Play Store guidelines, users have the right to delete their accounts.
            To request account deletion and the removal of all associated personal data, please contact us at <strong>support@nakprc.com</strong>.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">6. Security</h2>
        <p className="leading-relaxed">
          We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">7. Contact Us</h2>
        <p className="leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us:
          <br />
          <strong>NAKPRC</strong><br />
          Email: support@nakprc.com
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
