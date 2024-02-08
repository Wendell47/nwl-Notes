import { ChangeEvent, useState } from 'react'
import NewNoteCard from './components/new-note-card'
import NoteCard from './components/note-card'
import logo from './assets/logo.svg'
interface Note{
  id: string
  date: Date
  content: string
}
export function App() {
  const[search, setSearch]= useState('')
  const[notes,setNotes]= useState<Note[]>(()=>{
    const notesOnStorage= localStorage.getItem('notes')

    if(notesOnStorage){
      return JSON.parse(notesOnStorage)
    }
    
    return []
  })

  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value
    setSearch(query)

  }

  const filteredNotes = search !== '' ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) : notes


   function onNoteCreated(content: string) {
    const newNote = {
      id:crypto.randomUUID(),
      date: new Date(),
      content,
    }
    const notesArray = [newNote,...notes]
    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
   }

   function onNoteDelete(id: string){
    const notesArray = notes.filter(note => {
      return note.id !== id
    })
    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))

   }

  return (
    <>
     <div className=' mx-auto max-w-6xl px-6 pt-12 space-y-6 flex flex-col h-screen'>
      <img src={logo} className='w-40'/>
      <form className='w-full '>
        <input 
        className="bg-transparent w-full font-semibold text-3xl outline-none placeholder:text-slate-500 text-slate-200
        webkit-ap
        " 
        placeholder="Busque em suas notas..." 
        type="search" 
        onChange={handleSearch}
        />
      </form>
      <div className='h-px bg-slate-700'></div>
      <div className='flex flex-wrap grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] overflow-auto 
       scroll-mb-20
      '>
     <NewNoteCard onNoteCreated={onNoteCreated}/>
     
     {
      filteredNotes.map(notes => {
        return <NoteCard key={notes.id} note={notes} onNoteDelete={onNoteDelete} />
      })
     }
    
      </div>
     </div>
    </>
  )
}


