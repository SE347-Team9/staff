import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewAgency from './pages/AgencyManagement/ViewAgency';
import EditPayment from './pages/PaymentManagement/EditPayment';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './routes/auth/Login'
import Register from './routes/auth/Register'
import HomePage from './routes/home/index'
import MainLayout from './components/layout/MainLayout'
import Reports from './pages/Report/Reports'
import AddReport from './pages/Report/AddReport'
import ViewReport from './pages/Report/ViewReport'
import AgencyManagement from './pages/AgencyManagement/AgencyManagement'
import AddAgency from './pages/AgencyManagement/AddAgency'
import ExportManagement from './pages/ExportManagement/ExportManagement'
import CreateExport from './pages/ExportManagement/CreateExport'
import ReceiveGoods from './pages/ReceiveGoods/ReceiveGoods'
import CreateReceipt from './pages/ReceiveGoods/CreateReceipt'
import ViewReceipt from './pages/ReceiveGoods/ViewReceipt'
import EditReceipt from './pages/ReceiveGoods/EditReceipt'
import CreateReceiveOrder from './pages/ReceiveGoods/CreateReceiveOrder'
import ReceiveManagement from './pages/ReceiveManagement/ReceiveManagement'
import ViewReceiveOrder from './pages/ReceiveManagement/ViewReceiveOrder'
import EditReceiveOrder from './pages/ReceiveManagement/EditReceiveOrder'
import WarehouseManagement from './pages/WarehouseManagement/WarehouseManagement'
import PaymentManagement from './pages/PaymentManagement/PaymentManagement'
import CreateReceiptVoucher from './pages/PaymentManagement/CreateReceiptVoucher'
import Regulations from './pages/Regulations/Regulations'
import NotFound from './routes/NotFound/NotFound'
import EditAgency from './pages/AgencyManagement/EditAgency'
import ViewExport from './pages/ExportManagement/ViewExport'
import EditExport from './pages/ExportManagement/EditExport'
import ViewImport from './pages/ReceiveGoods/ViewImport'
import EditImport from './pages/ReceiveGoods/EditImport'
import ViewRegulation from './pages/Regulations/ViewRegulation'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          } />
          <Route path="/agency-management" element={
            <MainLayout>
              <AgencyManagement />
            </MainLayout>
          } />
          <Route path="/add-agency" element={
            <MainLayout>
              <AddAgency />
            </MainLayout>
          } />
          <Route path="/agency/view/:id" element={
            <MainLayout>
              <ViewAgency />
            </MainLayout>
          } />
          <Route path="/edit-agency" element={
            <MainLayout>
              <EditAgency />
            </MainLayout>
          } />
          <Route path="/export-management" element={
            <MainLayout>
              <ExportManagement />
            </MainLayout>
          } />
          <Route path="/create-export" element={
            <MainLayout>
              <CreateExport />
            </MainLayout>
          } />
          <Route path="/edit-export/:id" element={
            <MainLayout>
              <EditExport />
            </MainLayout>
          } />
          <Route path="/receive-goods" element={
            <MainLayout>
              <ReceiveGoods />
            </MainLayout>
          } />
          <Route path="/create-receipt" element={
            <MainLayout>
              <CreateReceipt />
            </MainLayout>
          } />
          <Route path="/import/view/:id" element={
            <MainLayout>
              <ViewReceipt />
            </MainLayout>
          } />
          <Route path="/import/edit/:id" element={
            <MainLayout>
              <EditReceipt />
            </MainLayout>
          } />
          <Route path="/create-receive-order" element={
            <MainLayout>
              <CreateReceiveOrder />
            </MainLayout>
          } />
          <Route path="/receive-management" element={
            <MainLayout>
              <ReceiveManagement />
            </MainLayout>
          } />
          <Route path="/receive-order/view/:id" element={
            <MainLayout>
              <ViewReceiveOrder />
            </MainLayout>
          } />
          <Route path="/receive-order/edit/:id" element={
            <MainLayout>
              <EditReceiveOrder />
            </MainLayout>
          } />
          <Route path="/warehouse-management" element={
            <MainLayout>
              <WarehouseManagement />
            </MainLayout>
          } />
          <Route path="/create-receipt-voucher" element={
            <MainLayout>
              <CreateReceiptVoucher />
            </MainLayout>
          } />
          <Route path="/payment-management" element={
            <MainLayout>
              <PaymentManagement />
            </MainLayout>
          } />
          <Route path="/payment/edit/:id" element={
            <MainLayout>
              <EditPayment />
            </MainLayout>
          } />
          <Route path="/regulations" element={
            <MainLayout>
              <Regulations />
            </MainLayout>
          } />
          <Route path="/regulations/view/:id" element={
            <MainLayout>
              <ViewRegulation />
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
          <Route path="/view-export/:id" element={
            <MainLayout>
              <ViewExport />
            </MainLayout>
          } />
          <Route path="/import/view/:id" element={
            <MainLayout>
              <ViewImport />
            </MainLayout>
          } />
          <Route path="/import/edit/:id" element={
            <MainLayout>
              <EditImport />
            </MainLayout>
          } />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </>
  )
}

export default App
