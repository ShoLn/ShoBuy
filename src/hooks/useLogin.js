import { useState, useEffect } from 'react'
import { auth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { useFirestore } from './useFirestore'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()
  const { dbGet } = useFirestore()

  const login = async (email, password) => {
    setError(null)
    setIsPending(true)

    try {
      // login with firebase auth
      const res = await auth.signInWithEmailAndPassword(email, password)
      // if sign up failed, res will be null
      if (!res) {
        throw new Error('login failed')
      }

      // update Authcontext state with member collection data
      const data = await dbGet('members', res.user.uid)
      if (data.email === 'managershobuy@gmail.com') {
        dispatch({ type: 'MANAGER', payload: data })
      } else {
        dispatch({ type: 'LOGIN', payload: data })
      }

      //update state
      setIsPending(false)
    } catch (err) {
      console.log(err)
      setError(err.message)
      setIsPending(false)
    }
  }

  return { error, isPending, login }
}
