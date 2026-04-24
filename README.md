# 🚀 Coinpad

A modern cryptocurrency dashboard and transaction explorer built with React (Vite).  
Track real-time crypto prices, explore transactions, and manage your favorite coins — all in a clean, premium UI.

---

## 🌐 Live Demo
👉 [coinpad ](https://coinpad-ten.vercel.app/)

---

## ✨ Features

- 📊 Live Crypto Prices (CoinGecko API)
- 🔍 Search, Filter & Sort Coins
- ⭐ Watchlist (CRUD) — Add/remove favorite coins
- 📈 Interactive Coin Details & Charts
- 🔗 Transaction Tracker
  - Supports BTC, LTC, ETH & USDT (multi-chain detection)
- 💰 USD Value Conversion for Transactions
- ⏱️ Auto Refresh + “Time Ago” Updates
- ⚡ Smooth Price Animations
- 🎨 Responsive, Premium UI

---

## 🧠 Tech Stack

- Frontend: React (Vite)
- State Management: Context API
- APIs: CoinGecko, Blockchain APIs
- Styling: Tailwind CSS / Custom CSS
- Deployment: Vercel

---

## 📁 Project Structure

src/  ├── components/  │     ├── CoinCard.jsx  │     ├── Navbar.jsx  │     ├── SearchBar.jsx  │     └── ...  ├── pages/  │     ├── Home.jsx  │     ├── CoinDetails.jsx  │     ├── Tracker.jsx  │     ├── TxTracker.jsx  │     └── ...  ├── context/  │     └── WatchlistContext.jsx  ├── services/  │     ├── api.js  │     └── apiConfig.js  ├── App.jsx  └── main.jsx

---

## ⚙️ Getting Started

### 1. Clone the repository
git clone https://github.com/your-username/coinpad.git cd coinpad

### 2. Install dependencies
npm install

### 3. Run locally
npm run dev

---

## 📦 Build for production
npm run build

---

## 🚀 Deployment

Deployed using Vercel.

To deploy your own version:

1. Push code to GitHub  
2. Import project in Vercel  
3. Deploy instantly  

---

## ⚠️ Notes

- Crypto prices may vary slightly due to different data sources and update intervals.  
- Transaction tracking supports limited blockchains for demo purposes.  
- No authentication or trading functionality (frontend-focused project).  

---

## 📌 Future Improvements

- More blockchain support (Polygon, BSC, etc.)  
- Portfolio tracking  
- Dark/light theme toggle  
- Pagination / infinite scroll  

---

## 👨‍💻 Author

Built by Divyam Bhardwaj

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on Git
