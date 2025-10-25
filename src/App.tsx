import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './routes/auth/Login'
import Register from './routes/auth/Register'
import MainLayout from './components/layout/MainLayout'
import Reports from './pages/Report/Reports'
import AddReport from './pages/Report/AddReport'
import ViewReport from './pages/Report/ViewReport'
import AgencyManagement from './pages/AgencyManagement/AgencyManagement'
import ExportManagement from './pages/ExportManagement/ExportManagement'
import ReceiveGoods from './pages/ReceiveGoods/ReceiveGoods'
import PaymentManagement from './pages/PaymentManagement/PaymentManagement'
import Regulations from './pages/Regulations/Regulations'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/agency-management" element={
          <MainLayout>
            <AgencyManagement />
          </MainLayout>
        } />
        <Route path="/export-management" element={
          <MainLayout>
            <ExportManagement />
          </MainLayout>
        } />
        <Route path="/receive-goods" element={
          <MainLayout>
            <ReceiveGoods />
          </MainLayout>
        } />
        <Route path="/payment-management" element={
          <MainLayout>
            <PaymentManagement />
          </MainLayout>
        } />
        <Route path="/regulations" element={
          <MainLayout>
            <Regulations />
          </MainLayout>
        } />
        <Route path="/reports" element={
          <MainLayout>
            <Reports />
          </MainLayout>
        } />
        <Route path="/add-report" element={
          <MainLayout>
            <AddReport />
          </MainLayout>
        } />
        <Route path="/view-report/:reportId" element={
          <MainLayout>
            <ViewReport />
          </MainLayout>
        } />
        <Route path="/" element={<Navigate to="/agency-management" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
