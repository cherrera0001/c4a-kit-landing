import type React from "react"
/**
 * Archivo de exportación principal para todos los tipos
 */

export * from "./database"
export * from "./api"
export * from "./forms"

// Tipos adicionales específicos de la UI

// Tipo para elementos de navegación
export interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
  external?: boolean
  submenu?: NavItem[]
}

// Tipo para opciones de selección
export interface SelectOption {
  value: string
  label: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
}

// Tipo para datos de gráficos
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }[]
}

// Tipo para notificaciones
export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: Date
}

// Tipo para breadcrumbs
export interface Breadcrumb {
  title: string
  href?: string
}

// Tipo para pestañas
export interface TabItem {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
}

// Tipo para filtros
export interface Filter {
  id: string
  label: string
  options?: SelectOption[]
  type: "select" | "multiselect" | "date" | "daterange" | "text" | "checkbox"
}

// Tipo para columnas de tabla
export interface TableColumn<T> {
  id: string
  header: string
  accessorKey?: keyof T
  cell?: (info: { row: { original: T } }) => React.ReactNode
  enableSorting?: boolean
  enableFiltering?: boolean
}
