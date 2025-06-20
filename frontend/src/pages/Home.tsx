import { useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import TutorialList from '@/components/TutorialList'
import { useTutorialsContext } from "@/utils/TutorialsContext";


export default function Home() {
  const { tutorials, refetch } = useTutorialsContext();
  useEffect(() => {
    refetch()
  }, [])


  return (
    <div className='w-[85%] align-center flex flex-col items-center justify-center self-center mx-auto'>
      <div className='max-w-5xl p-4 mt-8 w-full'>
        <h1 className='text-5xl font-bold text-balance ml-4 mb-3'>Tutorials</h1>
        <p className='text-lg opacity-75 ml-5 mb-4'>You currently have {tutorials.length} tutorials.</p>
        <Separator/>
        <TutorialList tutorials={tutorials} />
      </div>
    </div>
  )
}

