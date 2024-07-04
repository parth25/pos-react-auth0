import React, { useEffect, useState } from 'react'
import { ActionButtonWithTimeoutProps } from 'src/types/global'

function ActionButtonWithTimeout({
  mainComponent,
  timeoutComponent,
  timeout,
  onButtonClick
}: ActionButtonWithTimeoutProps) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (seconds === 0) return

    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [seconds])

  const handleClick = () => {
    setSeconds(timeout)
    onButtonClick && onButtonClick()
  }

  return <>{seconds !== 0 ? timeoutComponent(seconds) : mainComponent(handleClick)}</>
}

export default ActionButtonWithTimeout
