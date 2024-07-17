import { useEffect, useState } from "react";

const useDebounce = ({func, delay , callBack}) => {
  const [debouncedValue, setDebouncedValue] = useState(func);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(func);
      callBack?.()
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [func, delay]);

  return debouncedValue;
};

export default useDebounce;
