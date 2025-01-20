import { useEffect, useRef } from "react"

const useEventListener = <K extends keyof HTMLElementEventMap, T extends HTMLElement | null>(
  eventType: K,
  callback: (ev: HTMLElementEventMap[K]) => any,
  element: T,
)=> {
  const callbackRef = useRef<(ev: HTMLElementEventMap[K]) => any>(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (element == null) return;

    const handler = (e:HTMLElementEventMap[K]) => callbackRef.current(e)
    element.addEventListener(eventType, handler)

    return () => element.removeEventListener(eventType, handler)
  }, [eventType, element])
}

export default useEventListener;
