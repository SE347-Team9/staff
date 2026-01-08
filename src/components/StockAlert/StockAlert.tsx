import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Package, X, AlertCircle, TrendingDown } from 'lucide-react';
import './StockAlert.css';

interface StockAlertItem {
  id: string;
  productCode: string;
  productName: string;
  currentStock: number;
  minStock: number;
  unit: string;
  status: 'low' | 'out';
}

interface StockAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

const StockAlert: React.FC<StockAlertProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Mock data - trong thực tế sẽ fetch từ API
  const alerts: StockAlertItem[] = [
    {
      id: '1',
      productCode: 'SP001',
      productName: 'Sữa tươi Vinamilk 1L',
      currentStock: 5,
      minStock: 50,
      unit: 'thùng',
      status: 'low'
    },
    {
      id: '2',
      productCode: 'SP002',
      productName: 'Nước ngọt Coca Cola 330ml',
      currentStock: 0,
      minStock: 100,
      unit: 'thùng',
      status: 'out'
    },
    {
      id: '3',
      productCode: 'SP003',
      productName: 'Mì tôm Hảo Hảo',
      currentStock: 15,
      minStock: 80,
      unit: 'thùng',
      status: 'low'
    },
    {
      id: '4',
      productCode: 'SP004',
      productName: 'Dầu ăn Neptune 5L',
      currentStock: 0,
      minStock: 30,
      unit: 'can',
      status: 'out'
    }
  ];

  const lowStockCount = alerts.filter(a => a.status === 'low').length;
  const outOfStockCount = alerts.filter(a => a.status === 'out').length;

  if (!isOpen) return null;

  return (
    <div className="stock-alert-overlay" onClick={onClose}>
      <div className="stock-alert-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="stock-alert__header">
          <div className="stock-alert__header-content">
            <div className="stock-alert__header-icon">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="stock-alert__title">Cảnh báo tồn kho</h2>
              <p className="stock-alert__subtitle">
                {alerts.length} sản phẩm cần chú ý
              </p>
            </div>
          </div>
          <button className="stock-alert__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Stats */}
        <div className="stock-alert__stats">
          <div className="stock-alert__stat stock-alert__stat--warning">
            <TrendingDown size={20} />
            <span className="stock-alert__stat-value">{lowStockCount}</span>
            <span className="stock-alert__stat-label">Sắp hết hàng</span>
          </div>
          <div className="stock-alert__stat stock-alert__stat--danger">
            <AlertCircle size={20} />
            <span className="stock-alert__stat-value">{outOfStockCount}</span>
            <span className="stock-alert__stat-label">Đã hết hàng</span>
          </div>
        </div>

        {/* Alert List */}
        <div className="stock-alert__list">
          {alerts.map(alert => (
            <div key={alert.id} className={`stock-alert__item stock-alert__item--${alert.status}`}>
              <div className="stock-alert__item-icon">
                <Package size={20} />
              </div>
              <div className="stock-alert__item-info">
                <div className="stock-alert__item-header">
                  <span className="stock-alert__item-code">{alert.productCode}</span>
                  <span className={`stock-alert__item-badge stock-alert__item-badge--${alert.status}`}>
                    {alert.status === 'out' ? 'Hết hàng' : 'Sắp hết'}
                  </span>
                </div>
                <p className="stock-alert__item-name">{alert.productName}</p>
                <div className="stock-alert__item-stock">
                  <span className="stock-alert__item-current">
                    Còn: <strong>{alert.currentStock}</strong> {alert.unit}
                  </span>
                  <span className="stock-alert__item-divider">|</span>
                  <span className="stock-alert__item-min">
                    Tối thiểu: {alert.minStock} {alert.unit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="stock-alert__footer">
          <button 
            className="stock-alert__btn-secondary"
            onClick={onClose}
          >
            Đóng
          </button>
          <button 
            className="stock-alert__btn-primary"
            onClick={() => {
              onClose();
              navigate('/inventory');
            }}
          >
            Xem chi tiết tồn kho
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockAlert;
