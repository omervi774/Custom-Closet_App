import { useState } from 'react'
// import { signInWithEmailAndPassword } from 'firebase/auth'
// import { auth } from '../firebase'
export default function useLogIn() {
  const [inputsValues, setInputsValues] = useState({
    email: '',
    password: '',
  })
  // const [error, setError] = useState(false)
  function handleChange(e) {
    const { value, name } = e.target
    setInputsValues((prev) => {
      return { ...prev, [`${name}`]: value }
    })
  }
  // async function handleSubmit() {
  //   try {
  //     await signInWithEmailAndPassword(auth, inputsValues.email, inputsValues.password)
  //     //const user = userCredential.user
  //     // const token = await user.getIdToken()
  //     console.log('succsesfully logged in')
  //   } catch (error) {
  //     setError(true)
  //     setTimeout(() => {
  //       setError(false)
  //     }, 3000)
  //     throw new Error(error)
  //   }
  // }
  return [inputsValues, handleChange]
}
