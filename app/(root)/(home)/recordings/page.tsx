import CallList from '@/components/CallList'
import React from 'react'

const Recordings = () => {
  return (
    <section className='flex size-full flex-col gap-1 text-white'>
    <h1  className='text-3xl font-bold'>Recording</h1>
    <CallList type='recordings'></CallList>
   </section>
  )
}

export default Recordings
