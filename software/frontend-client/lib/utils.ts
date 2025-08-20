import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn
 * Utility para combinar clases Tailwind con soporte para deduplicado
 * (usa clsx + tailwind-merge). Usar en componentes para componer estilos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
