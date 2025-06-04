// ╭──────────────────────────────────────────────────────────────────────────────╮
// │ 🎖️ MILITARY INSIGNIA SYSTEM - CONTROL STATION OS V3.0                      │
// │ Complete Military Occupational Specialty (MOS) Classification System       │
// │ Professional military rank insignia, specializations, and visual hierarchy  │
// ╰──────────────────────────────────────────────────────────────────────────────╯

import {
  Shield, Crosshair, Radio, Zap, Activity, Terminal, Navigation, Wrench, Eye, 
  Layers, Award, Anchor, Brain, Heart, Flame, Sparkles, Mountain, Skull,
  Target, Lock, Wifi, Satellite, Database, Cpu, AlertTriangle, FileText,
  Globe, Radar, Headphones, Camera, Settings, Monitor, Truck, Plane
} from 'lucide-react'

/**
 * ENHANCED MILITARY OCCUPATIONAL SPECIALTIES (MOS)
 * Based on real military classifications with enhanced visual appeal
 * Each MOS includes designation codes, comprehensive descriptions, and visual hierarchy
 */
export const MILITARY_SPECIALIZATIONS = [
  // COMBAT ARMS
  {
    id: 'infantry',
    designation: '11B',
    name: 'INFANTRY',
    branch: 'Combat Arms',
    icon: Crosshair,
    description: 'Frontline Combat Operations',
    fullDescription: 'Elite infantry specialists trained in direct ground combat, urban warfare, and tactical operations. Masters of weapon systems and battlefield coordination.',
    primaryColor: '#DC2626',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/40',
    textColor: 'text-red-400',
    glowColor: 'shadow-red-500/30',
    rank: 'Combat Specialist',
    clearanceLevel: 'SECRET',
    requirements: ['Physical Fitness', 'Weapon Proficiency', 'Team Leadership'],
    specialties: ['Urban Combat', 'Reconnaissance', 'Fire Team Leadership']
  },
  {
    id: 'armor',
    designation: '19K',
    name: 'ARMOR',
    branch: 'Combat Arms',
    icon: Shield,
    description: 'Armored Vehicle Operations',
    fullDescription: 'Heavy armor specialists operating main battle tanks, armored personnel carriers, and mechanized warfare systems. Strategic battlefield dominance.',
    primaryColor: '#059669',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    glowColor: 'shadow-emerald-500/30',
    rank: 'Tank Commander',
    clearanceLevel: 'SECRET',
    requirements: ['Mechanical Aptitude', 'Navigation Skills', 'Team Coordination'],
    specialties: ['Tank Operations', 'Gunnery', 'Maintenance']
  },
  {
    id: 'artillery',
    designation: '13B',
    name: 'ARTILLERY',
    branch: 'Combat Arms',
    icon: Target,
    description: 'Fire Support Operations',
    fullDescription: 'Long-range fire support specialists delivering precision strikes with howitzers, rockets, and guided munitions. Masters of ballistics and target acquisition.',
    primaryColor: '#D97706',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-400',
    glowColor: 'shadow-amber-500/30',
    rank: 'Fire Support Specialist',
    clearanceLevel: 'SECRET',
    requirements: ['Mathematical Precision', 'Communication Skills', 'Technical Expertise'],
    specialties: ['Ballistics', 'Forward Observation', 'Digital Fire Control']
  },

  // INTELLIGENCE & SURVEILLANCE
  {
    id: 'intelligence',
    designation: '35N',
    name: 'INTELLIGENCE',
    branch: 'Intelligence',
    icon: Eye,
    description: 'Signals Intelligence Operations',
    fullDescription: 'Elite intelligence analysts specializing in signals interception, data analysis, and threat assessment. Critical to mission success and force protection.',
    primaryColor: '#7C3AED',
    bgColor: 'bg-violet-500/20',
    borderColor: 'border-violet-500/40',
    textColor: 'text-violet-400',
    glowColor: 'shadow-violet-500/30',
    rank: 'Intelligence Analyst',
    clearanceLevel: 'TOP SECRET/SCI',
    requirements: ['Analytical Skills', 'Language Proficiency', 'Technical Aptitude'],
    specialties: ['SIGINT', 'Threat Analysis', 'Briefing Preparation']
  },
  {
    id: 'counterintel',
    designation: '35S',
    name: 'COUNTERINTELLIGENCE',
    branch: 'Intelligence',
    icon: Lock,
    description: 'Security & Counterintelligence',
    fullDescription: 'Special security investigators protecting classified information and conducting counterintelligence operations against foreign intelligence threats.',
    primaryColor: '#1F2937',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500/40',
    textColor: 'text-gray-400',
    glowColor: 'shadow-gray-500/30',
    rank: 'Security Specialist',
    clearanceLevel: 'TOP SECRET/SCI',
    requirements: ['Investigation Skills', 'Interview Techniques', 'Report Writing'],
    specialties: ['Security Clearance Investigations', 'Threat Mitigation', 'OPSEC']
  },

  // COMMUNICATIONS & CYBER
  {
    id: 'signal',
    designation: '25B',
    name: 'SIGNAL',
    branch: 'Signal Corps',
    icon: Radio,
    description: 'Information Technology Operations',
    fullDescription: 'Advanced communications specialists maintaining secure networks, satellite systems, and battlefield communications. Digital backbone of military operations.',
    primaryColor: '#0EA5E9',
    bgColor: 'bg-sky-500/20',
    borderColor: 'border-sky-500/40',
    textColor: 'text-sky-400',
    glowColor: 'shadow-sky-500/30',
    rank: 'IT Specialist',
    clearanceLevel: 'SECRET',
    requirements: ['Technical Certifications', 'Network Knowledge', 'Problem Solving'],
    specialties: ['Network Administration', 'Satellite Communications', 'Cybersecurity']
  },
  {
    id: 'cyber',
    designation: '17C',
    name: 'CYBER OPERATIONS',
    branch: 'Cyber Command',
    icon: Terminal,
    description: 'Cyber Warfare & Defense',
    fullDescription: 'Elite cyber warriors conducting defensive and offensive cyber operations. Protecting critical infrastructure and conducting digital warfare operations.',
    primaryColor: '#06B6D4',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/40',
    textColor: 'text-cyan-400',
    glowColor: 'shadow-cyan-500/30',
    rank: 'Cyber Warrior',
    clearanceLevel: 'TOP SECRET/SCI',
    requirements: ['Programming Skills', 'Network Security', 'Ethical Hacking'],
    specialties: ['Penetration Testing', 'Incident Response', 'Digital Forensics']
  },

  // AVIATION
  {
    id: 'pilot',
    designation: '15A',
    name: 'AVIATION',
    branch: 'Aviation',
    icon: Navigation,
    description: 'Rotary Wing Operations',
    fullDescription: 'Elite helicopter pilots conducting air assault, medical evacuation, and close air support missions. Masters of three-dimensional battlefield operations.',
    primaryColor: '#8B5CF6',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/40',
    textColor: 'text-purple-400',
    glowColor: 'shadow-purple-500/30',
    rank: 'Aviator',
    clearanceLevel: 'SECRET',
    requirements: ['Flight Training', 'Spatial Awareness', 'Quick Decision Making'],
    specialties: ['Air Assault', 'MEDEVAC', 'Close Air Support']
  },
  {
    id: 'uav',
    designation: '15W',
    name: 'UNMANNED AVIATION',
    branch: 'Aviation',
    icon: Plane,
    description: 'Drone Operations & ISR',
    fullDescription: 'Unmanned aircraft specialists conducting intelligence, surveillance, reconnaissance, and precision strike operations using advanced drone systems.',
    primaryColor: '#6366F1',
    bgColor: 'bg-indigo-500/20',
    borderColor: 'border-indigo-500/40',
    textColor: 'text-indigo-400',
    glowColor: 'shadow-indigo-500/30',
    rank: 'UAV Operator',
    clearanceLevel: 'SECRET',
    requirements: ['Remote Piloting', 'Sensor Operation', 'Mission Planning'],
    specialties: ['ISR Operations', 'Target Identification', 'Data Exploitation']
  },

  // MEDICAL & SUPPORT
  {
    id: 'medic',
    designation: '68W',
    name: 'COMBAT MEDIC',
    branch: 'Medical Corps',
    icon: Activity,
    description: 'Battlefield Medical Operations',
    fullDescription: 'Life-saving medical professionals providing emergency trauma care under fire. Dual-trained in combat operations and advanced medical procedures.',
    primaryColor: '#EF4444',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/40',
    textColor: 'text-red-400',
    glowColor: 'shadow-red-500/30',
    rank: 'Combat Medic',
    clearanceLevel: 'SECRET',
    requirements: ['Medical Training', 'Combat Skills', 'Stress Management'],
    specialties: ['Trauma Surgery', 'Emergency Medicine', 'Combat Casualty Care']
  },
  {
    id: 'logistics',
    designation: '92A',
    name: 'LOGISTICS',
    branch: 'Quartermaster',
    icon: Truck,
    description: 'Supply Chain Operations',
    fullDescription: 'Critical supply chain specialists ensuring continuous flow of equipment, ammunition, fuel, and supplies to forward operating units.',
    primaryColor: '#F59E0B',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/40',
    textColor: 'text-yellow-400',
    glowColor: 'shadow-yellow-500/30',
    rank: 'Supply Specialist',
    clearanceLevel: 'SECRET',
    requirements: ['Inventory Management', 'Transportation Coordination', 'Resource Planning'],
    specialties: ['Supply Chain Management', 'Inventory Control', 'Distribution']
  },

  // ENGINEERING & TECHNICAL
  {
    id: 'engineer',
    designation: '12B',
    name: 'COMBAT ENGINEER',
    branch: 'Engineer Corps',
    icon: Wrench,
    description: 'Construction & Demolition',
    fullDescription: 'Specialized engineers conducting battlefield construction, explosive ordnance disposal, and obstacle reduction. Masters of both creation and destruction.',
    primaryColor: '#10B981',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    glowColor: 'shadow-emerald-500/30',
    rank: 'Sapper',
    clearanceLevel: 'SECRET',
    requirements: ['Engineering Knowledge', 'Explosive Handling', 'Construction Skills'],
    specialties: ['Demolitions', 'Bridge Construction', 'Mine Clearance']
  },
  {
    id: 'maintenance',
    designation: '91B',
    name: 'MAINTENANCE',
    branch: 'Ordnance',
    icon: Settings,
    description: 'Vehicle & Equipment Repair',
    fullDescription: 'Technical specialists maintaining combat vehicles, weapons systems, and critical equipment. Keeping the military machine operational.',
    primaryColor: '#6B7280',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500/40',
    textColor: 'text-gray-400',
    glowColor: 'shadow-gray-500/30',
    rank: 'Mechanic',
    clearanceLevel: 'SECRET',
    requirements: ['Mechanical Aptitude', 'Troubleshooting', 'Technical Manual Proficiency'],
    specialties: ['Automotive Repair', 'Hydraulics', 'Electrical Systems']
  }
]

