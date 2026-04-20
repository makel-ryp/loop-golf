import { NavLink, Outlet } from 'react-router-dom'

const tabs = [
  {
    to: '/learn',
    label: 'Learn',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M11 2L2 7l9 5 9-5-9-5zM2 12l9 5 9-5M2 17l9 5 9-5"
          stroke={active ? '#00AF51' : '#888'}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: '/practice',
    label: 'Practice',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8.5" stroke={active ? '#00AF51' : '#888'} strokeWidth="1.75" />
        <circle cx="11" cy="11" r="4" stroke={active ? '#00AF51' : '#888'} strokeWidth="1.75" />
        <circle cx="11" cy="11" r="1" fill={active ? '#00AF51' : '#888'} />
      </svg>
    ),
  },
  {
    to: '/play',
    label: 'Play',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 19V5" stroke={active ? '#00AF51' : '#888'} strokeWidth="1.75" strokeLinecap="round" />
        <path d="M4 5l10 3.5L4 12V5z" fill={active ? '#00AF51' : 'none'} stroke={active ? '#00AF51' : '#888'} strokeWidth="1.75" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-ryp-off-white flex flex-col">
      <div className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/8 z-50">
        <div className="max-w-lg mx-auto flex">
          {tabs.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1"
            >
              {({ isActive }) => (
                <>
                  {icon(isActive)}
                  <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-ryp-green' : 'text-ryp-mid'}`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
