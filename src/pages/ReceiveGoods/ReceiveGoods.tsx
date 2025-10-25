import { useState } from 'react'
import { Package, RefreshCw, Plus, Search, Eye, Edit, Trash2, TrendingUp, TrendingDown, AlertTriangle, Activity } from 'lucide-react'
import './ReceiveGoods.css'

interface Receipt {
  id: string
  code: string
  date: string
  total: number
}

const ReceiveGoods = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const receipts: Receipt[] = [
    {
      id: '1',
      code: '#4',
      date: '4/5/2024',
      total: 3000000
    },
    {
      id: '2',
      code: '#3',
      date: '3/5/2024',
      total: 2000000
    }
  ]

  const totalReceipts = 4
  const totalValue = 13300000
  const thisMonth = 0
  const outOfStock = 0

  const filteredReceipts = receipts.filter(receipt =>
    receipt.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleView = (id: string) => {
    console.log('View receipt:', id)
  }

  const handleEdit = (id: string) => {
    console.log('Edit receipt:', id)
  }

  const handleDelete = (id: string) => {
    console.log('Delete receipt:', id)
  }

  const handleCreateReceipt = () => {
    console.log('Create new receipt')
  }

  const handleRefresh = () => {
    console.log('Refresh data')
  }

  const handleViewInventory = () => {
    console.log('View inventory')
  }

  const handleViewReport = () => {
    console.log('View report')
  }

  return (
    <div className="receive-goods-page">
      {/* Header Section */}
      <div className="receive-goods__header">
        <div className="receive-goods__header-icon">
          <Package size={36} />
        </div>
        <div className="receive-goods__header-text">
          <h1 className="receive-goods__title">Quản lý Nhập hàng</h1>
          <p className="receive-goods__subtitle">Dashboard tổng quan và quản lý phiếu nhập</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="receive-goods__stats-grid">
        <div className="receive-goods__stat-card receive-goods__stat-card--blue">
          <div className="receive-goods__stat-icon">
            <Package size={24} />
          </div>
          <div className="receive-goods__stat-content">
            <div className="receive-goods__stat-label">Tổng phiếu nhập</div>
            <div className="receive-goods__stat-value">{totalReceipts}</div>
            <div className="receive-goods__stat-note">Tất cả thời gian</div>
          </div>
          <div className="receive-goods__stat-badge receive-goods__stat-badge--up">
            <TrendingUp size={16} />
            <span>+12%</span>
          </div>
        </div>

        <div className="receive-goods__stat-card receive-goods__stat-card--green">
          <div className="receive-goods__stat-icon">
            <span className="receive-goods__currency-icon">₫</span>
          </div>
          <div className="receive-goods__stat-content">
            <div className="receive-goods__stat-label">Tổng giá trị</div>
            <div className="receive-goods__stat-value">{(totalValue / 1000000).toFixed(1)}M</div>
            <div className="receive-goods__stat-note">VND</div>
          </div>
          <div className="receive-goods__stat-badge receive-goods__stat-badge--up">
            <TrendingUp size={16} />
            <span>+8%</span>
          </div>
        </div>

        <div className="receive-goods__stat-card receive-goods__stat-card--purple">
          <div className="receive-goods__stat-icon">
            <Activity size={24} />
          </div>
          <div className="receive-goods__stat-content">
            <div className="receive-goods__stat-label">Tháng này</div>
            <div className="receive-goods__stat-value">{thisMonth}</div>
            <div className="receive-goods__stat-note">0.0M VND</div>
          </div>
          <div className="receive-goods__stat-badge receive-goods__stat-badge--up">
            <TrendingUp size={16} />
            <span>+15%</span>
          </div>
        </div>

        <div className="receive-goods__stat-card receive-goods__stat-card--orange">
          <div className="receive-goods__stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="receive-goods__stat-content">
            <div className="receive-goods__stat-label">Hàng sắp hết</div>
            <div className="receive-goods__stat-value">{outOfStock}</div>
            <div className="receive-goods__stat-note">{'< 10'} sản phẩm</div>
          </div>
          <div className="receive-goods__stat-badge receive-goods__stat-badge--down">
            <TrendingDown size={16} />
            <span>-5%</span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="receive-goods__quick-actions">
        <div className="receive-goods__action-card receive-goods__action-card--blue" onClick={handleCreateReceipt}>
          <div className="receive-goods__action-icon">
            <Package size={32} />
          </div>
          <div className="receive-goods__action-content">
            <div className="receive-goods__action-title">Tạo phiếu nhập</div>
            <div className="receive-goods__action-subtitle">Nhập hàng mới vào kho</div>
            <div className="receive-goods__action-cta">Nhấn để bắt đầu</div>
          </div>
        </div>

        <div className="receive-goods__action-card receive-goods__action-card--green" onClick={handleViewInventory}>
          <div className="receive-goods__action-icon">
            <Package size={32} />
          </div>
          <div className="receive-goods__action-content">
            <div className="receive-goods__action-title">Xem tồn kho</div>
            <div className="receive-goods__action-subtitle">Kiểm tra số lượng hàng</div>
            <div className="receive-goods__action-cta">7 sản phẩm</div>
          </div>
        </div>

        <div className="receive-goods__action-card receive-goods__action-card--purple" onClick={handleViewReport}>
          <div className="receive-goods__action-icon">
            <Activity size={32} />
          </div>
          <div className="receive-goods__action-content">
            <div className="receive-goods__action-title">Báo cáo</div>
            <div className="receive-goods__action-subtitle">Phân tích xu hướng</div>
            <div className="receive-goods__action-cta">Xem chi tiết</div>
          </div>
        </div>
      </div>

      {/* Recent Receipts Section */}
      <div className="receive-goods__recent-section">
        <div className="receive-goods__section-header">
          <div className="receive-goods__section-title-wrapper">
            <div>
              <Package size={24} />
              <h2 className="receive-goods__section-title">Phiếu nhập gần đây</h2>
            </div>
            <div className="receive-goods__header-actions">
              <button className="receive-goods__header-btn receive-goods__header-btn--secondary" onClick={handleRefresh}>
                <RefreshCw size={20} />
                <span>Làm mới</span>
              </button>
              <button className="receive-goods__header-btn receive-goods__header-btn--primary" onClick={handleCreateReceipt}>
                <Plus size={20} />
                <span>Tạo phiếu nhập</span>
              </button>
            </div>
          </div>
          <p className="receive-goods__section-subtitle">Quản lý và theo dõi các phiếu nhập</p>
        </div>

        <div className="receive-goods__search-wrapper">
          <Search className="receive-goods__search-icon" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm phiếu nhập..."
            className="receive-goods__search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="receive-goods__table-wrapper">
          <table className="receive-goods__table">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Ngày nhập</th>
                <th>Tổng tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.length > 0 ? (
                filteredReceipts.map((receipt) => (
                  <tr key={receipt.id}>
                    <td>
                      <span className="receive-goods__receipt-code">{receipt.code}</span>
                    </td>
                    <td>{receipt.date}</td>
                    <td>
                      <span className="receive-goods__receipt-total">
                        {formatCurrency(receipt.total)}
                      </span>
                    </td>
                    <td>
                      <div className="receive-goods__action-buttons">
                        <button
                          className="receive-goods__action-btn receive-goods__action-btn--view"
                          onClick={() => handleView(receipt.id)}
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="receive-goods__action-btn receive-goods__action-btn--edit"
                          onClick={() => handleEdit(receipt.id)}
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="receive-goods__action-btn receive-goods__action-btn--delete"
                          onClick={() => handleDelete(receipt.id)}
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="receive-goods__no-data">
                    <Package size={48} />
                    <p>Không tìm thấy phiếu nhập nào</p>
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

export default ReceiveGoods
