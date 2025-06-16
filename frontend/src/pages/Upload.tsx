import { Separator } from '@/components/ui/separator'
import { NavLink } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import UploadForm from '@/components/UploadForm'

export default function Upload() {
  return (
    <div className='w-[85%] align-center flex flex-col items-center justify-center self-center mx-auto'>
      <div className='max-w-5xl p-4 mt-4 w-full'>
        <NavLink to={'/'} className='text-lg opacity-40 hover:opacity-60 ml-2 mb-1  flex'> <span  className='flex'><ChevronLeft className='mt-1' /> all tutorials</span></NavLink>
        <h1 className='text-4xl font-bold text-balance ml-4 mb-4'>Upload a new tutorial</h1>
        <Separator/>
        <div>
            <UploadForm />
        </div>
      </div>
    </div>
  )
}

