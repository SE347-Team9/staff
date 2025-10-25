import { useState } from 'react'
import { Truck, Search, Plus, AlertCircle, Eye, Edit, Trash2, List } from 'lucide-react'
import './ExportManagement.css'

interface Export {
  id: string
  code: string
  agency: string
  date: string
  total: number
  status: 'delivered' | 'pending' | 'cancelled'
  statusLabel: string
}

const ExportManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAgency, setSelectedAgency] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Mock data
  const exports: Export[] = [
    {
      id: '1',
      code: 'PX002',
      agency: 'Đại lý Đại',
      date: '11/5/2024',
      total: 900000,
      status: 'delivered',
      statusLabel: 'Đã giao hàng'
    },
    {
      id: '2',
      code: 'PX001',
      agency: 'Đại lý Nghĩa',
      date: '10/5/2024',
      total: 1530000,
      status: 'delivered',
      statusLabel: 'Đã giao hàng'
    }
  ]

  const totalExports = exports.length
  const totalAmount = exports.reduce((sum, exp) => sum + exp.total, 0)

  const filteredExports = exports.filter(exp => {
    const matchSearch = exp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       exp.agency.toLowerCase().includes(searchTerm.toLowerCase())
    const matchAgency = selectedAgency === 'all' || exp.agency === selectedAgency
    // Add date filtering logic here if needed
    return matchSearch && matchAgency
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleView = (id: string) => {
    console.log('View export:', id)
  }

  const handleEdit = (id: string) => {
    console.log('Edit export:', id)
  }

  const handleDelete = (id: string) => {
    console.log('Delete export:', id)
  }

  const handleCreateExport = () => {
    console.log('Create new export')
  }

  const handleConfirmFeedback = () => {
    console.log('Confirm feedback request')
  }

  return (
    <div className="export-management-page">
      {/* Header Section */}
      <div className="export-header">
        <div className="export-management__header-icon">
          <Truck size={36} />
        </div>
        <div className="export-management__header-text">
          <h1 className="export-title">QUẢN LÝ XUẤT HÀNG</h1>
          <p className="export-subtitle">Theo dõi và quản lý các phiếu xuất hàng của đại lý.</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="export-stats-grid">
        <div className="export-stat-card stat-blue">
          <div className="stat-icon-box">
            <List size={32} />
          </div>
          <div className="export-management__stat-content">
            <div className="export-management__stat-label">Tổng phiếu xuất</div>
            <div className="export-management__stat-value">{totalExports}</div>
          </div>
        </div>
        <div className="export-stat-card stat-green">
          <div className="stat-icon-box">
            <span className="currency-icon">₫</span>
          </div>
          <div className="export-management__stat-content">
            <div className="export-management__stat-label">Tổng số tiền</div>
            <div className="export-management__stat-value">{(totalAmount / 1000000).toFixed(2)}M</div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="export-main-card">
        <div className="export-main-header">
          <div className="main-header-left">
            <Truck size={28} />
            <h2 className="main-title">QUẢN LÝ XUẤT HÀNG</h2>
          </div>
          <div className="main-header-actions">
            <button className="export-management__action-btn export-management__action-btn--orange" onClick={handleConfirmFeedback}>
              <AlertCircle size={20} />
              <span>Xác nhận yêu cầu phản hồi</span>
            </button>
            <button className="export-management__action-btn export-management__action-btn--blue" onClick={handleCreateExport}>
              <Plus size={20} />
              <span>Tạo phiếu xuất</span>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="export-filters">
          <div className="filter-search">
            <Search className="export-management__search-icon" size={20} />
            <input
              type="text"
              className="export-management__search-input"
              placeholder="Tìm kiếm phiếu xuất..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="export-management__filter-select"
            value={selectedAgency}
            onChange={(e) => setSelectedAgency(e.target.value)}
          >
            <option value="all">Tất cả đại lý</option>
            <option value="Đại lý Đại">Đại lý Đại</option>
            <option value="Đại lý Nghĩa">Đại lý Nghĩa</option>
          </select>
          <input
            type="date"
            className="export-management__filter-date"
            placeholder="mm/dd/yyyy"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="export-management__filter-date"
            placeholder="mm/dd/yyyy"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Table Section */}
        <div className="export-table-section">
          <div className="table-header">
            <List size={24} />
            <h3 className="table-title">Danh sách phiếu xuất</h3>
          </div>

          <div className="export-table-wrapper">
            <table className="export-table">
              <thead>
                <tr>
                  <th className="col-code">MÃ PHIẾU XUẤT</th>
                  <th className="col-agency">ĐẠI LÝ</th>
                  <th className="col-date">NGÀY LẬP PHIẾU</th>
                  <th className="col-total">TỔNG TIỀN</th>
                  <th className="col-status">TRẠNG THÁI</th>
                  <th className="col-actions">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredExports.length > 0 ? (
                  filteredExports.map((exp) => (
                    <tr key={exp.id}>
                      <td className="col-code">
                        <div className="export-code">
                          <Truck size={18} />
                          <span>{exp.code}</span>
                        </div>
                      </td>
                      <td className="col-agency">{exp.agency}</td>
                      <td className="col-date">{exp.date}</td>
                      <td className="col-total">
                        <span className="total-amount">{formatCurrency(exp.total)}</span>
                      </td>
                      <td className="col-status">
                        <span className={`status-badge status-${exp.status}`}>
                          {exp.statusLabel}
                        </span>
                      </td>
                      <td className="col-actions">
                        <div className="export-management__action-buttons">
                          <button
                            className="export-management__action-icon-btn export-management__action-icon-btn--view"
                            onClick={() => handleView(exp.id)}
                            title="Xem"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="export-management__action-icon-btn export-management__action-icon-btn--edit"
                            onClick={() => handleEdit(exp.id)}
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="export-management__action-icon-btn export-management__action-icon-btn--delete"
                            onClick={() => handleDelete(exp.id)}
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
                    <td colSpan={6} className="export-management__no-data">
                      <Truck size={48} />
                      <p>Không tìm thấy phiếu xuất nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportManagement
