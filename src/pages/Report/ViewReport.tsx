import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FileText, ArrowLeft } from 'lucide-react'
import './ViewReport.css'

interface ImportDetail {
  id: string
  product: string
  unit: string
  quantity: number
  unitPrice: number
}

interface DistributionDetail {
  id: string
  agency: string
  product: string
  quantity: number
  unitPrice: number
}

interface DebtDetail {
  id: string
  agency: string
  totalDue: number
  collected: number
}

interface ReportData {
  id: string
  code: string
  type: 'import' | 'distribution' | 'debt'
  typeLabel: string
  period: string
  staff: string
  createdDate: string
  manufacturerFilter?: string
  agencyFilter?: string
  importDetails?: ImportDetail[]
  distributionDetails?: DistributionDetail[]
  debtDetails?: DebtDetail[]
}

const ViewReport = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  // Mock report data - in thực tế sẽ fetch từ API
  const [report] = useState<ReportData>({
    id: id || '1',
    code: 'BC1',
    type: 'import',
    typeLabel: 'Nhập kho',
    period: '10/2025',
    staff: 'Nguyễn Văn A',
    createdDate: '15/01/2025',
    manufacturerFilter: 'all',
    importDetails: [
      {
        id: '1',
        product: 'Sản phẩm A',
        unit: 'kg',
        quantity: 100,
        unitPrice: 450000
      },
      {
        id: '2',
        product: 'Sản phẩm B',
        unit: 'hộp',
        quantity: 50,
        unitPrice: 200000
      }
    ]
  })

  // Calculate totals
  const importTotal = useMemo(() => {
    return report.importDetails?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0
  }, [report.importDetails])

  const distributionTotal = useMemo(() => {
    return report.distributionDetails?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0
  }, [report.distributionDetails])

  const debtTotal = useMemo(() => {
    return report.debtDetails?.reduce((sum, item) => sum + (item.totalDue - item.collected), 0) || 0
  }, [report.debtDetails])

  return (
    <div className="view-report-page">
      <button
        className="view-report__back-button"
        onClick={() => navigate('/reports')}
        title="Quay lại"
      >
        <ArrowLeft size={18} />
        Quay lại
      </button>

      {/* Page Header */}
      <div className="view-report__header">
        <div className="view-report__header-icon">
          <FileText size={36} />
        </div>
        <div className="view-report__header-content">
          <h1 className="view-report__title">Chi tiết báo cáo</h1>
          <p className="view-report__subtitle">
            Xem chi tiết các thông tin báo cáo {report.typeLabel.toLowerCase()}
          </p>
        </div>
      </div>

      <div className="view-report-container">
        <div className="view-report__content">
          {/* Report Info Section */}
          <div className="view-report__card">
          <h2 className="view-report__card-title">Thông tin báo cáo</h2>
          
          <div className="view-report__info-grid">
            <div className="view-report__info-item">
              <label className="view-report__info-label">Mã báo cáo</label>
              <p className="view-report__info-value">{report.code}</p>
            </div>
            <div className="view-report__info-item">
              <label className="view-report__info-label">Loại báo cáo</label>
              <p className="view-report__info-value">{report.typeLabel}</p>
            </div>
            <div className="view-report__info-item">
              <label className="view-report__info-label">Kỳ báo cáo</label>
              <p className="view-report__info-value">{report.period}</p>
            </div>
            <div className="view-report__info-item">
              <label className="view-report__info-label">Staff lập báo cáo</label>
              <p className="view-report__info-value">{report.staff}</p>
            </div>
            <div className="view-report__info-item">
              <label className="view-report__info-label">Ngày lập</label>
              <p className="view-report__info-value">{report.createdDate}</p>
            </div>
          </div>
          </div>

          {/* Import Report Details */}
          {report.type === 'import' && report.importDetails && (
            <div className="view-report__card">
            <h2 className="view-report__card-title">Chi tiết nhập kho</h2>
            
            <div className="view-report__table-container">
              <table className="view-report__table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn vị</th>
                    <th>SL nhập</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {report.importDetails.map((item) => (
                    <tr key={item.id}>
                      <td>{item.product}</td>
                      <td>{item.unit}</td>
                      <td className="text-right">{item.quantity.toLocaleString('vi-VN')}</td>
                      <td className="text-right">{item.unitPrice.toLocaleString('vi-VN')} đ</td>
                      <td className="view-report-page text-right text-highlight text-bold view-report__amount">
                        {(item.quantity * item.unitPrice).toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="view-report__stats-summary">
              <div className="view-report__stat">
                <span className="view-report__stat-label">Tổng giá trị nhập kho</span>
                <span className="view-report__stat-value text-highlight">{importTotal.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
            </div>
          )}

          {/* Distribution Report Details */}
          {report.type === 'distribution' && report.distributionDetails && (
            <div className="view-report__card">
            <h2 className="view-report__card-title">Chi tiết phân phối</h2>
            
            <div className="view-report__table-container">
              <table className="view-report__table">
                <thead>
                  <tr>
                    <th>Đại lý</th>
                    <th>Sản phẩm</th>
                    <th>SL xuất</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {report.distributionDetails.map((item) => (
                    <tr key={item.id}>
                      <td>{item.agency}</td>
                      <td>{item.product}</td>
                      <td className="text-right">{item.quantity.toLocaleString('vi-VN')}</td>
                      <td className="text-right">{item.unitPrice.toLocaleString('vi-VN')} đ</td>
                      <td className="view-report-page text-right text-highlight text-bold view-report__amount">
                        {(item.quantity * item.unitPrice).toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="view-report__stats-summary">
              <div className="view-report__stat">
                <span className="view-report__stat-label">Tổng giá trị phân phối</span>
                <span className="view-report__stat-value text-highlight">{distributionTotal.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
            </div>
          )}

          {/* Debt Report Details */}
          {report.type === 'debt' && report.debtDetails && (
            <div className="view-report__card">
            <h2 className="view-report__card-title">Chi tiết công nợ</h2>
            
            <div className="view-report__table-container">
              <table className="view-report__table">
                <thead>
                  <tr>
                    <th>Đại lý</th>
                    <th>Tổng phải thu</th>
                    <th>Đã thu</th>
                    <th>Còn nợ</th>
                  </tr>
                </thead>
                <tbody>
                  {report.debtDetails.map((item) => (
                    <tr key={item.id}>
                      <td>{item.agency}</td>
                      <td className="text-right">{item.totalDue.toLocaleString('vi-VN')} đ</td>
                      <td className="text-right">{item.collected.toLocaleString('vi-VN')} đ</td>
                      <td className="view-report-page text-right text-highlight text-bold view-report__amount">
                        {(item.totalDue - item.collected).toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="view-report__stats-summary">
              <div className="view-report__stat">
                <span className="view-report__stat-label">Tổng công nợ còn lại</span>
                <span className="view-report__stat-value text-highlight">{debtTotal.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="view-report__footer">
          <button
            type="button"
            onClick={() => navigate('/reports')}
            className="view-report__btn view-report__btn--secondary"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewReport
