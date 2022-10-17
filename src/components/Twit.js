import React, { useState } from "react"
import { dbService } from "fbase"
import { doc, deleteDoc, updateDoc } from "firebase/firestore"

const Twit = ({ twitObj, isOwner }) => {
  const [editing, setEditing] = useState(false)
  const [newTwit, setNewTwit] = useState(twitObj.text)

  // https://firebase.google.com/docs/reference/js/firestore_.md?authuser=0&hl=ko#deletedoc
  const onDeleteClick = () => {
    const ok = window.confirm("Sure to delete?")
    if (ok) {
      deleteDoc(doc(dbService, "twits", twitObj.id))
    }
  }

  const toggleEditing = () => setEditing((prev) => !prev)
  // https://firebase.google.com/docs/reference/js/firestore_.md?authuser=0&hl=ko#updatedoc
  const onSubmit = async (event) => {
    event.preventDefault()
    await updateDoc(doc(dbService, "twits", twitObj.id), {
      text: newTwit
    })
    setEditing(false)
  }
  const onChange = (event) => {
    const {
      target: { value }
    } = event
    setNewTwit(value)
  }
  
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input value={newTwit} onChange={onChange} required />
            <input type="submit" value="Update Twit" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>
            {twitObj.text} {isOwner}
          </h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Twit</button>
              <button onClick={toggleEditing}>Edit Twit</button>
            </>
          )}
        </>
      )}

    </div>
  )
}

export default Twit
