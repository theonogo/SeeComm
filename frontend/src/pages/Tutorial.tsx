import { useEffect, useState } from 'react'
import api from '../api'
import { Separator } from '@/components/ui/separator'
import TutorialStep from '@/components/TutorialStep'
import { NavLink } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useParams } from 'react-router-dom';
import type { Tutorial } from '@/utils/Tutorial'

export default function Tutorial() {
  const { id } = useParams();
  const [tutorial, setTutorial] = useState<Tutorial>()
  useEffect(() => {
      api.get(`/tutorials/${id}/`)
      .then((res) => {
          setTutorial(res.data)
      })
  }, [id])

  if(!tutorial)
    return null
  else
    console.log(tutorial)

  return (
    <div className='w-[85%] align-center flex flex-col items-center justify-center self-center mx-auto'>
      <div className='max-w-5xl p-4 mt-4 w-full'>
        <NavLink to={'/'} className='text-lg opacity-40 hover:opacity-60 ml-2 mb-1  flex'> <span  className='flex'><ChevronLeft className='mt-1' /> all tutorials</span></NavLink>
        <h1 className='text-4xl font-bold text-balance ml-4 mb-4'>{tutorial.title}</h1>
        <Separator/>
        <ul className='list-none'>
          {tutorial.body.map( (step) => 
            <TutorialStep step={step} vidURL={tutorial.video_url} />
          )}
        </ul>
      </div>
    </div>
  )
}

