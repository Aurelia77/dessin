'use client'

import React from 'react'

// Hokks perso
import useDrawLines2 from '../hooks2/useDrawLines2'

export default function AutoDraw2() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null) // On récupère la référence du canvas (en mettant la souris sur le HTML canvas on voit le type (pour TS)  )
    const [fromPoint, setFromPoint] = React.useState<Point>({ x: 0, y: 0 }) // On mettra à jour le point de départ ensuite dans le useEffect
    const [xMove, setXMove] = React.useState<number>(0)
    const [yMove, setYMove] = React.useState<number>(0)
    const [xIncrease, setXIncrease] = React.useState<boolean>(true)
    const [yIncrease, setYIncrease] = React.useState<boolean>(true)

    // Une fois le canvas créé => On met à jour le point de départ => le centre du canvas 
    React.useEffect(() => {
        setFromPoint({
            x: canvasRef.current?.width ? canvasRef.current?.width / 2 : 0,
            y: canvasRef.current?.height ? canvasRef.current?.height / 2 : 0
        })
    }, [])  // A la fin du montage du composant


    // Fonction qui dessine une ligne à partir d'un contexte (ici va être le canvas), d'un point de départ et d'un point d'arrivée
    function drawLine(
        // 2 façons de passer les paramètres : si on vt utiliser le type Draw (et donc ça change quand on apelle la fonction!)=> utiliser la 1ère (destructuration)
        // **1** On utilise la destructuration pour récupérer les propriétés de l'objet Draw => les paramètres sont donc un seul => un objet avec 3 propriétés
        { ctx, fromPoint, toPoint }: Draw
        // **2** OU :  on met les types un par un
        // ctx: CanvasRenderingContext2D | null | undefined,
        // fromPoint: { x: number, y: number },    // Ou Point
        // toPoint: { x: number, y: number }
    ): void {      // Void car ne retourne rien

        if (ctx) {
            //console.log(fromPoint, toPoint)
            ctx.beginPath()                       // On commence un nouveau chemin
            ctx.lineWidth = 3
            ctx.moveTo(fromPoint.x, fromPoint.y)    // On se place ici
            ctx.lineTo(toPoint.x, toPoint.y)      // On trace une ligne jusqu'ici
            ctx.stroke()                          // On dessine la ligne
        }
    }



    //console.log("xMove", xMove)
    const { start, stop, running } = useDrawLines2(canvasRef, fromPoint, setFromPoint, xMove, yMove, xIncrease, setXIncrease, yIncrease, setYIncrease, drawLine, 1, false, false)
    //console.log("***fromPoint", fromPoint)

    const { start: startCircle, stop: stopCircle, running: runningCircle } = useDrawLines2(canvasRef, fromPoint, setFromPoint, xMove, yMove, xIncrease, setXIncrease, yIncrease, setYIncrease, drawLine, 1, true, false)

    const { start: start5Circle, stop: stop5Circle, running: running5Circle } = useDrawLines2(canvasRef, fromPoint, setFromPoint, xMove, yMove, xIncrease, setXIncrease, yIncrease, setYIncrease, drawLine, 1, true, true)

    const clear = () => {
        if (!canvasRef.current) return

        const ctx = canvasRef.current.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }

    return (
        <div className=' w-screen h-screen bg-[#ccc] flex justify-center items-center '>
            <canvas
                //onMouseDown={onMouseDown} 
                ref={canvasRef}
                width={800} height={500} className='border border-black rounded-md ' />
            <div className=' w-[20%] ml-5 border border-yellow-200 '>
                <div className=' flex justify-between'>
                    {!running ?
                        <button type='button' className='p-2 rounded-md border border-black' onClick={start} >Start Line</button>
                        :
                        <button type='button' className='p-2 rounded-md border border-black' onClick={stop} >Stop</button>
                    }
                </div>
                <div className='border border-cyan m-2'>
                    <label className=' mr-4 p-1' htmlFor="xMove">Interval X : </label>
                    <input className=' w-20 p-1 ' type="number" id="xMove" name="xMove" value={xMove} onChange={(e) => setXMove(parseInt(e.target.value))} step="3" />
                </div>
                {/* <div className='flex m-1'>
                    <label className=' mr-4 p-1' htmlFor="intY">Interval Y : </label>
                    <input className=' w-20 p-1 ' type="number" id="intY" name="intY" value={intY} onChange={(e) => setIntY(parseInt(e.target.value))} />
                </div> */}
                <div className=' flex justify-between'>
                    {!runningCircle ?
                        <button type='button' className='p-2 rounded-md border border-black' onClick={startCircle} >Start Circle</button>
                        :
                        <button type='button' className='p-2 rounded-md border border-black' onClick={stopCircle} >Stop Circle</button>
                    }
                </div>
                <div className=' flex justify-between'>
                    {!running5Circle ?
                        <button type='button' className='p-2 rounded-md border border-black' onClick={start5Circle} >Start 5 Circles</button>
                        :
                        <button type='button' className='p-2 rounded-md border border-black' onClick={stop5Circle} >Stop 5 Circles</button>
                    }
                </div>
                <div>
                    <button type='button' className='p-2 rounded-md border border-black' onClick={clear} >Clear</button>
                </div>
            </div>
        </div>
    )
}
