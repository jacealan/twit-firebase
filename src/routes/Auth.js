import { authService } from "fbase";
import { createUserWithEmailAndPassword,
          signInWithEmailAndPassword,
          GoogleAuthProvider,
          GithubAuthProvider,
          signInWithPopup,
          } from "firebase/auth";
        
import React, { useState } from "react"

// https://firebase.google.com/docs/auth/web/start?hl=ko&authuser=0

const Auth = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newAccount, setNewAccount] = useState(true)
  const [error, setError] = useState("")
  const onChange = (event) => {
    const {target: { name, value },} = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data
      if (newAccount) {
        data = await createUserWithEmailAndPassword(authService, email, password)
      } else {
        data = await signInWithEmailAndPassword(authService, email, password)
      }
      // console.log(data)
    } catch (error) {
      setError(error.message)
    }
  };
  const toggleAccount = () => setNewAccount(prev => !prev)
  const onSocialClick = async (event) => {
    // console.log(event.target.name)
    const {target: { name }} = event
    let provider
    if (name === "google") {
      provider = new GoogleAuthProvider()
    } else if (name === "github") {
      provider = new GithubAuthProvider()
    }    
    const data = await signInWithPopup(authService, provider)
  }
  
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
      </form>
      <div>{error}</div>
      <div onClick={toggleAccount}>{newAccount ? "Sing In" : "Create Account"}</div>
      <div>
        <button onClick={onSocialClick} name="google">Continue with Google</button>
        <button onClick={onSocialClick} name="github">Continue with Github</button>
      </div>
    </div>
  );
};
export default Auth;