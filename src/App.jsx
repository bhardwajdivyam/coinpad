import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Tracker from './pages/Tracker'
import CoinDetails from './pages/CoinDetails'
import TxTracker from "./pages/TxTracker"
import { WatchlistProvider } from "./context/WatchlistContext"

export default function App() {
  return (
    <WatchlistProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/coin/:id" element={<CoinDetails />} />
          <Route path="/tx" element={<TxTracker />} />
        </Routes>
      </div>
    </WatchlistProvider>
  )
}