/**
 * Get specialization by ID with fallback
 */
export function getSpecialization(id) {
  return MILITARY_SPECIALIZATIONS.find(spec => spec.id === id) || MILITARY_SPECIALIZATIONS[0]
}

/**
 * Get specializations by branch
 */
export function getSpecializationsByBranch(branch) {
  return MILITARY_SPECIALIZATIONS.filter(spec => spec.branch === branch)
}

/**
 * Get all unique branches
 */
export function getAllBranches() {
  return [...new Set(MILITARY_SPECIALIZATIONS.map(spec => spec.branch))]
}

/**
 * Enhanced rank chevrons based on level and specialization
 */
export function getRankChevrons(level, specId = null) {
  const spec = specId ? getSpecialization(specId) : null
  const isCombat = spec?.branch === 'Combat Arms'
  const isIntel = spec?.branch === 'Intelligence'
  const isSpecialist = spec?.clearanceLevel === 'TOP SECRET/SCI'
  
  if (level < 5) return isCombat ? '▪' : '◦'
  if (level < 10) return isCombat ? '◆' : '◇'
  if (level < 15) return isCombat ? '◆◆' : '◇◇'
  if (level < 20) return isCombat ? '◆◆◆' : '◇◇◇'
  if (level < 30) return isSpecialist ? '★' : '☆'
  if (level < 40) return isSpecialist ? '★★' : '☆☆'
  if (level < 50) return isSpecialist ? '★★★' : '☆☆☆'
  if (level < 75) return isIntel ? '🔶' : '★★★★'
  if (level < 100) return isIntel ? '🔶🔶' : '★★★★★'
  return isSpecialist ? '🏅' : '⭐⭐⭐⭐⭐'
}

/**
 * Get rank title based on level and specialization
 */
export function getRankTitle(level, specId = null) {
  const spec = specId ? getSpecialization(specId) : null
  
  if (level < 10) return 'Recruit'
  if (level < 20) return 'Private'
  if (level < 30) return 'Specialist'
  if (level < 40) return 'Corporal'
  if (level < 50) return 'Sergeant'
  if (level < 60) return 'Staff Sergeant'
  if (level < 70) return 'Sergeant First Class'
  if (level < 80) return 'Master Sergeant'
  if (level < 90) return 'First Sergeant'
  if (level < 100) return 'Sergeant Major'
  return 'Command Sergeant Major'
}

/**
 * Calculate readiness score based on completion stats
 */
export function getReadinessScore(stats) {
  const totalTasks = stats.totalTasksCompleted + stats.totalTasksFailed + stats.totalTasksAbandoned
  if (totalTasks === 0) return 0
  
  const completionRate = (stats.totalTasksCompleted / totalTasks) * 100
  const failureRate = (stats.totalTasksFailed / totalTasks) * 100
  const abandonmentRate = (stats.totalTasksAbandoned / totalTasks) * 100
  
  // Weighted scoring system
  let score = completionRate * 0.7 // 70% weight on completion
  score -= failureRate * 0.2 // 20% penalty for failures
  score -= abandonmentRate * 0.3 // 30% penalty for abandonment
  
  return Math.max(0, Math.min(100, Math.round(score)))
}

/**
 * Get deployment status based on performance
 */
export function getDeploymentStatus(readinessScore, level) {
  if (readinessScore >= 90 && level >= 50) return {
    status: 'DEPLOYMENT READY',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    description: 'Authorized for critical operations'
  }
  if (readinessScore >= 75 && level >= 25) return {
    status: 'MISSION CAPABLE',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    description: 'Qualified for standard operations'
  }
  if (readinessScore >= 50) return {
    status: 'TRAINING REQUIRED',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    description: 'Additional training needed'
  }
  return {
    status: 'NOT DEPLOYMENT READY',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    description: 'Requires immediate remedial action'
  }
}

export default MILITARY_SPECIALIZATIONS