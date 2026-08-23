import { ref, computed } from 'vue'

import { getSession, onAuthStateChange, signOut as signOutUser } from '../services/authService'

const user = ref(null)
const session = ref(null)
const initialized = ref(false)

let authListener = null
let initializationPromise = null

async function initialize() {
  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = (async () => {
    try {
      session.value = await getSession()
      user.value = session.value?.user ?? null

      if (!authListener) {
        const { data } = onAuthStateChange((event, newSession) => {
          session.value = newSession
          user.value = newSession?.user ?? null
        })

        authListener = data?.subscription ?? null
      }
    } finally {
      initialized.value = true
    }
  })()

  return initializationPromise
}

async function signOut() {
  await signOutUser()

  session.value = null
  user.value = null
}

const isAuthenticated = computed(() => !!session.value)

export function useAuth() {
  return {
    user,
    session,
    isAuthenticated,
    initialized,

    initialize,
    signOut,
  }
}
