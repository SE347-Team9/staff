import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  Package, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock
} from 'lucide-react'
import './ViewInventory.css'

interface InventoryHistory {
  id: string
  date: string
  type: 'import' | 'export'
  documentCode: string
  quantity: number
  balance: number
  note: string
}

const ViewInventory = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  // Mock data - in reality, fetch from API based on id
  const [inventoryItem] = useState({
    id: id || '1',
    productCode: 'SP001',
    productName: 'Bia Hà Nội',
    unit: 'Thùng',
    currentStock: 150,
    minStockLevel: 50,
    maxStockLevel: 500,
    costPrice: 200000,
    sellingPrice: 250000,
    lastUpdated: '2025-01-08 10:30',
    category: 'Đồ uống',
    description: 'Bia Hà Nội thùng 24 lon x 330ml'
  })

  const [history] = useState<InventoryHistory[]>([
    {
      id: '1',
      date: '2025-01-08 10:30',
      type: 'export',
      documentCode: 'PX001',
      quantity: -20,
      balance: 150,
      note: 'Xuất cho Đại lý Nghĩa'
    },
    {
      id: '2',
      date: '2025-01-07 14:00',
      type: 'import',
      documentCode: 'PN002',
      quantity: 50,
      balance: 170,
      note: 'Nhập từ Nhà cung cấp ABC'
    },
    {
      id: '3',
      date: '2025-01-06 09:15',
      type: 'export',
      documentCode: 'PX002',
      quantity: -30,
      balance: 120,
      note: 'Xuất cho Đại lý Đại'
    },
    {
      id: '4',
      date: '2025-01-05 16:45',
      type: 'import',
      documentCode: 'PN001',
      quantity: 100,
      balance: 150,
      note: 'Nhập từ Nhà cung cấp XYZ'
    }
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="view-inventory-page">
      {/* Header */}
      <div className="view-inventory__header">
        <button className="view-inventory__back-btn" onClick={() => navigate('/inventory')}>
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <div className="view-inventory__header-content">
          <div className="view-inventory__header-icon">
            <Package size={32} />
          </div>
          <div>
            <h1 className="view-inventory__title">Chi tiết tồn kho</h1>
            <p className="view-inventory__subtitle">{inventoryItem.productName}</p>
          </div>
        </div>
      </div>

      <div className="view-inventory__content">
        {/* Product Info */}
        <div className="view-inventory__info-card">
          <h3 className="view-inventory__section-title">Thông tin sản phẩm</h3>
          <div className="view-inventory__info-grid">
            <div className="view-inventory__info-item">
              <span className="view-inventory__info-label">Mã sản phẩm</span>
              <span className="view-inventory__info-value">{inventoryItem.productCode}</span>
            </div>
            <div className="view-inventory__info-item">
              <span className="view-inventory__info-label">Tên sản phẩm</span>
              <span className="view-inventory__info-value">{inventoryItem.productName}</span>
            </div>
            <div className="view-inventory__info-item">
              <span className="view-inventory__info-label">Đơn vị tính</span>
              <span className="view-inventory__info-value">{inventoryItem.unit}</span>
            </div>
            <div className="view-inventory__info-item">
              <span className="view-inventory__info-label">Danh mục</span>
              <span className="view-inventory__info-value">{inventoryItem.category}</span>
            </div>
            <div className="view-inventory__info-item view-inventory__info-item--full">
              <span className="view-inventory__info-label">Mô tả</span>
              <span className="view-inventory__info-value">{inventoryItem.description}</span>
            </div>
          </div>
        </div>

        {/* Stock Info */}
        <div className="view-inventory__stock-cards">
          <div className="view-inventory__stock-card view-inventory__stock-card--primary">
            <div className="view-inventory__stock-icon">
              <Package size={28} />
            </div>
            <div className="view-inventory__stock-content">
              <span className="view-inventory__stock-label">Tồn kho hiện tại</span>
              <span className="view-inventory__stock-value">{inventoryItem.currentStock}</span>
              <span className="view-inventory__stock-unit">{inventoryItem.unit}</span>
            </div>
          </div>

          <div className="view-inventory__stock-card view-inventory__stock-card--warning">
            <div className="view-inventory__stock-icon">
              <TrendingDown size={28} />
            </div>
            <div className="view-inventory__stock-content">
              <span className="view-inventory__stock-label">Mức tối thiểu</span>
              <span className="view-inventory__stock-value">{inventoryItem.minStockLevel}</span>
              <span className="view-inventory__stock-unit">{inventoryItem.unit}</span>
            </div>
          </div>

          <div className="view-inventory__stock-card view-inventory__stock-card--info">
            <div className="view-inventory__stock-icon">
              <TrendingUp size={28} />
            </div>
            <div className="view-inventory__stock-content">
              <span className="view-inventory__stock-label">Mức tối đa</span>
              <span className="view-inventory__stock-value">{inventoryItem.maxStockLevel}</span>
              <span className="view-inventory__stock-unit">{inventoryItem.unit}</span>
            </div>
          </div>
        </div>

        {/* Price Info */}
        <div className="view-inventory__info-card">
          <h3 className="view-inventory__section-title">Thông tin giá</h3>
          <div className="view-inventory__price-grid">
            <div className="view-inventory__price-item">
              <span className="view-inventory__price-label">Giá nhập</span>
              <span className="view-inventory__price-value view-inventory__price-value--cost">
                {formatCurrency(inventoryItem.costPrice)}
              </span>
            </div>
            <div className="view-inventory__price-item">
              <span className="view-inventory__price-label">Giá bán</span>
              <span className="view-inventory__price-value view-inventory__price-value--sell">
                {formatCurrency(inventoryItem.sellingPrice)}
              </span>
            </div>
            <div className="view-inventory__price-item">
              <span className="view-inventory__price-label">Giá trị tồn kho</span>
              <span className="view-inventory__price-value view-inventory__price-value--total">
                {formatCurrency(inventoryItem.currentStock * inventoryItem.costPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="view-inventory__history-card">
          <h3 className="view-inventory__section-title">
            <Clock size={20} />
            Lịch sử nhập/xuất
          </h3>
          <div className="view-inventory__history-table-wrapper">
            <table className="view-inventory__history-table">
              <thead>
                <tr>
                  <th>NGÀY GIỜ</th>
                  <th>LOẠI</th>
                  <th>MÃ CHỨNG TỪ</th>
                  <th>SỐ LƯỢNG</th>
                  <th>TỒN SAU</th>
                  <th>GHI CHÚ</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="view-inventory__date">
                        <Calendar size={14} />
                        {item.date}
                      </div>
                    </td>
                    <td>
                      <span className={`view-inventory__type-badge view-inventory__type-badge--${item.type}`}>
                        {item.type === 'import' ? 'Nhập' : 'Xuất'}
                      </span>
                    </td>
                    <td>
                      <span className="view-inventory__doc-code">{item.documentCode}</span>
                    </td>
                    <td>
                      <span className={`view-inventory__quantity ${item.quantity > 0 ? 'positive' : 'negative'}`}>
                        {item.quantity > 0 ? '+' : ''}{item.quantity}
                      </span>
                    </td>
                    <td>{item.balance}</td>
                    <td className="view-inventory__note">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewInventory
