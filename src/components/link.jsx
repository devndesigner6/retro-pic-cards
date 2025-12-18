import React from 'react'
import { SiGithub } from "react-icons/si";


function Link() {
  return (
    <div className='absolute z-10 top-4 md:top-8 right-4 md:right-6 flex'>
      <a href="https://github.com/devndesigner6/retro-pic-cards" aria-label="GitHub" className='inline-flex items-center justify-center rounded-full bg-white/90 border border-[rgba(0,0,0,0.08)] shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 size-9'>
        <SiGithub className='size-5 text-black' />
      </a>
    </div>
  )
}

export default Link
