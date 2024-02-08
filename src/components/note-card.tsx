import {formatDistanceToNow} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import * as Dialog from "@radix-ui/react-dialog"
import { X } from 'lucide-react'
interface NoteCardProps{
    note:{
        id: string
        date:Date
        content:string
    }
    onNoteDelete: (id:string) => void
}

export default function NoteCard({note, onNoteDelete}:NoteCardProps){
    
    return(
        <Dialog.Root>

      
    <Dialog.Trigger className='bg-slate-800 text-left rounded-md p-5 flex flex-col gap-3 relative overflow-hidden hover:ring-2 outline-none hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 justify-start
    last-of-type:mb-20 md:last-of-type:mb-0
    flex-auto h-48 w-32
    '>
        <span className='text-slate-200 text-sm '>
        {formatDistanceToNow(note.date, {locale: ptBR, addSuffix:true})}
        </span>
        <p className='text-sm leading-6 text-slate-400'>
           {note.content}
        </p>
        
        <div className='absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-black/50 to-black/0 pointer-events-none'>

        </div>

    </Dialog.Trigger>
    <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/60 backdrop-blur-lg"/>
        <Dialog.Content className="text-white fixed inset-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2  md:-translate-y-1/2 md:max-w-[640px] w-full min-h-[400px] bg-slate-700 flex flex-1  flex-col gap-2 overflow-hidden md:rounded-md outline-none">
        <Dialog.Close className='absolute outline-none right-0 top-0 p-2 bg-slate-800 text-slate-400 hover:text-slate-100'>
            <X className='size-5'/>
        </Dialog.Close>
       <div className='flex flex-1 flex-col gap-3 p-4'>
       <span className='text-slate-200 text-sm'>
            {formatDistanceToNow(note.date, {locale: ptBR, addSuffix:true})}
        </span>
        <p className='text-sm leading-6 text-slate-400'>
           {note.content}
        </p>
       </div>
        <button 
        onClick={() => onNoteDelete(note.id)}
        className='bg-slate-800 py-4 text-sm text-slate-300 outline-none font-medium group'>
            Deseja <span className='text-red-400 group-hover:underline'>apagar essa nota</span>?
        </button>
        </Dialog.Content>
    </Dialog.Portal>
    </Dialog.Root> 
    )
}