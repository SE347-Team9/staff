import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Eye, Edit, Search, UserPlus, TrendingUp } from 'lucide-react'
import './AgencyManagement.css'

interface Agency {
  id: string
  code: string
  name: string
  address: string
  phone: string
  email: string
}

const AgencyManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const agencies: Agency[] = [
    {
      id: '1',
      code: 'DL002',
      name: 'Đại lý Đại',
      address: 'Số 2, Phố Đông Đa, Đông Đa, Hà Nội',
      phone: '02232434242',
      email: 'daiagency@gmail.com'
    },
    {
      id: '2',
      code: 'DL001',
      name: 'Đại lý Nghĩa',
      address: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội',
      phone: '02232434242',
      email: 'nghiaagency@gmail.com'
    }
  ]

  const filteredAgencies = agencies.filter(agency =>
    agency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.phone.includes(searchTerm) ||
    agency.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleView = (id: string) => {
    console.log('View agency:', id)
    // Navigate to view page
  }

  const handleEdit = (id: string) => {
    console.log('Edit agency:', id)
    // Navigate to edit page
  }

  const handleAddAgency = () => {
    navigate('/add-agency')
  }

  return (
    <div className="agency-management-page">
      {/* Header Section */}
      <div className="agency-management__header">
        <div className="agency-management__header-icon">
          <Users size={36} />
        </div>
        <div className="agency-management__header-text">
          <h1 className="agency-management__title">Quản lý đại lý</h1>
          <p className="agency-management__subtitle">Theo dõi và quản lý thông tin các đại lý trong hệ thống.</p>
        </div>
      </div>

      {/* Statistics Card */}
      <div className="agency-management__stats-card">
        <div className="agency-management__stats-content">
          <div className="agency-management__stats-label">Tổng số đại lý</div>
          <div className="agency-management__stats-number">{agencies.length}</div>
        </div>
      </div>

      {/* Search and Add Section */}
      <div className="agency-management__actions-card">
        <div className="agency-management__search-box">
          <Search className="agency-management__search-icon" size={20} />
          <input
            type="text"
            className="agency-management__search-input"
            placeholder="Tìm kiếm đại lý..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="agency-management__add-btn" onClick={handleAddAgency}>
          <UserPlus size={20} />
          <span>Thêm đại lý</span>
        </button>
      </div>

      {/* Agencies Table */}
      <div className="agency-management__table-card">
        <table className="agency-management__table">
          <thead>
            <tr>
              <th className="agency-management__col-code">MÃ ĐẠI LÝ</th>
              <th className="agency-management__col-name">TÊN ĐẠI LÝ</th>
              <th className="agency-management__col-address">ĐỊA CHỈ</th>
              <th className="agency-management__col-phone">SỐ ĐIỆN THOẠI</th>
              <th className="agency-management__col-email">EMAIL</th>
              <th className="agency-management__col-actions">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgencies.length > 0 ? (
              filteredAgencies.map((agency) => (
                <tr key={agency.id}>
                  <td className="agency-management__col-code">
                    <span className="agency-management__code">{agency.code}</span>
                  </td>
                  <td className="agency-management__col-name">{agency.name}</td>
                  <td className="agency-management__col-address">{agency.address}</td>
                  <td className="agency-management__col-phone">{agency.phone}</td>
                  <td className="agency-management__col-email">{agency.email}</td>
                  <td className="agency-management__col-actions">
                    <div className="agency-management__action-buttons">
                      <button
                        className="agency-management__action-btn agency-management__action-btn--view"
                        onClick={() => handleView(agency.id)}
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="agency-management__action-btn agency-management__action-btn--edit"
                        onClick={() => handleEdit(agency.id)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="agency-management__no-data">
                  <Users size={48} />
                  <p>Không tìm thấy đại lý nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AgencyManagement
