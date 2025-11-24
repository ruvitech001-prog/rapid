export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms and Conditions</h1>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-slate-700 leading-relaxed">
              By accessing and using this website and service, you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use License</h2>
            <p className="text-slate-700 leading-relaxed">
              Permission is granted to temporarily download one copy of the materials (information or software) on
              Aether's website for personal, non-commercial transitory viewing only. This is the grant of a license,
              not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mt-4">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on the website</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transmitting the materials over a network</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Disclaimer</h2>
            <p className="text-slate-700 leading-relaxed">
              The materials on Aether's website are provided on an 'as is' basis. Aether makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Limitations</h2>
            <p className="text-slate-700 leading-relaxed">
              In no event shall Aether or its suppliers be liable for any damages (including, without limitation, damages
              for loss of data or profit, or due to business interruption) arising out of the use or inability to use
              the materials on Aether's website, even if Aether or a representative has been notified orally or in writing
              of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Accuracy of Materials</h2>
            <p className="text-slate-700 leading-relaxed">
              The materials appearing on Aether's website could include technical, typographical, or photographic errors.
              Aether does not warrant that any of the materials on its website are accurate, complete, or current. Aether
              may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Links</h2>
            <p className="text-slate-700 leading-relaxed">
              Aether has not reviewed all of the sites linked to its website and is not responsible for the contents of
              any such linked site. The inclusion of any link does not imply endorsement by Aether of the site. Use of
              any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Modifications</h2>
            <p className="text-slate-700 leading-relaxed">
              Aether may revise these terms of service for its website at any time without notice. By using this website,
              you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Governing Law</h2>
            <p className="text-slate-700 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction
              where Aether is located, and you irrevocably submit to the exclusive jurisdiction of the courts in that
              location.
            </p>
          </section>

          <section className="pt-8 border-t border-slate-200 mt-8">
            <p className="text-sm text-slate-600">
              Last updated: November 24, 2024
            </p>
            <p className="text-sm text-slate-600 mt-2">
              For questions about these terms, please contact us at support@aether.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
