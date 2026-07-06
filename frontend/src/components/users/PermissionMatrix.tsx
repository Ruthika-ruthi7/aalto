import type { UserPermissions, Permission, ModuleName } from '../../types/user.types'
import { TABLE_HEAD_CLASS, TABLE_HEADER_CELL_CLASS, TABLE_HEADER_CELL_CENTER_CLASS } from '../common/tableStyles'

interface PermissionMatrixProps {
  permissions: UserPermissions
  onChange: (permissions: UserPermissions) => void
  disabled?: boolean
}

const modules: ModuleName[] = [
  'Dashboard',
  'Enquiries',
  'Blogs',
  'Careers',
  'Applicants',
  'Gallery',
  'Case Studies',
  'User Management',
  'Settings'
]

const actions: (keyof Permission)[] = ['create', 'read', 'update', 'delete']

export default function PermissionMatrix({ permissions, onChange, disabled = false }: PermissionMatrixProps) {
  const handleToggle = (module: ModuleName, action: keyof Permission) => {
    if (disabled) return

    const newPermissions = { ...permissions }
    if (!newPermissions[module]) {
      newPermissions[module] = { create: false, read: false, update: false, delete: false }
    }
    newPermissions[module][action] = !newPermissions[module][action]
    onChange(newPermissions)
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className={TABLE_HEAD_CLASS}>
            <tr>
              <th className={TABLE_HEADER_CELL_CLASS}>Module</th>
              <th className={TABLE_HEADER_CELL_CENTER_CLASS}>Create</th>
              <th className={TABLE_HEADER_CELL_CENTER_CLASS}>Read</th>
              <th className={TABLE_HEADER_CELL_CENTER_CLASS}>Update</th>
              <th className={TABLE_HEADER_CELL_CENTER_CLASS}>Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {modules.map((module) => (
              <tr key={module} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-slate-700">{module}</td>
                {actions.map((action) => {
                  const isChecked = !!permissions[module]?.[action]
                  return (
                    <td key={action} className="px-6 py-4 text-center">
                      <label className="inline-flex items-center justify-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggle(module, action)}
                          disabled={disabled}
                          className="peer h-5 w-5 appearance-none rounded-lg border border-slate-300 bg-white checked:bg-[#1E3A5F] checked:border-[#1E3A5F] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <svg className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </label>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
