import { useState } from 'react'
import { Bell, User, AlertTriangle } from 'lucide-react'
import StockAlert from '../StockAlert/StockAlert'
import './Header.css'

interface HeaderProps {
  isCollapsed: boolean
}

const Header = ({ isCollapsed }: HeaderProps) => {
  const [showStockAlert, setShowStockAlert] = useState(false);
  
  // Mock data - trong thực tế sẽ fetch từ API
  const alertCount = 4; // Số sản phẩm cần cảnh báo

  return (
    <>
      <header className={`app-header ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="header-content">
          <div className="header-left">
            {/* Có thể thêm breadcrumb hoặc search ở đây */}
          </div>
          <div className="header-right">
            {/* Stock Alert Button */}
            {alertCount > 0 && (
              <button 
                className="header-alert-btn"
                onClick={() => setShowStockAlert(true)}
                title="Cảnh báo tồn kho"
              >
                <AlertTriangle size={18} />
                <span className="header-alert-badge">{alertCount}</span>
                <span className="header-alert-text">Cảnh báo tồn kho</span>
              </button>
            )}
            
            <button className="header-icon-btn">
              <Bell size={20} />
            </button>
            <div className="user-profile">
              <div className="user-avatar">
                <User size={20} />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Stock Alert Modal */}
      <StockAlert 
        isOpen={showStockAlert} 
        onClose={() => setShowStockAlert(false)} 
      />
    </>
  )
}

export default Header
