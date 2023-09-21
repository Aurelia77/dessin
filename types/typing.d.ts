type Draw = {
    ctx: CanvasRenderingContext2D | null | undefined
    fromPoint: Point
    toPoint: Point
}
type Point = {
    x: number
    y: number
}


type Draw0 ={
    ctx: CanvasRenderingContext2D
    currentPoint: Point0
    prevPoint: Point | null
}
type Point0 = {
    x: number
    y: number
}
