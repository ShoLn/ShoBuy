import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'
import { auth } from '../firebase/config'

export const useLogout = () => {
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const logout = async () => {
    setError(null)
    setIsPending(true)

    try {
      await auth.signOut()

      // update auth context
      dispatch({ type: 'LOGOUT' })

      // update state
      setError(null)
      setIsPending(false)
    } catch (err) {
      console.log(err.message)
      setError(err)
      setIsPending(false)
    }
  }

  return { logout, error, isPending }
}
