import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService, dbService } from "fbase"
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import Twit from "../components/Twit"

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)

  const navigate = useNavigate()
  const onLogOutClick = async () => {
    await authService.signOut()
    navigate("/")
    window.location.reload()
  }

  const onChange = (event) => {
    const {
      target: {value}
    } = event
    setNewDisplayName(value)
  }
  const onSubmit = async (event) => {
    event.preventDefault()
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      })
      refreshUser()
    }
  }

  const [userTwits, setUserTwits] = useState([])
  const getMyTwits = async () => {
    const queryTwits = await getDocs(
      query(
        collection(dbService, "twits"),
        where("creatorId", "==", userObj.uid),
        orderBy("createdAt", "desc"),
        // orderBy("createdAt", "asc"),
        limit(2)
      )
    )
    // twits.forEach((twit) => {
    //   console.log(twit.data())
    // })
    const twits = []
    queryTwits.forEach((doc) => {
      const twitsObject = {
        ...doc.data(),
        id: doc.id,
      }
      twits.push(twitsObject)
    })
    setUserTwits(twits)
    
    // const onSnap = []
    // querySnapshot.forEach((doc) => {
    //   const twitsObject = {
    //     ...doc.data(),
    //     id: doc.id,
    //   }
    //   onSnap.push(twitsObject)
    // })          
    // setTwits(onSnap)
  }
  useEffect(() => {
    getMyTwits()
  }, [])

  return (
    <>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} type="text" placeholder="Display name" value={newDisplayName} />
        <input type="submit" value="Update Profile" />
      </form>
      {/* <span>Profile</span> */}
      <button onClick={onLogOutClick}>Log Out</button>
      
      <div>
        {userTwits.map(twit => (
          <Twit key={twit.id} twitObj={twit} isOwner={twit.creatorId === userObj.uid} />
          // <>{twit.id}, {twit.createId}, {userObj.uid}</>
        ))}
      </div>
    </>
  )
}
export default Profile
