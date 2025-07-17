import { useState, useEffect } from 'react'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Header } from '@/components/layout/Header'
import { Dashboard } from '@/pages/Dashboard'
import { ProductFormulator } from '@/pages/ProductFormulator'
import { Toaster } from '@/components/ui/toaster'
import blink from '@/blink/client'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading TyCe</h2>
          <p className="text-gray-600">Initializing your AI-powered platform...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to TyCe
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            AI-Powered Product Development Platform for cosmetics and cleaning products
          </p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Sign In to Continue
          </button>
          <p className="text-sm text-gray-500 mt-6">
            Secure authentication powered by Blink
          </p>
        </div>
      </div>
    )
  }

  // Set default role if not set
  const userWithRole = {
    ...user,
    role: user.role || 'user'
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} userRole={userWithRole.role} />
      case 'formulator':
        return <ProductFormulator onPageChange={setCurrentPage} />
      case 'projects':
        return <div className="p-6"><h1 className="text-2xl font-bold">My Projects</h1><p className="text-gray-600 mt-2">Projects page coming soon...</p></div>
      case 'suppliers':
        return <div className="p-6"><h1 className="text-2xl font-bold">Supplier Database</h1><p className="text-gray-600 mt-2">Supplier database coming soon...</p></div>
      case 'certifications':
        return <div className="p-6"><h1 className="text-2xl font-bold">Certification Center</h1><p className="text-gray-600 mt-2">Certification center coming soon...</p></div>
      case 'analytics':
        return <div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p className="text-gray-600 mt-2">Analytics dashboard coming soon...</p></div>
      case 'users':
        return <div className="p-6"><h1 className="text-2xl font-bold">User Management</h1><p className="text-gray-600 mt-2">User management coming soon...</p></div>
      case 'settings':
        return <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-600 mt-2">Settings page coming soon...</p></div>
      case 'assistant':
        return <div className="p-6"><h1 className="text-2xl font-bold">AI Assistant</h1><p className="text-gray-600 mt-2">AI assistant coming soon...</p></div>
      default:
        return <Dashboard onPageChange={setCurrentPage} userRole={userWithRole.role} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        userRole={userWithRole.role}
      />
      <div className="flex-1 flex flex-col">
        <Header user={userWithRole} />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
      <Toaster />
    </div>
  )
}

export default App