import { Badge } from "@/src/components/ui/badge"
import { Crown, Shield, Star, Zap } from "lucide-react"
import type { SubscriptionTier } from "@/types/subscription"

interface SubscriptionBadgeProps {
  tier: SubscriptionTier
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const tierConfig = {
  free: {
    label: "Free",
    icon: Star,
    color: "bg-gray-100 text-gray-700 border-gray-300",
    iconColor: "text-gray-500",
  },
  basic: {
    label: "Basic",
    icon: Zap,
    color: "bg-blue-100 text-blue-700 border-blue-300",
    iconColor: "text-blue-600",
  },
  premium: {
    label: "Premium",
    icon: Crown,
    color: "bg-orange-100 text-orange-700 border-orange-300",
    iconColor: "text-orange-600",
  },
  elite: {
    label: "Elite",
    icon: Shield,
    color: "bg-purple-100 text-purple-700 border-purple-300",
    iconColor: "text-purple-600",
  },
}

const sizeConfig = {
  sm: { iconSize: "w-3 h-3", textSize: "text-xs", padding: "px-2 py-0.5" },
  md: { iconSize: "w-4 h-4", textSize: "text-sm", padding: "px-2 py-1" },
  lg: { iconSize: "w-5 h-5", textSize: "text-base", padding: "px-3 py-1.5" },
}

export function SubscriptionBadge({ tier, showLabel = true, size = "md", className = "" }: SubscriptionBadgeProps) {
  const config = tierConfig[tier]
  const sizeStyles = sizeConfig[size]
  const Icon = config.icon

  if (tier === "free" && !showLabel) return null

  return (
    <Badge className={`${config.color} ${sizeStyles.padding} ${sizeStyles.textSize} border font-semibold ${className}`}>
      <Icon className={`${sizeStyles.iconSize} ${config.iconColor} ${showLabel ? "mr-1" : ""}`} />
      {showLabel && config.label}
    </Badge>
  )
}
