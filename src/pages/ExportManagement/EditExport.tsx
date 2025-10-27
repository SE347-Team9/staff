
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle, Plus, Trash2 } from 'lucide-react';
import './EditExport.css';
import { useState } from 'react';

const initialData = {
  code: 'PX002',
  agency: 'Đại lý Đại',
  date: '2024-11-05',
  status: 'delivered',
  statusLabel: 'Đã giao hàng',
  note: 'Xác nhận nhận hàng bởi agency',
  items: [
    { name: 'Nước ngọt Pepsi', unit: 'Lon', quantity: 80, price: 9000 },
    { name: 'Sữa Vinamilk', unit: 'Lốc', quantity: 3, price: 60000 },
  ],
};

const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + ' VND';

const EditExport = () => {
  const navigate = useNavigate();
  const [agency, setAgency] = useState(initialData.agency);
  const [date, setDate] = useState(initialData.date);
  const [note, setNote] = useState(initialData.note);
  const [items, setItems] = useState(initialData.items);

  const handleItemChange = (idx: number, field: string, value: string | number) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items => items.filter((_, i) => i !== idx));
  };

  const handleAddItem = () => {
    setItems(items => [...items, { name: '', unit: '', quantity: 1, price: 0 }]);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="edit-export-wrapper">
      <div className="edit-export-header">
        <div className="edit-export-header-icon">
          <FileText size={36} />
        </div>
        <div className="edit-export-header-content">
          <h1 className="edit-export-title">Chỉnh sửa Phiếu Xuất</h1>
          <p className="edit-export-desc">Cập nhật thông tin phiếu xuất mã <b>#{initialData.code.replace('PX', '')}</b></p>
        </div>
        <button className="edit-export-back-btn" onClick={() => navigate('/export-management')}>
          <ArrowLeft size={20} />
          Quay lại
        </button>
      </div>
      <div className="edit-export-main">
        <div className="edit-export-main-left">
          <div className="edit-export-section">
            <h2 className="edit-export-section-title">Thông tin chung</h2>
            <div className="edit-export-info-grid">
              <div>
                <label className="edit-export-label">Đại lý</label>
                <input className="edit-export-input" value={agency} onChange={e => setAgency(e.target.value)} />
              </div>
              <div>
                <label className="edit-export-label">Ngày xuất hàng</label>
                <input className="edit-export-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="edit-export-section">
            <div className="edit-export-section-title-row">
              <h2 className="edit-export-section-title">Danh sách sản phẩm</h2>
              <button className="edit-export-add-btn" onClick={handleAddItem}><Plus size={18} /> Thêm sản phẩm</button>
            </div>
            <div className="edit-export-table-section">
              <table className="edit-export-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mặt hàng</th>
                    <th>Đơn vị tính</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td style={{ minWidth: 160, maxWidth: 320 }}>
                        <textarea
                          className="edit-export-table-input edit-export-table-textarea"
                          value={item.name}
                          onChange={e => handleItemChange(idx, 'name', e.target.value)}
                          placeholder="Tên sản phẩm"
                          rows={1}
                          style={{ resize: 'vertical', minHeight: 36, maxHeight: 80, width: '100%' }}
                        />
                      </td>
                      <td>
                        <input
                          className="edit-export-table-input"
                          value={item.unit}
                          onChange={e => handleItemChange(idx, 'unit', e.target.value)}
                          placeholder="Đơn vị"
                        />
                      </td>
                      <td>
                        <input
                          className="edit-export-table-input"
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))}
                        />
                      </td>
                      <td>
                        <input
                          className="edit-export-table-input"
                          type="number"
                          min={0}
                          value={item.price}
                          onChange={e => handleItemChange(idx, 'price', Number(e.target.value))}
                        />
                      </td>
                      <td className="edit-export-money">{formatCurrency(item.price * item.quantity)}</td>
                      <td>
                        <button
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          onClick={() => handleRemoveItem(idx)}
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="edit-export-main-right">
          <div className="edit-export-status-card">
            <div className="edit-export-status-label">Trạng thái phiếu</div>
            <div className="edit-export-status-badge edit-export-status-badge--delivered">
              <CheckCircle size={18} /> {initialData.statusLabel}
            </div>
            <div className="edit-export-note-label">Ghi chú</div>
            <textarea
              className="edit-export-note-input"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
          <div className="edit-export-total-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700 }}>Tổng cộng</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="edit-export-total" style={{ fontSize: '2rem', fontWeight: 900 }}>{total.toLocaleString('vi-VN')}</span>
              <span style={{ fontWeight: 700, fontSize: '1.3rem' }}>VND</span>
            </span>
          </div>
          <div className="edit-export-actions">
            <button className="edit-export-btn edit-export-btn--secondary" onClick={() => navigate('/export-management')}>Hủy</button>
            <button className="edit-export-btn edit-export-btn--primary">Lưu thay đổi</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExport;
