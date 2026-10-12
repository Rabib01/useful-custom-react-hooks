import { useCallback, useEffect, useRef } from "react"

export default function useTimeout(callback, delay) {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef()
  // callback ref stores a callback function - therefores refs can also be used to store functions with values 
  // callbackRef.current = callback means you're storing the latest version of the callback function inside a ref. 
  // Imagine you're building a debounce hook. A user types into a search box, and you want to execute a callback after they stop typing for a certain amount of time.
  // 
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay)
  }, [delay])

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current)
  }, [])

  useEffect(() => {
    set()
    return clear
  }, [delay, set, clear])

  const reset = useCallback(() => {
    clear()
    set()
  }, [clear, set])

  return { reset, clear }
}

{
  /**
  Bro, the important thing to understand is that useCallback preserves a function reference between renders unless its dependencies change. It does not stop the function from executing, and it does not preserve the function's internal state.
  
  why couldnt it be created inside an effect if it had to depend on delay ? why could we do the memoizing in the useEffect like in hte previous block of code ?
  Because set is a function you need to call, whereas the previous effect automatically updates callbackRef.current when callback changes.
  R: useEffect runs after rendering; useCallback preserves the function reference between renders. They serve different purposes.

  No dependency on clear memoized callback function -
  Because timeoutIDRef is a ref whose identity stays the same across renders, so it doesn't need to be a dependency.
  */
}

{
  /* Order of executio
  Initial render:
  Render → useCallback checks dependencies → Commit DOM → Browser paint → useEffect runs
  On re-render:
  State/props change → Render → useCallback checks dependencies (reuse or create function) → Commit DOM changes → Browser paint → useEffect runs if dependencies changed
  */
}
