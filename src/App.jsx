import { useState, useRef, useEffect } from 'react'
import HomePage from './components/HomePage'
import Header from './components/Header'
import FileDisplay from './components/FileDisplay'
import Information from './components/Information'
import Transcribing from './components/Transcribing'

function App() {
  const [file, setFile] = useState(null) //file upload
  const [audioStream, setAudioStream] = useState(null) //live recording
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const isAudioAvailable = file || audioStream

  function handleAudioReset(){
    setFile(null);
    setAudioStream(null)
  }

  const worker = useRef(null);

  //WEB WORKER TO CALL TRANSLATION AND NOT EFFECT CURRENT APP PAGE PERFORMANCE
  useEffect(() => {
    if(!worker.current) {
      worker.current = new Worker( new URL('./utils/whisper.work.js', import.meta.url), {
        type: 'module'
      });
    }

    const onMessageReceived = async (e) => {
      switch(e.data.type){
        case('DOWNLAODING'):
          setDownloading(true)
          console.log("downloading")
          break;
        case('LOADING'): 
          setLoading(true)
          console.log("LOADING")
          break;
        case('RESULT'):
          console.log("RESULT")
          setOutput(e.data.results)//info passsout of data
          break;
        case('INFERENCE_DONE'):
          setFinished(true)
          console.log("INFERENCE_DONE")
          break;

        }
    }

    worker.current.addEventListener('message', onMessageReceived)

    return() =>{
      worker.current.removeEventLister('message', onMessageReceived)
    }

  }, [])

  async function readAuidoFrom(file) {

    const sampling_rate = 16000
    
  }
 

  return (
   <div className="flex flex-col  max-w-[1000px] mx-auto w-full">
    <section className="min-h-screen flex flex-col">
      <Header />
      {output ? <Information/>  :  
      loading ? <Transcribing/> : 
      isAudioAvailable ?(<FileDisplay handleAudioReset={handleAudioReset} file={file} audioStream={setAudioStream}  />) :
      (<HomePage setFile={setFile} setAudioStream={setAudioStream}/>) }
    </section>

    <footer>

    </footer>
   </div>
  )
}

export default App
