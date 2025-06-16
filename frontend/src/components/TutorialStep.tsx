import type { Step } from "@/utils/Tutorial";
import VideoClip from "./VideoClip";
import { Pen, Trash2 } from 'lucide-react'

import {
 Dialog,
 DialogClose,
 DialogContent,
 DialogFooter,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from "@/components/ui/dialog"
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from "@/components/ui/popover"
import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react";
import { Switch } from "@/components/ui/switch";


export default function TutorialStep({step, vidURL, index, handleSaveSteps} : {step: Step, vidURL: string, index: number, handleSaveSteps: (newStep: Step | null, index: number) => Promise<boolean>}) {
	const [stepTitle, setStepTitle] = useState<string>('')
	const [details, setDetails] = useState<string>('')
	const [hasClip, setHasClip] = useState<boolean>(false)
	const [clipStart, setClipStart] = useState<number>(0)
	const [clipEnd, setClipEnd] = useState<number>(0)

	const [error, setError] = useState<string>('')
	const [openDiag, setOpenDiag] = useState<boolean>(false);


	async function handleSave() {
		if(stepTitle.trim() == ''){
			setError('Title cannot be blank')
			return
		}
		let newClip = null
		if(hasClip)
		{
			if(clipStart<0 || clipEnd<0){
				setError('Clip must be higher than 0')
				return
			}
			if(clipStart>clipEnd){
				setError('Clip end must be after start')
				return
			}
			newClip = {start: clipStart, end: clipEnd}
		}

		const newStep : Step = {
			title: stepTitle,
			body: details,
			clip: newClip
		}

		const saved = await handleSaveSteps(newStep, index)

		if(saved) {
			setOpenDiag(false)
		}
	}

	function handleEditStart() {
		setStepTitle(step.title)
		setDetails(step.body)
		setError('')
		if(step.clip){
			setHasClip(true)
			setClipStart(step.clip.start)
			setClipEnd(step.clip.end)
		} else {
			setHasClip(false)
			setClipStart(0)
			setClipEnd(0)
		}
	}

  return (
    <li className="w-full">
      <div className="flex flex-col mx-auto text-lg text-foreground border-b-2 border-border py-2 pl-3 hover:bg-muted dark:hover:bg-card/20">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-2 mt-2">{step.title}</h2>
          <div className='flex gap-4 mr-2 ml-2 mt-3'>
            <Dialog open={openDiag} onOpenChange={setOpenDiag}>
              <form>
                <DialogTrigger asChild>
                  <Pen 
										className='cursor-pointer text-primary/30 hover:text-primary h-5 w-5' 
										onClick={() => handleEditStart()}
									/>
								</DialogTrigger>
								<DialogContent className="sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Edit Step</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="step-title">Title</Label>
                      <Input 
												id="step-title" 
												value={stepTitle} 
												onChange={(e) => setStepTitle(e.target.value)}
											/>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="details">Details</Label>
                      <Textarea 
												id="details" 
												className="resize-none h-24 max-h-64 overflow-x-auto" 
												value={details} 
												onChange={(e) => setDetails(e.target.value)} 
											/>
                    </div>
										<div className="flex items-center space-x-2">
											<Switch id="has-clip" checked={hasClip} onCheckedChange={setHasClip}/>
											<Label htmlFor="has-clip">Include Video Clip</Label>
										</div>
										{hasClip ?
											<div className="flex gap-4">
												<div>
													<Label htmlFor="clip-start">Clip Start</Label>
													<Input 
														id="clip-start"
														type="number"
														value={clipStart} 
														className="w-20"
														onChange={(e) => setClipStart(Number(e.target.value))}
													/>
												</div>
												<div>
													<Label htmlFor="clip-end">Clip End</Label>
													<Input 
														id="clip-end"
														type="number"
														value={clipEnd} 
														className="w-20"
														onChange={(e) => setClipEnd(Number(e.target.value))}
													/>
												</div>
											</div> 
											:
											null
										}
										
                  </div>
                  <DialogFooter>
										<span className="text-destructive text-sm mt-2 font-semibold">{error}</span>
                    <Button type="submit" onClick={() => handleSave()}>Save changes</Button>
										<DialogClose asChild>
                    	<Button variant="outline">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
            <Popover>
            <PopoverTrigger className="h-5">
              <Trash2 className='cursor-pointer text-destructive/20 hover:text-destructive h-5 w-5'/>
            </PopoverTrigger>
            <PopoverContent className='w-60 flex flex-col gap-2'>
              <div>Are you sure you want to delete this step?</div>
							<PopoverClose asChild>
              	<Button variant={'destructive'} onClick={() => handleSaveSteps(null, index)}>Delete</Button>
							</PopoverClose>
            </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="text-base pl-4 pr-10">{step.body}</div>
        <div className="w-full max-w-[60%] mx-auto">
          {step.clip? <VideoClip vidURL={vidURL} clip_start={step.clip.start} clip_end={step.clip.end}/> : null}
        </div>
        
      </div>
    </li>
  )
}
