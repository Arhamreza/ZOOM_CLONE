import CallList from '@/components/CallList'
import React from 'react'

const upcoming = () => {
  return (
    <section className='flex size-full flex-col gap-1 text-white'>
    <h1  className='text-3xl font-bold'>upcoming</h1>
    <CallList  type="upcoming"></CallList>
   </section>
  )
}

export default upcoming