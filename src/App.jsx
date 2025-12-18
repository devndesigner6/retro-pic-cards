
import { useRef, useState, useMemo } from 'react'
import './App.css'
import { toPng } from 'html-to-image'

import { MdOutlineFileDownload } from "react-icons/md";
import { TbUpload } from "react-icons/tb";
import { RiResetLeftLine } from "react-icons/ri";

import Bgcolor from './components/bgcolor';
import Filter from './components/filter';

import { Analytics } from "@vercel/analytics/react"
import Bold from './components/bold';
import Link from './components/link';
import FontStyle from './components/fontstyle';



function App() {

  // all useRefs
  const dateRef = useRef()
  const titleRef = useRef()
  const imgBoxRef = useRef();

// all usestates
  const [image, setImage] = useState(null)
  const [title, setTitle] = useState('')
  const [date, setdate] = useState()

  const [filter, setFilter] = useState("");

  const [activeTab, setActiveTab] = useState('text');



  
  const [color, setColor] = useState("#ff0000")

  const [textColor, setTextColor] = useState("")
  const [font, setFont] = useState("sans-serif")


  
  // for darker color genaration of border for custom color
  function darkenColor(hex, percent) {
  let r = parseInt(hex.substring(1,3), 16);
  let g = parseInt(hex.substring(3,5), 16);
  let b = parseInt(hex.substring(5,7), 16);

  r = Math.floor(r * (1 - percent));
  g = Math.floor(g * (1 - percent));
  b = Math.floor(b * (1 - percent));

  return `rgb(${r}, ${g}, ${b})`;
}





// for image upload
  function handleUpload(e){
    e.preventDefault()
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result)
    };
    reader.readAsDataURL(file);
  }


