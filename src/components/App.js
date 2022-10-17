import { useEffect, useState } from "react"
import AppRouter from "components/Router"
// import * as firebase from 'fbase'
import { authService } from "fbase"
import { onAuthStateChanged, updateProfile } from "firebase/auth"

function App() {
  const [init, setInit] = useState(false)
  const [userObj, setUserObj] = useState(null)
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        // setUserObj(user)
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => updateProfile(authService.currentUser, args),
        })
      }
      // console.log("onAuthStateChanged", user, userObj)
      setInit(true)
    })
  }, [])

  const refreshUser = () => {
    const user = authService.currentUser
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => updateProfile(authService.currentUser, args),
    })
  }

  return (
    <div className="App">
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)} 
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; twit {new Date().getFullYear()}</footer>
    </div>
  )
}

export default App
