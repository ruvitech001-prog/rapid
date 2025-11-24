'use client';

import { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function HelpPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer:
        'You can reset your password by clicking on "Forgot Password" on the login page. Enter your email address and follow the instructions sent to your inbox.',
    },
    {
      id: '2',
      question: 'How do I update my profile information?',
      answer:
        'Go to your Profile Settings from the sidebar menu. You can update your personal information, contact details, and preferences. Click Save to apply changes.',
    },
    {
      id: '3',
      question: 'How do I submit a leave request?',
      answer:
        'Navigate to Leave > Apply in the sidebar. Select the leave type, start date, end date, and reason. Click Submit to send your request for approval.',
    },
    {
      id: '4',
      question: 'How can I view my payslip?',
      answer:
        'Go to Payslips section from the sidebar. You can view, download, and print your payslips. You can also receive payslips via email by enabling the setting in your preferences.',
    },
    {
      id: '5',
      question: 'How do I submit an expense claim?',
      answer:
        'Click on Expenses > Submit in the sidebar. Upload receipts, enter the amount, category, and description. Submit for approval. Your manager will review and approve or reject the claim.',
    },
    {
      id: '6',
      question: 'How do I access the mobile app?',
      answer:
        'The platform is fully responsive and works on mobile devices. Simply visit the website on your mobile browser or download the official app from your device app store.',
    },
    {
      id: '7',
      question: 'How do I enable two-factor authentication?',
      answer:
        'Go to Settings > Security and click "Enable" next to Two-Factor Authentication. Follow the setup instructions to add an extra layer of security to your account.',
    },
    {
      id: '8',
      question: 'Who do I contact for technical support?',
      answer:
        'You can reach out to our support team through the Help Center or email support@rapid.one. Our team typically responds within 24 hours.',
    },
  ];

  const contactInfo = [
    { label: 'Email', value: 'support@rapid.one' },
    { label: 'Phone', value: '+91 1800-123-4567' },
    { label: 'Hours', value: 'Monday - Friday, 9 AM - 6 PM IST' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-lg text-gray-600">Find answers to your questions and get support</p>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((contact, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">{contact.label}</p>
              <p className="text-lg font-semibold text-gray-900">{contact.value}</p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-gray-900 text-left">{faq.question}</h3>
                    <span
                      className={`flex-shrink-0 ml-4 transform transition-transform ${
                        expandedId === faq.id ? 'rotate-180' : ''
                      }`}
                    >
                      <svg
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </span>
                  </button>
                  {expandedId === faq.id && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Contact our support team and we'll be happy to help.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
        </div>

        {/* Documentation Links */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Documentation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="#"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-1">User Guide</h4>
              <p className="text-sm text-gray-600">Learn how to use Rapid.one features</p>
            </a>
            <a
              href="#"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-1">Video Tutorials</h4>
              <p className="text-sm text-gray-600">Watch step-by-step video guides</p>
            </a>
            <a
              href="#"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-1">API Documentation</h4>
              <p className="text-sm text-gray-600">Integrate Rapid.one with your systems</p>
            </a>
            <a
              href="#"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-1">Status Page</h4>
              <p className="text-sm text-gray-600">Check system status and updates</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
