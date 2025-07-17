import { useState, useEffect } from 'react'
import { Plus, TrendingUp, FlaskConical, Building2, Shield, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import blink from '@/blink/client'
import type { Project } from '@/types'

interface DashboardProps {
  onPageChange: (page: string) => void
  userRole: 'admin' | 'user' | 'certifying_body'
}

export function Dashboard({ onPageChange, userRole }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await blink.auth.me()
        setUser(userData)
        
        // Try to load user's projects, but handle database not existing
        try {
          const userProjects = await blink.db.projects.list({
            where: { userId: userData.id }, // Use camelCase for Blink SDK
            orderBy: { updatedAt: 'desc' },
            limit: 6
          })
          setProjects(userProjects)
        } catch (dbError: any) {
          console.warn('Database not available yet:', dbError.message)
          // Use mock data for now until database is set up
          setProjects([
            {
              id: 'demo-1',
              name: 'Moisturizing Face Cream',
              description: 'Anti-aging moisturizer with hyaluronic acid',
              userId: userData.id,
              ingredients: [
                { id: '1', name: 'Hyaluronic Acid', quantity: 2, unit: '%', category: 'Active', function: 'Moisturizing' },
                { id: '2', name: 'Glycerin', quantity: 5, unit: '%', category: 'Humectant', function: 'Moisture retention' }
              ],
              properties: {
                viscosity: 15000,
                color: '#F5F5DC',
                texture: 'Smooth cream',
                thickness: 8,
                expiryDate: '2025-12-31',
                stability: 95,
                performance: 88,
                safetyScore: 92
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 'demo-2',
              name: 'Gentle Cleanser',
              description: 'Sulfate-free facial cleanser',
              userId: userData.id,
              ingredients: [
                { id: '3', name: 'Cocamidopropyl Betaine', quantity: 15, unit: '%', category: 'Surfactant', function: 'Cleansing' }
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ])
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const stats = [
    {
      title: 'Active Projects',
      value: projects.length.toString(),
      description: 'Projects in development',
      icon: FlaskConical,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Formulations',
      value: projects.reduce((total, project) => total + (project.ingredients?.length || 0), 0).toString(),
      description: 'Total formulations created',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Suppliers',
      value: '156',
      description: 'Available suppliers',
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Certifications',
      value: '8',
      description: 'Pending certifications',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.displayName || user?.email}
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your product development projects
          </p>
          {projects.length > 0 && projects[0].id.startsWith('demo-') && (
            <div className="mt-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg inline-block">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Demo Mode:</span>
                <span className="ml-1">Database setup in progress. Your projects will be saved once ready.</span>
              </div>
            </div>
          )}
        </div>
        <Button onClick={() => onPageChange('formulator')} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Projects
              <Button variant="outline" size="sm" onClick={() => onPageChange('projects')}>
                View All
              </Button>
            </CardTitle>
            <CardDescription>
              Your latest product development projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No projects yet</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => onPageChange('formulator')}
                >
                  Create your first project
                </Button>
              </div>
            ) : (
              projects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {project.ingredients?.length || 0} ingredients
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {project.properties ? 'Analyzed' : 'Draft'}
                    </Badge>
                    <Progress value={project.properties ? 100 : 30} className="w-16" />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onPageChange('formulator')}
            >
              <FlaskConical className="w-4 h-4 mr-3" />
              Create New Formulation
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onPageChange('suppliers')}
            >
              <Building2 className="w-4 h-4 mr-3" />
              Browse Suppliers
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onPageChange('certifications')}
            >
              <Shield className="w-4 h-4 mr-3" />
              Check Certifications
            </Button>
            {userRole === 'admin' && (
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onPageChange('analytics')}
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                View Analytics
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}