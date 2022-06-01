import { db } from '../firebase/config'
import { useState } from 'react'

export const useFirestore = () => {
  const [isPending, setIsPending] = useState(false)

  const dbAdd = async (collectioin, doc) => {
    db.collection(collectioin).add(doc)
  }

  const dbSet = async (collectioin, docId, doc) => {
    db.collection(collectioin).doc(docId).set(doc)
  }

  const dbUpdate = async (collection, docId, doc) => {
    setIsPending(true)
    await db.collection(collection).doc(docId).update(doc)
    setIsPending(false)
  }

  const dbDelete = async (collectioin, docId) => {
    db.collection(collectioin).doc(docId).delete()
  }

  const dbGet = async (collectioin, docId) => {
    const snapshot = await db.collection(collectioin).doc(docId).get()
    const data = snapshot.data()
    return data
  }
  return { dbAdd, dbSet, dbUpdate, dbDelete, dbGet, isPending }
}
