import { useNavigate, useParams } from 'react-router-dom';
import { Box, Calendar, User, ArrowLeft, Activity, Building2, Printer, FileSpreadsheet, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import './ViewImport.css';

interface ImportItem {
  name: string
  quantity: number
  price: number
  total: number
  unit: string
  batchNumber?: string
  expiryDate?: string
}

interface ImportRecord {
  id: string
  code: string
  date: string
  creator: string
  status: 'completed' | 'pending' | 'cancelled'
  statusLabel: string
  supplier: string
  supplierPhone?: string
  supplierAddress?: string
  items: ImportItem[]
  note?: string
}

// Mock data với nhiều phiếu nhập
const mockImports: Record<string, ImportRecord> = {
  'PN001': {
    id: '1',
    code: 'PN001',
    date: '2025-01-05',
    creator: 'Nguyễn Văn A',
    status: 'completed',
    statusLabel: 'Hoàn thành',
    supplier: 'Công ty TNHH Thực phẩm Việt',
    supplierPhone: '0901234567',
    supplierAddress: '123 Nguyễn Trãi, Q.1, TP.HCM',
    items: [
      { name: 'Bia Hà Nội', quantity: 100, price: 200000, total: 20000000, unit: 'Thùng', batchNumber: 'BHN2501', expiryDate: '2025-07-01' },
      { name: 'Nước ngọt Pepsi', quantity: 50, price: 150000, total: 7500000, unit: 'Thùng', batchNumber: 'PEP2501', expiryDate: '2025-08-15' },
    ],
    note: 'Nhập bổ sung hàng Tết'
  },
  'PN002': {
    id: '2',
    code: 'PN002',
    date: '2025-01-07',
    creator: 'Trần Thị B',
    status: 'completed',
    statusLabel: 'Hoàn thành',
    supplier: 'Công ty CP Sữa Vinamilk',
    supplierPhone: '0987654321',
    supplierAddress: '456 Lê Lợi, Q.3, TP.HCM',
    items: [
      { name: 'Sữa Vinamilk', quantity: 200, price: 50000, total: 10000000, unit: 'Lốc', batchNumber: 'VNM2501', expiryDate: '2025-04-01' },
      { name: 'Sữa chua Vinamilk', quantity: 100, price: 30000, total: 3000000, unit: 'Lốc', batchNumber: 'VNM2502', expiryDate: '2025-02-28' },
    ],
    note: 'Nhập hàng định kỳ'
  },
  'PN003': {
    id: '3',
    code: 'PN003',
    date: '2025-01-08',
    creator: 'Lê Văn C',
    status: 'pending',
    statusLabel: 'Đang xử lý',
    supplier: 'Công ty TNHH Bánh kẹo ABC',
    supplierPhone: '0912345678',
    supplierAddress: '789 Điện Biên Phủ, Q.10, TP.HCM',
    items: [
      { name: 'Bánh quy Oreo', quantity: 150, price: 30000, total: 4500000, unit: 'Hộp', batchNumber: 'ORE2501', expiryDate: '2025-12-31' },
      { name: 'Snack Oishi', quantity: 200, price: 10000, total: 2000000, unit: 'Gói', batchNumber: 'OIS2501', expiryDate: '2025-09-30' },
      { name: 'Kẹo Chupa Chups', quantity: 100, price: 15000, total: 1500000, unit: 'Gói', batchNumber: 'CHP2501', expiryDate: '2026-01-15' },
    ],
    note: 'Đơn hàng mới - đang kiểm tra chất lượng'
  },
  '4': {
    id: '4',
    code: '#4',
    date: '2024-05-04',
    creator: 'ST',
    status: 'completed',
    statusLabel: 'Hoàn thành',
    supplier: 'Công ty TNHH ABC',
    items: [
      { name: 'Gạo ST25', quantity: 60, price: 25000, total: 1500000, unit: 'Kg' },
      { name: 'Nước ngọt Pepsi', quantity: 100, price: 9000, total: 900000, unit: 'Lon' },
      { name: 'Snack Oishi', quantity: 50, price: 12000, total: 600000, unit: 'Gói' },
    ],
    note: ''
  }
};

const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + ' VND';

const ViewImport = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Lấy dữ liệu phiếu nhập từ mock data dựa trên id
  const importData = id ? mockImports[id] : null;

  if (!importData) {
    return (
      <div className="view-import-wrapper">
        <div className="view-import-not-found">
          <Box size={64} />
          <h2>Không tìm thấy phiếu nhập</h2>
          <p>Phiếu nhập mã "{id}" không tồn tại trong hệ thống.</p>
          <button className="view-import-back-btn" onClick={() => navigate('/receive-goods')}>
            <ArrowLeft size={20} /> Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const total = importData.items.reduce((sum, i) => sum + i.total, 0);
  const totalProducts = importData.items.reduce((sum, i) => sum + i.quantity, 0);

  // Export to Excel
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Sheet 1: Thông tin phiếu nhập
    const infoData = [
      { 'Thông tin': 'Mã phiếu nhập', 'Giá trị': importData.code },
      { 'Thông tin': 'Ngày lập', 'Giá trị': importData.date },
      { 'Thông tin': 'Người tạo', 'Giá trị': importData.creator },
      { 'Thông tin': 'Trạng thái', 'Giá trị': importData.statusLabel },
      { 'Thông tin': 'Nhà cung cấp', 'Giá trị': importData.supplier },
      { 'Thông tin': 'SĐT', 'Giá trị': importData.supplierPhone || 'N/A' },
      { 'Thông tin': 'Địa chỉ', 'Giá trị': importData.supplierAddress || 'N/A' },
      { 'Thông tin': 'Ghi chú', 'Giá trị': importData.note || '' },
      { 'Thông tin': 'Tổng tiền', 'Giá trị': formatCurrency(total) },
    ];
    const ws1 = XLSX.utils.json_to_sheet(infoData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Thông tin');
    
    // Sheet 2: Chi tiết sản phẩm
    const itemsData = importData.items.map((item, idx) => ({
      'STT': idx + 1,
      'Mặt hàng': item.name,
      'Đơn vị': item.unit,
      'Số lượng': item.quantity,
      'Đơn giá': item.price,
      'Thành tiền': item.total,
      'Số lô': item.batchNumber || 'N/A',
      'Hạn sử dụng': item.expiryDate || 'N/A'
    }));
    const ws2 = XLSX.utils.json_to_sheet(itemsData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Chi tiết sản phẩm');
    
    XLSX.writeFile(wb, `PhieuNhap_${importData.code}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`);
    toast.success('Xuất file Excel thành công!');
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return 'view-import-status-badge--completed';
      case 'pending': return 'view-import-status-badge--pending';
      case 'cancelled': return 'view-import-status-badge--cancelled';
      default: return '';
    }
  };

  return (
    <div className="view-import-wrapper">
      <div className="view-import-header">
        <div className="view-import-header-icon"><Box size={36} /></div>
        <div className="view-import-header-content">
          <h1 className="view-import-title">Chi tiết Phiếu Nhập</h1>
          <p className="view-import-desc">Thông tin chi tiết phiếu nhập mã <b>{importData.code}</b></p>
        </div>
        <div className="view-import-header-actions">
          <button className="view-import-action-btn view-import-action-btn--excel" onClick={handleExportExcel}>
            <FileSpreadsheet size={18} /> Excel
          </button>
          <button className="view-import-action-btn view-import-action-btn--print" onClick={handlePrint}>
            <Printer size={18} /> In
          </button>
          <button className="view-import-back-btn" onClick={() => navigate('/receive-goods')}>
            <ArrowLeft size={20} /> Quay lại
          </button>
        </div>
      </div>
      <div className="view-import-main">
        {/* Thông tin chung */}
        <div className="view-import-section">
          <h2 className="view-import-section-title">Thông tin chung</h2>
          <div className="view-import-info-row">
            <div className="view-import-info-block">
              <span className="view-import-info-icon"><Box size={20} /></span>
              <div>
                <div className="view-import-info-label">Mã phiếu nhập</div>
                <div className="view-import-info-value">{importData.code}</div>
              </div>
            </div>
            <div className="view-import-info-block">
              <span className="view-import-info-icon"><Calendar size={20} /></span>
              <div>
                <div className="view-import-info-label">Ngày lập phiếu</div>
                <div className="view-import-info-value">{importData.date.split('-').reverse().join('/')}</div>
              </div>
            </div>
            <div className="view-import-info-block">
              <span className="view-import-info-icon"><User size={20} /></span>
              <div>
                <div className="view-import-info-label">Người tạo</div>
                <div className="view-import-info-value">{importData.creator}</div>
              </div>
            </div>
            <div className="view-import-info-block">
              <span className="view-import-info-icon"><Activity size={20} /></span>
              <div>
                <div className="view-import-info-label">Trạng thái</div>
                <span className={`view-import-status-badge ${getStatusClass(importData.status)}`}>{importData.statusLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin nhà cung cấp */}
        <div className="view-import-section">
          <h2 className="view-import-section-title">Thông tin nhà cung cấp</h2>
          <div className="view-import-info-row">
            <div className="view-import-info-block">
              <span className="view-import-info-icon"><Building2 size={20} /></span>
              <div>
                <div className="view-import-info-label">Nhà cung cấp</div>
                <div className="view-import-info-value">{importData.supplier}</div>
              </div>
            </div>
            {importData.supplierPhone && (
              <div className="view-import-info-block">
                <span className="view-import-info-icon">📞</span>
                <div>
                  <div className="view-import-info-label">Số điện thoại</div>
                  <div className="view-import-info-value">{importData.supplierPhone}</div>
                </div>
              </div>
            )}
            {importData.supplierAddress && (
              <div className="view-import-info-block view-import-info-block--full">
                <span className="view-import-info-icon">📍</span>
                <div>
                  <div className="view-import-info-label">Địa chỉ</div>
                  <div className="view-import-info-value">{importData.supplierAddress}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="view-import-section">
          <div className="view-import-section-title-row">
            <h2 className="view-import-section-title">Danh sách sản phẩm</h2>
            <span className="view-import-section-total">Tổng: {totalProducts} sản phẩm</span>
          </div>
          <div className="view-import-table-section">
            <table className="view-import-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mặt hàng</th>
                  <th>Đơn vị</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                  {importData.items.some(i => i.batchNumber) && <th>Số lô</th>}
                  {importData.items.some(i => i.expiryDate) && <th>HSD</th>}
                </tr>
              </thead>
              <tbody>
                {importData.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.unit}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td className="view-import-money">{formatCurrency(item.total)}</td>
                    {importData.items.some(i => i.batchNumber) && <td>{item.batchNumber || '-'}</td>}
                    {importData.items.some(i => i.expiryDate) && <td>{item.expiryDate || '-'}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ghi chú */}
        {importData.note && (
          <div className="view-import-section">
            <h2 className="view-import-section-title">Ghi chú</h2>
            <p className="view-import-note">{importData.note}</p>
          </div>
        )}

        {/* Tổng cộng */}
        <div className="view-import-total-box">
          <div className="view-import-total-label">Tổng cộng</div>
          <div className="view-import-total-value">{total.toLocaleString('vi-VN')} <span>VND</span></div>
          <div className="view-import-total-supplier">Nhà cung cấp: <span>{importData.supplier}</span></div>
          <div className="view-import-total-count">{importData.items.length} sản phẩm</div>
        </div>
      </div>
    </div>
  );
};

export default ViewImport;

