import './ViewAgency.css';
import { Building2, User, Phone, MapPin, Mail, Tag, Layers, CircleCheck, CalendarClock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Giả lập dữ liệu đại lý, thực tế sẽ lấy từ API hoặc props
const agency = {
  name: 'Đại lý Đại',
  representative: 'Nguyễn Văn A',
  phone: '02232434242',
  address: 'Số 2, Phố Đống Đa, Đống Đa, Hà Nội',
  email: 'daiagency@gmail.com',
  code: 'AG001',
  type: 'Cấp 1',
  status: 'Đang hoạt động',
  createdAt: '2025-01-01',
};

const ViewAgency = () => {
  const navigate = useNavigate();
  return (
    <div className="view-agency-root">
      <div className="view-agency-header-new">
        <div className="view-agency-header-icon-big">
          <Building2 size={48} />
        </div>
        <div className="view-agency-header-title-group">
          <h1 className="view-agency-title">Thông Tin Đại Lý</h1>
          <div className="view-agency-desc">Xem chi tiết đại lý: <b>{agency.name}</b></div>
        </div>
        <button className="view-agency-back-btn" onClick={() => navigate('/agency-management')}>
          <ArrowLeft size={20} style={{marginRight: 6}} /> Quay lại
        </button>
      </div>
      <div className="view-agency-card-new">
        <div className="view-agency-info-grid">
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><User size={20}/> Người đại diện</span>
            <span className="view-agency-info-value">{agency.representative}</span>
          </div>
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><Phone size={20}/> Số điện thoại</span>
            <span className="view-agency-info-value">{agency.phone}</span>
          </div>
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><MapPin size={20}/> Địa chỉ</span>
            <span className="view-agency-info-value">{agency.address}</span>
          </div>
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><Mail size={20}/> Email</span>
            <span className="view-agency-info-value">{agency.email}</span>
          </div>
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><Tag size={20}/> Mã đại lý</span>
            <span className="view-agency-info-value">{agency.code}</span>
          </div>
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><Layers size={20}/> Loại đại lý</span>
            <span className="view-agency-info-value">{agency.type}</span>
          </div>
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><CircleCheck size={20}/> Trạng thái</span>
            <span className="view-agency-info-value view-agency-status-active">{agency.status}</span>
          </div>
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><CalendarClock size={20}/> Ngày tạo</span>
            <span className="view-agency-info-value">{agency.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAgency;
