import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { throttleRAF } from "./throttleRAF";
import { Box } from "@chakra-ui/react";

export const useHandleScroll = ({ scrollerRef, invisiblePartHeight = 0, itemHeight = 200, itemBorder = 0, itemMarginBottom = 0, eachColCount = 1, initialShowColNum = 3, preloadingColNum = 1 }) => {
  const [range, setRange] = useState({ start: 0, end: initialShowColNum * eachColCount });
  //get border width
  const borderValue = itemBorder.split(' ').find(value => value.includes('px')); // "1px"
  const borderWidth = parseInt(borderValue); // 1
  const height = itemHeight + borderWidth * 2 + itemMarginBottom
  const handleScroll = useCallback(() => {
    if (scrollerRef.current) {

      const rect = scrollerRef.current.getBoundingClientRect();
      const visibleHeight = window.innerHeight;
      const scrollerTop = (rect.top - invisiblePartHeight) * -1;
      const scrollBottom = scrollerTop + visibleHeight - invisiblePartHeight;
      const startIndex = Math.max(0, (Math.floor(Math.abs(scrollerTop) / height) - preloadingColNum) * eachColCount);
      const endIndex = (Math.floor(scrollBottom / height) + 1 + preloadingColNum) * eachColCount;
      setRange({ start: startIndex, end: endIndex });
    }
  }, [scrollerRef, invisiblePartHeight, height, eachColCount, preloadingColNum]);

  //deal with throttle
  useEffect(() => {
    const throttledHandleScroll = throttleRAF(handleScroll);
    window.addEventListener("scroll", throttledHandleScroll);
    window.addEventListener("resize", throttledHandleScroll);

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      window.removeEventListener("resize", throttledHandleScroll);
    };
  }, [handleScroll]);

  return range;
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