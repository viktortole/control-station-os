// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎯 MISSION TYPE ICON COMPONENT                                              │
// │ Icon mapping for different mission types                                    │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import React from 'react'
import { Target, AlertOctagon, Crosshair, Star } from 'lucide-react'

const MissionTypeIcon = ({ type }) => {
  const icons = {
    standard: Target,
    priority: AlertOctagon,
    critical: Crosshair,
    special: Star,
  }
  const Icon = icons[type] || Target
  return <Icon className="w-4 h-4" />
}

export default MissionTypeIcon