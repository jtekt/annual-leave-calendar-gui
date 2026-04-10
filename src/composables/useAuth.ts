import axios from "axios"
import { store } from "@/store"

const TOKEN_KEY = "nenkyuu_token"

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  delete axios.defaults.headers.common["Authorization"]
}

/** Load stored token into axios headers. Call once at startup. */
function initToken(): void {
  const token = getToken()
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  }
}

/**
 * Ask the identification endpoint who the current user is.
 * Returns true if authenticated, false otherwise.
 * Safe to call outside component context.
 */
async function identify(): Promise<boolean> {
  const url = import.meta.env.VITE_IDENTIFICATION_URL
  if (!url) return true // no identification URL configured — skip auth

  try {
    const { data } = await axios.get(url)
    store.commit("set_current_user", data)
    return true
  } catch {
    clearToken()
    store.commit("set_current_user", null)
    return false
  }
}

/** For use inside components (returns helpers bound to the store). */
export function useAuth() {
  async function login(username: string, password: string): Promise<void> {
    const url = import.meta.env.VITE_LOGIN_URL
    if (!url) throw new Error("VITE_LOGIN_URL is not configured")

    const { data } = await axios.post(url, { username, password })

    // Handle common JWT response shapes; fall back to cookie-based if none match
    const token =
      data?.token ?? data?.jwt ?? data?.access_token ?? data?.Bearer
    if (token) setToken(token)

    await identify()
  }

  function logout(): void {
    clearToken()
    store.commit("set_current_user", null)
  }

  return { login, logout }
}

// Named exports so main.ts and router can use them without a component context
export { initToken, identify, getToken }
