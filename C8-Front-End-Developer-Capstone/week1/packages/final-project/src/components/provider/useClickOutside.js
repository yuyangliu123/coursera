import { useEffect } from 'react';

const useClickOutside = (refs, callback) => {
  const handleClickOutside = (event) => {
    setTimeout(() => {
      const refsArray = Array.isArray(refs) ? refs : Object.values(refs.current || refs);

      const isOutside = refsArray.every(ref => {
        if (!ref || !ref.current) {
          return true;
        }
        return !ref.current.contains(event.target);
      });

      if (isOutside) {
        callback();
      }
    }, 0);
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
};

export default useClickOutside;