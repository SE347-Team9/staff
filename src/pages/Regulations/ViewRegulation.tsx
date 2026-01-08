import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Calendar } // Thêm icon Calendar
from 'lucide-react';
import './ViewRegulation.css';

const regulation = {
  id: 'max_debt_level_1',
  value: '100000000',
  description: 'Trần nợ đại lý cấp 1',
  updatedAt: '2025-07-11T21:35:00',
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  // Thay đổi định dạng một chút cho gọn
  return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const ViewRegulation = () => {
  const navigate = useNavigate();
  return (
    <div className="view-regulation-wrapper">

      <div className="view-regulation-card">
        {/* --- Header --- */}
        <div className="view-regulation-header view-regulation-header--with-back">
          <div className="view-regulation-header-row">
            <h1 className="view-regulation-title">Chi tiết quy định</h1>
            <button className="view-regulation__back-button" onClick={() => navigate('/regulations')}>
              <ArrowLeft size={20} />
              Quay lại
            </button>
          </div>
          <p className="view-regulation-subtitle">
            Xem thông tin chi tiết và lịch sử cập nhật của quy định hệ thống.
          </p>
          <div className="view-regulation-updated">
            <Calendar size={14} />
            <span>Cập nhật lần cuối: {formatDate(regulation.updatedAt)}</span>
          </div>
        </div>
        {/* --- Nội dung --- */}
        <div className="view-regulation-content">
          {/* BỐ CỤC MỚI: Dạng danh sách_chi_tiết */}
          <div className="view-regulation-fields">
            <div className="field-item">
              <label>Mã quy định</label>
              <span className="field-value">{regulation.id}</span>
            </div>
            
            <div className="field-item">
              <label>Giá trị</label>
              <span className="field-value is-numeric">
                {/* Format số cho dễ đọc */}
                {Number(regulation.value).toLocaleString('vi-VN')}
              </span>
            </div>

            <div className="field-item is-full-width">
              <label>Mô tả</label>
              <span className="field-value is-description">
                {regulation.description}
              </span>
            </div>
          </div>

          {/* DI CHUYỂN "Lưu ý" XUỐNG ĐÂY */}
          <div className="view-regulation-note">
            <AlertTriangle size={20} className="view-regulation-note-icon" />
            <div>
              <b>Lưu ý</b>
              <p>Bạn chỉ có quyền xem thông tin quy định. Để thay đổi giá trị, vui lòng liên hệ quản trị viên.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRegulation;