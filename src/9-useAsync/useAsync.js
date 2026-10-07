import { useCallback, useEffect, useState } from "react"

export default function useAsync(callback, dependencies = []) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [value, setValue] = useState()

  const callbackMemoized = useCallback(() => {
    setLoading(true)
    setError(undefined)
    setValue(undefined)
    callback()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false))
  }, dependencies)

  useEffect(() => {
    callbackMemoized()
  }, [callbackMemoized])

  return { loading, error, value }
}


{
  /**
  useCallback is a hook that lets you cache a funciton definition between rerenders 
  const cachedFn = useCallback(fn, dependencies)

   -boring theories 
  fn: The function value that you want to cache. It can take any arguments and return any values. React will return (not call!) your function back to you during the initial render. On next renders, React will give you the same function again if the dependencies have not changed since the last render. Otherwise, it will give you the function that you have passed during the current render, and store it in case it can be reused later. React will not call your function. The function is returned to you so you can decide when and whether to call it.
  dependencies: The list of all reactive values referenced inside of the fn code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is configured for React, it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like [dep1, dep2, dep3]. React will compare each dependency with its previous value using the Object.is comparison algorithm.

  On the initial render, useCallback returns the fn function you have passed.

  During subsequent renders, it will either return an already stored
  fn function from the last render (if the dependencies haven’t changed), 
  or return the fn function you have passed during this render.

 "I'll remember this function and give you the same function on subsequent renders as long as these dependencies haven't changed."

 Therefore the data flow is - I guess programming is all about that data flow 
 FIrst Rendder
  dependencies
     ↓
  useCallback
     ↓
  callbackMemoized
     ↓
  useEffect dependency
     ↓
  callbackMemoized()
     ↓
  async operation
  
  useAsync(fetchWeather, [city])
  Component renders
       ↓
useAsync runs
       ↓
states initialized
       ↓
useCallback creates Function A
       ↓
useEffect runs
       ↓
callbackMemoized()
       ↓
setLoading(true)
       ↓
callback()
       ↓
request starts
Then 
request succeeds
       ↓
.then(setValue)
       ↓
value gets data
       ↓
.finally()
       ↓
loading = false

useCallBack becomes important only on hte second render 
"The dependency is still the same, so I'll give you the same Function A."  
Render 1 → Function A
Render 2 → Function A
Render 3 → Function A

without useCallback 
First render
    ↓
Function A

Effect sees Function A
    ↓
runs Function A
    ↓
setLoading(...)
    ↓
component renders again

Second render
    ↓
Function B

Effect sees Function B
    ↓
"Hey! My dependency changed."
    ↓
runs Function B
    ↓
setLoading(...)
    ↓
component renders again

Third render
    ↓
Function C

Effect sees Function C
    ↓
"Dependency changed again."
    ↓
runs Function C
    ↓
...


Don't think:

"useCallback prevents the function from changing."

That's not quite right.

Think:

useCallback preserves the function's reference when its dependencies haven't changed.

17. So why not put dependencies directly in useEffect?

useEffect(() => {
   ... async stuff
}, dependencies)


The custom hook is using useCallback to separate the operation itself from the Effect that triggers it.

  
  /
 }


 { 
/**
Memory version  
 useCallback memoizes a function reference, not the function’s result—
 if its dependencies stay the same, React gives you the same function reference across renders; if any dependency changes, React creates/returns
 a new function reference. A dependency is simply a value that React compares to decide whether something needs to be recreated or rerun; dependencies are
 compared between renders, not continuously “watched.” In useAsync, useCallback keeps callbackMemoized stable, while useEffect uses [callbackMemoized] to decide 
 when to execute it: same callback reference → Effect doesn’t rerun; new callback reference → Effect reruns. Without useCallback, a new function would be created on
 every render, so [callbackMemoized] would always look changed, causing the Effect to run again and potentially create a render → Effect → state update → render loop. Finally,
 memoization means remembering/reusing something until its dependencies change; useCallback memoizes a function reference, while useMemo memoizes a calculated value.


*/
  
/**
Generally, we need useEffect when rendering the React UI is not enough and we need to synchronize our component with
something outside of React’s rendering process. React’s normal job is basically “given the current state and props, calculate 
what the UI should look like”; an Effect is for saying “after React has rendered, now perform this external side effect.” Examples 
include fetching data from an API, changing the browser document title, subscribing to an event source, starting/stopping a timer, connecting to
a WebSocket, interacting with browser APIs, or synchronizing with a third-party library. The key distinction to memorize is: rendering should 
calculate what the UI is; Effects should synchronize with things outside React. If you can calculate something directly from props/state, you usually 
do not need an Effect. For example, const total = price * quantity belongs in rendering, not useEffect; but document.title = "Cart" involves the browser
outside React, so an Effect can synchronize the browser with React state.
*/ 
 
 }
