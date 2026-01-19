import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  CreditCard,
  FileText,
  ArrowRight,
  AlertTriangle,
  PackageCheck,
  PackageMinus,
  Wallet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import "./index.css";

const HomePage = () => {
  const navigate = useNavigate();

  // Mock data - Số phiếu xuất hàng theo tháng (của Staff này)
  const exportByMonthData = [
    { month: "T1", soPhieuXuat: 12, soPhieuNhap: 8 },
    { month: "T2", soPhieuXuat: 15, soPhieuNhap: 10 },
    { month: "T3", soPhieuXuat: 10, soPhieuNhap: 7 },
    { month: "T4", soPhieuXuat: 18, soPhieuNhap: 12 },
    { month: "T5", soPhieuXuat: 14, soPhieuNhap: 9 },
    { month: "T6", soPhieuXuat: 20, soPhieuNhap: 11 },
  ];

  // Mock data - Công nợ đại lý (của Staff quản lý)
  const debtTrendData = [
    { month: "T1", congNo: 85000000 },
    { month: "T2", congNo: 120000000 },
    { month: "T3", congNo: 95000000 },
    { month: "T4", congNo: 150000000 },
    { month: "T5", congNo: 130000000 },
    { month: "T6", congNo: 110000000 },
  ];

  // Mock data - Tiền thu được theo tháng
  const paymentTrendData = [
    { month: "T1", thuTien: 65000000 },
    { month: "T2", thuTien: 95000000 },
    { month: "T3", thuTien: 78000000 },
    { month: "T4", thuTien: 120000000 },
    { month: "T5", thuTien: 105000000 },
    { month: "T6", thuTien: 135000000 },
  ];

  // Format số tiền VND
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} tỷ`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)} tr`;
    }
    return value.toLocaleString("vi-VN");
  };

  // Custom tooltip cho biểu đồ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="staff-home__tooltip">
          <p className="staff-home__tooltip-label">{`Tháng ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey.includes("soPhieu")
                ? `${entry.name}: ${entry.value} phiếu`
                : `${entry.name}: ${entry.value.toLocaleString("vi-VN")} VNĐ`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const statistics = [
    {
      id: "agencies",
      label: "Đại lý phụ trách",
      value: "8",
      icon: Building2,
      gradient: "blue",
      change: "",
      description: "đại lý được phân công",
    },
    {
      id: "exports",
      label: "Phiếu xuất tháng này",
      value: "20",
      icon: PackageMinus,
      gradient: "green",
      change: "+6",
      description: "phiếu xuất hàng",
    },
    {
      id: "debt",
      label: "Công nợ cần thu",
      value: "110 tr",
      icon: AlertTriangle,
      gradient: "orange",
      change: "-15%",
      description: "giảm so với tháng trước",
    },
    {
      id: "payments",
      label: "Đã thu tháng này",
      value: "135 tr",
      icon: Wallet,
      gradient: "purple",
      change: "+29%",
      description: "so với tháng trước",
    },
  ];

  const quickLinks = [
    {
      id: "agency",
      icon: Building2,
      title: "Quản lý đại lý",
      description: "Xem thông tin các đại lý bạn phụ trách",
      path: "/agency-management",
      color: "blue",
    },
    {
      id: "export",
      icon: PackageMinus,
      title: "Xuất hàng",
      description: "Tạo phiếu xuất hàng cho đại lý",
      path: "/export-management",
      color: "green",
    },
    {
      id: "payment",
      icon: Wallet,
      title: "Thu tiền",
      description: "Ghi nhận thanh toán từ đại lý",
      path: "/payment-management",
      color: "purple",
    },
    {
      id: "report",
      icon: FileText,
      title: "Lập báo cáo",
      description: "Báo cáo công nợ, doanh số",
      path: "/reports",
      color: "orange",
    },
  ];

  return (
    <div className="staff-home-page">
      {/* Header Section */}
      <div className="staff-home__header">
        <div className="staff-home__header-icon">
          <LayoutDashboard size={36} />
        </div>
        <div className="staff-home__header-text">
          <h1 className="staff-home__title">Trang chủ nhân viên</h1>
          <p className="staff-home__subtitle">Tổng quan công việc của bạn</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="staff-home__stats-grid">
        {statistics.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`staff-home__stat-card staff-home__stat-card--${stat.gradient}`}
            >
              <div className="staff-home__stat-content">
                <div className="staff-home__stat-header">
                  <span className="staff-home__stat-label">{stat.label}</span>
                </div>
                <div className="staff-home__stat-value">{stat.value}</div>
                <div className="staff-home__stat-description">
                  {stat.description}
                </div>
              </div>
              <div className="staff-home__stat-icon">
                <Icon size={48} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="staff-home__charts-section">
        {/* Row 1: Biểu đồ số phiếu xuất/nhập */}
        <div className="staff-home__chart-card staff-home__chart-card--full">
          <div className="staff-home__chart-header">
            <h3 className="staff-home__chart-title">Số phiếu xuất/nhập hàng</h3>
            <span className="staff-home__chart-subtitle">
              6 tháng gần nhất - Thống kê số phiếu bạn đã tạo
            </span>
          </div>
          <div className="staff-home__chart-content">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={exportByMonthData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="soPhieuNhap"
                  name="Phiếu nhập"
                  fill="#60a5fa"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="soPhieuXuat"
                  name="Phiếu xuất"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Line Charts */}
        <div className="staff-home__charts-row">
          {/* Biểu đồ công nợ đại lý */}
          <div className="staff-home__chart-card">
            <div className="staff-home__chart-header">
              <h3 className="staff-home__chart-title">
                Công nợ đại lý phụ trách
              </h3>
              <span className="staff-home__chart-subtitle">
                6 tháng gần nhất - Tổng nợ cần thu
              </span>
            </div>
            <div className="staff-home__chart-content">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={debtTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="congNo"
                    name="Công nợ"
                    stroke="#fb923c"
                    strokeWidth={3}
                    dot={{ fill: "#fb923c", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biểu đồ tiền thu */}
          <div className="staff-home__chart-card">
            <div className="staff-home__chart-header">
              <h3 className="staff-home__chart-title">Tiền thu từ đại lý</h3>
              <span className="staff-home__chart-subtitle">
                6 tháng gần nhất - Số tiền đã thu
              </span>
            </div>
            <div className="staff-home__chart-content">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={paymentTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="thuTien"
                    name="Tiền thu"
                    stroke="#818cf8"
                    strokeWidth={3}
                    dot={{ fill: "#818cf8", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="staff-home__quick-links">
        <div className="staff-home__section-title">
          <h2>Truy cập nhanh</h2>
          <p>Các chức năng thường dùng</p>
        </div>
        <div className="staff-home__links-grid">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                className={`staff-home__link-card staff-home__link-card--${link.color}`}
                onClick={() => navigate(link.path)}
              >
                <div className="staff-home__link-icon">
                  <Icon size={28} />
                </div>
                <div className="staff-home__link-content">
                  <h3 className="staff-home__link-title">{link.title}</h3>
                  <p className="staff-home__link-description">
                    {link.description}
                  </p>
                </div>
                <div className="staff-home__link-arrow">
                  <ArrowRight size={20} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
