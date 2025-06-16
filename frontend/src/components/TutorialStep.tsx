import type { Step } from "@/utils/Tutorial";
import VideoClip from "./VideoClip";

export default function TutorialStep({step, vidURL} : {step: Step, vidURL:string}) {

    return (
        <li className="w-full">
            <div className="flex flex-col mx-auto text-lg text-foreground border-b-2 border-border p-2 hover:bg-card">
                <h2 className="text-2xl font-semibold mb-2 mt-2">{step.title}</h2>
                <div className="text-base pl-4 pr-10">{step.body}</div>
                <div className="w-full max-w-[60%] mx-auto">
                    {step.clip? <VideoClip vidURL={vidURL} clip_start={step.clip.start} clip_end={step.clip.end}/> : null}
                </div>
                
            </div>
        </li>
    )
}
