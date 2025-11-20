'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CloudUpload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function SubmitExpensePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: '',
    merchant: '',
    description: '',
    billFile: null as File | null,
  })

  const expenseCategories = [
    { value: 'travel', label: 'Travel', limit: 10000 },
    { value: 'food', label: 'Food & Meals', limit: 2000 },
    { value: 'accommodation', label: 'Accommodation', limit: 15000 },
    { value: 'internet', label: 'Internet & Phone', limit: 1500 },
    { value: 'office_supplies', label: 'Office Supplies', limit: 5000 },
    { value: 'client_entertainment', label: 'Client Entertainment', limit: 5000 },
    { value: 'other', label: 'Other', limit: 3000 },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, billFile: e.target.files[0] })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Expense submission:', formData)
    alert('Expense claim submitted successfully!')
    router.push('/employee/expenses/history')
  }

  const selectedCategory = expenseCategories.find(c => c.value === formData.category)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Submit Expense</h1>
        <p className="mt-1 text-sm text-muted-foreground">File a new expense reimbursement request</p>
      </div>

      {/* Expense Limits Info */}
      <Card className="bg-muted/30 border-muted">
        <CardHeader>
          <CardTitle className="text-sm">Expense Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {expenseCategories.slice(0, 4).map((cat) => (
              <div key={cat.value}>
                <p className="text-muted-foreground">{cat.label}</p>
                <p className="font-semibold mt-1">₹{cat.limit.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expense Form */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Expense Category *</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">Select Category</option>
                  {expenseCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {selectedCategory && (
                  <p className="text-xs text-muted-foreground">
                    Limit: ₹{selectedCategory.limit.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                  <Input
                    id="amount"
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
                {selectedCategory && formData.amount && parseFloat(formData.amount) > selectedCategory.limit && (
                  <p className="text-xs text-destructive">
                    Amount exceeds category limit!
                  </p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Expense Date *</Label>
                <Input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Merchant */}
              <div className="space-y-2">
                <Label htmlFor="merchant">Merchant/Vendor *</Label>
                <Input
                  id="merchant"
                  type="text"
                  name="merchant"
                  value={formData.merchant}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Uber, Swiggy, Hotel Name"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Provide details about the expense..."
                />
              </div>

              {/* File Upload */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="billFile">Upload Bill/Receipt *</Label>
                <div className="flex justify-center px-6 py-8 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="space-y-2 text-center">
                    <CloudUpload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <div className="flex flex-col sm:flex-row text-sm text-muted-foreground gap-1">
                      <label className="relative cursor-pointer text-primary font-medium hover:underline">
                        <span>Upload a file</span>
                        <input
                          id="billFile"
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleFileChange}
                          required
                          className="sr-only"
                        />
                      </label>
                      <p>or drag and drop</p>
                    </div>
                    <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
                    {formData.billFile && (
                      <p className="text-sm text-primary mt-2">
                        ✓ {formData.billFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="border border-border rounded-lg p-4 bg-muted/20">
              <h4 className="text-sm font-semibold mb-2">Important Notes:</h4>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Bills must be original and clearly readable</li>
                <li>Expenses older than 30 days may not be reimbursed</li>
                <li>GST bills are mandatory for claims above ₹2,500</li>
                <li>Reimbursement will be processed in the next payroll cycle</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit">
                Submit Expense Claim
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
