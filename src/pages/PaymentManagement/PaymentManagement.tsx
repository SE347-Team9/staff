import { useState } from 'react'
import { toast } from 'react-toastify';
import { DollarSign, Plus, Search, Edit, Trash2, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './PaymentManagement.css'

interface Payment {
  id: string
  code: string
  date: string
  agency: string
  amount: number
  status: 'paid' | 'pending'
}

const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  // Mock data
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      code: '2',
      date: '2024-05-16',
      agency: 'Đại lý Đại',
      amount: 300000,
      status: 'paid'
    },
    {
      id: '2',
      code: '1',
      date: '2024-05-15',
      agency: 'Đại lý Nghĩa',
      amount: 500000,
      status: 'paid'
    }
  ]);

  const totalPayments = 2
  const totalAmount = 800000

  const filteredPayments = payments.filter(payment =>
    payment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.agency.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleEdit = (id: string) => {
    navigate(`/payment/edit/${id}`);
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePayment, setDeletePayment] = useState<Payment | null>(null);

  const handleDelete = (id: string) => {
    const payment = payments.find(p => p.id === id) || null;
    setDeletePayment(payment);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deletePayment) {
      setPayments(prev => prev.filter(p => p.id !== deletePayment.id));
      toast.success('Đã xóa phiếu thu thành công!');
    }
    setShowDeleteModal(false);
    setDeletePayment(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletePayment(null);
  };

  const handleAddPayment = () => {
    navigate('/create-receipt-voucher');
  }

  return (
    <div className="payment-management-page">
      {/* Header Section */}
      <div className="payment-management__header">
        <div className="payment-management__header-icon">
          <DollarSign size={36} />
        </div>
        <div className="payment-management__header-text">
          <h1 className="payment-management__title">Phiếu Thu Của Tôi</h1>
        </div>
        <div className="payment-management__header-actions">
          <button className="payment-management__header-btn payment-management__header-btn--primary" onClick={handleAddPayment}>
            <Plus size={20} />
            <span>Thêm phiếu thu</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="payment-management__stats-grid">
        <div className="payment-management__stat-card payment-management__stat-card--blue">
          <div className="payment-management__stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="payment-management__stat-content">
            <div className="payment-management__stat-label">Tổng phiếu thu</div>
            <div className="payment-management__stat-value">{totalPayments}</div>
          </div>
        </div>

        <div className="payment-management__stat-card payment-management__stat-card--green">
          <div className="payment-management__stat-icon">
            <span className="payment-management__currency-icon">₫</span>
          </div>
          <div className="payment-management__stat-content">
            <div className="payment-management__stat-label">Tổng số tiền</div>
            <div className="payment-management__stat-value">{(totalAmount / 1000000).toFixed(2)}M</div>
          </div>
        </div>
      </div>

      {/* Payments Table Section */}
      <div className="payment-management__table-section">
        <div className="payment-management__search-wrapper">
          <Search className="payment-management__search-icon" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã phiếu, ngày thu..."
            className="payment-management__search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="payment-management__table-wrapper">
          <table className="payment-management__table">
            <thead>
              <tr>
                <th>
                  <span>
                    <DollarSign size={18} />
                    <span>MÃ PHIẾU</span>
                  </span>
                </th>
                <th>NGÀY THU</th>
                <th>ĐẠI LÝ</th>
                <th>SỐ TIỀN</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <div className="payment-management__receipt-code">
                        <DollarSign size={16} />
                        <span>{payment.code}</span>
                      </div>
                    </td>
                    <td>{payment.date}</td>
                    <td>
                      <div className="payment-management__agency-name">
                        {payment.agency}
                      </div>
                    </td>
                    <td>
                      <span className="payment-management__amount">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td>
                      <span className={`payment-management__status payment-management__status--${payment.status}`}>
                        <CheckCircle size={16} />
                        <span>Đã thanh toán</span>
                      </span>
                    </td>
                    <td>
                      <div className="payment-management__action-buttons">
                        <button
                          className="payment-management__action-btn payment-management__action-btn--edit"
                          onClick={() => handleEdit(payment.id)}
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="payment-management__action-btn payment-management__action-btn--delete"
                          onClick={() => handleDelete(payment.id)}
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
                  <td colSpan={6} className="payment-management__no-data">
                    <DollarSign size={48} />
                    <p>Không tìm thấy phiếu thu nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Popup xác nhận xóa phiếu thu */}
      {showDeleteModal && deletePayment && (
        <div className="payment-management__modal-overlay" onClick={handleCancelDelete}>
          <div className="payment-management__modal-delete" onClick={e => e.stopPropagation()}>
            <div className="payment-management__modal-delete-iconbox">
              <Trash2 size={32} />
            </div>
            <div className="payment-management__modal-delete-title">Xác nhận xóa phiếu thu?</div>
            <div className="payment-management__modal-delete-desc">Bạn có chắc chắn muốn xóa phiếu thu <b>{deletePayment.code}</b> không?</div>
            <div className="payment-management__modal-delete-warning">Hành động này không thể hoàn tác!</div>
            <div className="payment-management__modal-delete-actions">
              <button className="payment-management__modal-delete-cancel" onClick={handleCancelDelete}>Hủy</button>
              <button className="payment-management__modal-delete-confirm" onClick={handleConfirmDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentManagement
