import { NavLink} from "react-router-dom";
import { ChevronRight, Plus } from "lucide-react"


export default function TutorialList({ tutorials } : { tutorials: Array<{ id: string, title: string, created_at: string }> }) {
  console.log(tutorials)
  
  return (
    <div className=" py-4 mx-auto w-full">
      <ul className="flex flex-col gap-0 ">
        {tutorials.map((tutorial) => (
          <TutorialItem key={tutorial.id} tutorial={tutorial} />
        ))}
        <li className="w-full">
          <NavLink to={`/upload/`} className="flex mx-auto font-semibold border-t border-border bg-violet-200 hover:bg-violet-300 dark:bg-violet-950 rounded-b-sm dark:hover:bg-violet-900 text-primary/80 justify-center p-1.5 ">
            <div className="flex gap-2">
              Upload New Tutorial
              <Plus className="h-7 w-7 text-muted-foreground self-end" />
            </div>
           </NavLink>
        </li>
      </ul>
    </div>
  );
}

function TutorialItem({ tutorial } : { tutorial: { id: string, title: string, created_at: string } }) {
  return (
    <li className="w-full">
      <NavLink to={`/tutorials/${tutorial.id}`} className="block mx-auto text-lg text-primary border-b-2 border-border p-2 hover:bg-muted">
        <div className="flex justify-between ml-1">
          <div className="max-w-lg overflow-hidden text-ellipsis whitespace-nowrap">
            {tutorial.title}
          </div>
          <div className="flex text-sm text-muted-foreground self-end">
            <span className="mt-1 whitespace-nowrap">{new Date(tutorial.created_at).toLocaleString()}</span>

            <ChevronRight className="ml-2 h-7 w-7 text-muted-foreground self-end" />
          </div>
        </div>
      </NavLink>
    </li>
  );
}