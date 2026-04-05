<<<<<<< HEAD
/* eslint-disable react/forbid-elements */
=======
/* oxlint-disable react/forbid-elements */
>>>>>>> upstream/main
import { useIsPrimaryAppInstance } from 'src/store/storeSynchronization'

// This is a dev-only component that renders a small green/red dot in the bottom right corner of the screen
// to indicate whether the current app instance is the primary one.
export default function PrimaryAppInstanceDebugger(): JSX.Element | null {
  const isPrimaryAppInstance = useIsPrimaryAppInstance()

  return (
<<<<<<< HEAD
    // biome-ignore  lint/correctness/noRestrictedElements: needed here
=======
    // oxlint-disable-next-line react/forbid-elements -- needed here
>>>>>>> upstream/main
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        borderRadius: '5px',
        width: '5px',
        height: '5px',
        zIndex: Number.MAX_SAFE_INTEGER,
        background: isPrimaryAppInstance ? 'green' : 'red',
        color: 'white',
      }}
      title={`IsPrimaryAppInstance: ${isPrimaryAppInstance}`}
    />
  )
}
