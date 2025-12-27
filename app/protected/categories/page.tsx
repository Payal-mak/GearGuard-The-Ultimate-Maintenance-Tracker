"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import CategoryForm from "@/components/category-form"
import CategoryList from "@/components/category-list"

interface Category {
  id: string
  name: string
  description?: string
  created_at?: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const loadCategories = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("equipment_categories")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (data) setCategories(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadCategories()
  }, [supabase])

  const handleAddClick = () => {
    setSelectedCategory(null)
    setIsFormOpen(true)
  }

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedCategory(null)
    loadCategories()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    const { error } = await supabase.from("equipment_categories").delete().eq("id", id)
    if (!error) {
      loadCategories()
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Equipment Categories</h1>
            <p className="text-gray-600 text-sm mt-1">Organize equipment by category</p>
          </div>
          <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700 font-semibold px-6">
            Add Category
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <Card className="p-6 border border-gray-200">
            <CategoryForm initialData={selectedCategory} onClose={handleFormClose} onSuccess={handleFormClose} />
          </Card>
        </div>
      )}

      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">Loading categories...</p>
        </Card>
      ) : (
        <CategoryList
          categories={categories}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onRefresh={loadCategories}
        />
      )}
    </div>
  )
}
