'use client'

import { useRef } from 'react'

export function DeleteUserButton({
  action,
  id,
  name,
}: {
  action: (formData: FormData) => Promise<void>
  id: string
  name: string
}) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="button"
        className="text-[10px] font-mono tracking-wide uppercase px-3 py-1.5 text-red-500/70 hover:text-red-600 hover:bg-red-50 transition-colors rounded border border-transparent hover:border-red-200"
        onClick={() => {
          if (confirm(`¿Eliminar a ${name}?`)) formRef.current?.requestSubmit()
        }}
      >
        Eliminar
      </button>
    </form>
  )
}
