import { useState, useEffect } from "react";

const DataFetcher = ({ render, url }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (url.includes("desserts")) {
      setData(["cake", "ice cream", "pie", "brownie"]);
    } else {
      setData(["water", "soda", "juice"]);
    }
  }, [url]); // 添加 url 作為依賴項

  return render(data); //這邊的data指useState的data
};

const DessertsCount = () => {
  return (
    <DataFetcher
      url="https://littlelemon/desserts"
      render={(data) => (
        <>
          <p>{data.length} desserts</p>
          <ul>
            {data.map((d, index) => (
              <li key={index}>{d}</li> // 確保使用圓括號而不是花括號
            ))}
          </ul>
        </>
      )}
    />
  );
};
const DrinksCount = () => {
    return (
      <DataFetcher
        url="https://littlelemon/drink"
        render={(data) => (
          <>
            <p>{data.length} drinks</p>
            <ul>
              {data.map((d, index) => (
                <li key={index}>{d}</li> // 確保使用圓括號而不是花括號
              ))}
            </ul>
          </>
        )}
      />
    );
  };




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

const RenderProps = () => {
  return (
    <>
      <DessertsCount />
      <DrinksCount/>
      <PanelMouseLogger/>
    </>
  );
};

export default RenderProps;
