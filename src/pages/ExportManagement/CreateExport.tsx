import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FileText } from 'lucide-react'
import './CreateExport.css'

interface ExportItem {
  id: number
  product: string
  unit: string
  quantity: number
  price: number
  total: number
}

const productInfo: Record<string, { unit: string; price: number }> = {
  'Bia Hà Nội': { unit: 'Thùng', price: 230000 },
  'Gạo ST25': { unit: 'Bao', price: 450000 },
  'Sữa Vinamilk': { unit: 'Thùng', price: 310000 },
  'Loại 1': { unit: 'Đơn vị', price: 100000 },
  'Loại 2': { unit: 'Đơn vị', price: 200000 },
  'Loại 3': { unit: 'Đơn vị', price: 300000 }
}

const CreateExport = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const requestData = (location.state as { request?: any } | null)?.request
  const [exportCode, setExportCode] = useState('')
  const [agency, setAgency] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState<ExportItem[]>([
    { id: 1, product: '', unit: '', quantity: 0, price: 0, total: 0 }
  ])

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleItemChange = (id: number, field: keyof ExportItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'product') {
          const info = productInfo[value as string]
          if (info) {
            updatedItem.unit = info.unit
            updatedItem.price = info.price
          }
        }
        if (field === 'quantity' || field === 'price' || field === 'product') {
          updatedItem.total = updatedItem.quantity * updatedItem.price
        }
        return updatedItem
      }
      return item
    }))
  }

  const handleSubmit = () => {
    // Validate form
    if (!exportCode || !agency || items.some(item => !item.product)) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    const exportData = {
      code: exportCode,
      agency,
      date,
      items,
      total: calculateTotal()
    }

    console.log('Export data:', exportData)
    // TODO: Call API to save export
    // Lưu tạm vào localStorage để hiển thị ở danh sách
    const saved = localStorage.getItem('customExports')
    const parsed = saved ? JSON.parse(saved) : []
    const newExport = {
      id: Date.now().toString(),
      code: exportCode || `DH${Math.floor(Math.random() * 900 + 100)}`,
      agency,
      date,
      total: calculateTotal(),
      status: 'pending'
    }
    localStorage.setItem('customExports', JSON.stringify([...parsed, newExport]))

    // Tạo hóa đơn (phiếu thu) tương ứng
    try {
      const paymentsRaw = localStorage.getItem('customPayments')
      const paymentsList = paymentsRaw ? JSON.parse(paymentsRaw) : []
      const nextNumber = (paymentsList.length + 1).toString().padStart(3, '0')
      const newPayment = {
        id: (Date.now() + 1).toString(),
        code: `HD${nextNumber}`,
        date,
        agency,
        amount: calculateTotal(),
        status: 'pending'
      }
      localStorage.setItem('customPayments', JSON.stringify([...paymentsList, newPayment]))
    } catch (err) {
      console.error('Không thể tạo phiếu thu từ phiếu xuất', err)
    }

    alert('Tạo phiếu xuất thành công!')
    navigate('/export-management')
  }

  const handleCancel = () => {
    navigate('/export-management')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'
  }

  const convertDateToInput = (dateStr: string) => {
    if (!dateStr) return new Date().toISOString().split('T')[0]
    const parts = dateStr.includes('-') ? dateStr.split('-') : []
    if (parts.length === 3) {
      const [day, month, year] = parts
      if (year.length === 4) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
    }
    return dateStr
  }

  useEffect(() => {
    if (requestData) {
      setExportCode(requestData.code || '')
      setAgency(requestData.agency || '')
      setDate(convertDateToInput(requestData.date))
      if (Array.isArray(requestData.items)) {
        const mappedItems = requestData.items.map((item: any, idx: number) => {
          const info = productInfo[item.name] || { unit: item.unit || 'Đơn vị', price: item.price || 0 }
          const quantity = item.requested || 0
          const price = info.price
          return {
            id: idx + 1,
            product: item.name || '',
            unit: info.unit,
            quantity,
            price,
            total: quantity * price
          }
        })
        setItems(mappedItems)
      }
    }
  }, [requestData])

  return (
    <div className="create-export-page">
      <div className="create-export-container">
        {/* Header */}
        <div className="create-export-header">
          <FileText size={40} />
          <h1 className="create-export-title">TẠO PHIẾU XUẤT</h1>
        </div>

        {/* Form */}
        <div className="create-export-form">
          {/* Basic Info */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Mã phiếu xuất <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Để trống để tự động tạo"
                value={exportCode}
                onChange={(e) => setExportCode(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Đại lý <span className="required">*</span>
              </label>
              <select
                className="form-select"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
              >
                <option value="">Chọn đại lý</option>
                <option value="Đại lý Đại">Đại lý Đại</option>
                <option value="Đại lý Nghĩa">Đại lý Nghĩa</option>
                <option value="Đại lý Phát">Đại lý Phát</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Ngày lập phiếu <span className="required">*</span>
              </label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="items-section">
            <div className="items-header">
              <h3 className="items-title">Chi tiết sản phẩm</h3>
            </div>

            <div className="items-table-wrapper">
              <table className="items-table">
                <thead>
                  <tr>
                    <th className="col-stt">STT</th>
                    <th className="col-product">SẢN PHẨM</th>
                    <th className="col-unit">ĐƠN VỊ TÍNH</th>
                    <th className="col-quantity">SỐ LƯỢNG</th>
                    <th className="col-price">ĐON GIÁ</th>
                    <th className="col-total">THÀNH TIỀN</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="col-stt">{index + 1}</td>
                      <td className="col-product">
                        <select
                          className="table-select"
                          value={item.product}
                          onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                        >
                          <option value="">Chọn sản phẩm</option>
                          <option value="Bia Hà Nội">Bia Hà Nội</option>
                          <option value="Gạo ST25">Gạo ST25</option>
                          <option value="Sữa Vinamilk">Sữa Vinamilk</option>
                          <option value="Loại 1">Loại 1</option>
                          <option value="Loại 2">Loại 2</option>
                          <option value="Loại 3">Loại 3</option>
                        </select>
                      </td>
                      <td className="col-unit">
                        <input
                          type="text"
                          className="table-input"
                          value={item.unit}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                          placeholder="Đơn vị"
                        />
                      </td>
                      <td className="col-quantity">
                        <input
                          type="number"
                          className="table-input"
                          value={item.quantity || ''}
                          onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                          min="0"
                        />
                      </td>
                      <td className="col-price">
                        <input
                          type="number"
                          className="table-input"
                          value={item.price || ''}
                          onChange={(e) => handleItemChange(item.id, 'price', Number(e.target.value))}
                          min="0"
                        />
                      </td>
                      <td className="col-total">
                        <span className="total-value">{item.total}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="summary-section">
            <div className="summary-row">
              <span className="summary-label">Tổng tiền</span>
              <span className="summary-value total">{formatCurrency(calculateTotal())}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button className="btn-cancel" onClick={handleCancel}>
              Hủy bỏ
            </button>
            <button className="btn-submit" onClick={handleSubmit}>
              Tạo phiếu xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateExport
