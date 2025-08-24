import { useEffect } from 'react';

// Custom hook to detect clicks outside of specified elements
const useClickOutside = (refs, callback) => {
  // Ensure refs is an array
  const allRefs = Array.isArray(refs) ? refs : [refs];

  // Function to handle click events
  const handleClickOutside = (event) => {
    let isOutside = true; // Initialize isOutside as true

    // Check if the click event occurred inside any of the refs
    allRefs.forEach(ref => {
      if (ref.current && ref.current.contains(event.target)) {
        isOutside = false; // If click is inside, set isOutside to false
      }
    });

    // If the click event occurred outside all refs, invoke the callback
    if (isOutside) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [allRefs]);
};

export default useClickOutside;
