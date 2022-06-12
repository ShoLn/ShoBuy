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
        cart: [],
        uid: res.user.uid,
        displayName,
        email,
        address,
        phone,
        thumbNail:
          'https://firebasestorage.googleapis.com/v0/b/shobuy-bc47c.appspot.com/o/initial_thumb_nail%2Fthumb_nail.png?alt=media&token=f833b04b-bfac-4e84-bb95-d3815f50122c'
      })
      // update Authcontext state
      dispatch({
        type: 'LOGIN',
        payload: {
          cart: [],
          uid: res.user.uid,
          displayName,
          address,
          phone,
          thumbNail:
            'https://firebasestorage.googleapis.com/v0/b/shobuy-bc47c.appspot.com/o/initial_thumb_nail%2Fthumb_nail.png?alt=media&token=f833b04b-bfac-4e84-bb95-d3815f50122c'
        }
      })

      //update state
      setError(null)
      setIsPending(false)
    } catch (err) {
      console.log(err)
      setError(err.code)
      setIsPending(false)
    }
  }

  return { error, isPending, signup }
}
