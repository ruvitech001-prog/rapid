'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, MessageSquare, Phone, Mail, Search, ChevronRight } from 'lucide-react'

export default function HelpPage() {
  const faqCategories = [
    {
      category: 'Getting Started',
      questions: [
        { q: 'How do I set up my account?', a: 'You can set up your account by...' },
        { q: 'What are the system requirements?', a: 'The system requires...' },
        { q: 'How do I invite team members?', a: 'To invite team members...' },
      ],
    },
    {
      category: 'Payroll Management',
      questions: [
        { q: 'How do I run payroll?', a: 'To run payroll...' },
        { q: 'Can I customize payroll cycles?', a: 'Yes, you can customize...' },
        { q: 'How are taxes calculated?', a: 'Taxes are calculated based on...' },
      ],
    },
    {
      category: 'Invoice Management',
      questions: [
        { q: 'How do I generate invoices?', a: 'Invoices can be generated...' },
        { q: 'Can I schedule automatic invoices?', a: 'Yes, you can set up automatic...' },
        { q: 'What invoice formats are supported?', a: 'We support PDF and...' },
      ],
    },
  ]

  const contactMethods = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: 'Start Chat',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email at support@rapid.one',
      action: 'Send Email',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us at +91 1234-567890',
      action: 'Call Now',
    },
  ]

  const helpResources = [
    {
      title: 'User Guide',
      description: 'Complete guide to using the platform',
      icon: BookOpen,
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: BookOpen,
    },
    {
      title: 'API Documentation',
      description: 'For developers integrating with our API',
      icon: BookOpen,
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: MessageSquare,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground mt-2">Find answers and get support</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search help topics..." className="pl-10 h-10" />
          </div>
        </CardContent>
      </Card>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactMethods.map((method) => {
          const Icon = method.icon
          return (
            <Card key={method.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                <Button variant="outline" className="w-full">
                  {method.action}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Help Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Help Resources</CardTitle>
          <CardDescription>Browse our knowledge base</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpResources.map((resource) => {
              const _Icon = resource.icon
              return (
                <div key={resource.title} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{resource.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        {faqCategories.map((cat) => (
          <Card key={cat.category}>
            <CardHeader>
              <CardTitle className="text-base">{cat.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cat.questions.map((item, idx) => (
                  <div key={idx} className="border-b last:border-0 pb-3 last:pb-0">
                    <details className="group">
                      <summary className="cursor-pointer font-medium text-sm hover:text-primary transition-colors flex items-center justify-between">
                        <span>{item.q}</span>
                        <ChevronRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
                      </summary>
                      <p className="text-sm text-muted-foreground mt-2">{item.a}</p>
                    </details>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Still Need Help */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
          <CardDescription>We're here to assist you</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Can't find what you're looking for? Our support team is available 24/7 to help.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
