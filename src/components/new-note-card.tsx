
import * as Dialog from "@radix-ui/react-dialog"
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from "sonner"

interface newNoteCardProps{
    onNoteCreated:(content:string)=> void
}

let speechRecognition:SpeechRecognition | null = null

export default function newNoteCard({onNoteCreated}:newNoteCardProps){

    const[shouldShowOnboarding,setShouldShowOnboarding]=useState(true)
    const[content,setContent] = useState('')
    const[isRecording,setIsRecording] = useState(false)

    function handleStartEditor(){
        setShouldShowOnboarding(false)
    }
    function handleContentChange(event:ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value)
     if (event.target.value === ''){
        setShouldShowOnboarding(true)
     } 
     
    }
    function handleSaveNote(event:FormEvent){

        if(content ==''){
            return
        }
       event.preventDefault()
       setShouldShowOnboarding(true)
       onNoteCreated(content)
       setContent('') 
       toast.success('Nota Criada com sucesso')
        
    }

    function handleStartRecording(){
        setIsRecording(true)
        setShouldShowOnboarding(false)

        const isSpeechRecognitionAPIAvaiable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

        if(!isSpeechRecognitionAPIAvaiable) {
            toast.warning('Navegador sem suporte de gravação')
            return
        }

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

        speechRecognition = new SpeechRecognitionAPI()
        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true
        
        speechRecognition.onresult = (event)=>{
            
                const transcription = Array.from(event.results).reduce((text, result) => {
                    return text.concat(result[0].transcript)

                },'')
                setContent(transcription)
        }
        speechRecognition.onerror = (event)=>{
            console.error(event)
        }
        speechRecognition.start()
    }

    function handleStopRecording(){
        
        if(speechRecognition !== null){
            speechRecognition.stop()
        }
        setIsRecording(false)
    }
    return(
        <Dialog.Root>
        <Dialog.Trigger className='bg-slate-700 flex flex-col text-left rounded-md p-5 space-y-2 overflow-hidden hover:ring-2 outline-none hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 w-full'>
        <span className='text-slate-200 text-sm '>Adicionar nota</span>
        <p className='text-sm leading-6 text-slate-400'> Comece <button className='text-lime-400 font-medium hover:text-lime-500'>gravando uma nota</button> em áudio ou se preferir <button className='text-lime-400 font-medium hover:text-lime-500'>utilize apenas texto.</button></p>
        
        </Dialog.Trigger>
        <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/60 backdrop-blur-lg"/>
        <Dialog.Content className="text-white fixed inset-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2  md:-translate-y-1/2 md:max-w-[640px] w-full min-h-[400px] bg-slate-700 flex flex-1  flex-col gap-2 overflow-hidden md:rounded-md outline-none">
        <Dialog.Close className='absolute outline-none right-0 top-0 p-2 bg-slate-800 text-slate-400 hover:text-slate-100'>
            <X className='size-5'/>
        </Dialog.Close>
        <form  className="flex-1 flex flex-col">
       <div className='flex flex-1 flex-col gap-3 p-4'>
       <span className='text-slate-200 text-sm'>
           Adicionar nota
        </span>
        {
            shouldShowOnboarding ? 
            <p 
            className='text-sm leading-6 text-slate-400'>
        Comece <button 
        onClick={handleStartRecording}
        type="button" className='text-lime-400 font-medium hover:text-lime-500'>gravando uma nota</button> em áudio ou se preferir <button type="button" className='text-lime-400 font-medium hover:text-lime-500' onClick={()=>handleStartEditor()}>utilize apenas texto.</button>
        </p>
        :
        <textarea autoFocus className="text-sm leading-4 text-slate-400 bg-transparent resize-none flex-1 outline-none" 
        onChange={handleContentChange}
        value={content}
        />
        }
       </div>

       {isRecording ? 
        <button 
        type="button"
        onClick={handleStopRecording}
        className='bg-slate-900 py-4 text-sm text-slate-300 outline-none font-medium group hover:text-slate-1 00 flex items-center justify-center gap-2'>
            <div className="size-3 rounded-full bg-red-500 animate-pulse"/>
            Gravando (clique p/ interromper)
        </button>
       :
       
        <button 
        type="button"
        onClick={handleSaveNote}
        className='bg-lime-400 py-4 text-sm text-lime-950 outline-none font-medium group hover:bg-lime-500'>
            Salvar nota
        </button>
       
       }
        
        </form>
        </Dialog.Content>
    </Dialog.Portal>
        </Dialog.Root>
    )
}