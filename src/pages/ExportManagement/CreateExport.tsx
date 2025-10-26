import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, X } from 'lucide-react'
import './CreateExport.css'

interface ExportItem {
  id: number
  product: string
  unit: string
  quantity: number
  price: number
  total: number
}

const CreateExport = () => {
  const navigate = useNavigate()
  const [exportCode, setExportCode] = useState('')
  const [agency, setAgency] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState<ExportItem[]>([
    { id: 1, product: '', unit: '', quantity: 0, price: 0, total: 0 }
  ])
  const [amountPaid, setAmountPaid] = useState(0)

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateRemaining = () => {
    return calculateTotal() - amountPaid
  }

  const handleAddItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
    setItems([...items, { id: newId, product: '', unit: '', quantity: 0, price: 0, total: 0 }])
  }

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleItemChange = (id: number, field: keyof ExportItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'price') {
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
      total: calculateTotal(),
      amountPaid,
      remaining: calculateRemaining()
    }

    console.log('Export data:', exportData)
    // TODO: Call API to save export
    alert('Lưu phiếu xuất thành công!')
    navigate('/export-management')
  }

  const handleCancel = () => {
    navigate('/export-management')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'
  }

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
                    <th className="col-product">MẶT HÀNG</th>
                    <th className="col-unit">ĐƠN VỊ TÍNH</th>
                    <th className="col-quantity">SỐ LƯỢNG</th>
                    <th className="col-price">ĐON GIÁ</th>
                    <th className="col-total">THÀNH TIỀN</th>
                    <th className="col-action">THAO TÁC</th>
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
                          <option value="">Chọn mặt hàng</option>
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
                      <td className="col-action">
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={items.length === 1}
                          title="Xóa"
                        >
                          <X size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="btn-add-item" onClick={handleAddItem}>
              <Plus size={20} />
              <span>Thêm sản phẩm</span>
            </button>
          </div>

          {/* Summary */}
          <div className="summary-section">
            <div className="summary-row">
              <span className="summary-label">Tổng tiền</span>
              <span className="summary-value total">{formatCurrency(calculateTotal())}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Số tiền trả</span>
              <input
                type="number"
                className="summary-input"
                value={amountPaid || ''}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                min="0"
              />
            </div>

            <div className="summary-row remaining">
              <span className="summary-label">Còn lại</span>
              <span className="summary-value remaining-value">{formatCurrency(calculateRemaining())}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button className="btn-cancel" onClick={handleCancel}>
              Hủy bỏ
            </button>
            <button className="btn-submit" onClick={handleSubmit}>
              Lưu phiếu xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateExport
