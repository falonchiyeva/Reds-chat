import React, { useState } from 'react'
import Room from './components/Room'

export default function App(){
  const [roomId, setRoomId] = useState('')
  const [joined, setJoined] = useState(false)

  return (
    <div className="container">
      <h1>Video Interview — Demo</h1>
      {!joined ? (
        <>
          <p>Xona nomini kiriting (masalan <code>testroom</code>) va &quot;Join Room&quot; bosing.</p>
          <div className="controls">
            <input placeholder="Room ID" value={roomId} onChange={e=>setRoomId(e.target.value)} />
            <button onClick={()=>{ if(roomId.trim()) setJoined(true) }}>Join Room</button>
          </div>
        </>
      ) : (
        <Room roomId={roomId} />
      )}
      <hr />
      <p style={{fontSize:12,color:'#555'}}>Eslatma: bu demo ta'limiy maqsadlar uchun. Ko'p ishtirokchili seanslar uchun SFU/Media server talab etiladi.</p>
    </div>
  )
}