// for reset
  function handleReset(e){
    e.preventDefault()
    setImage(null)
    setTitle('')
    setdate()
    
  

    dateRef.current.value = ''
    titleRef.current.value = ''


 
  }



  // for image download
 const [isDownloading, setIsDownloading] = useState(false);

 const handleDownload = async () => {
  if (!imgBoxRef.current || isDownloading) return;
  setIsDownloading(true);
  try {
    const dataUrl = await toPng(imgBoxRef.current, { cacheBust: true, pixelRatio: 4 });
    const link = document.createElement("a");
    link.download = "card.png";
    link.href = dataUrl;
    link.click();

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1500);
  } catch (e) {
    console.error('Download failed', e);
  } finally {
    setIsDownloading(false);
  }
};


  const cardMotionClass = image ? '' : 'sheen float-soft';
  const resolvedTextColor = textColor || 'var(--text)';
  const confettiPieces = useMemo(() => Array.from({ length: 40 }), []);
  const [showConfetti, setShowConfetti] = useState(false);




  return (
    <>
    <Analytics/>
      <div className='flex selection:text-white selection:bg-black flex-col md:flex-row '>

        {/* Mobile controls (tabbed) */}
        <div className='mobile-controls-panel md:hidden flex flex-col items-center pt-0 pb-6 gap-3 order-2 text-[var(--text)] bg-[var(--surface)] shadow-lg border border-[rgba(0,0,0,0.05)]'>

          <div className='flex w-full justify-center gap-1.5 px-2 sticky top-0 z-30 bg-[var(--surface-2)] pb-3 pt-3 border-b-[var(--border)]'>
            {[
              { key: 'text', label: 'Text' },
              { key: 'color', label: 'Colors' },
              { key: 'filters', label: 'Filters' },
              { key: 'date', label: 'Date' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${activeTab === tab.key ? 'bg-[var(--accent)] text-black' : 'bg-[rgba(0,0,0,0.05)] text-[var(--muted)] hover:bg-[rgba(0,0,0,0.08)]'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className='w-full px-4 pb-4 flex justify-center'>
            <div className='w-full max-w-sm'>
            {activeTab === 'text' && (
              <div className='flex flex-col gap-5 animate-fade-in'>
                <div className='flex flex-col gap-2'>
                  <h1 className='text-xl tracking-tight text-[var(--text)]' style={{fontFamily: "'Instrument Serif', serif", fontWeight: 600}}>Title</h1>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    className='border-2 border-[rgba(255,255,255,0.18)] rounded-lg p-3 w-full text-base font-medium focus:border-[var(--accent)] focus:outline-none transition-colors bg-[rgba(255,255,255,0.06)] text-[var(--text)] placeholder:text-[rgba(255,255,255,0.72)]'
                    placeholder="What’s on your mind?"
                    maxLength={50}
                    ref={titleRef}
                  />
                </div>

                <Bold value={textColor} onChange={setTextColor} />

                <div>
                  <h1 className='text-xl mb-2 tracking-tight text-[var(--text)]' style={{fontFamily: "'Instrument Serif', serif", fontWeight: 600}}>Font Style</h1>
                  <FontStyle selectedFont={font} onFontChange={setFont} />
                </div>
              </div>
            )}

            {activeTab === 'color' && (
              <div className='animate-fade-in'>
              <Bgcolor value={color} onChange={setColor} />
              </div>
            )}

            {activeTab === 'filters' && (
              <div className='animate-fade-in'>
              <Filter onFilterChange={setFilter} />
              </div>
            )}

            {activeTab === 'date' && (
              <div className='flex flex-col gap-3 animate-fade-in'>
                <h1 className='text-xl tracking-tight text-[var(--text)]' style={{fontFamily: "'Instrument Serif', serif", fontWeight: 600}}>Date</h1>
                <input
                  onClick={() => dateRef.current?.showPicker()}
                  onChange={(e) => {
                    const value = e.target.value;
                    const [y, m, d] = value.split("-");
                    const formatted = `${d}.${m}.${y}`;
                    setdate(formatted);
                  }}
                  type="date"
                  onFocus={(e) => e.target.blur()}
                  className='border-2 border-[rgba(255,255,255,0.18)] rounded-lg p-3 w-full text-base font-medium focus:border-[var(--accent)] focus:outline-none transition-colors bg-[rgba(255,255,255,0.06)] text-[var(--text)] placeholder:text-[rgba(255,255,255,0.72)]'
                  ref={dateRef}
                />
              </div>
            )}
            </div>
          </div>

        </div>

        {/* Desktop controls */}
        <div className='hidden md:flex h-auto md:h-screen w-auto md:w-100 flex-col items-center pt-12 pb-12 gap-8 order-2 md:order-1 md:overflow-y-auto no-scrollbar text-[var(--text)] bg-[var(--surface)] shadow-[0_12px_32px_rgba(0,0,0,0.25)] border-r border-[rgba(0,0,0,0.08)]'>

          <div className='flex flex-col gap-3 w-full px-6'>
            <h1 className='text-2xl tracking-tight text-[var(--text)] font-semibold' style={{fontFamily: "'Instrument Serif', serif"}}>Title</h1>
            <form action="" className='w-full'>

              <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)} 
              type="text" 
              className='modern-input border-2 border-[rgba(110,220,111,0.2)] rounded-xl p-3.5 w-full text-base font-medium bg-[var(--surface-2)] text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 focus:outline-none transition-all duration-300 hover:border-[rgba(110,220,111,0.3)]' 
              placeholder="What’s on your mind?"
              maxLength={50}
              ref={titleRef} />
            </form>
          </div>

          <div className='w-full px-6'>
            <Bold  value={textColor} onChange={setTextColor}  />
          </div>

          <div className='w-full px-6'>
            <h1 className='text-2xl mb-3 tracking-tight text-[var(--text)] font-semibold' style={{fontFamily: "'Instrument Serif', serif"}}>Font Style</h1>
            <FontStyle selectedFont={font} onFontChange={setFont} />
          </div>


          <div className='flex flex-col gap-3 w-full px-6'>
            <h1 className='text-2xl tracking-tight text-[var(--text)] font-semibold' style={{fontFamily: "'Instrument Serif', serif"}}>Date</h1>
            <form action=""  onClick={() => dateRef.current.showPicker()} className='w-full'>

              <input 
              onChange={(e) => {
                const value = e.target.value;
                const [y, m, d] = value.split("-");
                const formatted = `${d}.${m}.${y}`; 
                setdate(formatted);
              }} 
              type="date" 
              onFocus={(e) => e.target.blur()}
              className='modern-input border-2 border-[rgba(110,220,111,0.2)] rounded-xl p-3.5 w-full text-base font-medium bg-[var(--surface-2)] text-[var(--text)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 focus:outline-none transition-all duration-300 hover:border-[rgba(110,220,111,0.3)]'
              ref={dateRef}
            />
            </form>
          </div>

          <div className='w-full px-6'>
            <Bgcolor  value={color} onChange={setColor} />
          </div>

          <div className='w-full px-6'>
            <Filter  onFilterChange={setFilter}/>
          </div>

        </div>

        <div className='mobile-preview aurora-bg md:sticky h-auto md:h-screen w-auto flex-1 flex flex-col justify-center items-center md:-mt-7 selection:text-white selection:bg-black  pt-4 pb-4 md:pb-0  order-1 md:order-2
        bg-[radial-gradient(circle,_rgba(255,255,255,0.08)_1px,_transparent_1px)]
        bg-[size:10px_10px]
        '>


            <Link />


            <div ref={imgBoxRef} className='inline-block mobile-preview-card'>

              <div className={`mobile-card glass glass-card ${cardMotionClass} w-[260px] md:w-[320px] h-[320px] md:h-[400px] bg-white m-2 md:m-6 mb-4 md:mb-10 rounded-lg border border-[rgba(0,0,0,0.08)] flex flex-col  hover:rotate-5 transition-all duration-400 px-4 md:px-5 pt-4 md:pt-5 pb-3 md:pb-4 overflow-hidden flex-wrap relative



              yellow:bg-yellow-200 yellow:border-yellow-400
              
              sky:bg-sky-100 sky:border-sky-300
              
              green:bg-green-200 green:border-green-500
              
              pink:bg-rose-200 pink:border-rose-300
              
              red:bg-red-200 red:border-red-400
              
              indigo:bg-indigo-200 indigo:border-indigo-400
              
              neutral:bg-neutral-200 neutral:border-neutral-400
              
              purple:bg-purple-200 purple:border-purple-400
              
              teal:bg-teal-200 teal:border-teal-500
              
              orange:bg-orange-200 orange:border-orange-400
              
              
              custom:bg-[var(--customColor)] custom:border-[var(--customBorder)]
              `}
              style={{
                "--customColor": color,
                "--customBorder": darkenColor(color, 0.35), // 35% darker of stored color
              }}
              >

                
                <div className=' relative w-full aspect-square rounded-sm  overflow-hidden '>
                  {image ?
                    (<img src={image} className='w-full h-full  rounded-xm object-cover 
                         
                       retro:filter 
                       retro:sepia-[100%]
                        retro:brightness-90 
                        retro:contrast-125
                         retro:saturate-170 
                         retro:hue-rotate-10
                       


                       sunny:filter 
                       sunny:brightness-100 
                       sunny:saturate-150 
                       sunny:contrast-100
                       


                       bw:filter 
                       bw:brightness-110 
                       bw:saturate-0 
                       bw:contrast-110 


                        tealOrange:filter 
                        tealOrange:brightness-100 
                        tealOrange:contrast-125 
                        tealOrange:saturate-125 
                        tealOrange:hue-rotate-[20deg]
  
                        
                        bright:brightness-[1.12] 
                        bright:contrast-[1.0]
                        bright:saturate-[1.45]
                        bright:sepia-[0.5]
                        bright:hue-rotate-[15deg] 


                        
                        

                      ' />) : null
                      
                  }

                    
                          
                     { filter === "cinematic" && 
                    (
                      <div>
                       <div className="absolute inset-0 bg-teal-300/30 mix-blend-color"></div>
                      <div className="absolute inset-0 bg-orange-500/20 mix-blend-soft-light backdrop-brightness-110 backdrop-contrast-125"></div>

                     
                      </div>
                    )
                  }
                  

                          

                  { filter === "sunlight" && 
                    (
                      <div>
                        <div className="absolute inset-0 bg-orange-400/40 mix-blend-soft-light"></div>
                        <div className="absolute inset-0 bg-yellow-200/20 mix-blend-screen"></div>
                      </div>
                    )
                  }




                  { filter === "tealOrange" && 
                    (
                      <div>
                        <div className='bg-green-500 absolute inset-0 mix-blend-soft-light'></div>
                        <div className='bg-red-400 absolute inset-0 mix-blend-soft-light'></div>
                      </div>
                    )
                  }
                    
                </div>

                <div className=' flex  flex-wrap '>

                  <h1 className='mt-1 md:mt-2 text-lg break-all text-contrast text-[var(--text)]

                  boldtext:font-bold
                  italicText:italic
                  underlinetext:underline
                  strike:line-through

                  customText:text-[var(--customTextColor)] '

                  style={{
                    "--customTextColor": textColor,
                    fontFamily: font,
                    color: resolvedTextColor
                  }}
                  
                  >{title}</h1>
                </div>


                <div className='  w-full h-8 md:h-11 flex justify-end items-end'>
                  <p className='absolute bottom-4 right-5 mt-0 md:mt-2  text-sm text-[var(--muted)] font-mono '>{date}</p>
                </div>
              </div>

            </div>

            
          <form action="" className='flex flex-row justify-center items-center gap-4 mb-4 mobile-actions'>

            <input id='file' onChange={ handleUpload} accept="image/*" type="file" className='border-2 cursor-pointer rounded-md p-2 hidden'/>


              
              <button type="button"  onClick={handleReset}  className='glass-button border-2 py-2 w-35 flex justify-center items-center rounded-full text-black font-semibold text-base cursor-pointer bg-white/80 hover:bg-white transition-all duration-300 active:scale-95' style={{fontFamily: "'Instrument Serif', serif"}}>
                <RiResetLeftLine className='mr-2 '/>
                Reset</button>

              <label htmlFor='file' className='glass-button bg-black/90 py-2.5 w-35 flex justify-center items-center  rounded-full text-base text-white cursor-pointer hover:bg-black transition-all duration-300 active:scale-95' style={{fontFamily: "'Instrument Serif', serif"}}>
                <TbUpload className='mr-2'/>
                Upload</label>
          </form>
            
            <div>
                { image ? 
                  (<button type="button"  onClick={handleDownload} disabled={isDownloading} className='glass-button bg-black/90 py-2.5 w-74 flex justify-center items-center  rounded-full text-base text-white   cursor-pointer hover:bg-black transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed' style={{fontFamily: "'Instrument Serif', serif"}}>
                    <MdOutlineFileDownload className='mr-2 size-6'/>
                    {isDownloading ? 'Downloading...' : 'Download'}</button>) : null
                
                 }
              
            </div>
            {showConfetti && (
              <div className='confetti-overlay'>
                {confettiPieces.map((_, idx) => (
                  <div
                    key={idx}
                    className='confetti-piece'
                    style={{
                      left: `${Math.random() * 100}%`,
                      background: idx % 3 === 0 ? '#6edc6f' : idx % 3 === 1 ? '#2f6b3a' : '#f7f3e8',
                      animationDelay: `${Math.random() * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            )}
        </div>
      </div>
    </>
  )
}

export default App
