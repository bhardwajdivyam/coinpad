import axios from 'axios'

// Simple in-memory cache
let coinCache = null
let chartCache = {}

import { COINGECKO, BLOCKCYPHER } from './apiConfig'

/* ── CoinGecko ─────────────────────────────────────────── */

const geckoClient = axios.create({ baseURL: COINGECKO.BASE })

export async function fetchTopCoins() {
  // Return cached data if available
  if (coinCache) return coinCache

  const { data } = await geckoClient.get(COINGECKO.TOP_COINS, {
    params: COINGECKO.params,
  })

  coinCache = data
  return data
}

export async function fetchCoinChart(coinId, days = 7) {
  const cacheKey = `${coinId}-${days}`

  // Return cached chart if available
  if (chartCache[cacheKey]) return chartCache[cacheKey]

  const { data } = await geckoClient.get(COINGECKO.COIN_CHART(coinId), {
    params: { vs_currency: 'usd', days },
  })

  const formatted = data.prices.map(([timestamp, price]) => ({
    time: new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    price,
  }))

  chartCache[cacheKey] = formatted
  return formatted
}

/* ── BlockCypher ───────────────────────────────────────── */

const cypherClient = axios.create({ baseURL: BLOCKCYPHER.BASE })

export async function fetchAddressInfo(coin, address) {
  const params = BLOCKCYPHER.TOKEN ? { token: BLOCKCYPHER.TOKEN } : {}
  const { data } = await cypherClient.get(
    BLOCKCYPHER.address(coin, address),
    { params }
  )
  return data
}

export async function fetchAddressTxs(coin, address) {
  const params = { limit: 10, ...(BLOCKCYPHER.TOKEN ? { token: BLOCKCYPHER.TOKEN } : {}) }
  const { data } = await cypherClient.get(
    BLOCKCYPHER.fullAddress(coin, address),
    { params }
  )
  return data
}
