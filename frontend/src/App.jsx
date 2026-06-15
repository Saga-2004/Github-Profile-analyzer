import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProfilesPage from './pages/ProfilesPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen text-slate-100" style={{ backgroundColor: '#0d1117' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profiles" element={<ProfilesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
