import React, { useState, useEffect } from 'react';

// 這是一個高階組件，它提供鼠標位置的功能
const withMousePosition = (Component) => {
  return (props) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
      const handleMousePositionChange = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };

      window.addEventListener('mousemove', handleMousePositionChange);
      return () => window.removeEventListener('mousemove', handleMousePositionChange);
    }, []);

    return <Component {...props} mousePosition={mousePosition} />;
  };
};

// 使用HOC的組件
const PanelMouseLogger = ({ mousePosition }) => {
  if (!mousePosition) {
    return null;
  }
  return (
    <>
      <p>Mouse position:</p>
      <div className="row">
        <span>x: {mousePosition.x}</span>
        <span>y: {mousePosition.y}</span>
      </div>
    </>
  );
};

const PointMouseLogger = ({ mousePosition }) => {
  if (!mousePosition) {
    return null;
  }
  return (
    <>
      <p>Mouse position:X:{mousePosition.x} Y:{mousePosition.y}</p>
    </>
  );
};

// 使用withMousePosition HOC增強組件
const EnhancedPanelMouseLogger = withMousePosition(PanelMouseLogger);
const EnhancedPointMouseLogger = withMousePosition(PointMouseLogger);

const HOC = () => {
  return (
    <>
      <EnhancedPanelMouseLogger />
      <EnhancedPointMouseLogger />
    </>
  );
};

export default HOC;
