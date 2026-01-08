import { useNavigate, useParams } from 'react-router-dom';
import { FileText, ArrowLeft, Building2, Calendar, Package, DollarSign, User, Truck, CheckCircle, Clock } from 'lucide-react';
import './ViewExport.css';

// Mock data - thực tế sẽ fetch từ API dựa vào id
const exportsData: { [key: string]: any } = {
  '1': {
    id: '1',
    code: 'PX002',
    agency: 'Đại lý Đại',
    agencyCode: 'DL002',
    agencyAddress: 'Số 2, Phố Đông Đa, Đống Đa, Hà Nội',
    agencyPhone: '0901234568',
    date: '11/5/2024',
    status: 'delivered',
    statusLabel: 'Đã giao hàng',
    createdBy: 'Nguyễn Văn A',
    deliveredBy: 'Trần Văn B',
    deliveredDate: '12/5/2024',
    items: [
      { name: 'Nước ngọt Pepsi', unit: 'Thùng', quantity: 10, price: 180000 },
      { name: 'Sữa Vinamilk', unit: 'Lốc', quantity: 5, price: 60000 },
    ],
    totalAmount: 2100000,
    amountPaid: 1200000,
    remainingAmount: 900000,
    note: 'Giao hàng trong giờ hành chính'
  },
  '2': {
    id: '2',
    code: 'PX001',
    agency: 'Đại lý Nghĩa',
    agencyCode: 'DL001',
    agencyAddress: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội',
    agencyPhone: '0901234567',
    date: '10/5/2024',
    status: 'delivered',
    statusLabel: 'Đã giao hàng',
    createdBy: 'Nguyễn Văn A',
    deliveredBy: 'Trần Văn B',
    deliveredDate: '11/5/2024',
    items: [
      { name: 'Bia Hà Nội', unit: 'Thùng', quantity: 5, price: 250000 },
      { name: 'Gạo ST25', unit: 'Kg', quantity: 10, price: 28000 },
    ],
    totalAmount: 1530000,
    amountPaid: 1530000,
    remainingAmount: 0,
    note: ''
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const ViewExport = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const exportData = exportsData[id || '1'] || exportsData['1'];
  const total = exportData.items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);

  return (
    <div className="view-export-page">
      {/* Header */}
      <div className="view-export__header">
        <button className="view-export__back-btn" onClick={() => navigate('/export-management')}>
          <ArrowLeft size={20} />
        </button>
        <div className="view-export__header-icon">
          <FileText size={32} />
        </div>
        <div className="view-export__header-text">
          <h1 className="view-export__title">Chi tiết phiếu xuất</h1>
          <p className="view-export__subtitle">Mã phiếu: {exportData.code}</p>
        </div>
        <div className={`view-export__status view-export__status--${exportData.status}`}>
          {exportData.status === 'delivered' ? <CheckCircle size={18} /> : <Clock size={18} />}
          {exportData.statusLabel}
        </div>
      </div>

      <div className="view-export__content">
        {/* Thông tin phiếu */}
        <div className="view-export__section">
          <h2 className="view-export__section-title">
            <FileText size={20} />
            Thông tin phiếu xuất
          </h2>
          <div className="view-export__info-grid">
            <div className="view-export__info-item">
              <span className="view-export__info-label">Mã phiếu</span>
              <span className="view-export__info-value view-export__code">{exportData.code}</span>
            </div>
            <div className="view-export__info-item">
              <span className="view-export__info-label">Ngày lập</span>
              <span className="view-export__info-value">
                <Calendar size={16} /> {exportData.date}
              </span>
            </div>
            <div className="view-export__info-item">
              <span className="view-export__info-label">Người lập</span>
              <span className="view-export__info-value">
                <User size={16} /> {exportData.createdBy}
              </span>
            </div>
            {exportData.deliveredBy && (
              <div className="view-export__info-item">
                <span className="view-export__info-label">Người giao</span>
                <span className="view-export__info-value">
                  <Truck size={16} /> {exportData.deliveredBy}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Thông tin đại lý */}
        <div className="view-export__section">
          <h2 className="view-export__section-title">
            <Building2 size={20} />
            Thông tin đại lý
          </h2>
          <div className="view-export__info-grid">
            <div className="view-export__info-item">
              <span className="view-export__info-label">Mã đại lý</span>
              <span className="view-export__info-value">{exportData.agencyCode}</span>
            </div>
            <div className="view-export__info-item">
              <span className="view-export__info-label">Tên đại lý</span>
              <span className="view-export__info-value">{exportData.agency}</span>
            </div>
            <div className="view-export__info-item view-export__info-item--full">
              <span className="view-export__info-label">Địa chỉ</span>
              <span className="view-export__info-value">{exportData.agencyAddress}</span>
            </div>
            <div className="view-export__info-item">
              <span className="view-export__info-label">Điện thoại</span>
              <span className="view-export__info-value">{exportData.agencyPhone}</span>
            </div>
          </div>
        </div>

        {/* Chi tiết sản phẩm */}
        <div className="view-export__section">
          <h2 className="view-export__section-title">
            <Package size={20} />
            Chi tiết sản phẩm
          </h2>
          <div className="view-export__table-wrapper">
            <table className="view-export__table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>MẶT HÀNG</th>
                  <th>ĐƠN VỊ</th>
                  <th>SỐ LƯỢNG</th>
                  <th>ĐƠN GIÁ</th>
                  <th>THÀNH TIỀN</th>
                </tr>
              </thead>
              <tbody>
                {exportData.items.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.unit}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td className="view-export__money">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Thông tin thanh toán */}
        <div className="view-export__section">
          <h2 className="view-export__section-title">
            <DollarSign size={20} />
            Thông tin thanh toán
          </h2>
          <div className="view-export__payment">
            <div className="view-export__payment-row">
              <span>Tổng tiền hàng</span>
              <span className="view-export__payment-value">{formatCurrency(total)}</span>
            </div>
            <div className="view-export__payment-row">
              <span>Đã thanh toán</span>
              <span className="view-export__payment-value view-export__payment-value--paid">
                {formatCurrency(exportData.amountPaid)}
              </span>
            </div>
            <div className="view-export__payment-row view-export__payment-row--total">
              <span>Còn nợ</span>
              <span className={`view-export__payment-value ${exportData.remainingAmount > 0 ? 'view-export__payment-value--debt' : ''}`}>
                {formatCurrency(exportData.remainingAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Ghi chú */}
        {exportData.note && (
          <div className="view-export__section">
            <h2 className="view-export__section-title">Ghi chú</h2>
            <p className="view-export__note">{exportData.note}</p>
          </div>
        )}

        {/* Actions */}
        <div className="view-export__actions">
          <button className="view-export__btn view-export__btn--secondary" onClick={() => navigate('/export-management')}>
            Quay lại
          </button>
          <button className="view-export__btn view-export__btn--primary" onClick={() => window.print()}>
            In phiếu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewExport;
