import { useState } from 'react'
import { 
  Home, 
  FlaskConical, 
  FolderOpen, 
  Building2, 
  Shield, 
  BarChart3, 
  Settings, 
  Users, 
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface AppSidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  userRole: 'admin' | 'user' | 'certifying_body'
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'user', 'certifying_body'] },
  { id: 'formulator', label: 'Product Formulator', icon: FlaskConical, roles: ['admin', 'user'] },
  { id: 'projects', label: 'My Projects', icon: FolderOpen, roles: ['admin', 'user'] },
  { id: 'suppliers', label: 'Supplier Database', icon: Building2, roles: ['admin', 'user'] },
  { id: 'certifications', label: 'Certification Center', icon: Shield, roles: ['admin', 'user', 'certifying_body'] },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin'] },
  { id: 'users', label: 'User Management', icon: Users, roles: ['admin'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'user', 'certifying_body'] },
]

export function AppSidebar({ currentPage, onPageChange, userRole }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const filteredItems = navigationItems.filter(item => item.roles.includes(userRole))

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TyCe</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed ? "px-2" : "px-3",
                isActive && "bg-indigo-600 text-white hover:bg-indigo-700"
              )}
              onClick={() => onPageChange(item.id)}
            >
              <Icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          )
        })}
      </nav>

      {/* AI Assistant */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start",
            isCollapsed ? "px-2" : "px-3"
          )}
          onClick={() => onPageChange('assistant')}
        >
          <MessageCircle className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>AI Assistant</span>}
        </Button>
      </div>
    </div>
  )
}