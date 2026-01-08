import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Package, 
  Search, 
  AlertTriangle, 
  TrendingDown,
  TrendingUp,
  Eye,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { toast } from 'react-toastify'
import { InventoryItem, StockAlert } from '../../types'
import './InventoryManagement.css'

const InventoryManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'out' | 'normal'>('all')

  // Mock inventory data với batches và hạn sử dụng
  const [inventory] = useState<InventoryItem[]>([
    {
      id: '1',
      productId: 'SP001',
      productCode: 'SP001',
      productName: 'Bia Hà Nội',
      unit: 'Thùng',
      currentStock: 150,
      minStockLevel: 50,
      maxStockLevel: 500,
      costPrice: 200000,
      sellingPrice: 250000,
      lastUpdated: '2025-01-08 10:30',
      batches: [
        { id: 'B001', batchNumber: 'LOT2024001', productId: 'SP001', quantity: 100, expiryDate: '2025-06-15', importDate: '2024-12-01', importReceiptCode: 'PN001', remainingQuantity: 80 },
        { id: 'B002', batchNumber: 'LOT2024002', productId: 'SP001', quantity: 100, expiryDate: '2025-08-20', importDate: '2025-01-05', importReceiptCode: 'PN002', remainingQuantity: 70 }
      ]
    },
    {
      id: '2',
      productId: 'SP002',
      productCode: 'SP002',
      productName: 'Nước ngọt Pepsi',
      unit: 'Thùng',
      currentStock: 25,
      minStockLevel: 30,
      maxStockLevel: 300,
      costPrice: 150000,
      sellingPrice: 180000,
      lastUpdated: '2025-01-08 09:15',
      batches: [
        { id: 'B003', batchNumber: 'LOT2024003', productId: 'SP002', quantity: 50, expiryDate: '2025-02-10', importDate: '2024-11-10', importReceiptCode: 'PN001', remainingQuantity: 25 }
      ]
    },
    {
      id: '3',
      productId: 'SP003',
      productCode: 'SP003',
      productName: 'Sữa Vinamilk',
      unit: 'Lốc',
      currentStock: 0,
      minStockLevel: 100,
      maxStockLevel: 1000,
      costPrice: 45000,
      sellingPrice: 60000,
      lastUpdated: '2025-01-07 16:45',
      batches: []
    },
    {
      id: '4',
      productId: 'SP004',
      productCode: 'SP004',
      productName: 'Bánh quy Oreo',
      unit: 'Hộp',
      currentStock: 200,
      minStockLevel: 80,
      maxStockLevel: 400,
      costPrice: 25000,
      sellingPrice: 35000,
      lastUpdated: '2025-01-08 08:00',
      batches: [
        { id: 'B004', batchNumber: 'LOT2025001', productId: 'SP004', quantity: 200, expiryDate: '2025-12-31', importDate: '2025-01-02', importReceiptCode: 'PN003', remainingQuantity: 200 }
      ]
    },
    {
      id: '5',
      productId: 'SP005',
      productCode: 'SP005',
      productName: 'Gạo ST25',
      unit: 'Kg',
      currentStock: 500,
      minStockLevel: 200,
      maxStockLevel: 2000,
      costPrice: 22000,
      sellingPrice: 28000,
      lastUpdated: '2025-01-08 11:00',
      batches: [
        { id: 'B005', batchNumber: 'LOT2024004', productId: 'SP005', quantity: 500, expiryDate: '2026-01-01', importDate: '2024-10-15', importReceiptCode: 'PN002', remainingQuantity: 500 }
      ]
    },
    {
      id: '6',
      productId: 'SP006',
      productCode: 'SP006',
      productName: 'Snack Oishi',
      unit: 'Gói',
      currentStock: 15,
      minStockLevel: 50,
      maxStockLevel: 300,
      costPrice: 8000,
      sellingPrice: 12000,
      lastUpdated: '2025-01-08 07:30',
      batches: [
        { id: 'B006', batchNumber: 'LOT2024005', productId: 'SP006', quantity: 100, expiryDate: '2025-01-20', importDate: '2024-09-01', importReceiptCode: 'PN001', remainingQuantity: 15 }
      ]
    }
  ])

  // Tính toán thống kê
  const statistics = useMemo(() => {
    const totalProducts = inventory.length
    const lowStockCount = inventory.filter(item => 
      item.currentStock > 0 && item.currentStock <= item.minStockLevel
    ).length
    const outOfStockCount = inventory.filter(item => item.currentStock === 0).length
    const totalValue = inventory.reduce((sum, item) => 
      sum + (item.currentStock * item.costPrice), 0
    )

    // Đếm sản phẩm sắp hết hạn (trong vòng 30 ngày)
    const today = new Date()
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    let expiringCount = 0
    
    inventory.forEach(item => {
      if (item.batches) {
        item.batches.forEach(batch => {
          if (batch.expiryDate && batch.remainingQuantity > 0) {
            const expiryDate = new Date(batch.expiryDate)
            if (expiryDate <= thirtyDaysLater) {
              expiringCount++
            }
          }
        })
      }
    })

    return { totalProducts, lowStockCount, outOfStockCount, totalValue, expiringCount }
  }, [inventory])

  // Lọc inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      // Search filter
      const matchSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productCode.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      let matchStatus = true
      if (filterStatus === 'low') {
        matchStatus = item.currentStock > 0 && item.currentStock <= item.minStockLevel
      } else if (filterStatus === 'out') {
        matchStatus = item.currentStock === 0
      } else if (filterStatus === 'normal') {
        matchStatus = item.currentStock > item.minStockLevel
      }

      return matchSearch && matchStatus
    })
  }, [inventory, searchTerm, filterStatus])

  // Stock alerts - bao gồm cả cảnh báo hạn sử dụng
  const stockAlerts: StockAlert[] = useMemo(() => {
    const alerts: StockAlert[] = []
    const today = new Date()
    
    inventory.forEach(item => {
      // Cảnh báo hết hàng
      if (item.currentStock === 0) {
        alerts.push({
          id: `alert-${item.id}`,
          productId: item.productId,
          productCode: item.productCode,
          productName: item.productName,
          currentStock: item.currentStock,
          minStockLevel: item.minStockLevel,
          alertType: 'out_of_stock',
          alertMessage: `${item.productName} đã hết hàng!`,
          isRead: false,
          createdAt: new Date().toISOString()
        })
      } else if (item.currentStock <= item.minStockLevel) {
        // Cảnh báo sắp hết hàng
        alerts.push({
          id: `alert-${item.id}`,
          productId: item.productId,
          productCode: item.productCode,
          productName: item.productName,
          currentStock: item.currentStock,
          minStockLevel: item.minStockLevel,
          alertType: 'low_stock',
          alertMessage: `${item.productName} sắp hết hàng (còn ${item.currentStock} ${item.unit})`,
          isRead: false,
          createdAt: new Date().toISOString()
        })
      }
      
      // Cảnh báo sắp hết hạn sử dụng
      if (item.batches) {
        item.batches.forEach(batch => {
          if (batch.expiryDate && batch.remainingQuantity > 0) {
            const expiryDate = new Date(batch.expiryDate)
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
            
            if (daysUntilExpiry <= 0) {
              // Đã hết hạn
              alerts.push({
                id: `expiry-${batch.id}`,
                productId: item.productId,
                productCode: item.productCode,
                productName: item.productName,
                currentStock: batch.remainingQuantity,
                minStockLevel: item.minStockLevel,
                alertType: 'expired',
                alertMessage: `${item.productName} (Lô ${batch.batchNumber}) ĐÃ HẾT HẠN! Còn ${batch.remainingQuantity} ${item.unit}`,
                isRead: false,
                createdAt: new Date().toISOString()
              })
            } else if (daysUntilExpiry <= 30) {
              // Sắp hết hạn (trong 30 ngày)
              alerts.push({
                id: `expiry-${batch.id}`,
                productId: item.productId,
                productCode: item.productCode,
                productName: item.productName,
                currentStock: batch.remainingQuantity,
                minStockLevel: item.minStockLevel,
                alertType: 'expiring_soon',
                alertMessage: `${item.productName} (Lô ${batch.batchNumber}) sắp hết hạn trong ${daysUntilExpiry} ngày`,
                isRead: false,
                createdAt: new Date().toISOString()
              })
            }
          }
        })
      }
    })

    return alerts
  }, [inventory])

  // Lấy hạn sử dụng gần nhất của sản phẩm
  const getNearestExpiry = (item: InventoryItem): { date: string | null, daysLeft: number | null, isExpired: boolean } => {
    if (!item.batches || item.batches.length === 0) {
      return { date: null, daysLeft: null, isExpired: false }
    }
    
    const today = new Date()
    let nearestDate: Date | null = null
    
    item.batches.forEach(batch => {
      if (batch.expiryDate && batch.remainingQuantity > 0) {
        const expiry = new Date(batch.expiryDate)
        if (!nearestDate || expiry < nearestDate) {
          nearestDate = expiry
        }
      }
    })
    
    if (!nearestDate) return { date: null, daysLeft: null, isExpired: false }
    
    const nearestDateValue = nearestDate as Date
    const daysLeft = Math.ceil((nearestDateValue.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
    return {
      date: nearestDateValue.toLocaleDateString('vi-VN'),
      daysLeft,
      isExpired: daysLeft <= 0
    }
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return { label: 'Hết hàng', class: 'status-out', icon: <AlertTriangle size={14} /> }
    }
    if (item.currentStock <= item.minStockLevel) {
      return { label: 'Sắp hết', class: 'status-low', icon: <TrendingDown size={14} /> }
    }
    return { label: 'Còn hàng', class: 'status-normal', icon: <TrendingUp size={14} /> }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleViewDetail = (id: string) => {
    navigate(`/inventory/view/${id}`)
  }

  const handleExportExcel = () => {
    toast.info('Đang xuất file Excel...')
    // TODO: Implement Excel export
  }

  const handleRefresh = () => {
    toast.success('Đã cập nhật dữ liệu tồn kho')
    // TODO: Refresh data from API
  }

  return (
    <div className="inventory-management-page">
      {/* Header */}
      <div className="inventory__header">
        <div className="inventory__header-icon">
          <Package size={36} />
        </div>
        <div className="inventory__header-text">
          <h1 className="inventory__title">Quản lý Tồn kho</h1>
          <p className="inventory__subtitle">Theo dõi số lượng hàng hóa trong kho</p>
        </div>
        <div className="inventory__header-actions">
          <button className="inventory__btn inventory__btn--secondary" onClick={handleRefresh}>
            <RefreshCw size={18} />
            <span>Làm mới</span>
          </button>
          <button className="inventory__btn inventory__btn--primary" onClick={handleExportExcel}>
            <Download size={18} />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Stock Alerts */}
      {stockAlerts.length > 0 && (
        <div className="inventory__alerts">
          <div className="inventory__alerts-header">
            <AlertTriangle size={20} />
            <span>Cảnh báo tồn kho ({stockAlerts.length})</span>
          </div>
          <div className="inventory__alerts-list">
            {stockAlerts.slice(0, 3).map(alert => (
              <div 
                key={alert.id} 
                className={`inventory__alert-item inventory__alert-item--${alert.alertType}`}
              >
                <span className="inventory__alert-message">{alert.alertMessage}</span>
                <button 
                  className="inventory__alert-action"
                  onClick={() => navigate('/create-receipt')}
                >
                  Nhập thêm
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="inventory__stats-grid">
        <div className="inventory__stat-card inventory__stat-card--blue">
          <div className="inventory__stat-icon">
            <Package size={24} />
          </div>
          <div className="inventory__stat-content">
            <div className="inventory__stat-label">Tổng sản phẩm</div>
            <div className="inventory__stat-value">{statistics.totalProducts}</div>
          </div>
        </div>

        <div className="inventory__stat-card inventory__stat-card--orange">
          <div className="inventory__stat-icon">
            <TrendingDown size={24} />
          </div>
          <div className="inventory__stat-content">
            <div className="inventory__stat-label">Sắp hết hàng</div>
            <div className="inventory__stat-value">{statistics.lowStockCount}</div>
          </div>
        </div>

        <div className="inventory__stat-card inventory__stat-card--red">
          <div className="inventory__stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="inventory__stat-content">
            <div className="inventory__stat-label">Hết hàng</div>
            <div className="inventory__stat-value">{statistics.outOfStockCount}</div>
          </div>
        </div>

        <div className="inventory__stat-card inventory__stat-card--green">
          <div className="inventory__stat-icon">
            <span className="inventory__currency-icon">₫</span>
          </div>
          <div className="inventory__stat-content">
            <div className="inventory__stat-label">Tổng giá trị kho</div>
            <div className="inventory__stat-value">
              {(statistics.totalValue / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="inventory__filters">
        <div className="inventory__search-wrapper">
          <Search className="inventory__search-icon" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
            className="inventory__search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="inventory__filter-wrapper">
          <Filter size={18} />
          <select
            className="inventory__filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="all">Tất cả</option>
            <option value="normal">Còn hàng</option>
            <option value="low">Sắp hết hàng</option>
            <option value="out">Hết hàng</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="inventory__table-section">
        <div className="inventory__table-wrapper">
          <table className="inventory__table">
            <thead>
              <tr>
                <th>MÃ SP</th>
                <th>TÊN SẢN PHẨM</th>
                <th>ĐƠN VỊ</th>
                <th>TỒN KHO</th>
                <th>TỐI THIỂU</th>
                <th>HẠN SỬ DỤNG GẦN NHẤT</th>
                <th>GIÁ BÁN</th>
                <th>GIÁ TRỊ TỒN</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const status = getStockStatus(item)
                  const expiry = getNearestExpiry(item)
                  return (
                    <tr key={item.id}>
                      <td>
                        <span className="inventory__product-code">{item.productCode}</span>
                      </td>
                      <td>
                        <span className="inventory__product-name">{item.productName}</span>
                      </td>
                      <td>{item.unit}</td>
                      <td>
                        <span className={`inventory__stock-value ${
                          item.currentStock === 0 ? 'text-red' : 
                          item.currentStock <= item.minStockLevel ? 'text-orange' : ''
                        }`}>
                          {item.currentStock}
                        </span>
                      </td>
                      <td>{item.minStockLevel}</td>
                      <td>
                        {expiry.date ? (
                          <span className={`inventory__expiry-badge ${
                            expiry.isExpired ? 'expiry-expired' :
                            expiry.daysLeft !== null && expiry.daysLeft <= 30 ? 'expiry-warning' : 'expiry-ok'
                          }`}>
                            {expiry.date}
                            {expiry.daysLeft !== null && (
                              <small>
                                {expiry.isExpired ? ' (Đã hết hạn!)' : ` (${expiry.daysLeft} ngày)`}
                              </small>
                            )}
                          </span>
                        ) : (
                          <span className="inventory__no-expiry">N/A</span>
                        )}
                      </td>
                      <td>{formatCurrency(item.sellingPrice)}</td>
                      <td>
                        <span className="inventory__total-value">
                          {formatCurrency(item.currentStock * item.costPrice)}
                        </span>
                      </td>
                      <td>
                        <span className={`inventory__status-badge ${status.class}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </td>
                      <td>
                        <div className="inventory__actions">
                          <button
                            className="inventory__action-btn inventory__action-btn--view"
                            onClick={() => handleViewDetail(item.id)}
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={10} className="inventory__no-data">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default InventoryManagement
