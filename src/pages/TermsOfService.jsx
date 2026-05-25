import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-background-dark text-text-main dark:text-white p-6 md:p-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4 border-gray-200 dark:border-gray-800">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: May 25, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">1. Agreement to Terms</h2>
        <p className="leading-relaxed">
          By accessing or using the <strong>Auto Bhaiya</strong> application, you agree to be bound by these Terms of Service.
          These terms are provided by <strong>NAKPRC</strong>. If you do not agree to all of these terms, you are prohibited from using the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">2. Description of Service</h2>
        <p className="leading-relaxed">
          Auto Bhaiya is a transport coordination platform designed to support drivers and school transport systems.
          The service provides tools for route management, student tracking, and communication.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">3. User Accounts & Authentication</h2>
        <div className="space-y-4">
          <p className="leading-relaxed">
            To use certain features, you must create an account. We utilize <strong>Truecaller Authentication</strong> to simplify this process.
            You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
          </p>
          <p className="leading-relaxed">
            You agree to provide accurate and complete information and to notify us immediately of any changes to your profile.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">4. Permitted Use & Restrictions</h2>
        <p className="leading-relaxed mb-4">
          You agree to use the service only for lawful purposes. You are prohibited from:
        </p>
        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
          <li>Using the service to engage in any illegal activity.</li>
          <li>Attempting to interfere with the proper working of the application or its servers.</li>
          <li>Using the platform to harass, threaten, or stalk any individual.</li>
          <li>Misrepresenting your identity or using another person's account.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">5. School Transport Support Clause</h2>
        <p className="leading-relaxed">
          When using Auto Bhaiya for school transport support, users agree to adhere to all local laws and school-specific safety regulations.
          NAKPRC provides the software tools for coordination but is not the transport provider.
          The responsibility for the actual physical transport, safety of students, and vehicle maintenance rests solely with the transport operator/driver.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">6. Limitation of Liability</h2>
        <p className="leading-relaxed">
          To the maximum extent permitted by law, <strong>NAKPRC</strong> and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data loss, or transport delays.
          Our total liability for any claim arising out of or relating to these terms shall not exceed the amount paid by you, if any, for using the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">7. Termination</h2>
        <p className="leading-relaxed">
          We reserve the right to suspend or terminate your account and access to the service at our sole discretion, without notice, for conduct that we believe violates these Terms of Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">8. Governing Law</h2>
        <p className="leading-relaxed">
          These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which NAKPRC is registered, without regard to its conflict of law provisions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">9. Contact Information</h2>
        <p className="leading-relaxed">
          For any questions regarding these Terms of Service, please contact:
          <br />
          <strong>NAKPRC</strong><br />
          Email: support@nakprc.com
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
