import { useEffect, useState } from 'react'
import api from '../api'
import { Separator } from '@/components/ui/separator'
import TutorialStep from '@/components/TutorialStep'
import { NavLink, useNavigate } from 'react-router-dom'
import { ChevronLeft, Pen, Trash2 } from 'lucide-react'
import { useParams } from 'react-router-dom';
import type { Step, Tutorial } from '@/utils/Tutorial'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Tutorial() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutorial, setTutorial] = useState<Tutorial>()
  const [tempTitle, setTempTitle] = useState<string>('')
  const [editing, setEditing] = useState<boolean>(false)

  useEffect(() => {
      setEditing(false)
      api.get(`/tutorials/${id}/`)
      .then((res) => {
          setTutorial(res.data)
      })
  }, [id])

  function handleDelete() {
    api.delete(`/tutorials/${id}/`)
    .then( () => navigate('/') )
  }

  function handleEditStart() {
    setTempTitle(tutorial!.title)
    setEditing(true)
  }

  async function handleSaveTitle() {
    if(tempTitle.trim() === '')
      return;

    const formData = new FormData();
    formData.append('title', tempTitle);

    try {
      api.patch(`/tutorials/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(() => {
        const newTut = { ...tutorial! }
        newTut['title'] = tempTitle;
        setTutorial(newTut)
        setEditing(false)
      });
    } catch (error) {
      console.error('Edit failed:', error);
    }
  }

  async function handleSaveSteps(newStep: Step | null, index: number){
    const steps = tutorial?.body
    if(newStep && steps){
      steps[index] = newStep
    } else {
      steps?.splice(index, 1);
    }
    
    const formData = new FormData();
    formData.append('body', JSON.stringify(steps));

    try {
      await api.patch(`/tutorials/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const newTut = { ...tutorial! }
      newTut['body'] = steps!;
      setTutorial(newTut)
      return true
    } catch (error) {
      console.error('Edit failed:', error);
      return false
    }
  }

  if(!tutorial)
    return null

  return (
    <div className='w-[85%] align-center flex flex-col items-center justify-center self-center mx-auto'>
      <div className='max-w-5xl p-4 mt-4 w-full'>
        <NavLink to={'/'} className='text-lg opacity-40 hover:opacity-60 ml-2 mb-1 w-fit flex'> <span  className='flex'><ChevronLeft className='mt-1' /> all tutorials</span></NavLink>
        <div className='flex justify-between'>
          {editing ? (
          <>
            <div className=' grow mr-28 mb-1'> 
              <Input
                id='Title'
                type="text"
                value={tempTitle}
                placeholder="Tutorial Title"
                onChange={(e) => setTempTitle(e.target.value)}
                className='h-10 my-1 ml-4 !text-lg'
              /> 
            </div>
            <div className='flex mt-2 gap-2'>
              <Button type="submit" onClick={() => handleSaveTitle()}>
                Save
              </Button>
              <Button type="reset" variant={'outline'} onClick={()=> setEditing(false)}>
                Cancel
              </Button>
            </div>
          </>
          ) : (
            <>
              <h1 className='text-4xl font-bold text-balance ml-4 mb-4'>{tutorial.title}</h1>
              <div className='flex gap-4 mr-2 ml-2'>
                <button className='cursor-pointer text-primary/40 hover:text-primary mt-1' onClick={() => handleEditStart()}>
                  <Pen/>
                </button>
                <Popover>
                  <PopoverTrigger>
                    <Trash2 className='cursor-pointer text-destructive/30 hover:text-destructive mt-2'/>
                  </PopoverTrigger>
                  <PopoverContent className='w-60 flex flex-col gap-2'>
                    <div>Are you sure you want to delete this tutorial?</div>
                    <Button variant={'destructive'} onClick={() => handleDelete()}>Delete</Button>
                  </PopoverContent>
                </Popover>

              </div>
            </>
          )
        }
        </div>
        <Separator/>
        <ul className='list-none'>
          {tutorial.body.map( (step, index) => 
            <TutorialStep key={index} step={step} vidURL={tutorial.video_url} index={index} handleSaveSteps={handleSaveSteps}/>
          )}
        </ul>
      </div>
    </div>
  )
}

