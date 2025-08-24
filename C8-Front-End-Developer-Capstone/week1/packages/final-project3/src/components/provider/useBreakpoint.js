import { useEffect, useState } from 'react';

const useBreakpoint = (breakpoints, eachColCounts) => {
  const getBreakpoint = () => {
    const width = window.innerWidth;
    const keys = Object.keys(breakpoints);

    for (let i = keys.length - 1; i >= 0; i--) {
      if (width >= breakpoints[keys[i]]) {
        return keys[i];
      }
    }

    return 'base';
  };

  const [breakpoint, setBreakpoint] = useState(getBreakpoint);

  useEffect(() => {
    const handleResize = () => {
      const newBreakpoint = getBreakpoint();
      if (newBreakpoint !== breakpoint) {
        setBreakpoint(newBreakpoint);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints, breakpoint]);

  return eachColCounts[breakpoint];
};

export default useBreakpoint;
