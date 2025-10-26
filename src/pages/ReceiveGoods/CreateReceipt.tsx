import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Plus, X } from 'lucide-react'
import './CreateReceipt.css'

interface ReceiptItem {
  id: number
  product: string
  unit: string
  quantity: number
  price: number
  total: number
}

const CreateReceipt = () => {
  const navigate = useNavigate()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: 1, product: '', unit: 'Thùng', quantity: 0, price: 250000, total: 0 }
  ])

  // Mock products data with units and prices
  const products = [
    { name: 'Bia Hà Nội', unit: 'Thùng', price: 250000 },
    { name: 'Gạo ST25', unit: 'Kg', price: 25000 },
    { name: 'Nước ngọt Coca', unit: 'Chai', price: 10000 },
    { name: 'Nước ngọt Pepsi', unit: 'Lon', price: 9000 },
    { name: 'Snack Oishi', unit: 'Gói', price: 12000 },
    { name: 'Sữa Vinamilk', unit: 'Lốc', price: 60000 }
  ]

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleAddItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
    setItems([...items, { id: newId, product: '', unit: 'Thùng', quantity: 0, price: 250000, total: 0 }])
  }

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleProductChange = (id: number, productName: string) => {
    const selectedProduct = products.find(p => p.name === productName)
    if (selectedProduct) {
      setItems(items.map(item => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            product: productName,
            unit: selectedProduct.unit,
            price: selectedProduct.price,
            total: item.quantity * selectedProduct.price
          }
          return updatedItem
        }
        return item
      }))
    }
  }

  const handleQuantityChange = (id: number, quantity: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, quantity, total: quantity * item.price }
        return updatedItem
      }
      return item
    }))
  }

  const handleSubmit = () => {
    // Validate form
    if (items.some(item => !item.product || item.quantity === 0)) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    const receiptData = {
      date,
      items,
      total: calculateTotal()
    }

    console.log('Receipt data:', receiptData)
    // TODO: Call API to save receipt
    alert('Tạo phiếu nhập thành công!')
    navigate('/receive-goods')
  }

  const handleCancel = () => {
    navigate('/receive-goods')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND'
  }

  return (
    <div className="create-receipt-page">
      <div className="create-receipt-container">
        {/* Header */}
        <div className="create-receipt-header">
          <Package size={32} />
          <h1 className="create-receipt-title">Tạo phiếu nhập mới</h1>
          <button className="btn-back" onClick={handleCancel}>
            Trở lại
          </button>
        </div>

        {/* Form */}
        <div className="create-receipt-form">
          {/* Date */}
          <div className="form-section">
            <label className="form-label">Ngày lập phiếu</label>
            <input
              type="date"
              className="form-input-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Products List */}
          <div className="products-section">
            <h3 className="section-title">Danh sách sản phẩm</h3>

            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th className="col-product">Sản phẩm</th>
                    <th className="col-quantity">Số lượng</th>
                    <th className="col-total">Thành tiền</th>
                    <th className="col-action"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="col-product">
                        <select
                          className="product-select"
                          value={item.product}
                          onChange={(e) => handleProductChange(item.id, e.target.value)}
                        >
                          <option value="">Chọn sản phẩm</option>
                          {products.map((product) => (
                            <option key={product.name} value={product.name}>
                              {product.name} - {product.unit} - {formatCurrency(product.price)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="col-quantity">
                        <input
                          type="number"
                          className="quantity-input"
                          value={item.quantity || ''}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          min="0"
                        />
                      </td>
                      <td className="col-total">
                        <span className="total-value">{item.total}</span>
                      </td>
                      <td className="col-action">
                        <button
                          className="btn-remove-item"
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

            <button className="btn-add-product" onClick={handleAddItem}>
              <Plus size={20} />
              <span>Thêm sản phẩm</span>
            </button>
          </div>

          {/* Total */}
          <div className="total-section">
            <span className="total-label">Tổng tiền:</span>
            <span className="total-amount">{formatCurrency(calculateTotal())}</span>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button className="btn-cancel" onClick={handleCancel}>
              Hủy
            </button>
            <button className="btn-submit" onClick={handleSubmit}>
              Tạo phiếu nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateReceipt
