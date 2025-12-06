import { Link, useLocation } from 'react-router-dom'
import './BottomNav.css'

export default function BottomNav() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: '🏠', label: '홈' },
    { path: '/members', icon: '👥', label: '멤버' },
    { path: '/deposits', icon: '💰', label: '입금' },
    { path: '/expenses', icon: '💸', label: '지출' },
    { path: '/events', icon: '🎁', label: '경조사' },
    { path: '/summary', icon: '📊', label: '요약' },
    { path: '/settings', icon: '⚙️', label: '설정' }
  ]

  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

