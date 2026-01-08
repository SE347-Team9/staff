import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck, Search, Plus, AlertCircle, Eye, Edit, Trash2, List } from 'lucide-react'

import { toast } from 'react-toastify';
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
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAgency, setSelectedAgency] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [inventoryLoading, setInventoryLoading] = useState(false)
  // Stub handlers để tránh lỗi biên dịch
  const handleCloseModal = () => setShowRequestModal(false);
  
  const handleConfirmExport = () => {
    if (!inventoryData) return;
    
    // Tạo phiếu xuất từ yêu cầu
    const newExport: Export = {
      id: String(exports.length + 1),
      code: inventoryData.code,
      agency: inventoryData.agency,
      date: new Date().toLocaleDateString('vi-VN'),
      total: inventoryData.items.reduce((sum: number, item: any) => sum + (item.requested * 250000), 0),
      status: 'pending',
      statusLabel: 'Chờ giao hàng'
    };
    
    setExports(prev => [newExport, ...prev]);
    toast.success(`Đã xác nhận yêu cầu xuất hàng ${inventoryData.code}! Phiếu xuất đã được tạo.`);
    setSelectedRequest(null);
    setInventoryData(null);
    setShowRequestModal(false);
  };
  
  const handleCheckInventory = (id: string) => {
    setSelectedRequest(id);
    setInventoryLoading(true);
    setInventoryData(null);
    // Simulate loading and then show inventory data
    setTimeout(() => {
      const req = distributionRequests.find(r => r.id === id);
      if (req) {
        setInventoryData(req);
      }
      setInventoryLoading(false);
    }, 1200);
  };
  const [inventoryData, setInventoryData] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteExport, setDeleteExport] = useState<Export | null>(null);

  // Mock data for distribution requests
  const distributionRequests = [
    {
      id: '1',
      code: 'PX005',
      agency: 'Đại lý Nghĩa',
      date: '2025-10-11',
      status: 'pending',
      items: [
        { name: 'Bia Hà Nội', requested: 12, available: 96 },
        { name: 'Gạo ST25', requested: 12, available: 190 }
      ]
    }
  ]

  // Mock data
  const [exports, setExports] = useState<Export[]>([
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
  ]);

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
    navigate(`/view-export/${id}`);
  }

  const handleEdit = (id: string) => {
    navigate(`/edit-export/${id}`)
  }

  const handleDelete = (id: string) => {
    const exp = exports.find(e => e.id === id) || null;
    setDeleteExport(exp);
    setShowDeleteModal(true);
  }

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    if (deleteExport) {
      setExports(prev => prev.filter(exp => exp.id !== deleteExport.id));
      toast.success('Đã xóa phiếu xuất ' + deleteExport.code + ' thành công!');
    }
    setDeleteExport(null);
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteExport(null);
  }

  const handleCreateExport = () => {
    navigate('/create-export')
  }

  const handleConfirmFeedback = () => {
    setShowRequestModal(true);
  }

  const handlePauseRequest = () => {
    setSelectedRequest(null)
    setInventoryData(null)
    alert('Yêu cầu đã được tạm hoãn')
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
              <span>Xác nhận yêu cầu phân phối</span>
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
                        <span className="export-total-amount">{formatCurrency(exp.total)}</span>
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

      {/* Popup xác nhận xóa phiếu xuất */}
      {showDeleteModal && deleteExport && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content modal-delete-modern" onClick={e => e.stopPropagation()}>
            <div className="modal-delete-modern-iconbox">
              <Trash2 size={32} />
            </div>
            <div className="modal-delete-modern-title">Xác nhận xóa phiếu xuất</div>
            <div className="modal-delete-modern-desc">
              Bạn có chắc chắn muốn xóa phiếu xuất <b>{deleteExport.code}</b>?
            </div>
            <div className="modal-delete-modern-warning">Hành động này không thể hoàn tác.</div>
            <div className="modal-delete-modern-actions">
              <button className="btn-modal-cancel-modern" onClick={handleCancelDelete}>Hủy bỏ</button>
              <button className="btn-modal-delete-modern" onClick={handleConfirmDelete}>Xóa phiếu xuất</button>
            </div>
          </div>
        </div>
      )}

      {/* Distribution Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <AlertCircle size={28} className="modal-icon" />
              <h2 className="modal-title">Yêu cầu xuất hàng từ đại lý</h2>
            </div>
            
            <p className="modal-description">
              Danh sách các đại lý gửi yêu cầu xuất hàng, xác nhận để lập phiếu xuất.
            </p>

            <div className="request-table-wrapper">
              <table className="request-table">
                <thead>
                  <tr>
                    <th>MÃ YÊU CẦU</th>
                    <th>ĐẠI LÝ</th>
                    <th>NGÀY YÊU CẦU</th>
                    <th>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {distributionRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="request-code">{request.code}</td>
                      <td>{request.agency}</td>
                      <td>{request.date}</td>
                      <td>
                        {selectedRequest === request.id ? (
                          <div className="inventory-check-section">
                            {inventoryLoading ? (
                              <div className="loading-spinner">
                                <div className="spinner"></div>
                                <span>Đang kiểm tra...</span>
                              </div>
                            ) : inventoryData ? (
                              <div className="inventory-details">
                                <div className="inventory-status">
                                  <span className="status-label">Chi tiết tồn kho:</span>
                                  <span className="status-badge status-sufficient">ĐỦ TỒN KHO</span>
                                </div>
                                
                                <div className="inventory-items">
                                  {inventoryData.items.map((item: any, idx: number) => (
                                    <div key={idx} className="inventory-item">
                                      <div className="item-info">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-quantity">
                                          Yêu cầu: {item.requested} | Có sẵn: {item.available}
                                        </span>
                                      </div>
                                      <span className="item-status">{item.requested}/{item.available} ✓</span>
                                    </div>
                                  ))}
                                </div>

                                <div className="inventory-summary">
                                  <span className="summary-text">Tóm tắt:</span>
                                  <span className="summary-result">
                                    ✓ Tất cả mặt hàng đều đủ tồn kho - Có thể xác nhận xuất hàng
                                  </span>
                                </div>

                                <div className="inventory-actions">
                                  <button className="btn-confirm" onClick={handleConfirmExport}>
                                    ✓ Xác nhận
                                  </button>
                                  <button className="btn-pause" onClick={handlePauseRequest}>
                                    ⊗ Tạm hoãn
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <button 
                            className="btn-check-inventory"
                            onClick={() => handleCheckInventory(request.id)}
                          >
                            Kiểm tra tồn kho
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-actions">
              <button className="btn-modal-close" onClick={handleCloseModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExportManagement
