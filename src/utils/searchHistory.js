const SEARCH_HISTORY_KEY = "herbSearchHistory"


// =========================================
// GET SEARCH HISTORY
// =========================================

export function getSearchHistory() {
  try {
    const savedHistory = localStorage.getItem(
      SEARCH_HISTORY_KEY
    )

    if (!savedHistory) {
      return []
    }

    return JSON.parse(savedHistory)

  } catch (error) {

    console.error(
      "Unable to read search history:",
      error
    )

    return []
  }
}


// =========================================
// SAVE SEARCH HISTORY
// =========================================

function saveSearchHistory(history) {
  localStorage.setItem(
    SEARCH_HISTORY_KEY,
    JSON.stringify(history)
  )
}


// =========================================
// ADD SEARCH TO HISTORY
// =========================================

export function addSearchHistory(searchData) {

  const history = getSearchHistory()

  const newSearch = {
    id: Date.now(),

    timestamp: new Date().toISOString(),

    mode: searchData.mode || "simple",

    query: searchData.query || "",

    parameters:
      searchData.parameters || {},

    resultCount:
      searchData.resultCount || 0,

    averageMatch:
      searchData.averageMatch || 0,

    topResults:
      searchData.topResults || [],

    zeroMatch:
      searchData.resultCount === 0,

    weakMatch:
      searchData.averageMatch > 0 &&
      searchData.averageMatch < 40
  }

  const updatedHistory = [
    ...history,
    newSearch
  ]

  saveSearchHistory(updatedHistory)

  return newSearch
}


// =========================================
// CLEAR SEARCH HISTORY
// =========================================

export function clearSearchHistory() {

  localStorage.removeItem(
    SEARCH_HISTORY_KEY
  )
}