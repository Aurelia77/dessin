// https://www.youtube.com/watch?v=yOjJy0L7Rt8 => Tuto : Let's Build the Coolest Drawing App in NextJS 13 and React!

'use client'

import { useDraw } from '../hooks/useDraw'


import ColorPicker from 'react-pick-color';  // pnpm install react-pick-color

import React from 'react'

export default function Draw() {

    const { canvasRef, onMouseDown, clear } = useDraw(drawLine)
    const [color, setColor] = React.useState<string>('#000')

    console.log(clear)

    function drawLine({ prevPoint, currentPoint, ctx }: Draw0) {
        const { x: currX, y: currY } = currentPoint
        const lineColor = color
        const lineWidth = 5

        let startPoint = prevPoint ?? currentPoint
        ctx.beginPath()
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = lineColor
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(currX, currY)
        ctx.stroke()

        // On ajoute un rond pour ne pas faire d'espace si on dessine vite
        ctx.fillStyle = lineColor
        ctx.beginPath()
        ctx.arc(startPoint.x, startPoint.y, 2, 0, Math.PI * 2)
        //ctx.arc(startPoint.x, startPoint.y, lineWidth / 2, 0, Math.PI * 2)
        ctx.fill()
    }

    return (
        <div className=' w-screen h-screen bg-white flex justify-center items-center'>
            <ColorPicker  color={color} onChange={(e) => setColor(e.hex)} />
            <button type='button' className='p-2 rounded-md border border-black' onClick={clear}>
                Clear canvas
            </button>
            <canvas onMouseDown={onMouseDown} ref={canvasRef} width={500} height={500} className='border border-black rounded-md' />
        </div>
    )
}




