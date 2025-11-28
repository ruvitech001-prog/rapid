/**
 * Mock Employee Data Generator
 */

import {
  generateId,
  FIRST_NAMES,
  LAST_NAMES,
  DESIGNATIONS,
  DEPARTMENTS,
  INDIAN_CITIES,
  generateRandomEmail,
  generateRandomPhone,
  generatePAN,
  generateAadhaar,
  generateUAN,
  generatePFAccount,
  formatDate,
  subtractDays,
  getRandomElement,
  getRandomNumber,
} from "./utils"

export interface MockEmployee {
  id: string
  user_id: string
  company_id: string
  team_id: string
  team_name: string
  employee_code: string
  first_name: string
  last_name: string
  email: string
  phone: string
  designation: string
  department: string
  employment_type: "full_time" | "part_time" | "contract" | "intern"
  joining_date: string
  salary_structure_id: string
  status: "active" | "probation" | "resigned" | "terminated" | "on_leave"
  badge_status: "none" | "ex_employee" | "manager" | "on_notice_period"
  reporting_manager_id: string | null
  reporting_manager_name: string | null
  personal_details: {
    date_of_birth: string
    gender: "male" | "female" | "other"
    marital_status: "single" | "married" | "divorced" | "widowed"
    pan: string
    aadhaar: string
    address: {
      country: string
      address_line_1: string
      address_line_2: string
      pin: string
      city: string
      state: string
    }
  }
  statutory_details: {
    uan: string
    pf_account: string
    bank_account: string
    bank_name: string
    ifsc_code: string
  }
  created_at: string
  updated_at: string
}

export function generateMockEmployees(count: number = 25, company_id: string = ""): MockEmployee[] {
  const employees: MockEmployee[] = []
  const designations = [...DESIGNATIONS]
  const departments = [...DEPARTMENTS]
  const teams = ["Design", "Engineering", "Product", "Marketing", "Sales", "Operations", "HR", "Finance"]
  const managerNames = ["Ronak Singhavi", "Priya Sharma", "Amit Kumar", "Sneha Gupta", "Vikram Singh"]

  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(FIRST_NAMES)
    const lastName = getRandomElement(LAST_NAMES)
    const designation = getRandomElement(designations)
    const department = getRandomElement(departments)
    const teamName = getRandomElement(teams)

    const joiningDate = subtractDays(new Date(), getRandomNumber(30, 730))

    // Assign badge statuses with realistic distribution
    let badgeStatus: "none" | "ex_employee" | "manager" | "on_notice_period" = "none"
    if (i === 1) badgeStatus = "ex_employee" // Second employee is ex-employee
    else if (i === 2) badgeStatus = "on_notice_period" // Third is on notice
    else if (i === 3) badgeStatus = "manager" // Fourth is manager
    else if (i % 8 === 0) badgeStatus = "manager" // Every 8th is a manager
    else if (i % 12 === 0) badgeStatus = "ex_employee"
    else if (i % 15 === 0) badgeStatus = "on_notice_period"

    employees.push({
      id: generateId(),
      user_id: generateId(),
      company_id: company_id || generateId(),
      team_id: generateId(),
      team_name: teamName,
      employee_code: `${234 + i}`,
      first_name: firstName,
      last_name: lastName,
      email: generateRandomEmail(firstName, lastName),
      phone: generateRandomPhone(),
      designation,
      department,
      employment_type: getRandomElement(["full_time", "part_time", "contract"] as const),
      joining_date: formatDate(joiningDate),
      salary_structure_id: generateId(),
      status: getRandomElement(["active", "probation", "active"] as const), // More active employees
      badge_status: badgeStatus,
      reporting_manager_id: i === 0 ? null : generateId(),
      reporting_manager_name: i === 0 ? null : getRandomElement(managerNames),
      personal_details: {
        date_of_birth: formatDate(
          subtractDays(new Date(), getRandomNumber(20000, 17520)), // 20-48 years old
        ),
        gender: getRandomElement(["male", "female"] as const),
        marital_status: getRandomElement([
          "single",
          "married",
          "single",
          "married",
        ] as const),
        pan: generatePAN(),
        aadhaar: generateAadhaar(),
        address: (() => {
          const statesWithCities = Object.keys(INDIAN_CITIES) as Array<keyof typeof INDIAN_CITIES>
          const state = getRandomElement(statesWithCities)
          const cities = INDIAN_CITIES[state]
          const city = getRandomElement(cities)
          const streetNames = ["MG Road", "Park Street", "Gandhi Nagar", "Sector", "Ashok Vihar", "Rajiv Colony", "Nehru Place", "Green Park"]
          const localities = ["Phase 1", "Phase 2", "Block A", "Block B", "Near Metro Station", "Near Hospital", "Main Road"]
          return {
            country: "India",
            address_line_1: `${getRandomNumber(1, 999)}, ${getRandomElement(streetNames)}`,
            address_line_2: `${getRandomElement(localities)}, ${city}`,
            pin: `${getRandomNumber(100000, 999999)}`,
            city,
            state,
          }
        })(),
      },
      statutory_details: {
        uan: generateUAN(),
        pf_account: generatePFAccount(),
        bank_account: `${getRandomNumber(10000000000000, 99999999999999)}`,
        bank_name: getRandomElement([
          "HDFC Bank",
          "ICICI Bank",
          "Axis Bank",
          "IDBI Bank",
          "BOI",
        ]),
        ifsc_code: `${getRandomElement(["HDFC", "ICIC", "UTIB", "IDBI", "BKID"])}0000001`,
      },
      created_at: formatDate(joiningDate),
      updated_at: formatDate(new Date()),
    })
  }

  return employees
}

