/**
 * Mock Data Utilities
 * Helper functions for generating mock data
 */

import { v4 as uuidv4 } from "crypto"

export function generateId(): string {
  return uuidv4()
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomBoolean(): boolean {
  return Math.random() > 0.5
}

export function getRandomEnum<T extends readonly string[]>(values: T): T[number] {
  return values[Math.floor(Math.random() * values.length)]
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days)
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

// Indian names and data
export const FIRST_NAMES = [
  "Amit",
  "Ananya",
  "Arjun",
  "Deepak",
  "Divya",
  "Gaurav",
  "Harish",
  "Ishita",
  "Jaswant",
  "Karan",
  "Kavya",
  "Madhav",
  "Maya",
  "Nikhil",
  "Pooja",
  "Rahul",
  "Rajesh",
  "Riya",
  "Sandeep",
  "Sneha",
  "Sundar",
  "Tanya",
  "Varun",
  "Vikram",
  "Vikas",
]

export const LAST_NAMES = [
  "Sharma",
  "Kumar",
  "Singh",
  "Patel",
  "Verma",
  "Gupta",
  "Jain",
  "Reddy",
  "Rao",
  "Pandey",
  "Tripathi",
  "Mishra",
  "Yadav",
  "Krishnan",
  "Iyer",
  "Menon",
  "Nair",
  "Bhat",
  "Desai",
  "Kapoor",
]

export const COMPANY_NAMES = [
  "TechVision India",
  "CloudFirst Solutions",
  "DataHub Systems",
  "InnovateTech Ltd",
  "FutureWorks India",
  "DigitalFirst Corp",
  "SmartBuild Systems",
  "NextGen Technologies",
  "ProTech Solutions",
  "VentureTech India",
]

export const DESIGNATIONS = [
  "Software Engineer",
  "Senior Developer",
  "Tech Lead",
  "Product Manager",
  "UI/UX Designer",
  "Data Scientist",
  "DevOps Engineer",
  "QA Engineer",
  "Business Analyst",
  "HR Manager",
  "Finance Manager",
  "Sales Executive",
  "Marketing Manager",
]

export const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Operations",
  "Finance",
  "Human Resources",
  "Sales",
  "Marketing",
]

export const REQUEST_TYPES = [
  "equipment",
  "gift",
  "salary_amendment",
  "promotion",
  "termination",
  "resignation",
  "probation_extension",
  "office_space",
]

export const LEAVE_TYPES = [
  "casual",
  "sick",
  "earned",
  "special",
  "maternity",
  "paternity",
  "unpaid",
]

export const LEAVE_STATUSES = ["pending", "approved", "rejected", "cancelled"]

export const REQUEST_STATUSES = [
  "pending",
  "in_progress",
  "completed",
  "rejected",
  "cancelled",
]

export const PAYMENT_STATUSES = ["pending", "processed", "failed", "cancelled"]

export const EXPENSE_CATEGORIES = [
  "travel",
  "accommodation",
  "meals",
  "equipment",
  "software",
  "training",
  "other",
]

export function generateRandomEmail(firstName: string, lastName: string): string {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`
}

export function generateRandomPhone(): string {
  return `+91 ${getRandomNumber(6000000000, 9999999999)}`
}

export function generatePAN(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let pan = ""
  for (let i = 0; i < 5; i++) {
    pan += letters[Math.floor(Math.random() * 26)]
  }
  pan += getRandomNumber(1000, 9999)
  for (let i = 0; i < 3; i++) {
    pan += letters[Math.floor(Math.random() * 26)]
  }
  return pan
}

export function generateAadhaar(): string {
  return getRandomNumber(100000000000, 999999999999).toString()
}

export function generateUAN(): string {
  return `${getRandomNumber(100, 999)}-${getRandomNumber(1000000, 9999999)}-${getRandomNumber(
    0,
    99,
  )}`
}

export function generatePFAccount(): string {
  return `${getRandomNumber(1000, 9999)}-${getRandomNumber(1000000, 9999999)}`
}

export function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

// Calculate age from DOB
export function calculateAge(dob: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return age
}
