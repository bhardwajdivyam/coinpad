/* ── Centralized API configuration ──────────────────────── */

export const COINGECKO = {
  BASE: 'https://api.coingecko.com/api/v3',
  TOP_COINS: '/coins/markets',
  COIN_CHART: (id) => `/coins/${id}/market_chart`,
  params: {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 100,
    page: 1,
    sparkline: false,
    price_change_percentage: '24h,7d',
  },
}

export const BLOCKCYPHER = {
  BASE: 'https://api.blockcypher.com/v1',
  // chain paths: /btc/main or /ltc/main
  address: (coin, addr) => `/${coin}/main/addrs/${addr}`,
  fullAddress: (coin, addr) => `/${coin}/main/addrs/${addr}/full`,
  // Optional – set your API token here
  TOKEN: '',
}
