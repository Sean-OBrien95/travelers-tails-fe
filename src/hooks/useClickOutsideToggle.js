import { useEffect, useRef, useState } from "react";

// Custom hook for toggling state based on clicks outside a specified element
const useClickOutsideToggle = () => {
  const [expanded, setExpanded] = useState(false);
  
  const ref = useRef(null);

  // Effect hook to add event listener for click events outside the specified element
  useEffect(() => {
    // Function to handle click outside event
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    // Add event listener for mouseup event
    document.addEventListener("mouseup", handleClickOutside);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref]);

  return { expanded, setExpanded, ref };
};

export default useClickOutsideToggle;
