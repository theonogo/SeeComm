import { useEffect, useState } from 'react'
import api from '../api'
import LogoutButton from '../components/LogoutButton'
import UploadForm from '../components/UploadForm'

export default function Home() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/hello/')
      .then((res : { data: { message: string } }) => {
        setMessage(res.data.message)
      })
  }, [])

  return (
    <>
      <div>
        <h1>{message}</h1>
        <UploadForm />
        <LogoutButton />
      </div>
    </>
  )
}

