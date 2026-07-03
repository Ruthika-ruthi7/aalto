import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal } from 'lucide-react'

export interface ActionMenuItem {
  label: string
  onClick: () => void
  icon?: React.ReactNode
  color?: 'default' | 'danger' | 'success' | 'warning'
  disabled?: boolean
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  ariaLabel?: string
}

export default function ActionMenu({ items, ariaLabel = 'Actions' }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleItemClick = (item: ActionMenuItem) => {
    if (!item.disabled) {
      item.onClick()
      setIsOpen(false)
    }
  }

  const getItemColor = (color: ActionMenuItem['color'] = 'default') => {
    switch (color) {
      case 'danger':
        return 'text-red-600 hover:bg-red-50'
      case 'success':
        return 'text-green-600 hover:bg-green-50'
      case 'warning':
        return 'text-yellow-600 hover:bg-yellow-50'
      default:
        return 'text-gray-700 hover:bg-gray-100'
    }
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
          role="menu"
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                item.disabled ? 'text-gray-400 cursor-not-allowed' : getItemColor(item.color)
              }`}
              role="menuitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleItemClick(item)
                }
              }}
            >
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
