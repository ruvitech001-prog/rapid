'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Edit,
  ChevronDown,
  ChevronUp,
  FileText,
  Eye,
  Download,
  MapPin,
  Briefcase,
  User,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useEmployee } from '@/lib/hooks'

// Helper function to get initials
function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// Helper function to calculate experience
function calculateExperience(joiningDate: string): string {
  const joining = new Date(joiningDate)
  const now = new Date()
  const diffMs = now.getTime() - joining.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const years = Math.floor(diffDays / 365)
  const months = Math.floor((diffDays % 365) / 30)

  if (years === 0) {
    return `${months} months`
  }
  return `${years} yrs ${months} months`
}

// Section component for collapsible sections
function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-[#DEE4EB] rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-[#F4F7FA] transition-colors"
      >
        <span className="text-base font-semibold text-[#353B41]">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-[#8593A3]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[#8593A3]" />
        )}
      </button>
      {isOpen && <div className="px-6 pb-6 bg-white">{children}</div>}
    </div>
  )
}

// Info field component
function InfoField({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-[#8593A3] uppercase tracking-wider">{label}</p>
      {typeof value === 'string' ? (
        <p className="text-sm font-medium text-[#353B41]">{value || '-'}</p>
      ) : (
        value
      )}
    </div>
  )
}

// Document card component
function DocumentCard({
  name,
  uploadedDate,
  onView,
  onDownload,
}: {
  name: string
  uploadedDate: string
  onView?: () => void
  onDownload?: () => void
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-xl border border-[#DEE4EB]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
          <FileText className="h-5 w-5 text-[#EF4444]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#353B41]">{name}</p>
          <p className="text-xs text-[#8593A3]">Uploaded on {uploadedDate}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#8593A3] hover:text-[#586AF5]"
          onClick={onView}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#8593A3] hover:text-[#586AF5]"
          onClick={onDownload}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function EmployeeDetailPage() {
  const params = useParams()
  const employeeId = params.id as string

  // Fetch employee data from backend
  const { data: employee, isLoading } = useEmployee(employeeId)

  // Documents tab state
  const [selectedDocCategory, setSelectedDocCategory] = useState('current_employment')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#642DFC]" />
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#8593A3]">Employee not found</p>
      </div>
    )
  }

  // Parse full name into first and last name
  const nameParts = employee.full_name?.split(' ') || ['Unknown']
  const firstName = nameParts[0] || 'Unknown'
  const lastName = nameParts.slice(1).join(' ') || ''
  const fullName = employee.full_name || 'Unknown'
  const initials = getInitials(firstName, lastName)
  const experience = employee.contract?.start_date
    ? calculateExperience(employee.contract.start_date)
    : 'N/A'
  const location = employee.contract?.work_location || 'Not specified'

  // Mock family data
  const familyMembers = [
    {
      name: 'Priya Singh',
      relationship: 'Spouse',
      dob: '1992-05-15',
      isNominee: true,
      isEmergencyContact: true,
      phone: '+91 9876543210',
    },
    {
      name: 'Raj Singh',
      relationship: 'Father',
      dob: '1960-08-20',
      isNominee: false,
      isEmergencyContact: false,
      phone: '+91 9876543211',
    },
    {
      name: 'Sunita Singh',
      relationship: 'Mother',
      dob: '1965-03-10',
      isNominee: false,
      isEmergencyContact: false,
      phone: '+91 9876543212',
    },
  ]

  // Mock education data
  const educationHistory = [
    {
      type: 'University',
      level: 'Bachelor of Technology',
      board: 'Rajasthan Technical University',
      institute: 'Engineering College, Jaipur',
      from: '2012-07-01',
      to: '2016-06-30',
      percentage: '78%',
      document: 'degree_certificate.pdf',
    },
    {
      type: 'School',
      level: '12th Standard',
      board: 'CBSE',
      institute: 'Delhi Public School, Jaipur',
      from: '2010-04-01',
      to: '2012-03-31',
      percentage: '85%',
      document: 'marksheet_12th.pdf',
    },
  ]

  // Mock employment history
  const employmentHistory = [
    {
      company: 'TechCorp India',
      designation: 'Software Developer',
      from: '2018-06-01',
      to: '2021-12-31',
      document: 'experience_letter.pdf',
    },
    {
      company: 'StartupXYZ',
      designation: 'Junior Developer',
      from: '2016-07-01',
      to: '2018-05-31',
      document: 'relieving_letter.pdf',
    },
  ]

  // Mock documents by category
  const documents: Record<string, { name: string; uploadedDate: string }[]> = {
    current_employment: [
      { name: 'Offer Letter.pdf', uploadedDate: '15 Jan 2024' },
      { name: 'Appointment Letter.pdf', uploadedDate: '20 Jan 2024' },
      { name: 'NDA Agreement.pdf', uploadedDate: '20 Jan 2024' },
    ],
    identity: [
      { name: 'Aadhaar Card.pdf', uploadedDate: '15 Jan 2024' },
      { name: 'PAN Card.pdf', uploadedDate: '15 Jan 2024' },
      { name: 'Passport.pdf', uploadedDate: '16 Jan 2024' },
    ],
    tax_declaration: [
      { name: 'Form 16 (2023-24).pdf', uploadedDate: '01 Jun 2024' },
      { name: 'Investment Proofs.pdf', uploadedDate: '15 Feb 2024' },
    ],
    previous_employment: [
      { name: 'Experience Letter - TechCorp.pdf', uploadedDate: '15 Jan 2024' },
      { name: 'Relieving Letter - StartupXYZ.pdf', uploadedDate: '15 Jan 2024' },
    ],
    education: [
      { name: 'Degree Certificate.pdf', uploadedDate: '15 Jan 2024' },
      { name: '12th Marksheet.pdf', uploadedDate: '15 Jan 2024' },
    ],
  }

  // Mock assets
  const assets = [
    {
      device: 'MacBook Pro 14"',
      id: 'ASSET-001',
      assignedOn: '20 Jan 2024',
      assignedBy: 'HR Admin',
      status: 'Active',
    },
    {
      device: 'Dell Monitor 27"',
      id: 'ASSET-002',
      assignedOn: '20 Jan 2024',
      assignedBy: 'HR Admin',
      status: 'Active',
    },
    {
      device: 'Logitech MX Keys',
      id: 'ASSET-003',
      assignedOn: '21 Jan 2024',
      assignedBy: 'IT Support',
      status: 'Active',
    },
  ]

  const documentCategories = [
    { id: 'current_employment', label: 'Current employment' },
    { id: 'identity', label: 'Identity' },
    { id: 'tax_declaration', label: 'Tax declaration proofs' },
    { id: 'previous_employment', label: 'Previous employment' },
    { id: 'education', label: 'Education' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href="/employer/employees">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-[#F4F7FA]"
            >
              <ArrowLeft className="h-5 w-5 text-[#353B41]" />
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center">
              <span className="text-xl font-semibold text-[#B91C1C]">{initials}</span>
            </div>

            {/* Info */}
            <div>
              <h1 className="text-2xl font-semibold text-[#353B41]">{fullName}</h1>
              <p className="text-sm text-[#8593A3] mt-0.5">{employee.contract?.designation || 'No designation'}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-[#8593A3]">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>ID: {employee.employee_code || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{experience}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          className="border-[#586AF5] text-[#586AF5] hover:bg-[#586AF5]/10"
        >
          <Link href={`/employer/employees/${employee.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full justify-start gap-1 bg-white border border-[#DEE4EB] rounded-xl p-1 h-auto">
          <TabsTrigger
            value="personal"
            className="px-4 py-2.5 rounded-lg text-sm font-medium data-[state=active]:bg-[#586AF5] data-[state=active]:text-white data-[state=inactive]:text-[#8593A3] data-[state=inactive]:hover:bg-[#F4F7FA]"
          >
            Personal
          </TabsTrigger>
          <TabsTrigger
            value="bank"
            className="px-4 py-2.5 rounded-lg text-sm font-medium data-[state=active]:bg-[#586AF5] data-[state=active]:text-white data-[state=inactive]:text-[#8593A3] data-[state=inactive]:hover:bg-[#F4F7FA]"
          >
            Bank
          </TabsTrigger>
          <TabsTrigger
            value="family"
            className="px-4 py-2.5 rounded-lg text-sm font-medium data-[state=active]:bg-[#586AF5] data-[state=active]:text-white data-[state=inactive]:text-[#8593A3] data-[state=inactive]:hover:bg-[#F4F7FA]"
          >
            Family
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="px-4 py-2.5 rounded-lg text-sm font-medium data-[state=active]:bg-[#586AF5] data-[state=active]:text-white data-[state=inactive]:text-[#8593A3] data-[state=inactive]:hover:bg-[#F4F7FA]"
          >
            Education
          </TabsTrigger>
          <TabsTrigger
            value="employment"
            className="px-4 py-2.5 rounded-lg text-sm font-medium data-[state=active]:bg-[#586AF5] data-[state=active]:text-white data-[state=inactive]:text-[#8593A3] data-[state=inactive]:hover:bg-[#F4F7FA]"
          >
            Employment history
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="px-4 py-2.5 rounded-lg text-sm font-medium data-[state=active]:bg-[#586AF5] data-[state=active]:text-white data-[state=inactive]:text-[#8593A3] data-[state=inactive]:hover:bg-[#F4F7FA]"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="assets"
            className="px-4 py-2.5 rounded-lg text-sm font-medium data-[state=active]:bg-[#586AF5] data-[state=active]:text-white data-[state=inactive]:text-[#8593A3] data-[state=inactive]:hover:bg-[#F4F7FA]"
          >
            Assets
          </TabsTrigger>
        </TabsList>

        {/* Personal Tab */}
        <TabsContent value="personal" className="mt-6 space-y-6">
          {/* Basic Details */}
          <CollapsibleSection title="Basic details">
            <div className="grid grid-cols-3 gap-6 pt-4">
              <InfoField
                label="DATE OF BIRTH"
                value={employee.date_of_birth
                  ? new Date(employee.date_of_birth).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Not provided'}
              />
              <InfoField
                label="GENDER"
                value={employee.gender
                  ? employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1)
                  : 'Not provided'}
              />
              <InfoField
                label="MARITAL STATUS"
                value={employee.marital_status
                  ? employee.marital_status.charAt(0).toUpperCase() + employee.marital_status.slice(1)
                  : 'Not provided'}
              />
            </div>
          </CollapsibleSection>

          {/* Contact Details */}
          <CollapsibleSection title="Contact details">
            <div className="grid grid-cols-2 gap-6 pt-4">
              <InfoField label="PERSONAL EMAIL" value={employee.email || employee.personal_email || 'Not provided'} />
              <InfoField label="PHONE NUMBER" value={employee.phone_number || 'Not provided'} />
            </div>
          </CollapsibleSection>

          {/* Identity Proof */}
          <CollapsibleSection title="Identity proof">
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-6">
                <InfoField label="PAN" value={employee.pan_number || 'Not provided'} />
                <InfoField label="AADHAAR CARD" value={employee.aadhaar_number || 'Not provided'} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <InfoField label="UAN NUMBER" value={employee.uan_number || 'Not provided'} />
                <InfoField label="ESIC NUMBER" value={employee.esic_number || 'Not provided'} />
              </div>
            </div>
          </CollapsibleSection>

          {/* Employment Details */}
          <CollapsibleSection title="Employment details">
            <div className="grid grid-cols-3 gap-6 pt-4">
              <InfoField label="EMPLOYEE CODE" value={employee.employee_code || 'Not assigned'} />
              <InfoField label="DESIGNATION" value={employee.contract?.designation || 'Not assigned'} />
              <InfoField label="DEPARTMENT" value={employee.contract?.department || 'Not assigned'} />
              <InfoField label="EMPLOYMENT TYPE" value={employee.contract?.employment_type || 'Not specified'} />
              <InfoField
                label="START DATE"
                value={employee.contract?.start_date
                  ? new Date(employee.contract.start_date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Not specified'}
              />
              <InfoField label="STATUS" value={employee.status || 'Active'} />
            </div>
          </CollapsibleSection>
        </TabsContent>

        {/* Bank Tab */}
        <TabsContent value="bank" className="mt-6 space-y-6">
          <CollapsibleSection title="Bank details">
            <div className="grid grid-cols-2 gap-6 pt-4">
              <InfoField label="ACCOUNT NUMBER" value="Bank details not available" />
              <InfoField label="BANK NAME" value="Contact HR for details" />
              <InfoField label="IFSC CODE" value="-" />
              <InfoField label="BANK BRANCH" value="-" />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Salary Information">
            <div className="grid grid-cols-3 gap-6 pt-4">
              <InfoField
                label="CTC"
                value={employee.contract?.ctc
                  ? `₹${Number(employee.contract.ctc).toLocaleString('en-IN')}`
                  : 'Not specified'}
              />
              <InfoField
                label="GROSS SALARY"
                value={employee.contract?.gross_salary
                  ? `₹${Number(employee.contract.gross_salary).toLocaleString('en-IN')}`
                  : 'Not specified'}
              />
              <InfoField
                label="BASIC SALARY"
                value={employee.contract?.basic_salary
                  ? `₹${Number(employee.contract.basic_salary).toLocaleString('en-IN')}`
                  : 'Not specified'}
              />
            </div>
          </CollapsibleSection>
        </TabsContent>

        {/* Family Tab */}
        <TabsContent value="family" className="mt-6">
          <div className="bg-white border border-[#DEE4EB] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#DEE4EB] bg-[#F9FAFB]">
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#8593A3] uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#8593A3] uppercase tracking-wider">
                    RELATIONSHIP
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#8593A3] uppercase tracking-wider">
                    DATE OF BIRTH
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#8593A3] uppercase tracking-wider">
                    NOMINEE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#8593A3] uppercase tracking-wider">
                    EMERGENCY CONTACT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#8593A3] uppercase tracking-wider">
                    PHONE NUMBER
                  </th>
                </tr>
              </thead>
              <tbody>
                {familyMembers.map((member, index) => (
                  <tr
                    key={index}
                    className={index !== familyMembers.length - 1 ? 'border-b border-[#DEE4EB]' : ''}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#353B41]">{member.name}</td>
                    <td className="px-6 py-4 text-sm text-[#8593A3]">{member.relationship}</td>
                    <td className="px-6 py-4 text-sm text-[#8593A3]">
                      {new Date(member.dob).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {member.isNominee ? (
                        <Badge className="bg-[#D1FAE5] text-[#065F46] text-xs">Yes</Badge>
                      ) : (
                        <span className="text-sm text-[#8593A3]">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {member.isEmergencyContact ? (
                        <Badge className="bg-[#FEF3C7] text-[#92400E] text-xs">Yes</Badge>
                      ) : (
                        <span className="text-sm text-[#8593A3]">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8593A3]">{member.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="mt-6 space-y-4">
          {educationHistory.map((edu, index) => (
            <CollapsibleSection key={index} title={edu.type} defaultOpen={index === 0}>
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-3 gap-6">
                  <InfoField label="EDUCATION LEVEL" value={edu.level} />
                  <InfoField label="BOARD NAME" value={edu.board} />
                  <InfoField label="INSTITUTE NAME" value={edu.institute} />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <InfoField
                    label="FROM"
                    value={new Date(edu.from).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  />
                  <InfoField
                    label="TO"
                    value={new Date(edu.to).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  />
                  <InfoField label="PERCENTAGE" value={edu.percentage} />
                </div>
                <div>
                  <p className="text-xs text-[#8593A3] uppercase tracking-wider mb-2">DOCUMENT</p>
                  <DocumentCard
                    name={edu.document}
                    uploadedDate="15 Jan 2024"
                    onView={() => console.log('View')}
                    onDownload={() => console.log('Download')}
                  />
                </div>
              </div>
            </CollapsibleSection>
          ))}
        </TabsContent>

        {/* Employment History Tab */}
        <TabsContent value="employment" className="mt-6 space-y-4">
          {employmentHistory.map((job, index) => (
            <CollapsibleSection key={index} title={`Previous job ${index + 1}`} defaultOpen={index === 0}>
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-6">
                  <InfoField label="COMPANY NAME" value={job.company} />
                  <InfoField label="DESIGNATION" value={job.designation} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <InfoField
                    label="FROM"
                    value={new Date(job.from).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  />
                  <InfoField
                    label="TO"
                    value={new Date(job.to).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  />
                </div>
                <div>
                  <p className="text-xs text-[#8593A3] uppercase tracking-wider mb-2">DOCUMENT</p>
                  <DocumentCard
                    name={job.document}
                    uploadedDate="15 Jan 2024"
                    onView={() => console.log('View')}
                    onDownload={() => console.log('Download')}
                  />
                </div>
              </div>
            </CollapsibleSection>
          ))}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6">
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white border border-[#DEE4EB] rounded-2xl p-2">
                {documentCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedDocCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      selectedDocCategory === category.id
                        ? 'bg-[#F6F2FF] text-[#642DFC]'
                        : 'text-[#8593A3] hover:bg-[#F4F7FA]'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Documents Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                {documents[selectedDocCategory]?.map((doc, index) => (
                  <DocumentCard
                    key={index}
                    name={doc.name}
                    uploadedDate={doc.uploadedDate}
                    onView={() => console.log('View', doc.name)}
                    onDownload={() => console.log('Download', doc.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="mt-6">
          <div className="bg-white border border-[#DEE4EB] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#DEE4EB] bg-[#F9FAFB]">
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#8593A3] uppercase tracking-wider">
                    DEVICE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#8593A3] uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#8593A3] uppercase tracking-wider">
                    ASSIGNED ON
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#8593A3] uppercase tracking-wider">
                    ASSIGNED BY
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#8593A3] uppercase tracking-wider">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr
                    key={index}
                    className={index !== assets.length - 1 ? 'border-b border-[#DEE4EB]' : ''}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#353B41]">{asset.device}</td>
                    <td className="px-6 py-4 text-sm text-[#8593A3]">{asset.id}</td>
                    <td className="px-6 py-4 text-sm text-[#8593A3]">{asset.assignedOn}</td>
                    <td className="px-6 py-4 text-sm text-[#8593A3]">{asset.assignedBy}</td>
                    <td className="px-6 py-4">
                      <Badge className="bg-[#D1FAE5] text-[#065F46] text-xs">{asset.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
