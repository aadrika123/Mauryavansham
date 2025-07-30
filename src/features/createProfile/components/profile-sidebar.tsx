"use client"

import { Card } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { User, Users, GraduationCap, Home, TreePine } from "lucide-react"

interface ProfileSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
  const tabs = [
    {
      id: "personal-info",
      label: "Personal Info",
      icon: User,
    },
    {
      id: "family-details",
      label: "Family Details",
      icon: Users,
    },
    {
      id: "education-career",
      label: "Education & Career",
      icon: GraduationCap,
    },
    {
      id: "lifestyle",
      label: "Lifestyle",
      icon: Home,
    },
    {
      id: "genealogy",
      label: "Genealogy",
      icon: TreePine,
    },
  ]

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Profile Sections</h2>
          <p className="text-sm text-gray-600 mt-1">Complete all sections for better matches</p>
        </div>

        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  activeTab === tab.id
                    ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
