import { useNavigate, useParams } from 'react-router-dom'
import { Package, ArrowLeft } from 'lucide-react'
import './ViewReceiveOrder.css'

interface ReceiveOrderItem {
  id: number
  product: string
  unit: string
  warehouse: string
  quantity: number
  price: number
  mfgDate: string
  expDate: string
  total: number
}

const ViewReceiveOrder = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  // Mock data - In production, fetch from API using the id
  const receiveOrder = {
    id: id,
    code: 'MPNHAN001',
    manufacturer: 'Công ty A',
    date: '5/5/2024',
    status: 'approved',
    items: [
      { 
        id: 1, 
        product: 'Bia Hà Nội', 
        unit: 'Thùng', 
        warehouse: 'Kho thường',
        quantity: 10, 
        price: 250000, 
        mfgDate: '2024-01-01',
        expDate: '2025-01-01',
        total: 2500000 
      },
      { 
        id: 2, 
        product: 'Nước ngọt Coca', 
        unit: 'Chai', 
        warehouse: 'Kho mát',
        quantity: 50, 
        price: 10000,
        mfgDate: '2024-02-01',
        expDate: '2025-02-01',
        total: 500000 
      }
    ],
    total: 3000000
  }

  const handleBack = () => {
    navigate('/receive-management')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt'
      case 'pending':
        return 'Chờ duyệt'
      case 'rejected':
        return 'Từ chối'
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'status-approved'
      case 'pending':
        return 'status-pending'
      case 'rejected':
        return 'status-rejected'
      default:
        return ''
    }
  }

  return (
    <div className="view-receive-order-page">
      <div className="view-receive-order-container">
        {/* Header */}
        <div className="view-receive-order-header">
          <Package size={32} />
          <h1 className="view-receive-order-title">Chi tiết phiếu nhận</h1>
          <button className="btn-back" onClick={handleBack}>
            <ArrowLeft size={20} />
            Trở lại
          </button>
        </div>

        {/* Receipt Info */}
        <div className="view-receive-order-content">
          {/* Info Section */}
          <div className="info-section">
            <div className="info-row">
              <span className="info-label">Mã phiếu nhận:</span>
              <span className="info-value">{receiveOrder.code}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Nhà sản xuất:</span>
              <span className="info-value">{receiveOrder.manufacturer}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ngày tạo:</span>
              <span className="info-value">{receiveOrder.date}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Trạng thái:</span>
              <span className={`status-badge ${getStatusClass(receiveOrder.status)}`}>
                {getStatusLabel(receiveOrder.status)}
              </span>
            </div>
          </div>

          {/* Products Table */}
          <div className="products-section">
            <h3 className="section-title">Danh sách sản phẩm</h3>

            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th className="col-product">Sản phẩm</th>
                    <th className="col-unit">Đơn vị</th>
                    <th className="col-warehouse">Kho</th>
                    <th className="col-quantity">Số lượng</th>
                    <th className="col-price">Đơn giá</th>
                    <th className="col-date">NSX</th>
                    <th className="col-date">HSD</th>
                    <th className="col-total">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {receiveOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td className="col-product">{item.product}</td>
                      <td className="col-unit">{item.unit}</td>
                      <td className="col-warehouse">{item.warehouse}</td>
                      <td className="col-quantity">{item.quantity}</td>
                      <td className="col-price">{formatCurrency(item.price)}</td>
                      <td className="col-date">{formatDate(item.mfgDate)}</td>
                      <td className="col-date">{formatDate(item.expDate)}</td>
                      <td className="col-total">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="total-section">
            <span className="total-label">Tổng tiền:</span>
            <span className="total-amount">{formatCurrency(receiveOrder.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewReceiveOrder
