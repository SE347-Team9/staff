import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './routes/auth/Login'
import Register from './routes/auth/Register'
import MainLayout from './components/layout/MainLayout'
import Reports from './pages/Report/Reports'
import AddReport from './pages/Report/AddReport'
import ViewReport from './pages/Report/ViewReport'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
        <Route path="/" element={<Navigate to="/reports" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
