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
