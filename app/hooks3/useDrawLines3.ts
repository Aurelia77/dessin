import React from "react"

// Fonction (hook perso car utilise des hooks) qui dessine plusieurs lignes à partir d'un canvas, d'un point de départ, de la fonction drawLine et un chiffre (vitesse) 
export default function useDrawLines3(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    fromPoint: Point,
    setFromPoint: React.Dispatch<React.SetStateAction<Point>>,
    xMove: number,
    yMove: number,
    xIncrease: boolean,
    setXIncrease: React.Dispatch<React.SetStateAction<boolean>>,
    yIncrease: boolean,
    setYIncrease: React.Dispatch<React.SetStateAction<boolean>>,
    drawLine: (
        // **1**Les param de drawLine sont en fait un seul param : un objet avec 3 propriétés 
        { ctx, fromPoint, toPoint }: Draw
        // **2**Les param de drawLine sont 3 paramètres
        // ctx: CanvasRenderingContext2D | null | undefined,
        // fromPoint: { x: number, y: number },    // Ou Point
        // toPoint: { x: number, y: number }
    ) => void,
    speed: number,
) {

    //console.log("FROMPOINT", fromPoint)

    const ctx = canvasRef.current?.getContext('2d') // On récupère le contexte du canvas   
    const canvasWidth = canvasRef.current?.width
    const canvasHeight = canvasRef.current?.height     

    const [intervalId, setIntervalId] = React.useState<NodeJS.Timeout>(setTimeout(() => { })) // Pour pouvoir l'arrêter dans le clear  
    const [running, setRunning] = React.useState(false) // Pour savoir si le dessin est en cours ou pas

    // // Directions
    // let xIncrease = true
    // let yIncrease = true
    const step = 10
    const xStep = step + xMove
    const yStep = step + yMove

    const toPoint = { x: fromPoint.x, y: fromPoint.y }    // Ne pas mettre toPoint = fromPoint car sinon pointe vers les même références et donc fromPoint se modifie à chaque fois que toPoint se modifie !!! (et inversement)
  

    const start = () => {

        if (!ctx) return

        setRunning(true)  

        let xStart = fromPoint.x  // Pour savoir quand on a fait la moitié du cercle et revenir en arrière
        let isStartPoint = true            // Pour savoir si c'est le début du cercle
        let nbCercle = 0            // S'incrémente à chaque nouveau cercle

        const id = setInterval(() => {

            // console.log("AVVVV-fromPoint", fromPoint)
            // console.log("AVVVV-toPoint", toPoint)

    
            // On calcule le point d'arrivée
            xIncrease ? toPoint.x += xStep : toPoint.x -= xStep
            yIncrease ? toPoint.y += yStep : toPoint.y -= yStep
            // xIncrease ? toPoint.x += move.x : toPoint.x -= move.x
            // yIncrease ? toPoint.y += move.y : toPoint.y -= move.y

            // On change de direction si on arrive aux extrémités
            if (canvasWidth && canvasHeight) {
                if (toPoint.x >= canvasWidth - xStep) xIncrease = false
                if (toPoint.x <= 0 + xStep) xIncrease = true
                if (toPoint.y >= canvasHeight - yStep) yIncrease = false
                if (toPoint.y <= 0 + yStep) yIncrease = true                
            }            

            // console.log("AV-fromPoint", fromPoint)
            // console.log("AV-toPoint", toPoint)
            // console.log("xIncrease", xIncrease)
            // console.log("yIncrease", yIncrease)

            // On dessine la ligne
            //**1**
            drawLine({ ctx, fromPoint, toPoint })
            // **2**
            //drawLine(ctx, fromPoint, toPoint)

            setXIncrease(xIncrease)
            setYIncrease(yIncrease)

            setFromPoint({ x: toPoint.x, y: toPoint.y })    // Pour que si on reclic sur START ça parte du dernier point  => modifie fromPoint dans le composant qui appelle la fonction
            // !!! Ne pas mettre "setfromPoint(toPoint)" car sinon il va pointer vers les même références et donc chaque Point va se modifier dès qu'on modifie l'autre !!!       

            // Obligé d'ajouter ceci car ne met pas à jour le fromPoint avant de sortir du setInterval
            fromPoint = {
                x: toPoint.x,
                y: toPoint.y
            }

            //fromPoint = toPoint      // NON !!! Car sinon va se modifier tout seul à chaque fois que toPoint change !!!
            // => On ne veut pas qu'il poite vers les même références mais qu'il prenne leurs valeurs !!!
            //console.log("**fromPoint", fromPoint)
            //console.log("***fromPoint", fromPoint)


        }, speed)

        //console.log("fromPoint", fromPoint)
        //console.log(intervalId)
        setIntervalId(id)           // ???? Je comprends pas comment le clearInterval peut connaitre l'id alors qu'on le met à jour après ??? (le LOG ci-dessus ne donne pas l'id à jour !!!)

    }

    const stop = () => {
        setRunning(false)

        //console.log("STOP !!!!!!!!!!")

        // console.log("intervalId", intervalId)
        // console.log("fromPoint", fromPoint)
        clearInterval(intervalId)
    }

    return { start, stop, running }
}