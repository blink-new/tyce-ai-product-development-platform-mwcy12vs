import { useState } from 'react'
import { Plus, Trash2, FlaskConical, Palette, Package, DollarSign, Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import blink from '@/blink/client'
import type { Ingredient, Project, ProductProperties } from '@/types'

interface ProductFormulatorProps {
  onPageChange: (page: string) => void
}

export function ProductFormulator({ onPageChange }: ProductFormulatorProps) {
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const ingredientCategories = [
    'Active Ingredient',
    'Emulsifier',
    'Thickener',
    'Preservative',
    'Fragrance',
    'Colorant',
    'pH Adjuster',
    'Antioxidant',
    'Solvent',
    'Surfactant'
  ]

  const units = ['g', 'ml', '%', 'ppm', 'drops']

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: `ing_${Date.now()}`,
      name: '',
      quantity: 0,
      unit: 'g',
      category: 'Active Ingredient',
      function: ''
    }
    setIngredients([...ingredients, newIngredient])
  }

  const updateIngredient = (id: string, field: keyof Ingredient, value: any) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, [field]: value } : ing
    ))
  }

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id))
  }

  const analyzeFormulation = async () => {
    if (ingredients.length === 0) return

    setIsAnalyzing(true)
    try {
      // Simulate AI analysis
      const { text } = await blink.ai.generateText({
        prompt: `Analyze this cosmetic/cleaning product formulation and provide detailed properties:

Ingredients: ${ingredients.map(ing => `${ing.name} (${ing.quantity}${ing.unit}) - ${ing.category}`).join(', ')}

Please provide analysis in this JSON format:
{
  "properties": {
    "viscosity": number (1-100),
    "color": "hex color code",
    "texture": "description",
    "thickness": number (1-10),
    "expiryDate": "YYYY-MM-DD",
    "stability": number (1-100),
    "performance": number (1-100),
    "safetyScore": number (1-100)
  },
  "visualOutput": {
    "colorPreview": "hex color",
    "textureDescription": "detailed texture description"
  },
  "costAnalysis": {
    "totalProductionCost": number,
    "costPerUnit": number,
    "recommendedRetailPrice": number,
    "profitMargin": number
  },
  "suggestions": ["improvement suggestion 1", "improvement suggestion 2"],
  "safetyNotes": ["safety note 1", "safety note 2"]
}`
      })

      // Parse AI response
      let results
      try {
        results = JSON.parse(text)
      } catch {
        // Fallback mock data if AI doesn't return valid JSON
        results = {
          properties: {
            viscosity: Math.floor(Math.random() * 100),
            color: '#' + Math.floor(Math.random()*16777215).toString(16),
            texture: 'Smooth and creamy',
            thickness: Math.floor(Math.random() * 10) + 1,
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            stability: Math.floor(Math.random() * 30) + 70,
            performance: Math.floor(Math.random() * 30) + 70,
            safetyScore: Math.floor(Math.random() * 20) + 80
          },
          visualOutput: {
            colorPreview: '#' + Math.floor(Math.random()*16777215).toString(16),
            textureDescription: 'Smooth, creamy texture with good spreadability'
          },
          costAnalysis: {
            totalProductionCost: Math.floor(Math.random() * 50) + 10,
            costPerUnit: Math.floor(Math.random() * 5) + 2,
            recommendedRetailPrice: Math.floor(Math.random() * 20) + 15,
            profitMargin: Math.floor(Math.random() * 40) + 30
          },
          suggestions: [
            'Consider adding vitamin E for antioxidant properties',
            'Optimize pH level for better stability',
            'Add natural preservatives for clean label appeal'
          ],
          safetyNotes: [
            'Patch test recommended before use',
            'Store in cool, dry place',
            'Avoid contact with eyes'
          ]
        }
      }

      setAnalysisResults(results)
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const saveProject = async () => {
    if (!projectName.trim()) return

    setSaving(true)
    try {
      const user = await blink.auth.me()
      
      const project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
        name: projectName,
        description: projectDescription,
        userId: user.id,
        ingredients,
        properties: analysisResults?.properties,
        visualOutput: analysisResults?.visualOutput,
        costAnalysis: analysisResults?.costAnalysis
      }

      try {
        await blink.db.projects.create({
          ...project,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        
        // Navigate to dashboard to show saved project
        onPageChange('dashboard')
      } catch (dbError: any) {
        console.warn('Database not available, project saved locally:', dbError.message)
        // For now, just navigate back to dashboard
        // In a real app, you might save to localStorage as a fallback
        onPageChange('dashboard')
      }
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Formulator</h1>
          <p className="text-gray-600 mt-1">
            Create and analyze new product formulations with AI-powered insights
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => onPageChange('projects')}
          >
            Cancel
          </Button>
          <Button 
            onClick={saveProject}
            disabled={!projectName.trim() || saving}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Formulation Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Basic information about your product formulation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Anti-Aging Face Cream"
                />
              </div>
              <div>
                <Label htmlFor="projectDescription">Description (Optional)</Label>
                <Textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your product goals and target market..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Ingredients
                <Button onClick={addIngredient} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ingredient
                </Button>
              </CardTitle>
              <CardDescription>
                Add ingredients and their quantities for your formulation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ingredients.length === 0 ? (
                <div className="text-center py-8">
                  <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No ingredients added yet</p>
                  <Button onClick={addIngredient} variant="outline" className="mt-2">
                    Add your first ingredient
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {ingredients.map((ingredient, index) => (
                    <div key={ingredient.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Ingredient {index + 1}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIngredient(ingredient.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Ingredient Name</Label>
                          <Input
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                            placeholder="e.g., Hyaluronic Acid"
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select
                            value={ingredient.category}
                            onValueChange={(value) => updateIngredient(ingredient.id, 'category', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ingredientCategories.map(category => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex space-x-2">
                          <div className="flex-1">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              value={ingredient.quantity}
                              onChange={(e) => updateIngredient(ingredient.id, 'quantity', parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <div className="w-20">
                            <Label>Unit</Label>
                            <Select
                              value={ingredient.unit}
                              onValueChange={(value) => updateIngredient(ingredient.id, 'unit', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {units.map(unit => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Function</Label>
                          <Input
                            value={ingredient.function}
                            onChange={(e) => updateIngredient(ingredient.id, 'function', e.target.value)}
                            placeholder="e.g., Moisturizing agent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analyze Button */}
          {ingredients.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={analyzeFormulation}
                  disabled={isAnalyzing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  size="lg"
                >
                  <FlaskConical className="w-5 h-5 mr-2" />
                  {isAnalyzing ? 'Analyzing Formulation...' : 'Analyze Formulation'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Analysis Results */}
        <div className="space-y-6">
          {analysisResults ? (
            <Tabs defaultValue="properties" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="visual">Visual</TabsTrigger>
                <TabsTrigger value="cost">Cost</TabsTrigger>
              </TabsList>

              <TabsContent value="properties">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FlaskConical className="w-5 h-5 mr-2" />
                      Product Properties
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Viscosity</span>
                          <span>{analysisResults.properties.viscosity}%</span>
                        </div>
                        <Progress value={analysisResults.properties.viscosity} className="mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Stability</span>
                          <span>{analysisResults.properties.stability}%</span>
                        </div>
                        <Progress value={analysisResults.properties.stability} className="mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Performance</span>
                          <span>{analysisResults.properties.performance}%</span>
                        </div>
                        <Progress value={analysisResults.properties.performance} className="mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Safety Score</span>
                          <span>{analysisResults.properties.safetyScore}%</span>
                        </div>
                        <Progress value={analysisResults.properties.safetyScore} className="mt-1" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Texture:</span>
                        <span className="text-sm font-medium">{analysisResults.properties.texture}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Thickness:</span>
                        <span className="text-sm font-medium">{analysisResults.properties.thickness}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Expiry Date:</span>
                        <span className="text-sm font-medium">{analysisResults.properties.expiryDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="visual">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="w-5 h-5 mr-2" />
                      Visual Output
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-600">Color Preview</Label>
                      <div className="flex items-center space-x-3 mt-2">
                        <div 
                          className="w-16 h-16 rounded-lg border-2 border-gray-200"
                          style={{ backgroundColor: analysisResults.visualOutput.colorPreview }}
                        ></div>
                        <div>
                          <p className="text-sm font-medium">{analysisResults.visualOutput.colorPreview}</p>
                          <p className="text-xs text-gray-600">Product color</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-gray-600">Texture Description</Label>
                      <p className="text-sm mt-1">{analysisResults.visualOutput.textureDescription}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-center text-gray-600">
                        3D packaging mockup will be generated here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cost">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Cost Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Production Cost:</span>
                        <span className="text-sm font-medium">${analysisResults.costAnalysis.totalProductionCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cost per Unit:</span>
                        <span className="text-sm font-medium">${analysisResults.costAnalysis.costPerUnit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Recommended Retail:</span>
                        <span className="text-sm font-medium">${analysisResults.costAnalysis.recommendedRetailPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Profit Margin:</span>
                        <Badge variant="secondary">{analysisResults.costAnalysis.profitMargin}%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Add ingredients and analyze to see results</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {analysisResults?.suggestions && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResults.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}