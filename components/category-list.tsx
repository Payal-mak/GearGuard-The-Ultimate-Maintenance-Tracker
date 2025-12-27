"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  description?: string
  created_at?: string
}

interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
  onRefresh: () => void
}

export default function CategoryList({ categories, onEdit, onDelete, onRefresh }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 mb-4">No categories found. Create one to get started.</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((category) => (
        <Card key={category.id} className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
          {category.description && <p className="text-sm text-gray-600 mt-2">{category.description}</p>}
          <div className="flex gap-2 mt-4">
            <Button onClick={() => onEdit(category)} variant="outline" size="sm">
              Edit
            </Button>
            <Button onClick={() => onDelete(category.id)} variant="outline" size="sm" className="text-red-600">
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
