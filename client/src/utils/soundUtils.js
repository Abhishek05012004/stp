// Enhanced sound utility functions with better error handling

// Create a simple beep sound using Web Audio API
const createBeepSound = (frequency = 800, duration = 0.3, volume = 0.3) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)

    return true
  } catch (error) {
    return false
  }
}

// Create success sound sequence
const createSuccessSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const notes = [523.25, 659.25, 783.99] // C5, E5, G5

    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = "sine"

      const startTime = audioContext.currentTime + index * 0.15
      gainNode.gain.setValueAtTime(0.2, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.3)
    })

    return true
  } catch (error) {
    return false
  }
}

export const playBeepSound = () => {
  try {
    // Try to create beep sound using Web Audio API
    createBeepSound(800, 0.5, 0.3)
  } catch (error) {
    // Silent fail
  }
}

export const playSuccessSound = () => {
  try {
    // Try to create success sound using Web Audio API
    createSuccessSound()
  } catch (error) {
    // Silent fail
  }
}

// Preload function (now just logs that audio is ready)
export const preloadAudio = () => {
  try {
    // Test if Web Audio API is available
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (AudioContext) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export const testAudio = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (AudioContext) {
      playBeepSound()
      setTimeout(() => {
        playSuccessSound()
      }, 1000)
    }
  } catch (error) {
    // Silent fail
  }
}
