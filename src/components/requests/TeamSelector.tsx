'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface Team {
  id: string
  name: string
  description?: string
  memberCount?: number
}

interface TeamSelectorProps {
  label?: string
  helpText?: string
  value: Team | null
  onChange: (team: Team | null) => void
  teams: Team[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

const inputClass = "w-full h-10 px-3 py-2 rounded-lg border border-[#DEE4EB] bg-white text-sm focus:border-[#642DFC] focus:outline-none focus:ring-2 focus:ring-[#642DFC]/20"

export function TeamSelector({
  label = 'Team',
  helpText,
  value,
  onChange,
  teams,
  placeholder = 'Select team',
  disabled = false,
  required = false,
}: TeamSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (team: Team) => {
    onChange(team)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div className="space-y-1.5" ref={containerRef}>
      {label && (
        <Label className="text-sm font-medium text-gray-900">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="relative">
        <button
          type="button"
          className={`
            ${inputClass}
            flex items-center justify-between
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className={value ? 'text-gray-900' : 'text-gray-400'}>
            {value ? value.name : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[#DEE4EB] rounded-lg shadow-lg overflow-hidden">
            {/* Search input */}
            <div className="p-2 border-b border-[#DEE4EB]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  className="pl-9 h-9"
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Team list */}
            <div className="max-h-60 overflow-y-auto">
              {filteredTeams.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No teams found
                </div>
              ) : (
                filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    className={`
                      px-4 py-3 cursor-pointer transition-colors
                      hover:bg-[#642DFC]/5
                      ${value?.id === team.id ? 'bg-[#642DFC]/10' : ''}
                    `}
                    onClick={() => handleSelect(team)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#642DFC]/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-[#642DFC]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{team.name}</p>
                        {team.description && (
                          <p className="text-xs text-gray-500 truncate">{team.description}</p>
                        )}
                      </div>
                      {team.memberCount !== undefined && (
                        <span className="text-xs text-gray-400">
                          {team.memberCount} members
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {helpText && <p className="text-xs text-[#8593A3]">{helpText}</p>}
    </div>
  )
}
