import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Eye, Trash2, Edit, AlertTriangle, TrendingUp } from 'lucide-react'
import { toast } from 'react-toastify'
import './WarehouseManagement.css'

interface ProductBatch {
  id: string
  batchCode: string
  mfgDate: string
  expDate: string
  quantity: number
  status: string
}

interface Product {
  id: string
  name: string
  totalQuantity: number
  unit: string
  warehouseType: string
  status: 'normal' | 'low' | 'out' | 'expired'
  batches: ProductBatch[]
}

const WarehouseManagement = () => {
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showBatchModal, setShowBatchModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

  // Mock data
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Bia Hà Nội',
      totalQuantity: 2000,
      unit: 'Thùng',
      warehouseType: 'Kho thường',
      status: 'normal',
      batches: [
        { id: '1', batchCode: 'LO-20260201', mfgDate: '01/02/2026', expDate: '01/02/2027', quantity: 800, status: 'Bình thường' },
        { id: '2', batchCode: 'LO-20260301', mfgDate: '01/03/2026', expDate: '01/03/2027', quantity: 1200, status: 'Bình thường' }
      ]
    },
    {
      id: '2',
      name: 'Gạo ST25',
      totalQuantity: 200,
      unit: 'Kg',
      warehouseType: 'Kho mát',
      status: 'low',
      batches: [
        { id: '3', batchCode: 'LO-20260201', mfgDate: '01/02/2026', expDate: '01/02/2027', quantity: 120, status: 'Xuất trước' },
        { id: '4', batchCode: 'LO-20260301', mfgDate: '01/03/2026', expDate: '01/03/2027', quantity: 80, status: 'Bình thường' }
      ]
    },
    {
      id: '3',
      name: 'Sữa Vinamilk',
      totalQuantity: 0,
      unit: 'Lốc',
      warehouseType: 'Kho đông lạnh',
      status: 'out',
      batches: [
        { id: '5', batchCode: 'LO-20260201', mfgDate: '01/02/2026', expDate: '01/02/2027', quantity: 0, status: 'Hết hàng' },
        { id: '6', batchCode: 'LO-20260301', mfgDate: '01/03/2026', expDate: '01/03/2027', quantity: 0, status: 'Hết hàng' }
      ]
    },
    {
      id: '4',
      name: 'Nước ngọt Coca',
      totalQuantity: 2300,
      unit: 'Chai',
      warehouseType: 'Kho thường',
      status: 'expired',
      batches: [
        { id: '7', batchCode: 'LO-20250101', mfgDate: '01/01/2025', expDate: '01/01/2026', quantity: 300, status: 'Sắp hết hạn' },
        { id: '8', batchCode: 'LO-20250301', mfgDate: '01/03/2025', expDate: '01/03/2026', quantity: 1000, status: 'Xuất trước' },
        { id: '9', batchCode: 'LO-20250401', mfgDate: '01/04/2025', expDate: '01/04/2026', quantity: 1000, status: 'Bình thường' }
      ]
    }
  ])

  const totalProducts = products.length
  const totalQuantity = products.reduce((sum, p) => sum + p.totalQuantity, 0)
  const totalValue = products.reduce((sum, p) => sum + (p.totalQuantity * 50000), 0) // Giá giả định
  const expiredProducts = products.filter(p => p.status === 'expired').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'normal'
      case 'low':
        return 'low'
      case 'out':
        return 'out'
      case 'expired':
        return 'expired'
      default:
        return 'normal'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'normal':
        return 'Bình thường'
      case 'low':
        return 'Sắp hết hàng'
      case 'out':
        return 'Hết hàng'
      case 'expired':
        return 'Sắp hết hạn'
      default:
        return 'Bình thường'
    }
  }

  const handleView = (product: Product) => {
    setSelectedProduct(product)
    setShowBatchModal(true)
  }

  const handleDelete = (product: Product) => {
    setDeleteProduct(product)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (deleteProduct) {
      toast.success(`Đã xóa sản phẩm ${deleteProduct.name}`)
    }
    setShowDeleteModal(false)
    setDeleteProduct(null)
  }

  const handleEdit = (product: Product) => {
    navigate(`/warehouse-management/edit/${product.id}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="warehouse-management-page">
      {/* Header Section */}
      <div className="warehouse-management__header">
        <div className="warehouse-management__header-icon">
          <Package size={36} />
        </div>
        <div className="warehouse-management__header-text">
          <h1 className="warehouse-management__title">Quản lý Kho</h1>
          <p className="warehouse-management__subtitle">Theo dõi tồn kho và quản lý sản phẩm trong kho</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="warehouse-management__stats-grid">
        <div className="warehouse-management__stat-card warehouse-management__stat-card--blue">
          <div className="warehouse-management__stat-icon">
            <Package size={24} />
          </div>
          <div className="warehouse-management__stat-content">
            <div className="warehouse-management__stat-label">Tổng tồn kho</div>
            <div className="warehouse-management__stat-value">{totalQuantity.toLocaleString('vi-VN')}</div>
            <div className="warehouse-management__stat-unit">sản phẩm</div>
          </div>
          <div className="warehouse-management__stat-badge">
            <TrendingUp size={16} />
          </div>
        </div>

        <div className="warehouse-management__stat-card warehouse-management__stat-card--green">
          <div className="warehouse-management__stat-icon">
            <span className="warehouse-management__currency-icon">₫</span>
          </div>
          <div className="warehouse-management__stat-content">
            <div className="warehouse-management__stat-label">Giá trị tồn kho</div>
            <div className="warehouse-management__stat-value">{(totalValue / 1000000).toFixed(1)}M</div>
            <div className="warehouse-management__stat-unit">VND</div>
          </div>
          <div className="warehouse-management__stat-badge">
            <TrendingUp size={16} />
          </div>
        </div>

        <div className="warehouse-management__stat-card warehouse-management__stat-card--orange">
          <div className="warehouse-management__stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="warehouse-management__stat-content">
            <div className="warehouse-management__stat-label">Hàng sắp hết hạn</div>
            <div className="warehouse-management__stat-value">{expiredProducts}</div>
            <div className="warehouse-management__stat-unit">sản phẩm</div>
          </div>
          <div className="warehouse-management__stat-badge">
            <TrendingUp size={16} />
          </div>
        </div>
      </div>

      {/* Products Table Section */}
      <div className="warehouse-management__section">
        <div className="warehouse-management__section-header">
          <div className="warehouse-management__section-title-wrapper">
            <Package size={24} />
            <h2 className="warehouse-management__section-title">Danh sách sản phẩm</h2>
          </div>
          <p className="warehouse-management__section-subtitle">Quản lý và theo dõi tồn kho sản phẩm</p>
        </div>

        <div className="warehouse-management__table-wrapper">
          <table className="warehouse-management__table">
            <thead>
              <tr>
                <th>SẢN PHẨM</th>
                <th>TỔNG TỒN</th>
                <th>ĐƠN VỊ</th>
                <th>LOẠI KHO</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <span className="warehouse-management__product-name">{product.name}</span>
                  </td>
                  <td>
                    <span className="warehouse-management__quantity">{product.totalQuantity.toLocaleString('vi-VN')}</span>
                  </td>
                  <td>{product.unit}</td>
                  <td>{product.warehouseType}</td>
                  <td>
                    <span className={`warehouse-management__status warehouse-management__status--${getStatusColor(product.status)}`}>
                      {getStatusLabel(product.status)}
                    </span>
                  </td>
                  <td>
                    <div className="warehouse-management__action-buttons">
                      <button
                        className="warehouse-management__action-btn warehouse-management__action-btn--view"
                        onClick={() => handleView(product)}
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="warehouse-management__action-btn warehouse-management__action-btn--edit"
                        onClick={() => handleEdit(product)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="warehouse-management__action-btn warehouse-management__action-btn--delete"
                        onClick={() => handleDelete(product)}
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Details Modal */}
      {showBatchModal && selectedProduct && (
        <div className="warehouse-management__modal-overlay" onClick={() => setShowBatchModal(false)}>
          <div className="warehouse-management__modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="warehouse-management__modal-header">
              <h2 className="warehouse-management__modal-title">Chi tiết lô - {selectedProduct.name}</h2>
              <button 
                className="warehouse-management__modal-close"
                onClick={() => setShowBatchModal(false)}
              >
                ×
              </button>
            </div>

            <div className="warehouse-management__modal-body">
              <table className="warehouse-management__batch-table">
                <thead>
                  <tr>
                    <th>MÃ LÔ</th>
                    <th>NGÀY SX</th>
                    <th>HSD</th>
                    <th>SL</th>
                    <th>TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.batches.map((batch) => (
                    <tr key={batch.id}>
                      <td>
                        <span className="warehouse-management__batch-code">{batch.batchCode}</span>
                      </td>
                      <td>{batch.mfgDate}</td>
                      <td>{batch.expDate}</td>
                      <td>
                        <span className="warehouse-management__batch-quantity">{batch.quantity.toLocaleString('vi-VN')}</span>
                      </td>
                      <td>
                        <span className={`warehouse-management__batch-status warehouse-management__batch-status--${batch.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {batch.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="warehouse-management__modal-footer">
              <button 
                className="warehouse-management__modal-btn warehouse-management__modal-btn--close"
                onClick={() => setShowBatchModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteProduct && (
        <div className="warehouse-management__modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="warehouse-management__modal-delete" onClick={(e) => e.stopPropagation()}>
            <div className="warehouse-management__modal-delete-iconbox">
              <Trash2 size={32} />
            </div>
            <div className="warehouse-management__modal-delete-title">Xác nhận xóa sản phẩm?</div>
            <div className="warehouse-management__modal-delete-desc">
              Bạn có chắc chắn muốn xóa sản phẩm <b>{deleteProduct.name}</b> không?
            </div>
            <div className="warehouse-management__modal-delete-warning">Hành động này không thể hoàn tác!</div>
            <div className="warehouse-management__modal-delete-actions">
              <button 
                className="warehouse-management__modal-delete-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button 
                className="warehouse-management__modal-delete-confirm"
                onClick={handleConfirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WarehouseManagement
