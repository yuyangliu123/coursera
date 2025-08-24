import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { throttleRAF } from "./throttleRAF";
import { Box } from "@chakra-ui/react";

export const useHandleScroll = ({ scrollerRef, invisiblePartHeight = 0, itemHeight = 200, itemBorder = 0, itemMarginBottom = 0, eachColCount = 1, initialShowColNum = 3, preloadingColNum = 1, elements }) => {
  // Calculate initial end index based on initial row count and columns
  const getInitialEnd = () => {
    if (!elements) return 0;
    return Math.min(initialShowColNum * eachColCount, Object.keys(elements).length);
  };
  // State to track the visible range of items
  const [range, setRange] = useState({
    start: 0,
    end: getInitialEnd()
  });
  // Extract border width from border string (e.g., "1px solid black" -> 1)
  const borderValue = itemBorder.split(' ').find(value => value.includes('px'));
  const borderWidth = parseInt(borderValue);
  const height = itemHeight + borderWidth * 2 + itemMarginBottom

  // Handle scroll events to update visible range
  const handleScroll = useCallback(() => {
    if (scrollerRef.current) {
      // Calculate visible area and scroll position
      const rect = scrollerRef.current.getBoundingClientRect();
      const visibleHeight = window.innerHeight;
      const scrollerTop = (rect.top - invisiblePartHeight) * -1;
      const scrollBottom = scrollerTop + visibleHeight - invisiblePartHeight;

      // Calculate start and end indices based on scroll position
      const startIndex = Math.max(0, (Math.floor(Math.abs(scrollerTop) / height) - preloadingColNum) * eachColCount);
      const endIndex = (Math.floor(scrollBottom / height) + 1 + preloadingColNum) * eachColCount;
      setRange({ start: startIndex, end: Math.min(endIndex, Object.keys(elements).length) });
    }
  }, [scrollerRef, invisiblePartHeight, height, eachColCount, preloadingColNum, elements]);

  // Add throttled scroll and resize event listeners
  useEffect(() => {
    const throttledHandleScroll = throttleRAF(handleScroll);
    window.addEventListener("scroll", throttledHandleScroll);
    window.addEventListener("resize", throttledHandleScroll);

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      window.removeEventListener("resize", throttledHandleScroll);
    };
  }, [handleScroll])

  // Update range when elements change or on initial load
  useEffect(() => {
    if (!elements) {
      setRange({ start: 0, end: 0 });
      return;
    }

    // If at top of page, use initial values
    if (window.scrollY === 0) {
      setRange(prev => ({
        start: 0,
        end: Math.min(initialShowColNum * eachColCount, Object.keys(elements).length)
      }));
    } else {
      // Otherwise calculate based on current scroll position
      handleScroll();
    }
  }, [elements, initialShowColNum, eachColCount, handleScroll]);
  return { range, setRange }
};

export const WindowElement = ({ scrollHeight, backgroundColor = "#ffffff", elements, range, scrollerRef, height = 200, border = "", marginRight = 0, marginBottom = 0, eachColCount = 1 }) => {
  const boxRef = useRef(null);
  const [boxWidth, setBoxWidth] = useState(0);
  //set item width
  const width = useMemo(() =>
    (boxWidth - marginRight * (eachColCount - 1)) / eachColCount
    , [boxWidth, marginRight, eachColCount]);

  //set box width with RWD
  useEffect(() => {
    const updateBoxWidth = () => {
      if (boxRef.current) {
        setBoxWidth(boxRef.current.offsetWidth);
      }
    };

    updateBoxWidth();
    window.addEventListener("resize", updateBoxWidth);

    return () => {
      window.removeEventListener("resize", updateBoxWidth);
    };
  }, []);


  return (
    <Box position="relative"
      id="scroller"
      height={scrollHeight}
      backgroundColor={backgroundColor}
      ref={scrollerRef}
    >
      <Box
        ref={boxRef}>
        {elements.slice(range.start, range.end).map((value, index) => {
          const globalIndex = range.start + index;
          return (
            <Box
              id={`item${globalIndex + 1}`}
              key={globalIndex}
              width={width}
              border={border}
              position="absolute"
              height={height}
              marginBottom={marginBottom}
              transform={eachColCount !== 1
                ? `translate(${(Math.floor(globalIndex % eachColCount) * width + (Math.floor(globalIndex % eachColCount) * (boxWidth - width * eachColCount) / (eachColCount - 1)))}px,
                            ${((Math.floor(globalIndex / eachColCount)) * height) + ((Math.floor(globalIndex / eachColCount)) * (marginBottom + 2))}px)`
                : `translate(0px,
                            ${((Math.floor(globalIndex / eachColCount)) * height) + ((Math.floor(globalIndex / eachColCount)) * (marginBottom + 2))}px)`
              }
            >
              {value}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// transform={`translate(${(Math.floor(globalIndex%eachColCount)*width+(Math.floor(globalIndex % eachColCount)*(boxWidth-width*eachColCount)/(eachColCount-1)))}px,
//                                   ${((Math.floor(globalIndex / eachColCount)) * height)+((Math.floor(globalIndex / eachColCount))*(marginBottom+2))}px)`}

// (Math.floor(globalIndex / eachColCount)) * (height+marginBottom)
// (Math.floor(globalIndex % eachColCount)) * boxWidth/eachColCount