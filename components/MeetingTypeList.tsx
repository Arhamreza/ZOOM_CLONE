'use client'
import React from 'react'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { Textarea } from './ui/textarea'
import HomeCard from './HomeCard'
import ReactDatePicker from "react-datepicker"
import { useToast } from './ui/use-toast'
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { Input } from './ui/input'
const MeetingTypeList = () => {
    const router = useRouter();
    const [Meeting, setMeeting] = useState<'isScehduleMeeting'|'isjoiningMeeting'|'isInstantMeeting'| undefined>()
    const {user}=useUser();
    const  client=useStreamVideoClient();
    const [values, setValues] = useState({
        dateTime:new Date(),
        description:'',
        link:''
    })
    const [callDetails, setCallDetails] = useState<Call>()
    const {toast}=useToast()

    const createMeeting=async()=>{
        if(!client || !user) return;
        try {

            if(!values.dateTime){
                toast({title:'Failed to create meeting',})
                return;
            }
            const id=crypto.randomUUID();
            const call=client.call('default',id)
            if(!call) throw new Error('failed to create  call')
        const startsAt= values.dateTime.toISOString() || new Date(Date.now()).toISOString();
    const description=values.description||'Instant meeting'
    await call.getOrCreate({
        data:{
            starts_at:startsAt,
            custom:{
                description
            }


        }
    })
    setCallDetails(call)
    if(!values.description){
        router.push(`/meeting/${call.id}`)
        
    }
    toast({title:'Metting created'})
            } 
    catch (error) {
            console.log(error)
            toast({title:'Failed to create meeting',})
        }
    }
    const meetingLink=`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
  return (
    <section className='grid grid-cols-1  gap-5 md:grid-cols-2 xl:grid-cols-4 '>
       <HomeCard 
       img='icons/add-meeting.svg'
       className="bg-orange-1"
       title="New Meeting"
       description="start an instant meeting"
       handleClick={()=>setMeeting('isInstantMeeting')}
       ></HomeCard>
       <HomeCard
       img='icons/schedule.svg'
       className="bg-blue-1"
       title="Schedule Meeting"
       description="Plan your meeting"
       handleClick={()=>setMeeting('isScehduleMeeting')}
       ></HomeCard>
       <HomeCard
       img='icons/recordings.svg'
       className="bg-purple-1"
       title="view Recording"
       description="check your recording"
       handleClick={()=>router.push('/recordings')}
       ></HomeCard>
       <HomeCard
       img='icons/join-meeting.svg'
       title="via invitation link"
       className="bg-yellow-1"
       description="start an instant meeting"
       handleClick={()=>setMeeting('isjoiningMeeting')}
       ></HomeCard>
       {!callDetails?(
         <MeetingModal isOpen={Meeting==='isScehduleMeeting'}
         onClose={()=>setMeeting(undefined)}
         title='create Meeting'
         handleClick={createMeeting}
         >  <div  className='flex flex-col gap-2.5'>
            <label className='text-base text-normal leading-[22px] text-sky-2'>
                <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'  onChange={(e)=>{
                    setValues({...values,description:e.target.value})
                }}>

                </Textarea>
            </label>

            </div>  
            <div className='flex w-full flex-col gap-2.5'>
                <label className='text-base text-normal leading-[22px] text-sky-2'>
                    Select Date and Time
                </label> 
                <ReactDatePicker 
                selected={values.dateTime}
                onChange={(date)=>setValues({...values,dateTime:date!})}
                showTimeSelect
                timeFormat='HH:mm;'
                timeIntervals={15}
                timeCaption='time'
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                >
                </ReactDatePicker>

            </div>
            </MeetingModal>
       ):(
        <MeetingModal isOpen={Meeting==='isScehduleMeeting'}
       onClose={()=>setMeeting(undefined)}
       title='start an instant meeting'
       className='text-center'
       handleClick={()=>{
        
       }}
       image="/icons/checked.svg"
       buttonIcon="/icons/copy.svg"
       buttonText="Copy Meeting Link"
       />

       )}
       <MeetingModal isOpen={Meeting==='isInstantMeeting'}
       onClose={()=>setMeeting(undefined)}
       title='start an instant meeting'
       className='text-center'
       buttonText="Start Meeting"
       handleClick={createMeeting}
       ></MeetingModal>

<MeetingModal
        isOpen={Meeting === 'isjoiningMeeting'}
        onClose={() => setMeeting(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeList