'use client'

import React from 'react'

// Hooks perso
import useDrawLines3 from '@/app/hooks3/useDrawLines3'


import ColorPicker from 'react-pick-color';  // pnpm install react-pick-color

export default function AutoDraw3() {
    const canvasContainer = React.useRef<HTMLDivElement>(null) // On récupère la référence du canvas (en mettant la souris sur le HTML canvas on voit le type (pour TS)  )
    const canvasRef = React.useRef<HTMLCanvasElement>(null) // On récupère la référence du canvas (en mettant la souris sur le HTML canvas on voit le type (pour TS)  )
    const [lineColor, setLineColor] = React.useState<string>('#000')
    const [circlesColor, setCirclesColor] = React.useState<string>('cyan')
    const [lineWidth, setLineWidth] = React.useState<number>(3)
    const [circlesWidth, setCirclesWidth] = React.useState<number>(5)
    const [fromPoint, setFromPoint] = React.useState<Point>({ x: 0, y: 0 }) // On mettra à jour le point de départ ensuite dans le useEffect
    const [xMove, setXMove] = React.useState<number>(3)
    const [yMove, setYMove] = React.useState<number>(0)
    const [xIncrease, setXIncrease] = React.useState<boolean>(true)
    const [yIncrease, setYIncrease] = React.useState<boolean>(true)


    // Une fois le canvas créé => On met à jour le point de départ => le centre du canvas 
    React.useEffect(() => {
        //console.log(canvasContainer.current?.clientWidth)
        if (canvasRef.current !== null){ 
            if (canvasContainer.current?.clientWidth) canvasRef.current.width = canvasContainer.current?.clientWidth * 0.97
            if (canvasContainer.current?.clientHeight) canvasRef.current.height = canvasContainer.current?.clientHeight * 0.97
        }        

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

            ctx.lineWidth = lineWidth
            ctx.strokeStyle = lineColor

            ctx.moveTo(fromPoint.x, fromPoint.y)    // On se place ici
            ctx.lineTo(toPoint.x, toPoint.y)      // On trace une ligne jusqu'ici
            ctx.stroke()                          // On dessine la ligne

             // On ajoute un rond pour ne pas faire d'espace si on dessine vite
            ctx.fillStyle = circlesColor
            ctx.beginPath()
            ctx.arc(fromPoint.x, fromPoint.y, circlesWidth/2, 0, Math.PI * 2)
            //ctx.arc(startPoint.x, startPoint.y, lineWidth / 2, 0, Math.PI * 2)
            ctx.fill()
        }
    }

    //console.log("xMove", xMove)
    const { start, stop, running } = useDrawLines3(canvasRef, fromPoint, setFromPoint, xMove, yMove, xIncrease, setXIncrease, yIncrease, setYIncrease, drawLine, 1)
    //console.log("***fromPoint", fromPoint)

    // const { start: startCircle, stop: stopCircle, running: runningCircle } = useDrawLines3(canvasRef, fromPoint, setFromPoint, xMove, yMove, xIncrease, setXIncrease, yIncrease, setYIncrease, drawLine, 1, true, false)

    // const { start: start5Circle, stop: stop5Circle, running: running5Circle } = useDrawLines3(canvasRef, fromPoint, setFromPoint, xMove, yMove, xIncrease, setXIncrease, yIncrease, setYIncrease, drawLine, 1, true, true)

    const clear = () => {
        if (!canvasRef.current) return

        const ctx = canvasRef.current.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }

    return (
        <div className=' w-full h-full bg-[#ccc] flex justify-around flex-wrap-reverse text-black'>
            <div ref={canvasContainer} className=' 
                h-[60vh] sm:h-screen
                flex-grow m-auto' 
            >
                <canvas
                    //onMouseDown={onMouseDown} 
                    ref={canvasRef} className='border border-black rounded-md m-auto' />                
            </div>
            <div className='w-[592px]'>
                <div className=' flex my-1 sm:my-10 flex-wrap m-1 gap-2'>
                    <label className='m-auto font-bold'>
                        Couleur de ligne :
                        <ColorPicker
                            color={lineColor}
                            onChange={(e) => setLineColor(e.hex)}
                        />
                    </label>
                    <label className=' m-auto font-bold'>
                        Couleur des cercles :
                        <ColorPicker
                            color={circlesColor}
                            onChange={(e) => setCirclesColor(e.hex)}
                        />
                    </label>
                </div>
                <div className=' m-2 sm:m-5 p-2 border border-[#4ce279] rounded-md '>
                    <div className=' flex justify-between mb-2'>
                        {!running ?
                            <button type='button' className='p-2 rounded-md border border-black bg-green-600 text-white font-bold w-full text-lg ' onClick={start} >LANCER !</button>
                            :
                            <button type='button' className='p-2 rounded-md border border-black bg-red-700 text-white font-bold w-full text-lg ' onClick={stop} >STOP !</button>
                        }
                    </div>
                    <div className='my-2 flex items-center '>
                        <label className=' mr-4 p-1 font-bold' htmlFor="lineWidth">
                            Epaisseur de la ligne
                            <input className=' w-12 pl-1 mx-2 ' type="number" id="lineWidth" name="lineWidth" value={lineWidth} onChange={(e) => setLineWidth(parseInt(e.target.value))}/>
                        </label>
                        <div className=' w-[50%] ' 
                        style={{backgroundColor:lineColor, height:`${lineWidth}px`}} 
                        ></div>
                    </div>
                    <div className='flex justify-between gap-3'>
                        <div className='my-2 flex items-center justify-between flex-wrap gap-2'>
                            <label className=' p-1 font-bold' htmlFor="circlesWidth">
                                Epaisseur des cercles
                                <input className=' w-12 pl-1 mx-2' type="number" id="circlesWidth" name="circlesWidth" value={circlesWidth} onChange={(e) => setCirclesWidth(parseInt(e.target.value))} />
                            </label>
                            <div 
                                className={`rounded-full border border-black`}
                                style={{
                                    backgroundColor:circlesColor, 
                                    width:`${circlesWidth}px`, 
                                    height:`${circlesWidth}px`, 
                                    //borderRadius:`${circlesWidth/2}px`
                                }} 
                            >
                            </div>
                        </div>
                        <div className='my-2'>
                            <label className='mr-4 p-1 font-bold' htmlFor="xMove">
                                Direction (abscisse X)
                                <input className='w-12 pl-1 mx-2 ' type="number" id="xMove" name="xMove" value={xMove} onChange={(e) => setXMove(parseInt(e.target.value))} />
                            </label>
                        </div>
                    </div>
                    {/* <div className='flex m-1'>
                        <label className=' mr-4 p-1' htmlFor="intY">Interval Y : </label>
                        <input className=' w-20 p-1 ' type="number" id="intY" name="intY" value={intY} onChange={(e) => setIntY(parseInt(e.target.value))} />
                    </div> */}
                    {/* <div className=' flex justify-between'>
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
                    </div> */}
                    <div>
                        <button type='button' className='p-2 rounded-md border border-black bg-yellow-400 w-[50%] mt-1 sm:mt-5' onClick={clear}>Effacer</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
