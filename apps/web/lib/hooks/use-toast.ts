'use client'

import * as React from 'react'
import type { ToastProps } from '@/components/ui/toast'

type Toast = ToastProps & { id: string; title?: React.ReactNode; description?: React.ReactNode }

type State = { toasts: Toast[] }

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: { type: 'ADD' | 'REMOVE'; toast: Toast }) {
  if (action.type === 'ADD') {
    memoryState = { toasts: [action.toast, ...memoryState.toasts].slice(0, 3) }
  } else {
    memoryState = { toasts: memoryState.toasts.filter((t) => t.id !== action.toast.id) }
  }
  listeners.forEach((l) => l(memoryState))
}

function toast(props: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).slice(2)
  dispatch({ type: 'ADD', toast: { ...props, id } })
  setTimeout(() => dispatch({ type: 'REMOVE', toast: { id } as Toast }), 4000)
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)
  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const idx = listeners.indexOf(setState)
      if (idx > -1) listeners.splice(idx, 1)
    }
  }, [])
  return { ...state, toast }
}

export { useToast, toast }
