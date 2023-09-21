import Link from 'next/link'

export default function Home() {
  return (
    <div>     
      <div>
        <Link href={"/canvas"}>Canvas</Link>
      </div>
      <div>
        <Link href={"/autoDraw2"}>AutoDraw2</Link>
      </div>
    </div>
  )
}
