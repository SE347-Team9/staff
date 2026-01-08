import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Plus, X, Truck, Calendar, FileText, Building2 } from 'lucide-react'
import { toast } from 'react-toastify'
import './CreateReceipt.css'

interface Supplier {
  id: string
  code: string
  name: string
  address: string
  phone: string
  contactPerson: string
}

interface Product {
  id: string
  code: string
  name: string
  unit: string
  costPrice: number // Giá nhập
}

interface ReceiptItem {
  id: number
  productId: string
  productCode: string
  product: string
  unit: string
  quantity: number
  price: number
  total: number
  batchNumber: string
  expiryDate: string
}

const CreateReceipt = () => {
  const navigate = useNavigate()
  const [receiptCode, setReceiptCode] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [supplierId, setSupplierId] = useState('')
  const [purchaseOrderCode, setPurchaseOrderCode] = useState('')
  const [note, setNote] = useState('')
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: 1, productId: '', productCode: '', product: '', unit: '', quantity: 0, price: 0, total: 0, batchNumber: '', expiryDate: '' }
  ])

  // Mock suppliers data - Nhà cung cấp
  const suppliers: Supplier[] = [
    { id: 'NCC001', code: 'NCC001', name: 'Công ty TNHH Sabeco', address: '187 Nguyễn Chí Thanh, Q.5, TP.HCM', phone: '028 3859 0780', contactPerson: 'Nguyễn Văn A' },
    { id: 'NCC002', code: 'NCC002', name: 'Công ty CP Sữa Vinamilk', address: '10 Tân Trào, Q.7, TP.HCM', phone: '028 5413 9000', contactPerson: 'Trần Thị B' },
    { id: 'NCC003', code: 'NCC003', name: 'PepsiCo Việt Nam', address: 'KCN Biên Hòa 2, Đồng Nai', phone: '0251 3836 700', contactPerson: 'Lê Văn C' },
    { id: 'NCC004', code: 'NCC004', name: 'Mondelez Kinh Đô', address: 'KCN Tân Bình, TP.HCM', phone: '028 3815 1200', contactPerson: 'Phạm Thị D' },
    { id: 'NCC005', code: 'NCC005', name: 'Công ty Lương thực Miền Nam', address: 'Q.1, TP.HCM', phone: '028 3829 1290', contactPerson: 'Hoàng Văn E' },
  ]

  // Mock products data - Sản phẩm với giá nhập
  const products: Product[] = [
    { id: 'SP001', code: 'SP001', name: 'Bia Hà Nội', unit: 'Thùng', costPrice: 200000 },
    { id: 'SP002', code: 'SP002', name: 'Nước ngọt Pepsi', unit: 'Thùng', costPrice: 150000 },
    { id: 'SP003', code: 'SP003', name: 'Sữa Vinamilk', unit: 'Lốc', costPrice: 45000 },
    { id: 'SP004', code: 'SP004', name: 'Bánh quy Oreo', unit: 'Hộp', costPrice: 25000 },
    { id: 'SP005', code: 'SP005', name: 'Gạo ST25', unit: 'Kg', costPrice: 22000 },
    { id: 'SP006', code: 'SP006', name: 'Snack Oishi', unit: 'Gói', costPrice: 8000 },
  ]

  // Lấy thông tin nhà cung cấp được chọn
  const selectedSupplier = useMemo(() => {
    return suppliers.find(s => s.id === supplierId)
  }, [supplierId])

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleAddItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
    setItems([...items, { 
      id: newId, 
      productId: '', 
      productCode: '', 
      product: '', 
      unit: '', 
      quantity: 0, 
      price: 0, 
      total: 0, 
      batchNumber: '', 
      expiryDate: '' 
    }])
  }

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleProductChange = (id: number, productId: string) => {
    const selectedProduct = products.find(p => p.id === productId)
    if (selectedProduct) {
      setItems(items.map(item => {
        if (item.id === id) {
          return {
            ...item,
            productId: selectedProduct.id,
            productCode: selectedProduct.code,
            product: selectedProduct.name,
            unit: selectedProduct.unit,
            price: selectedProduct.costPrice,
            total: item.quantity * selectedProduct.costPrice
          }
        }
        return item
      }))
    } else {
      setItems(items.map(item => {
        if (item.id === id) {
          return { ...item, productId: '', productCode: '', product: '', unit: '', price: 0, total: 0 }
        }
        return item
      }))
    }
  }

  const handleQuantityChange = (id: number, quantity: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, quantity, total: quantity * item.price }
      }
      return item
    }))
  }

  const handleBatchChange = (id: number, field: 'batchNumber' | 'expiryDate', value: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value }
      }
      return item
    }))
  }

  const handleSubmit = () => {
    // Validate form
    if (!supplierId) {
      toast.error('Vui lòng chọn nhà cung cấp!')
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

    const receiptData = {
      code: receiptCode || `PN${Date.now()}`,
      date,
      supplierId,
      supplierName: selectedSupplier?.name,
      purchaseOrderCode,
      items: items.map(item => ({
        productId: item.productId,
        productCode: item.productCode,
        productName: item.product,
        unit: item.unit,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.total,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate
      })),
      totalAmount: calculateTotal(),
      note,
      status: 'completed',
      createdAt: new Date().toISOString()
    }

    console.log('Receipt data:', receiptData)
    // TODO: Call API to save receipt and update inventory
    toast.success('Tạo phiếu nhập thành công! Tồn kho đã được cập nhật.')
    navigate('/receive-goods')
  }

  const handleCancel = () => {
    navigate('/receive-goods')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'
  }

  return (
    <div className="create-receipt-page">
      <div className="create-receipt-container">
        {/* Header */}
        <div className="create-receipt-header">
          <Package size={32} />
          <h1 className="create-receipt-title">Tạo phiếu nhập kho</h1>
          <button className="btn-back" onClick={handleCancel}>
            Trở lại
          </button>
        </div>

        {/* Form */}
        <div className="create-receipt-form">
          {/* Basic Info */}
          <div className="form-section-grid">
            <div className="form-group">
              <label className="form-label">
                <FileText size={16} />
                Mã phiếu nhập
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Tự động tạo nếu để trống"
                value={receiptCode}
                onChange={(e) => setReceiptCode(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} />
                Ngày nhập kho <span className="required">*</span>
              </label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Truck size={16} />
                Nhà cung cấp <span className="required">*</span>
              </label>
              <select
                className="form-select"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
              >
                <option value="">Chọn nhà cung cấp</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.code} - {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <FileText size={16} />
                Mã đơn đặt hàng (nếu có)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="VD: PO-001234"
                value={purchaseOrderCode}
                onChange={(e) => setPurchaseOrderCode(e.target.value)}
              />
            </div>
          </div>

          {/* Supplier Info Card */}
          {selectedSupplier && (
            <div className="supplier-info-card">
              <h4 className="supplier-info-title">
                <Building2 size={18} />
                Thông tin nhà cung cấp
              </h4>
              <div className="supplier-info-grid">
                <div className="supplier-info-item">
                  <span className="supplier-info-label">Mã NCC:</span>
                  <span className="supplier-info-value">{selectedSupplier.code}</span>
                </div>
                <div className="supplier-info-item">
                  <span className="supplier-info-label">Tên công ty:</span>
                  <span className="supplier-info-value">{selectedSupplier.name}</span>
                </div>
                <div className="supplier-info-item">
                  <span className="supplier-info-label">Người liên hệ:</span>
                  <span className="supplier-info-value">{selectedSupplier.contactPerson}</span>
                </div>
                <div className="supplier-info-item">
                  <span className="supplier-info-label">Điện thoại:</span>
                  <span className="supplier-info-value">{selectedSupplier.phone}</span>
                </div>
                <div className="supplier-info-item full-width">
                  <span className="supplier-info-label">Địa chỉ:</span>
                  <span className="supplier-info-value">{selectedSupplier.address}</span>
                </div>
              </div>
            </div>
          )}

          {/* Products List */}
          <div className="products-section">
            <h3 className="section-title">
              <Package size={18} />
              Chi tiết sản phẩm nhập kho
            </h3>

            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>SẢN PHẨM</th>
                    <th>ĐƠN VỊ</th>
                    <th>SỐ LƯỢNG</th>
                    <th>GIÁ NHẬP</th>
                    <th>THÀNH TIỀN</th>
                    <th>SỐ LÔ</th>
                    <th>HẠN SD</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="col-stt">{index + 1}</td>
                      <td className="col-product">
                        <select
                          className="product-select"
                          value={item.productId}
                          onChange={(e) => handleProductChange(item.id, e.target.value)}
                        >
                          <option value="">Chọn sản phẩm</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.code} - {product.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="col-unit">{item.unit}</td>
                      <td className="col-quantity">
                        <input
                          type="number"
                          className="quantity-input"
                          value={item.quantity || ''}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          min="1"
                        />
                      </td>
                      <td className="col-price">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="col-total">
                        <span className="total-value">{formatCurrency(item.total)}</span>
                      </td>
                      <td className="col-batch">
                        <input
                          type="text"
                          className="batch-input"
                          placeholder="VD: L001"
                          value={item.batchNumber}
                          onChange={(e) => handleBatchChange(item.id, 'batchNumber', e.target.value)}
                        />
                      </td>
                      <td className="col-expiry">
                        <input
                          type="date"
                          className="expiry-input"
                          value={item.expiryDate}
                          onChange={(e) => handleBatchChange(item.id, 'expiryDate', e.target.value)}
                        />
                      </td>
                      <td className="col-action">
                        <button
                          className="btn-remove-item"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={items.length === 1}
                          title="Xóa"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="btn-add-product" onClick={handleAddItem}>
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

          {/* Total */}
          <div className="total-section">
            <div className="total-row">
              <span className="total-label">Tổng số sản phẩm:</span>
              <span className="total-count">{items.filter(i => i.productId).length} loại</span>
            </div>
            <div className="total-row">
              <span className="total-label">Tổng số lượng:</span>
              <span className="total-count">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
            </div>
            <div className="total-row total-main">
              <span className="total-label">Tổng giá trị nhập:</span>
              <span className="total-amount">{formatCurrency(calculateTotal())}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button className="btn-cancel" onClick={handleCancel}>
              Hủy bỏ
            </button>
            <button className="btn-submit" onClick={handleSubmit}>
              Lưu phiếu nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateReceipt
