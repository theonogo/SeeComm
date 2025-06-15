import LoginButton from '../components/LoginButton'
import { useEffect, useState } from 'react'
import api from '../api'

export default function Login() {
    const [message, setMessage] = useState('')
    
      useEffect(() => {
        api.get('/hello/')
          .then((res : { data: { message: string } }) => {
            setMessage(res.data.message)
          })
      }, [])
    
    return (
      <div>
        <h1>{message}</h1>
        <LoginButton />
      </div>
    )
}