import { PiLineSegmentDuotone } from "react-icons/pi";
import { MdOutlineSquare, MdOutlineRectangle  } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";

import { useEffect, useState } from "react";
import { useRef } from "react"

export default function Canvas(){

    const [canvasContext,setCanvascontext] = useState();
    const [shape,setShape] = useState('Line');
    const [IsDrawing,setIsDrawing] = useState(false);

    const [startX, setStartX] = useState(null);
    const [startY, setStartY] = useState(null);
    const [imageData,setImagedata] = useState([]); 
    
    const canvas = useRef(null);

    useEffect(() => {
        setCanvascontext(canvas.current.getContext("2d",{ willReadFrequently: true }));
    },[]);

    const handleMouseDown = (e) => {
        setIsDrawing(true);

        let rect = canvas.current.getBoundingClientRect();
      
        setStartX(e.clientX - rect.left);
        setStartY(e.clientY - rect.top);
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
        // canvasContext.putImageData(imageData[imageData.length-1],0,0);

        switch (shape) {
            case "Line":
                canvasContext.beginPath();
                canvasContext.moveTo(startX, startY);
                canvasContext.lineTo(currentX, currentY);
                canvasContext.stroke();
                break;

            case "Rectangle":
                canvasContext.beginPath();
                canvasContext.fillStyle = "rgba(0, 0, 0, 0)";
                canvasContext.strokeRect(startX, startY, currentX-startX, currentY-startY);
                break;

            case "Square":
                canvasContext.beginPath();
                canvasContext.fillStyle = "rgba(0, 0, 0, 0)";
                canvasContext.strokeRect(startX,startY, currentX-startX, currentX-startX);
                break;

            case "Circle":
                canvasContext.beginPath();
                canvasContext.fillStyle = "rgba(0, 0, 0, 0)";
                const dist = Math.sqrt( (currentX-startX)*(currentX-startX) + (currentY-startY)*(currentY-startY) );
                canvasContext.arc((currentX+startX)/2,(currentY+startY)/2,dist/2,0,Math.PI * 2);
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
        <div className="flex bg-gray-300">
            <div className="w-2/12 h-screen p-6">
                <div className="flex flex-col w-full h-full bg-white border-2 border-gray-600 shadow-2xl">
                    <div id="tools" className="grid grid-cols-4">
                        <div className={`flex justify-center items-center h-9 ${shape === "Line" ? `bg-gray-400` : `bg-gray-200`} m-1 rounded-md cursor-pointer active:bg-gray-500`} onClick={() => setShape("Line")}>
                            <PiLineSegmentDuotone className="size-7"/>
                        </div>
                        <div className={`flex justify-center items-center h-9 ${shape === "Circle" ? `bg-gray-400` : `bg-gray-200`} m-1 rounded-md cursor-pointer active:bg-gray-500`} onClick={() => setShape("Circle")}>
                            <FaRegCircle className="size-7"/>
                        </div>
                        <div className={`flex justify-center items-center h-9 ${shape === "Square" ? `bg-gray-400` : `bg-gray-200`} m-1 rounded-md cursor-pointer active:bg-gray-500`} onClick={() => setShape("Square")}>
                            <MdOutlineSquare className="size-7"/>
                        </div>
                        <div className={`flex justify-center items-center h-9 ${shape === "Rectangle" ? `bg-gray-400` : `bg-gray-200`} m-1 rounded-md cursor-pointer active:bg-gray-500`} onClick={() => setShape("Rectangle")}>
                            <MdOutlineRectangle className="size-7"/>
                        </div>
                    </div>
                    <div>
                        
                    </div>
                </div>
            </div>
            <div className="w-10/12 h-screen p-6">
                <canvas ref={canvas} className="justify-self-end border-2 border-gray-600 bg-white shadow-2xl shadow-black cursor-pointer" height={634} width={1080} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>

                </canvas>

            </div>
        </div>
    )

}