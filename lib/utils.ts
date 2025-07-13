// Utility Functions for DMS Application
// This file contains commonly used utility functions throughout the application

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Classname utility function (cn) - Combines and merges CSS class names
 * This function merges multiple class names intelligently, handling conflicts
 * and providing a clean way to conditionally apply Tailwind CSS classes
 * 
 * @param inputs - Array of class names, objects, or conditional classes
 * @returns Merged and optimized class name string
 * 
 * Usage examples:
 * cn("text-red-500", "bg-blue-100") // "text-red-500 bg-blue-100"
 * cn("p-4", isActive && "bg-blue-500") // "p-4 bg-blue-500" (if isActive is true)
 * cn("text-sm", { "font-bold": isBold }) // "text-sm font-bold" (if isBold is true)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
