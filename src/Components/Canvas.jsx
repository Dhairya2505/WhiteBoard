import ReactDOM from 'react-dom';

import { PiLineSegmentDuotone } from "react-icons/pi";
import { LiaPencilAltSolid } from "react-icons/lia";
import { MdOutlineSquare, MdOutlineRectangle  } from "react-icons/md";
import { IoTriangleOutline } from "react-icons/io5";
import { FaRegCircle } from "react-icons/fa";
import { RiPentagonLine } from "react-icons/ri";

import { useEffect, useState } from "react";
import { useRef } from "react"

export default function Canvas(){

    const [shape,setShape] = useState('Pencil');
    const [color,setColor] = useState('#000000');
    const [lineWidth,setLineWidth] = useState(1);

    const [X,setX] = useState(0);
    const [Y,setY] = useState(0);
    const [isDraggable,setIsdraggable] = useState(false); 

    const [screenX,setScreenX] = useState(0);
    const [screenY,setScreenY] = useState(0);

    const [canvasContext,setCanvascontext] = useState();
    const [IsDrawing,setIsDrawing] = useState(false);

    const [startX, setStartX] = useState(null);
    const [startY, setStartY] = useState(null);
    const [imageData,setImagedata] = useState([]); 
    
    const canvas = useRef(null);
    const dragRef = useRef(null);

    useEffect(() => {
        setCanvascontext(canvas.current.getContext("2d",{ willReadFrequently: true }));
        setScreenX(ReactDOM.findDOMNode(canvas.current).parentElement.scrollWidth);
        setScreenY(ReactDOM.findDOMNode(canvas.current).parentElement.scrollHeight);
    },[]);

    const handleMouseDown = (e) => {
        setIsDrawing(true);

        let rect = canvas.current.getBoundingClientRect();
      
        const X = e.clientX - rect.left;
        const Y = e.clientY - rect.top;

        setStartX(X);
        setStartY(Y);

        switch (shape) {
            case "Pencil":
                canvasContext.beginPath();
                canvasContext.moveTo(X,Y);
                break;
                
            default:
                    break;
        }
    };
            
            
    const handleMouseMove = (e) => {
        if (!IsDrawing) return;
        
        let rect = canvas.current.getBoundingClientRect();
        
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        canvasContext.clearRect(0, 0, canvas.current.width, canvas.current.height);
        if(imageData[imageData.length-1]){
            canvasContext.putImageData(imageData[imageData.length-1],0,0);
        }
        
        switch (shape) {
            case "Pencil":
                canvasContext.lineWidth = lineWidth;
                canvasContext.lineTo(currentX,currentY);
                canvasContext.strokeStyle = `${color}`
                canvasContext.lineCap = "round";
                canvasContext.lineJoin = "round";
                canvasContext.stroke();
                break;
                    
            case "Line":
                canvasContext.beginPath();
                canvasContext.moveTo(startX,startY);
                canvasContext.lineWidth = lineWidth;
                canvasContext.strokeStyle = `${color}`
                canvasContext.lineTo(currentX, currentY);
                canvasContext.stroke();
                break;
            
            case "Rectangle":
                canvasContext.lineWidth = lineWidth;
                canvasContext.strokeStyle = "black";
                canvasContext.fillStyle = "rgb(0,0,0,0)";
                canvasContext.fillRect(startX, startY, currentX-startX, currentY-startY);
                canvasContext.strokeRect(startX, startY, currentX-startX, currentY-startY);
                break;
            
            case "Square":
                canvasContext.lineWidth = lineWidth;
                canvasContext.strokeStyle = "black";
                canvasContext.fillStyle = "rgb(0,0,0,0)";
                canvasContext.fillRect(startX, startY, currentX-startX, currentX-startX);
                canvasContext.strokeRect(startX,startY, currentX-startX, currentX-startX);
                break;
                
            case "Circle":
                canvasContext.beginPath();
                canvasContext.lineWidth = lineWidth;
                canvasContext.strokeStyle = "black";
                canvasContext.fillStyle = "rgb(0,0,0,0)";
                const dist = Math.sqrt( (currentX-startX)*(currentX-startX) + (currentY-startY)*(currentY-startY) );
                canvasContext.arc((currentX+startX)/2,(currentY+startY)/2,dist/2,0,Math.PI * 2);
                canvasContext.stroke();
                break;
                    
            case "Triangle":
                canvasContext.beginPath();
                canvasContext.lineWidth = lineWidth;
                canvasContext.strokeStyle = "black";
                canvasContext.fillStyle = "rgb(0,0,0,0)";
                canvasContext.moveTo((currentX+startX)/2,startY);
                canvasContext.lineTo(startX,currentY);
                canvasContext.lineTo(currentX,currentY);
                canvasContext.lineTo((currentX+startX)/2,startY);
                canvasContext.lineTo(startX,currentY);
                canvasContext.stroke();
                break;
                        
            case "Pentagon":
                canvasContext.beginPath();
                canvasContext.lineWidth = lineWidth;
                canvasContext.strokeStyle = "black";
                canvasContext.fillStyle = "rgb(0,0,0,0)";
                canvasContext.moveTo((currentX+startX)/2,startY);
                canvasContext.lineTo(startX,((currentY-startY)/2.5)+startY);
                canvasContext.lineTo(((currentX-startX)/4)+startX,currentY);
                canvasContext.lineTo((currentX-(currentX-startX)/4),currentY);
                canvasContext.lineTo(currentX,startY+((currentY-startY)/2.5));
                canvasContext.lineTo((currentX+startX)/2,startY);
                canvasContext.stroke();
                break;

            default:
                canvasContext.closePath();
                break;
        }
    };
        
        
    const handleMouseUp = () => {
        setIsDrawing(false);
        setStartX(null);
        setStartY(null);

        const data = canvasContext.getImageData(0,0,canvas.current.width,canvas.current.height, { colorSpace: "srgb" });
        const rest = imageData;
        setImagedata([...rest,data]);
            
    };
    


    return(
        <div className="flex flex-col bg-gray-300 h-screen w-screen">
            <div className="grid grid-cols-3 border-2 border-black m-2 bg-gray-100 shadow-md shadow-black" ref={dragRef}>
                <div className="flex justify-center items-center">
                    <div>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-9 m-1" />
                    </div>
                    <div className={`flex justify-center items-center h-9 w-9 ${shape === "Pencil" ? `shadow-inner shadow-black` : ``} m-1 rounded-md cursor-pointer active:bg-gray-300`} onClick={() => setShape("Pencil")}>
                        <LiaPencilAltSolid className="size-7"/>
                    </div>
                </div>
                <div className='flex justify-center items-center'>
                    <div className={`flex justify-center items-center h-9 w-9 ${shape === "Line" ? `shadow-inner shadow-black` : ``} m-1 rounded-md cursor-pointer active:bg-gray-300`} onClick={() => setShape("Line")}>
                        <PiLineSegmentDuotone className="size-7"/>
                    </div>
                    <div className={`flex justify-center items-center h-9 w-9 ${shape === "Circle" ? `shadow-inner shadow-black` : ``} m-1 rounded-md cursor-pointer active:bg-gray-300`} onClick={() => setShape("Circle")}>
                        <FaRegCircle className="size-7"/>
                    </div>
                    <div className={`flex justify-center items-center h-9 w-9 ${shape === "Square" ? `shadow-inner shadow-black` : ``} m-1 rounded-md cursor-pointer active:bg-gray-300`} onClick={() => setShape("Square")}>
                        <MdOutlineSquare className="size-7"/>
                    </div>
                    <div className={`flex justify-center items-center h-9 w-9 ${shape === "Rectangle" ? `shadow-inner shadow-black` : ``} m-1 rounded-md cursor-pointer active:bg-gray-300`} onClick={() => setShape("Rectangle")}>
                        <MdOutlineRectangle className="size-7"/>
                    </div>
                    <div className={`flex justify-center items-center h-9 w-9 ${shape === "Triangle" ? `shadow-inner shadow-black` : ``} m-1 rounded-md cursor-pointer active:bg-gray-300`} onClick={() => setShape("Triangle")}>
                        <IoTriangleOutline className="size-7"/>
                    </div>
                    <div className={`flex justify-center items-center h-9 w-9 ${shape === "Pentagon" ? `shadow-inner shadow-black` : ``} m-1 rounded-md cursor-pointer active:bg-gray-300`} onClick={() => setShape("Pentagon")}>
                        <RiPentagonLine className="size-7"/>
                    </div>
                </div>
                <div className='flex justify-center items-center'>
                    <div className="flex justify-center items-center shadow-inner shadow-black px-1 h-8 w-8">
                        {lineWidth}
                    </div>
                    <input type="range" min={1} max={20} value={lineWidth} onChange={(e) => setLineWidth(e.target.value)}/>
                </div>
            
            </div>
            <div className="flex justify-center items-center w-full h-full">
                <canvas ref={canvas} className="border-2 border-gray-600 bg-white shadow-lg shadow-black cursor-pointer" height={screenY-20} width={screenX-20} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
                </canvas>
            </div>
        </div>
    )

}