import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const SIGNALING_SERVER_URL = import.meta.env.VITE_SIGNALING_URL || 'http://localhost:4000';
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

export default function Room({ roomId }){
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const [status, setStatus] = useState('connecting');

  useEffect(()=>{
    let mounted = true;
    async function init(){
      try{
        // get media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = stream;

        // socket
        const socket = io(SIGNALING_SERVER_URL);
        socketRef.current = socket;

        socket.on('connect', ()=> {
          console.log('connected to signaling server', socket.id);
          socket.emit('join-room', { roomId, userId: socket.id });
          setStatus('joined signaling');
        });

        // create RTCPeerConnection
        const pc = new RTCPeerConnection(configuration);
        pcRef.current = pc;

        // add local tracks
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        // handle remote track
        pc.ontrack = (event) => {
          // attach first stream
          if(remoteVideoRef.current && !remoteVideoRef.current.srcObject){
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // ICE candidate => send to other
        pc.onicecandidate = (event) => {
          if(event.candidate){
            socket.emit('ice-candidate', { toSocketId: otherSocketIdRef.current, candidate: event.candidate });
          }
        };

        // store other peer socket id when they join
        const otherSocketIdRef = { current: null };
        // events
        socket.on('user-joined', ({ userId, socketId }) => {
          console.log('user-joined', userId, socketId);
          otherSocketIdRef.current = socketId;
          // create offer
          createOffer(socketId);
        });

        socket.on('offer', async ({ sdp, fromSocketId }) => {
          console.log('received offer');
          otherSocketIdRef.current = fromSocketId;
          await pc.setRemoteDescription(sdp);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('answer', { toSocketId: fromSocketId, sdp: pc.localDescription });
        });

        socket.on('answer', async ({ sdp, fromSocketId }) => {
          console.log('received answer');
          await pc.setRemoteDescription(sdp);
        });

        socket.on('ice-candidate', async ({ candidate, fromSocketId }) => {
          try{
            await pc.addIceCandidate(candidate);
          }catch(e){ console.warn('addIceCandidate error', e) }
        });

        async function createOffer(toSocketId){
          try{
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('offer', { toSocketId, sdp: pc.localDescription, fromUserId: socket.id });
          }catch(e){ console.error(e) }
        }

        setStatus('ready');
      }catch(err){
        console.error(err);
        setStatus('error: ' + (err.message || err));
      }
    }
    init();

    return ()=>{ mounted=false;
      if(socketRef.current) socketRef.current.disconnect();
      if(pcRef.current) pcRef.current.close();
    }
  }, [roomId]);

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <p>Status: {status}</p>
      <div className="row">
        <div>
          <p>Local</p>
          <video ref={localVideoRef} autoPlay playsInline muted></video>
        </div>
        <div>
          <p>Remote</p>
          <video ref={remoteVideoRef} autoPlay playsInline></video>
        </div>
      </div>
    </div>
  )
}
