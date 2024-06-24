import { useRef } from "react";
import useLocalStorage from "../../../Hooks/useLocalStorage";
import { getCurrentTimeStamp } from "../../../utils";

const useSmartSearchCatch = (expire) => {
  const [cache, setCache] = useLocalStorage("smartSeachCache", {});
  const caheRef = useRef(cache);
  
  const get = (query) => {
    const cachedData = caheRef.current[query];
    if (cachedData) {
      const { data, timestamp } = cachedData;
      const isExpired = getCurrentTimeStamp() - timestamp > expire;

      if (data && !isExpired) {
        return data;
      } else {
        delete caheRef.current[query];
        setCache(caheRef.current);
      }
    }
    return null;
  };

  const set = (query, data) => {
    const timestamp = getCurrentTimeStamp();
    caheRef.current[query] = { data, timestamp } ;
    setCache(caheRef.current);
  };

  return [get, set];
};

export default useSmartSearchCatch;
