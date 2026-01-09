import { Link, useLocation } from 'react-router-dom'
import { 
  Building2,
  RefreshCw, 
  Package, 
  CreditCard, 
  BarChart3, 
  BookOpen,
  Home,
  ChevronLeft,
  ChevronRight,
  Store
} from 'lucide-react'
import './Sidebar.css'

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation()

  const menuItems = [
    {
      id: 'home',
      icon: Home,
      label: 'Trang chủ',
      path: '/home'
    },
    {
      id: 'agency',
      icon: Building2,
      label: 'Quản lý đại lý',
      path: '/agency-management'
    },
    {
      id: 'export',
      icon: RefreshCw,
      label: 'Quản lý xuất hàng',
      path: '/export-management'
    },
    {
      id: 'receive',
      icon: Package,
      label: 'Quản lý nhập hàng',
      path: '/receive-goods'
    },
    {
      id: 'receive-management',
      icon: Package,
      label: 'Quản lý nhận hàng',
      path: '/receive-management'
    },
    {
      id: 'warehouse',
      icon: Store,
      label: 'Quản lý kho',
      path: '/warehouse-management'
    },
    {
      id: 'payment',
      icon: CreditCard,
      label: 'Quản lý thanh toán',
      path: '/payment-management'
    },
    {
      id: 'report',
      icon: BarChart3,
      label: 'Lập báo cáo',
      path: '/reports'
    },
    {
      id: 'regulations',
      icon: BookOpen,
      label: 'Quản lý quy định',
      path: '/regulations'
    }
  ]

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <Home className="logo-icon" size={24} />
          {!isCollapsed && <span className="logo-text">Staff</span>}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon
          const isActive = location.pathname === item.path || (item.id === 'report' && (location.pathname.startsWith('/add-report') || location.pathname.startsWith('/view-report')))
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <IconComponent className="nav-icon" size={20} />
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
              {!isCollapsed && isActive && <span className="nav-badge">•</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