export interface MockEmployeeProfile {
  id: string
  employee_id: string
  profile_image_url: string | null
  bio: string
  emergency_contact_name: string
  emergency_contact_phone: string
  emergency_contact_relationship: string
  verified_fields: string[]
  created_at: string
}

export function generateMockEmployeeProfiles(
  employee_ids: string[],
): MockEmployeeProfile[] {
  return employee_ids.map((employee_id) => ({
    id: generateId(),
    employee_id,
    profile_image_url: null,
    bio: "Dedicated professional",
    emergency_contact_name: getRandomElement(FIRST_NAMES),
    emergency_contact_phone: generateRandomPhone(),
    emergency_contact_relationship: getRandomElement([
      "spouse",
      "parent",
      "sibling",
      "child",
    ]),
    verified_fields: ["pan", "aadhaar", "email"],
    created_at: formatDate(new Date()),
  }))
}

export interface MockEmployeeLeaveBalance {
  id: string
  employee_id: string
  leave_type: string
  total_days: number
  used_days: number
  available_days: number
  carryforward_days: number
  financial_year: string
  created_at: string
}

export function generateMockEmployeeLeaveBalances(
  employee_ids: string[],
): MockEmployeeLeaveBalance[] {
  const balances: MockEmployeeLeaveBalance[] = []
  const leaveTypes = ["casual", "sick", "earned"]
  const totalDays = { casual: 8, sick: 7, earned: 20 }

  employee_ids.forEach((employee_id) => {
    leaveTypes.forEach((leaveType) => {
      const total = totalDays[leaveType as keyof typeof totalDays]
      const used = getRandomNumber(0, total - 2)

      balances.push({
        id: generateId(),
        employee_id,
        leave_type: leaveType,
        total_days: total,
        used_days: used,
        available_days: total - used,
        carryforward_days: getRandomNumber(0, 5),
        financial_year: "2024-2025",
        created_at: formatDate(new Date()),
      })
    })
  })

  return balances
}

export interface MockEmployeeAsset {
  id: string
  employee_id: string
  asset_type: string
  asset_code: string
  description: string
  allocation_date: string
  return_date: string | null
  status: "allocated" | "returned" | "lost"
  created_at: string
}

export function generateMockEmployeeAssets(
  employee_ids: string[],
  countPerEmployee: number = 2,
): MockEmployeeAsset[] {
  const assets: MockEmployeeAsset[] = []
  const assetTypes = ["laptop", "phone", "tablet", "monitor", "headphones", "keyboard"]

  employee_ids.forEach((employee_id) => {
    for (let i = 0; i < countPerEmployee; i++) {
      const assetType = getRandomElement(assetTypes)
      const allocationDate = subtractDays(new Date(), getRandomNumber(30, 365))

      assets.push({
        id: generateId(),
        employee_id,
        asset_type: assetType,
        asset_code: `ASSET${getRandomNumber(10000, 99999)}`,
        description: `${assetType} for employee`,
        allocation_date: formatDate(allocationDate),
        return_date: null,
        status: "allocated",
        created_at: formatDate(allocationDate),
      })
    }
  })

  return assets
}
