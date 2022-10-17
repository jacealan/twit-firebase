import React, { useEffect, useState } from "react"
import { dbService } from "fbase"
import { collection, query, addDoc, getDocs, onSnapshot } from "firebase/firestore"
import Twit from "../components/Twit"

const Home = ({ userObj }) => {
  const [twit, setTwit] = useState("")
  const onChange = (event) => {
    const {
      target: { value },
    } = event
    setTwit(value)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const docRef = await addDoc(collection(dbService, "twits"), {
      text: twit,
      creatorId: userObj.uid,
      createdAt: Date.now(),
    })
    // console.log(twit, docRef.id)
    setTwit("")
  }

  const [twits, setTwits] = useState([])
  // const getTwits = async () => {
  //   const dbTwits = await getDocs(collection(dbService, "twits"))
  //   setTwits([])
  //   dbTwits.forEach((doc) => {
  //     console.log(doc)
  //     const twitsObject = {
  //       ...doc.data(),
  //       id: doc.id,
  //     }
  //     setTwits(prev => [twitsObject, ...prev])
  //   })    
  //   console.log(twits.length)
  // }
  useEffect(() => {
    // getTwits()
    const onTwits = onSnapshot(
      query(collection(dbService, "twits")),
      (querySnapshot) => {
        const onSnap = []
        querySnapshot.forEach((doc) => {
          const twitsObject = {
            ...doc.data(),
            id: doc.id,
          }
          onSnap.push(twitsObject)
        })          
        setTwits(onSnap)
      }
    )
  }, [])

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          value={twit}
          onChange={onChange}
          type="text"
          placeholder="What?"
          maxLength={120}
        />
        <input type="submit" value="twit" />
      </form>

      <div>
        {twits.map(twit => (
          <Twit key={twit.id} twitObj={twit} isOwner={twit.creatorId === userObj.uid} />
          // <>{twit.id}, {twit.createId}, {userObj.uid}</>
        ))}
      </div>
    </>
  )
}

export default Home
