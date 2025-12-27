"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  description?: string
  created_at?: string
  responsible?: string
  company?: string
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
      <div className="text-center py-8 bg-white border border-gray-200 rounded-lg">
        <p className="text-gray-500">No categories found. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Responsible</TableHead>
            <TableHead className="font-semibold">Company</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="hover:bg-gray-50 border-b">
              <TableCell className="font-medium text-gray-900">{category.name}</TableCell>
              <TableCell className="text-gray-700">{category.responsible || "-"}</TableCell>
              <TableCell className="text-gray-700">
                {category.company || "My Company (San Francisco)"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button onClick={() => onEdit(category)} variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(category.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
