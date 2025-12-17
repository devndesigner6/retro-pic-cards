import React from 'react'
import { SiGithub } from "react-icons/si";


function Link() {
  return (
    <div className='absolute z-10 top-4 md:top-13 right-4 md:right-8  flex rounded-lg justify-center items-center gap-3 '> 

        <button>
             <a href="https://github.com/devndesigner6/retro-pic-cards">
                <div className='border-2 rounded-lg p-1 bg-white hover:bg-neutral-200/80 transition-all duration-100 active:scale-97'>
                <SiGithub className='size-5 md:size-7'/>
                </div>
            </a>
        </button>

        
    </div>
  )
}

export default Link
