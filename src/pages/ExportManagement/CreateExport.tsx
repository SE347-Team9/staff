import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, X, AlertTriangle, CheckCircle, Package } from 'lucide-react'
import { toast } from 'react-toastify'
import './CreateExport.css'

interface InventoryProduct {
  id: string
  code: string
  name: string
  unit: string
  currentStock: number
  sellingPrice: number
}

interface ExportItem {
  id: number
  productId: string
  product: string
  unit: string
  quantity: number
  price: number
  total: number
  availableStock: number
  isOverStock: boolean // Cảnh báo nếu xuất quá tồn kho
}

interface AgencyInfo {
  id: string
  code: string
  name: string
  type: 'level_1' | 'level_2'
  debtLimit: number
  currentDebt: number
  address: string
}

const CreateExport = () => {
  const navigate = useNavigate()
  const [exportCode, setExportCode] = useState('')
  const [agencyId, setAgencyId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState<ExportItem[]>([
    { id: 1, productId: '', product: '', unit: '', quantity: 0, price: 0, total: 0, availableStock: 0, isOverStock: false }
  ])
  const [amountPaid, setAmountPaid] = useState(0)
  const [note, setNote] = useState('')

  // Format currency helper - định nghĩa trước khi sử dụng trong useMemo
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'
  }

  // Mock inventory data - thực tế sẽ lấy từ API
  const inventoryProducts: InventoryProduct[] = [
    { id: 'SP001', code: 'SP001', name: 'Bia Hà Nội', unit: 'Thùng', currentStock: 150, sellingPrice: 250000 },
    { id: 'SP002', code: 'SP002', name: 'Nước ngọt Pepsi', unit: 'Thùng', currentStock: 25, sellingPrice: 180000 },
    { id: 'SP003', code: 'SP003', name: 'Sữa Vinamilk', unit: 'Lốc', currentStock: 0, sellingPrice: 60000 },
    { id: 'SP004', code: 'SP004', name: 'Bánh quy Oreo', unit: 'Hộp', currentStock: 200, sellingPrice: 35000 },
    { id: 'SP005', code: 'SP005', name: 'Gạo ST25', unit: 'Kg', currentStock: 500, sellingPrice: 28000 },
    { id: 'SP006', code: 'SP006', name: 'Snack Oishi', unit: 'Gói', currentStock: 15, sellingPrice: 12000 },
  ]

  // Mock agencies data
  const agencies: AgencyInfo[] = [
    { id: 'DL001', code: 'DL001', name: 'Đại lý Nghĩa', type: 'level_1', debtLimit: 100000000, currentDebt: 24060000, address: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội' },
    { id: 'DL002', code: 'DL002', name: 'Đại lý Đại', type: 'level_2', debtLimit: 50000000, currentDebt: 12400000, address: 'Số 2, Phố Đông Đa, Đống Đa, Hà Nội' },
    { id: 'DL003', code: 'DL003', name: 'Đại lý An Khang', type: 'level_1', debtLimit: 100000000, currentDebt: 5000000, address: 'Số 3, Phố Hai Bà Trưng, Hoàn Kiếm, Hà Nội' },
  ]

  // Lấy thông tin đại lý được chọn
  const selectedAgency = useMemo(() => {
    return agencies.find(a => a.id === agencyId)
  }, [agencyId])

  // Tính toán
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateRemaining = () => {
    return calculateTotal() - amountPaid
  }

  // Kiểm tra vượt trần nợ
  const debtCheck = useMemo(() => {
    if (!selectedAgency) return { isOverLimit: false, message: '' }
    
    const newDebt = selectedAgency.currentDebt + calculateRemaining()
    const isOverLimit = newDebt > selectedAgency.debtLimit
    
    return {
      isOverLimit,
      newDebt,
      debtLimit: selectedAgency.debtLimit,
      message: isOverLimit 
        ? `Vượt trần nợ! Nợ mới: ${formatCurrency(newDebt)} > Trần nợ: ${formatCurrency(selectedAgency.debtLimit)}`
        : `Nợ sau giao dịch: ${formatCurrency(newDebt)} / ${formatCurrency(selectedAgency.debtLimit)}`
    }
  }, [selectedAgency, amountPaid, items])

  // Kiểm tra có sản phẩm nào vượt tồn kho
  const hasOverStock = useMemo(() => {
    return items.some(item => item.isOverStock)
  }, [items])

  const handleAddItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
    setItems([...items, { 
      id: newId, 
      productId: '', 
      product: '', 
      unit: '', 
      quantity: 0, 
      price: 0, 
      total: 0, 
      availableStock: 0,
      isOverStock: false 
    }])
  }

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleProductChange = (id: number, productId: string) => {
    const selectedProduct = inventoryProducts.find(p => p.id === productId)
    
    setItems(items.map(item => {
      if (item.id === id) {
        if (selectedProduct) {
          return {
            ...item,
            productId: selectedProduct.id,
            product: selectedProduct.name,
            unit: selectedProduct.unit,
            price: selectedProduct.sellingPrice,
            availableStock: selectedProduct.currentStock,
            total: item.quantity * selectedProduct.sellingPrice,
            isOverStock: item.quantity > selectedProduct.currentStock
          }
        }
        return { ...item, productId: '', product: '', unit: '', price: 0, availableStock: 0, total: 0, isOverStock: false }
      }
      return item
    }))
  }

  const handleQuantityChange = (id: number, quantity: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const isOverStock = quantity > item.availableStock
        return {
          ...item,
          quantity,
          total: quantity * item.price,
          isOverStock
        }
      }
      return item
    }))
  }

  const handleSubmit = () => {
    // Validate form
    if (!agencyId) {
      toast.error('Vui lòng chọn đại lý!')
      return
    }

    if (items.some(item => !item.productId)) {
      toast.error('Vui lòng chọn sản phẩm cho tất cả các dòng!')
      return
    }

    if (items.some(item => item.quantity <= 0)) {
      toast.error('Số lượng phải lớn hơn 0!')
      return
    }

    // Kiểm tra tồn kho
    if (hasOverStock) {
      const overStockItems = items.filter(i => i.isOverStock)
      toast.error(`Không đủ tồn kho cho: ${overStockItems.map(i => i.product).join(', ')}`)
      return
    }

    // Kiểm tra trần nợ
    if (debtCheck.isOverLimit) {
      toast.error('Giao dịch này sẽ vượt trần nợ của đại lý!')
      return
    }

    const exportData = {
      code: exportCode || `PX${Date.now()}`,
      agencyId,
      agencyName: selectedAgency?.name,
      date,
      items: items.map(item => ({
        productId: item.productId,
        productName: item.product,
        unit: item.unit,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.total
      })),
      totalAmount: calculateTotal(),
      amountPaid,
      remainingAmount: calculateRemaining(),
      note,
      status: 'pending'
    }

    console.log('Export data:', exportData)
    // TODO: Call API to save export
    toast.success('Tạo phiếu xuất thành công!')
    navigate('/export-management')
  }

  const handleCancel = () => {
    navigate('/export-management')
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
                Mã phiếu xuất
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Tự động tạo nếu để trống"
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
                value={agencyId}
                onChange={(e) => setAgencyId(e.target.value)}
              >
                <option value="">Chọn đại lý</option>
                {agencies.map(agency => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name} ({agency.type === 'level_1' ? 'Cấp 1' : 'Cấp 2'})
                  </option>
                ))}
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

          {/* Agency Info Card */}
          {selectedAgency && (
            <div className="agency-info-card">
              <h4 className="agency-info-title">Thông tin đại lý</h4>
              <div className="agency-info-grid">
                <div className="agency-info-item">
                  <span className="agency-info-label">Mã đại lý:</span>
                  <span className="agency-info-value">{selectedAgency.code}</span>
                </div>
                <div className="agency-info-item">
                  <span className="agency-info-label">Loại đại lý:</span>
                  <span className="agency-info-value">
                    {selectedAgency.type === 'level_1' ? 'Cấp 1' : 'Cấp 2'}
                  </span>
                </div>
                <div className="agency-info-item">
                  <span className="agency-info-label">Công nợ hiện tại:</span>
                  <span className="agency-info-value debt">
                    {formatCurrency(selectedAgency.currentDebt)}
                  </span>
                </div>
                <div className="agency-info-item">
                  <span className="agency-info-label">Trần nợ:</span>
                  <span className="agency-info-value">
                    {formatCurrency(selectedAgency.debtLimit)}
                  </span>
                </div>
                <div className="agency-info-item full-width">
                  <span className="agency-info-label">Địa chỉ:</span>
                  <span className="agency-info-value">{selectedAgency.address}</span>
                </div>
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="items-section">
            <div className="items-header">
              <h3 className="items-title">
                <Package size={20} />
                Chi tiết sản phẩm
              </h3>
            </div>

            <div className="items-table-wrapper">
              <table className="items-table">
                <thead>
                  <tr>
                    <th className="col-stt">STT</th>
                    <th className="col-product">SẢN PHẨM</th>
                    <th className="col-unit">ĐƠN VỊ</th>
                    <th className="col-stock">TỒN KHO</th>
                    <th className="col-quantity">SỐ LƯỢNG</th>
                    <th className="col-price">ĐƠN GIÁ</th>
                    <th className="col-total">THÀNH TIỀN</th>
                    <th className="col-action">XÓA</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className={item.isOverStock ? 'row-error' : ''}>
                      <td className="col-stt">{index + 1}</td>
                      <td className="col-product">
                        <select
                          className="table-select"
                          value={item.productId}
                          onChange={(e) => handleProductChange(item.id, e.target.value)}
                        >
                          <option value="">Chọn sản phẩm</option>
                          {inventoryProducts.map(product => (
                            <option 
                              key={product.id} 
                              value={product.id}
                              disabled={product.currentStock === 0}
                            >
                              {product.name} {product.currentStock === 0 ? '(Hết hàng)' : ''}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="col-unit">{item.unit}</td>
                      <td className="col-stock">
                        <span className={`stock-badge ${item.availableStock === 0 ? 'out' : item.availableStock < 30 ? 'low' : 'normal'}`}>
                          {item.availableStock}
                        </span>
                      </td>
                      <td className="col-quantity">
                        <div className="quantity-wrapper">
                          <input
                            type="number"
                            className={`table-input ${item.isOverStock ? 'input-error' : ''}`}
                            value={item.quantity || ''}
                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                            min="0"
                            max={item.availableStock}
                          />
                          {item.isOverStock && (
                            <span className="stock-warning" title="Vượt tồn kho!">
                              <AlertTriangle size={16} />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="col-price">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="col-total">
                        <span className="total-value">{formatCurrency(item.total)}</span>
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

            {/* Stock Warning */}
            {hasOverStock && (
              <div className="stock-alert stock-alert--error">
                <AlertTriangle size={18} />
                <span>Một số sản phẩm có số lượng xuất vượt tồn kho hiện có!</span>
              </div>
            )}

            <button className="btn-add-item" onClick={handleAddItem}>
              <Plus size={20} />
              <span>Thêm sản phẩm</span>
            </button>
          </div>

          {/* Note */}
          <div className="note-section">
            <label className="form-label">Ghi chú</label>
            <textarea
              className="form-textarea"
              placeholder="Nhập ghi chú (nếu có)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          {/* Summary */}
          <div className="summary-section">
            <div className="summary-row">
              <span className="summary-label">Tổng tiền</span>
              <span className="summary-value total">{formatCurrency(calculateTotal())}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Số tiền thanh toán</span>
              <input
                type="number"
                className="summary-input"
                value={amountPaid || ''}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                min="0"
                max={calculateTotal()}
              />
            </div>

            <div className="summary-row remaining">
              <span className="summary-label">Còn nợ</span>
              <span className="summary-value remaining-value">{formatCurrency(calculateRemaining())}</span>
            </div>

            {/* Debt Check */}
            {selectedAgency && (
              <div className={`debt-check ${debtCheck.isOverLimit ? 'debt-check--error' : 'debt-check--ok'}`}>
                {debtCheck.isOverLimit ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                <span>{debtCheck.message}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button className="btn-cancel" onClick={handleCancel}>
              Hủy bỏ
            </button>
            <button 
              className="btn-submit" 
              onClick={handleSubmit}
              disabled={hasOverStock || debtCheck.isOverLimit}
            >
              Lưu phiếu xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateExport
