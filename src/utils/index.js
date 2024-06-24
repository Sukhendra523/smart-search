export const debounce = (func,delay)=>{
    let timer;
    return function(...args){
        if(timer) clearTimeout(timer);

        timer = setTimeout(()=>{
            func(...args)
        },delay);
    }
}

export const getCurrentTimeStamp = () => Math.floor(Date.now() / 1000);
