import { useState,useEffect } from "react";


const WithMousePosition = ({render}) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
      useEffect(() => {
        const handleMousePositionChange = (e) => {
          setMousePosition({ x: e.clientX, y: e.clientY });
        };
  
        window.addEventListener('mousemove', handleMousePositionChange);
        return () => window.removeEventListener('mousemove', handleMousePositionChange);
      }, []);
  
      return render(mousePosition)
  };

  const PanelMouseLogger = () => {
    return(
    <WithMousePosition
            render={(data)=>(
                <>
                    <p>Mouse position:</p>
                    <div className="row">
                    <span>x: {data.x}</span>
                    <span>y: {data.y}</span>
                    </div>
                </>
            )}
        />
    )
  };

  const PointMouseLogger = () => {
    
    return (
        <WithMousePosition
            render={(data)=>(
                <>
                    <p>Mouse position:X:{data.x} Y:{data.y}</p>
                </>
            )}
        />
    );
  };



const ImplementingScroller=()=>{
    return(
        <>
        <PanelMouseLogger/>
        <PointMouseLogger/>
        </>
    )
}

export default ImplementingScroller