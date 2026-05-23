import { create } from 'zustand'

export type ToastType = 'error' | 'success' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastStore {
  toasts: Toast[]
  add: (type: ToastType, message: string) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (type, message) => {
    const id = Math.random().toString(36).slice(2)
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 4500)
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/** Helper to extract a human-readable message from an API error */
export function getErrorMessage(e: unknown): string {
  if (!e) return 'Something went wrong'
  if (typeof e === 'string') return e
  const err = e as any
  const detail = err?.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.map((d: any) => d?.msg ?? JSON.stringify(d)).join(', ')
  return err?.message ?? 'Something went wrong'
}

/** Convenience fire-and-forget functions (usable outside React components) */
export const toast = {
  error:   (msg: string) => useToastStore.getState().add('error', msg),
  success: (msg: string) => useToastStore.getState().add('success', msg),
  info:    (msg: string) => useToastStore.getState().add('info', msg),
  warning: (msg: string) => useToastStore.getState().add('warning', msg),
}
