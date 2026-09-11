import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import POSPage from './components/POSPage'
import BillingPage from './components/BillingPage'
import SettingsPage from './components/SettingsPage'
import { RestaurantProvider } from './context/RestaurantProvider'
import { Customers, Dashboard, MenuPage, Orders, Reports, Tables } from './pages'

function App() {
  return <RestaurantProvider><BrowserRouter><Routes><Route element={<Layout />}><Route path="/" element={<Dashboard />} /><Route path="/tables" element={<Tables />} /><Route path="/new-order" element={<POSPage />} /><Route path="/orders" element={<Orders />} /><Route path="/menu" element={<MenuPage />} /><Route path="/customers" element={<Customers />} /><Route path="/billing" element={<BillingPage />} /><Route path="/reports" element={<Reports />} /><Route path="/settings" element={<SettingsPage />} /></Route></Routes><Toaster position="top-right" richColors /></BrowserRouter></RestaurantProvider>
}

export default App
