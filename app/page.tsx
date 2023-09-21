import Link from 'next/link'

export default function Home() {
  return (
    <div className='flex flex-col justify-center items-center mt-16'>
      <Link href={"/autoDraw3"}><button className='w-32 p-2 rounded-md border border-black m-2 bg-[#a12727] text-white font-bold'>AutoDraw3</button></Link>
      <Link href={"/autoDraw2"}><button className='w-32 p-2 rounded-md border border-black m-2 bg-[#5c74e9] text-white font-bold'>AutoDraw2</button></Link>
      <Link href={"/canvas"}><button className=' w-32 p-2 rounded-md border border-black m-2 bg-[#3cff87] text-white font-bold'>Canvas</button></Link>
      {/* <Link href={"/autoDraw"}><button className='w-32 p-2 rounded-md border border-black m-2 bg-[#5c41e4] text-white font-bold'>AutoDraw</button></Link> */}
    </div>  
  )
}
