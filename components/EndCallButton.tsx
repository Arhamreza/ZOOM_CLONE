'use client'
import React from 'react'
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
const EndCallButton = () => {
    const call=useCall();
    const router=useRouter();
    const{useLocalParticipant}=useCallStateHooks();
    const LocalParticipant=useLocalParticipant()
    const isMeetingOnwer=LocalParticipant && call?.state.createdBy && LocalParticipant.userId===call.state.createdBy.id
    if(!isMeetingOnwer) return null;
    return (
        <Button onClick={async()=>{
            await call.endCall();
            router.push('/')
        }} className='bg-red-500'>
            End Call for everyone
        </Button>
    )
  return (
    <div>EndCallButton</div>
  )
}

export default EndCallButton