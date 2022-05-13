import { useState, useEffect } from 'react'
import { auth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { useFirestore } from '../hooks/useFirestore'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()
  const { dbSet } = useFirestore()

  const signup = async (email, password, displayName, address, phone) => {
    setError(null)
    setIsPending(true)

    try {
      // sign up with firebase auth
      const res = await auth.createUserWithEmailAndPassword(email, password)
      // if sign up failed, res will be null
      if (!res) {
        throw new Error('sign up failed')
      }

      // create user document in firestore member collection
      await dbSet('members', res.user.uid, {
        uid:res.user.uid,
        displayName,
        email,
        address,
        phone
      })
      // update Authcontext state
      dispatch({
        type: 'LOGIN',
        payload: { uid:res.user.uid, displayName, address, phone }
      })

      //update state
      setError(null)
      setIsPending(false)
    } catch (err) {
      console.log(err)
      setError(err.message)
      setIsPending(false)
    }
  }

  return { error, isPending, signup }
}
