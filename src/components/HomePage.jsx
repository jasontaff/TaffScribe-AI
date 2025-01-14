import React, {useState, useEffect, useRef} from 'react'

export default function HomePage(props) {

  const{setFile, setAudioStream} = props


  const [recordingStatus, setRecordingStatus] = useState('inactive');
  const [audioChunks, setAudioChunks] = useState([]);
  const [duration, setDuration] = useState(0);
  const mediaRecorder = useRef(null)
  const mimeType = 'audio/webm'



  //LOCAL AUDIO FUNCTION to get acces to the user microphone
   async function startRecording(){

    let tempStream
    console.log('start recording');
    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false
                })
      tempStream = streamData;


    } catch (error) {
      console.log(error.message)
   
      return;
    }
    setRecordingStatus('recording')

    //create a new media recorder instance using the stream
    const media = new MediaRecorder(tempStream, {type: mimeType})

    //set instancfe to useREF
    mediaRecorder.current = media
    
    //start recording
    mediaRecorder.current.start();
    let localAudioChunks =[]

    mediaRecorder.current.ondataavailable = (event) =>{
      if(typeof event.data === 'undefined'){
        return
      }
      if( event.data.size === 0){
        return
      }
      localAudioChunks.push(event.data)
    }

    setAudioChunks(localAudioChunks)
  }

  //once stopped, create a audioblob from the audiochunks
    async function stopRecording() {
        setDuration(0)
        setRecordingStatus('inactive')
        console.log('Stop recording')

        mediaRecorder.current.stop()
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType })
            setAudioStream(audioBlob)
            setAudioChunks([])
        
        }
    }



    useEffect(() => {
        if (recordingStatus === 'inactive') { return }

        const interval = setInterval(() => {
            setDuration(curr => curr + 1)
        }, 1000)

        return () => clearInterval(interval)
    })


  return (
    <main className='flex-1 p-4 flex flex-col gap-3 sm:gap-4 justify-center text-center pb-20'>
      <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl'>Taff<span className='text-blue-400 bold'>Scribe</span>-AI</h1>
      <h3 className="font-medium md:text-lg">Record <span className="text-blue-400"> &rarr;</span> Transcribe<span className="text-blue-400"> &rarr;</span> Translate</h3>
      <button  onClick={recordingStatus ==='recording' ? stopRecording : startRecording}className='specialBtn px-4 py-2 rounded-xl flex items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4 '>
        <p className='text-blue-400'> {recordingStatus === 'inactive' ? 'Record' : 'Stop Recording'}</p>
        <div className='flex items-center gap-2'>

          {duration  !== 0 &&  (<p className='text-sm '>{duration}s</p>)}

          <i className={"fa-solid duration-200 fa-microphone " + (recordingStatus==='recording' ? 'text-rose-300' : "")}></i>
        </div>
      
      </button>
      <p className="text-base">Or <label className="text-blue-400 cursor-pointer hover:text-blue-600 duration-200">upload 
        <input onChange={(e) => {
          const tempfile = e.target.files[0];
          setFile(tempfile);
        }}
        className="hidden" type='file' accept=".mp3, .wave"></input></label> a mp3 file</p>
      <p className='italic text-slate-400'>Free now free forever!</p>
    </main>
  )
}
