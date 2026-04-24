

import { createContext, useContext, useEffect, useMemo, useState } from "react"

const WatchlistContext = createContext(null)

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("coinpad_watchlist")
      if (stored) {
        setWatchlist(JSON.parse(stored))
      }
    } catch {
      // fail silently
    }
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("coinpad_watchlist", JSON.stringify(watchlist))
    } catch {
      // fail silently
    }
  }, [watchlist])

  // CREATE
  const addToWatchlist = (coin) => {
    setWatchlist((prev) => {
      if (prev.find((c) => c.id === coin.id)) return prev
      return [...prev, coin]
    })
  }

  // DELETE
  const removeFromWatchlist = (id) => {
    setWatchlist((prev) => prev.filter((c) => c.id !== id))
  }

  // READ helper
  const isInWatchlist = (id) => {
    return watchlist.some((c) => c.id === id)
  }

  const value = useMemo(
    () => ({
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
    }),
    [watchlist]
  )

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  )
}

// Custom hook
export const useWatchlist = () => {
  const context = useContext(WatchlistContext)
  if (!context) {
    throw new Error("useWatchlist must be used within WatchlistProvider")
  }
  return context
}