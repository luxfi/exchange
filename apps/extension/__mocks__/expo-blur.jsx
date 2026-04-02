// Simple mock for expo-blur's BlurView
// We don't actually need to use `expo-blur` in the extension, as we just use CSS; so, we can mock it out.

export const BlurView = (props) => <div {...props} />

export default BlurView
