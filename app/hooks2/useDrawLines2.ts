import React from "react"

// Fonction (hook perso car utilise des hooks) qui dessine plusieurs lignes à partir d'un canvas, d'un point de départ, de la fonction drawLine et un chiffre (vitesse) 
export default function useDrawLines2(
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
    cercle: boolean,
    fiveCircles: boolean,
) {

    //console.log("FROMPOINT", fromPoint)

    const ctx = canvasRef.current?.getContext('2d') // On récupère le contexte du canvas        

    const [intervalId, setIntervalId] = React.useState<NodeJS.Timeout>(setTimeout(() => { })) // Pour pouvoir l'arrêter dans le clear  
    const [running, setRunning] = React.useState(false) // Pour savoir si le dessin est en cours ou pas

    // // Directions
    // let xIncrease = true
    // let yIncrease = true
    const step = 10
    const xStep = step + xMove
    const yStep = step + yMove

    const toPoint = { x: fromPoint.x, y: fromPoint.y }    // Ne pas mettre toPoint = fromPoint car sinon pointe vers les même références et donc fromPoint se modifie à chaque fois que toPoint se modifie !!! (et inversement)


    // Pour les CERCLES on a besoin : un point de départ, le centre du cercle, le rayon et la fonction de calcul de y par rapport à x et au rayon

    // On choisi r=100 donc centre du cercle x+100
    let centerCirclePoint: Point = {
        x: fromPoint.x + 100,
        y: fromPoint.y
    }

    // Fonction qui calcule le point Y en fonction du point X et du rayon => Pour former un cercle
    const calculToPointY = (x: number, yIncrease: boolean, centerCirclePoint: Point, r = 100) => {
        const val = Math.sqrt(Math.abs(Math.pow(r, 2) - Math.pow(x - centerCirclePoint.x, 2)))
        return yIncrease ? val + centerCirclePoint.y : -val + centerCirclePoint.y
    }

    const start = () => {

        if (!ctx) return

        setRunning(true)

        // console.log(canvasRef.current?.height)
        // console.log(canvasRef.current?.width)
        // console.log("centerCirclePoint", centerCirclePoint)        

        // On vérifie que le centre du point soit bien dans le canvas sinon on le décale
        // if (canvasRef.current?.width && canvasRef.current?.height) {
        //     if (centerCirclePoint.x > canvasRef.current?.width) centerCirclePoint.x = canvasRef.current?.width - 100
        //     if (centerCirclePoint.x < 0) centerCirclePoint.x = 0 + 100
        //     if (centerCirclePoint.y > canvasRef.current?.height) centerCirclePoint.y = canvasRef.current?.height - 100
        //     if (centerCirclePoint.y < 0) centerCirclePoint.y = 0 + 100
        // }

        let xStart = fromPoint.x  // Pour savoir quand on a fait la moitié du cercle et revenir en arrière
        let isStartPoint = true            // Pour savoir si c'est le début du cercle
        let nbCercle = 0            // S'incrémente à chaque nouveau cercle

        const id = setInterval(() => {

            // console.log("AVVVV-fromPoint", fromPoint)
            // console.log("AVVVV-toPoint", toPoint)

            if (cercle) {

                console.log("nbCercle**********************************", nbCercle)

                // SI ON VEUT PLUSIEURS CERCLES !!
                // On vérifie si fromPoint.x est égale au point de départ pour la 2ème fois (donc cercle fini) pour commencer un nouveau cercle
                console.log("fromPoint.x", fromPoint.x)
                console.log("xStart", xStart)
                console.log("isStartPoint", isStartPoint)

                if (fiveCircles) {
                
                    if (fromPoint.x === xStart && xIncrease === false) {
                        nbCercle++

                        console.log("Nouveau CERCLE !!!!!!!!!!!!!!!!!!!!!!!!")
                        // On dessine un nouveau cercle avec un centre décalé
                        isStartPoint = true

                        switch (nbCercle) {
                            case 1: {
                                centerCirclePoint = {
                                    x: 500,
                                    y: 150
                                }
                            }
                                break;
                            case 2: {
                                centerCirclePoint = {
                                    x: 600,
                                    y: 250
                                }
                            }
                                break;
                            case 3: {
                                centerCirclePoint = {
                                    x: 500,
                                    y: 350
                                }
                            }
                                break;
                            case 4: {
                                centerCirclePoint = {
                                    x: 400,
                                    y: 250
                                }
                            }
                        }

                        fromPoint = {
                            x: centerCirclePoint.x - 100,
                            y: centerCirclePoint.y
                        }

                        // centerCirclePoint = {
                        //     x: fromPoint.x + 100,
                        //     y: fromPoint.y                            
                        //                   }
                        // fromPoint = {
                        //     x: xStart + 100/2, 
                        //     y: calculToPointY(xStart + 100/2, true)}
                        xStart = fromPoint.x
                        xIncrease = true
                        yIncrease = true


                    }
                }

                // Si on arrive au bout du cercle donc fromPoint.x est égale au rayon*2 => on inverse le sens de x
                if (xIncrease && toPoint.x === xStart + 100 * 2) {
                    xIncrease = false
                    // yIncrease = false
                }
                else if (!xIncrease && toPoint.x === xStart) {
                    xIncrease = true
                }


                console.log("fromPoint : ", fromPoint)
                console.log("toPoint : ", toPoint)
                console.log("xIncrease : ", xIncrease)
                console.log("yIncrease : ", yIncrease)


                // On met à jour le point d'arrivée => ne pas mettre toPoint = { x: fromPoint.x + 1, y: calculToPointY(fromPoint.x + 1, true) } car sinon va pointer vers les même références et donc chaque Point va se modifier dès qu'on modifie l'autre !!! 
                if (xIncrease === true) {
                    toPoint.x = fromPoint.x + 1
                    toPoint.y = calculToPointY(fromPoint.x + 1, true, centerCirclePoint)
                } else {
                    toPoint.x = fromPoint.x - 1
                    toPoint.y = calculToPointY(fromPoint.x - 1, false, centerCirclePoint)
                }



            } else {
                // On calcule le point d'arrivée
                xIncrease ? toPoint.x += xStep : toPoint.x -= xStep
                yIncrease ? toPoint.y += yStep : toPoint.y -= yStep
                // xIncrease ? toPoint.x += move.x : toPoint.x -= move.x
                // yIncrease ? toPoint.y += move.y : toPoint.y -= move.y

                // On change de direction si on arrive aux extrémités
                if (toPoint.x >= 800 - xStep) xIncrease = false
                if (toPoint.x <= 0 + xStep) xIncrease = true
                if (toPoint.y >= 500 - yStep) yIncrease = false
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

        console.log("STOP !!!!!!!!!!")

        // console.log("intervalId", intervalId)
        // console.log("fromPoint", fromPoint)
        clearInterval(intervalId)
    }

    return { start, stop, running }
}