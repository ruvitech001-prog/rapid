export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-700 leading-relaxed">
              Aether ("we", "our", or "us") operates the website. This page informs you of our policies regarding the
              collection, use, and disclosure of personal data when you use our service and the choices you have
              associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information Collection and Use</h2>
            <p className="text-slate-700 leading-relaxed">
              We collect several different types of information for various purposes to provide and improve our service
              to you.
            </p>
            <h3 className="text-xl font-semibold text-slate-800 mt-4 mb-2">Types of Data Collected:</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li><strong>Personal Data:</strong> Email address, first name and last name, phone number, address, state, province, ZIP/postal code, city</li>
              <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time and date of visits, time spent on pages</li>
              <li><strong>Device Data:</strong> Device type, operating system, unique device identifiers</li>
              <li><strong>Cookies and Similar Tracking Technologies</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Use of Data</h2>
            <p className="text-slate-700 leading-relaxed">
              Aether uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mt-4">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Security of Data</h2>
            <p className="text-slate-700 leading-relaxed">
              The security of your data is important to us but remember that no method of transmission over the Internet
              or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to
              protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Changes to This Privacy Policy</h2>
            <p className="text-slate-700 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "effective date" at the bottom of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Contact Us</h2>
            <p className="text-slate-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mt-4">
              <li>By email: privacy@aether.com</li>
              <li>By phone: +1-800-XXX-XXXX</li>
              <li>By mail: Aether Inc., Address, City, State, ZIP Code</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Your Rights</h2>
            <p className="text-slate-700 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mt-4">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to our use of your personal data</li>
              <li>Request restriction of processing of your personal data</li>
              <li>Request portability of your personal data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Cookies</h2>
            <p className="text-slate-700 leading-relaxed">
              We use cookies to enhance your experience. You can instruct your browser to refuse all cookies or to
              indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use
              some portions of our service.
            </p>
          </section>

          <section className="pt-8 border-t border-slate-200 mt-8">
            <p className="text-sm text-slate-600">
              Last updated: November 24, 2024
            </p>
            <p className="text-sm text-slate-600 mt-2">
              This Privacy Policy is effective as of the date listed above.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
