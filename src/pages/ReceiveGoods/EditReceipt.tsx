import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Package, Plus, X, ArrowLeft } from 'lucide-react'
import './EditReceipt.css'

interface ReceiptItem {
  id: number
  product: string
  unit: string
  quantity: number
  price: number
  total: number
}

const EditReceipt = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [manufacturer, setManufacturer] = useState('')
  const [items, setItems] = useState<ReceiptItem[]>([])

  // Mock manufacturers and products
  const manufacturers = [
    {
      name: 'Công ty A',
      products: [
        { name: 'Bia Hà Nội', unit: 'Thùng', price: 250000 },
        { name: 'Nước ngọt Coca', unit: 'Chai', price: 10000 },
        { name: 'Snack Oishi', unit: 'Gói', price: 12000 }
      ]
    },
    {
      name: 'Công ty B',
      products: [
        { name: 'Gạo ST25', unit: 'Kg', price: 25000 },
        { name: 'Sữa Vinamilk', unit: 'Lốc', price: 60000 },
        { name: 'Nước ngọt Pepsi', unit: 'Lon', price: 9000 }
      ]
    }
  ]

  // Mock data - In production, fetch from API using the id
  useEffect(() => {
    const mockReceipt = {
      id: id,
      code: 'PN001',
      manufacturer: 'Công ty A',
      items: [
        { id: 1, product: 'Bia Hà Nội', unit: 'Thùng', quantity: 10, price: 250000, total: 2500000 },
        { id: 2, product: 'Nước ngọt Coca', unit: 'Chai', quantity: 50, price: 10000, total: 500000 }
      ]
    }
    setManufacturer(mockReceipt.manufacturer)
    setItems(mockReceipt.items)
  }, [id])

  const currentProducts = manufacturer
    ? manufacturers.find(m => m.name === manufacturer)?.products || []
    : []

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleAddItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
    setItems([...items, { id: newId, product: '', unit: '', quantity: 0, price: 0, total: 0 }])
  }

  const handlePriceChange = (id: number, price: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, price, total: price * item.quantity }
        return updatedItem
      }
      return item
    }))
  }

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleProductChange = (id: number, productName: string) => {
    const selectedProduct = currentProducts.find(p => p.name === productName)
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
    if (!manufacturer) {
      alert('Vui lòng chọn nhà sản xuất')
      return
    }

    if (items.some(item => !item.product || item.quantity === 0 || item.price === 0)) {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm')
      return
    }

    const receiptData = {
      id,
      manufacturer,
      items,
      total: calculateTotal()
    }

    console.log('Updated receipt data:', receiptData)
    // TODO: Call API to update receipt
    alert('Cập nhật phiếu nhập thành công!')
    navigate('/receive-goods')
  }

  const handleCancel = () => {
    navigate('/receive-goods')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND'
  }

  return (
    <div className="edit-receipt-page">
      <div className="edit-receipt-container">
        {/* Header */}
        <div className="edit-receipt-header">
          <Package size={32} />
          <h1 className="edit-receipt-title">Chỉnh sửa phiếu nhập</h1>
          <button className="btn-back" onClick={handleCancel}>
            <ArrowLeft size={20} />
            Trở lại
          </button>
        </div>

        {/* Form */}
        <div className="edit-receipt-form">
          {/* Manufacturer */}
          <div className="form-section">
            <label className="form-label">Nhà sản xuất</label>
            <select
              className="form-select"
              value={manufacturer}
              onChange={(e) => {
                setManufacturer(e.target.value)
                // reset items when change manufacturer
                setItems([{ id: 1, product: '', unit: '', quantity: 0, price: 0, total: 0 }])
              }}
            >
              <option value="">Chọn nhà sản xuất</option>
              {manufacturers.map((m) => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Products List */}
          <div className="products-section">
            <h3 className="section-title">Danh sách sản phẩm</h3>

            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th className="col-product">Sản phẩm</th>
                    <th className="col-unit">Đơn vị</th>
                    <th className="col-quantity">Số lượng</th>
                    <th className="col-price">Đơn giá</th>
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
                          disabled={!manufacturer}
                        >
                          <option value="">Chọn sản phẩm</option>
                          {currentProducts.map((product) => (
                            <option key={product.name} value={product.name}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="col-unit">
                        <span className="unit-value">{item.unit || '--'}</span>
                      </td>
                      <td className="col-quantity">
                        <input
                          type="number"
                          className="quantity-input"
                          value={item.quantity || ''}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          min="0"
                          disabled={!manufacturer}
                        />
                      </td>
                      <td className="col-price">
                        <input
                          type="number"
                          className="price-input"
                          value={item.price || ''}
                          onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                          min="0"
                          disabled={!manufacturer}
                        />
                      </td>
                      <td className="col-total">
                        <span className="total-value">{formatCurrency(item.total)}</span>
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
              Cập nhật phiếu nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditReceipt
