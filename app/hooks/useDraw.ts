
import React from "react"

export const useDraw = (onDraw: ({ ctx, currentPoint, prevPoint }: Draw0) => void) => {
  const [mouseDown, setMouseDown] = React.useState(false)

  const canvasRef = React.useRef<HTMLCanvasElement>(null)    // en mettant la souris sur le HTML canvas on voit le type (pour TS)    
  const prevPoint = React.useRef<null | Point0>(null)    // On garde en mémoire le point précédent

  const onMouseDown = () => setMouseDown(true)

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {    // Pour connaitre le type (TS) ajouter e => voir ci-dessous après le event listener (puis l'enlever)
      console.log("Ecran : ", { x: e.clientX, y: e.clientY })    // Coordonnées de la souris sur l'écran

      if (!mouseDown) return

      const currentPoint = computePointInCanvas(e)    // Coordonnées de la souris sur le canvas

      const ctx = canvasRef.current?.getContext("2d")   // On récupère le contexte du canvas

      // Si pas de contexte ou pas de point courant, on sort
      if (!ctx || !currentPoint) return

      // On dessine
      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current })
      prevPoint.current = currentPoint
    }

    // On veut connaitre les coordonnées de la souris sur le canvas
    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()   // On récupère les coordonnées du canvas
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      console.log("Canvas : ", { x, y })

      return { x, y }
    }

    
    // Pour arrêter le dessin quand on relache la souris
    const mouseUpHandler = () => {
      setMouseDown(false)
      prevPoint.current = null
    }

    // Add event listener
    canvasRef.current?.addEventListener("mousemove", handler)
    //canvasRef.current?.addEventListener("mousemove", e =>  handler)  // => Pour connaitre le type (TS)    
    window.addEventListener('mouseup', mouseUpHandler)   // pour arrêter le dessin quand on relache la souris

    // Remove events listeners on cleanup
    return () => {
      canvasRef.current?.removeEventListener('mousemove', handler)
      window.removeEventListener('mouseup', mouseUpHandler)
    }

  }, [onDraw])

  return { canvasRef, onMouseDown, clear }
}


