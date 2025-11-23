"use client"

import { useEffect, useRef, useState } from "react"
import countries from "../../data/countries"

const CANVAS_W = 1920
const CANVAS_H = 1080
const TOTAL_ROUNDS = 55
const QUIZ_DURATION = 10

// Calcular duração total aproximada do vídeo
const ROUND_TIME = QUIZ_DURATION + 3
const TOTAL_VIDEO_TIME = ROUND_TIME * TOTAL_ROUNDS

const SOUNDS = {
  correct: "/audio/sounds/correct.mp3",
  tick: "/audio/sounds/tick.mp3",
  background: "/audio/sounds/background-music.mp3",
  transition: "/audio/sounds/transition.mp3",
}

export default function QuizYouTube() {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const lastTimeRef = useRef(0)
  const frameInterval = 1000 / 45

  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const isRecordingRef = useRef(false)
  const recordingTimeoutRef = useRef(null)
  const recordingIntervalRef = useRef(null)
  const recordingStartTimeRef = useRef(0)

  const audioCtxRef = useRef(null)
  const destinationRef = useRef(null)

  const bgm = useRef(null)
  const tick = useRef(null)
  const voice = useRef(null)

  const [stage, setStage] = useState("idle")
  const [round, setRound] = useState(1)
  const [timer, setTimer] = useState(QUIZ_DURATION)
  const [isRevealing, setIsRevealing] = useState(false)
  const [currentCountry, setCurrentCountry] = useState(null)
  const [flagImage, setFlagImage] = useState(null)
  const [options, setOptions] = useState([])
  const [status, setStatus] = useState("")
  const [recordingTime, setRecordingTime] = useState(0)
  const [quizMode, setQuizMode] = useState("flag") // "flag" | "capital"
  const [usedCountries, setUsedCountries] = useState([]) // Track used countries

  const allCountries = countries

  const particlesRef = useRef([])
  const confettiRef = useRef([])
  const waveParticlesRef = useRef([])
  const bgParticlesRef = useRef([]) // New background particles
  const glitchOffsetRef = useRef({ x: 0, y: 0 })
  const pulseRef = useRef(0)

  const initAudioSystem = async () => {
    if (!audioCtxRef.current) {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const dest = audioCtx.createMediaStreamDestination()
      audioCtxRef.current = audioCtx
      destinationRef.current = dest
    }

    if (audioCtxRef.current.state === "suspended") {
      await audioCtxRef.current.resume()
    }

    return audioCtxRef.current
  }

  const playSound = async (url, volume = 1, loop = false) => {
    try {
      const audioCtx = audioCtxRef.current
      if (!audioCtx) return null

      const res = await fetch(url)
      if (!res.ok) throw new Error(`Falha ao carregar: ${url}`)

      const buf = await res.arrayBuffer()
      const audioBuffer = await audioCtx.decodeAudioData(buf)

      const src = audioCtx.createBufferSource()
      const gain = audioCtx.createGain()

      src.buffer = audioBuffer
      src.loop = loop
      gain.gain.value = volume

      src.connect(gain)
      gain.connect(destinationRef.current)
      gain.connect(audioCtx.destination)

      src.start(0)
      return src
    } catch (err) {
      console.warn("Erro ao tocar:", url, err.message)
      return null
    }
  }

  const stopSound = (ref) => {
    if (ref?.current) {
      try {
        ref.current.onended = null
        ref.current.stop()
      } catch {}
      ref.current = null
    }
  }

  const playBackground = async () => {
    stopSound(bgm)
    bgm.current = await playSound(SOUNDS.background, 0.15, true)
  }

  const playTick = async () => {
    stopSound(tick)
    tick.current = await playSound(SOUNDS.tick, 0.3)
  }

  const playCountryAudio = async (code) => {
    stopSound(voice)
    voice.current = await playSound(`/audio/countries/${code}.mp3`, 0.9)

    if (voice.current) {
      voice.current.onended = async () => {
        await playSound(SOUNDS.correct, 0.8)
        createConfetti()
      }
    } else {
      await playSound(SOUNDS.correct, 0.8)
      createConfetti()
    }
  }

  const playTransition = async () => {
    await playSound(SOUNDS.transition, 0.5)
  }

  const stopAllAudio = () => {
    stopSound(bgm)
    stopSound(tick)
    stopSound(voice)
  }

  const createParticles = () => {
    particlesRef.current = Array.from({ length: 150 }, (_, i) => ({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      baseX: Math.random() * CANVAS_W,
      baseY: Math.random() * CANVAS_H,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.8 + 0.2,
      offset: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? "rgba(138, 43, 226, 0.3)" : "rgba(0, 255, 255, 0.2)",
    }))
  }

  const createBgParticles = () => {
    bgParticlesRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      size: Math.random() * 100 + 50,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      color: `hsla(${Math.random() * 60 + 240}, 70%, 50%, 0.03)`,
    }))
  }

  const createWaveParticles = () => {
    waveParticlesRef.current = Array.from({ length: 80 }, () => ({
      angle: Math.random() * Math.PI * 2,
      distance: 0,
      speed: Math.random() * 10 + 5,
      size: Math.random() * 6 + 3,
      life: 1,
      color: Math.random() > 0.5 ? "#00FF88" : "#FFD700",
      shimmer: Math.random() * Math.PI * 2,
    }))
  }

  const createConfetti = () => {
    confettiRef.current = Array.from({ length: 250 }, () => ({
      x: CANVAS_W / 2,
      y: CANVAS_H / 2,
      vx: (Math.random() - 0.5) * 25,
      vy: (Math.random() - 0.5) * 25 - 12,
      size: Math.random() * 18 + 8,
      color: `hsl(${Math.random() * 360}, 100%, ${60 + Math.random() * 20}%)`,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 40,
      gravity: 0.5,
      life: 1,
      shape: Math.floor(Math.random() * 4),
      shimmer: Math.random() * Math.PI * 2,
    }))
  }

  const startRecording = async () => {
    try {
      const canvas = canvasRef.current
      if (!canvas) throw new Error("Canvas não encontrado")

      await initAudioSystem()

      const canvasStream = canvas.captureStream(30)
      const audioStream = destinationRef.current.stream

      const mixedStream = new MediaStream([...canvasStream.getVideoTracks(), ...audioStream.getAudioTracks()])

      const options = {
        mimeType: "video/webm;codecs=vp8,opus",
        videoBitsPerSecond: 8000000, // Increased bitrate for better quality
        audioBitsPerSecond: 192000,
      }

      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "video/webm"
      }

      recordedChunksRef.current = []
      const recorder = new MediaRecorder(mixedStream, options)

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data)
        }
      }

      recorder.onstop = () => {
        processFinalVideo()
      }

      recorder.start(500)
      mediaRecorderRef.current = recorder
      isRecordingRef.current = true
      recordingStartTimeRef.current = Date.now()
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000)
        setRecordingTime(elapsed)
      }, 1000)

      // Aumentar timeout para 10 minutos (600 segundos)
      recordingTimeoutRef.current = setTimeout(() => {
        forceStopRecording()
      }, 600000)

      setStatus("🎥 Gravando para YouTube...")
      await playBackground()
      createParticles()
      createBgParticles()
    } catch (err) {
      console.error("Erro ao iniciar gravação:", err)
      setStatus("❌ Erro ao iniciar gravação")
    }
  }

  const clearRecordingTimers = () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current)
      recordingTimeoutRef.current = null
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
      recordingIntervalRef.current = null
    }
  }

  const forceStopRecording = () => {
    if (isRecordingRef.current && mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
      }

      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => {
          track.stop()
        })
      }

      isRecordingRef.current = false
      stopAllAudio()
      clearRecordingTimers()

      setStatus("⏳ Finalizando vídeo...")
    }
  }

  const stopRecording = () => {
    forceStopRecording()
  }

  const processFinalVideo = () => {
    try {
      setStatus("🎬 Quase pronto...")

      const chunks = recordedChunksRef.current
      if (!chunks || chunks.length === 0) {
        throw new Error("Nenhum dado foi gravado")
      }

      const finalBlob = new Blob(chunks, { type: "video/webm" })

      if (finalBlob.size === 0) {
        throw new Error("Vídeo final vazio")
      }

      downloadVideo(finalBlob)
    } catch (err) {
      console.error("Erro no processamento:", err)
      setStatus("❌ Erro ao processar vídeo")
    }
  }

  const downloadVideo = (blob) => {
    try {
      setStatus("📱 Baixando vídeo...")

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `quiz-youtube-30rodadas-${Date.now()}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      setTimeout(() => {
        URL.revokeObjectURL(url)
        setStatus(`✅ Pronto para YouTube!`)

        setTimeout(() => {
          setStage("idle")
          setRound(1)
          setRecordingTime(0)
          setStatus("")
        }, 3000)
      }, 1000)
    } catch (err) {
      console.error("Erro no download:", err)
      setStatus("❌ Erro ao baixar vídeo")
    }
  }

  async function loadFlag(code) {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = `/flags/${code}.svg`
      img.onload = () => resolve(img)
      img.onerror = () => resolve(null)
    })
  }

  function pickRandomCountry(excludeList = []) {
    const available = allCountries.filter(c => !excludeList.includes(c.code))
    if (available.length === 0) {
        // Fallback if all countries used (unlikely with 55 rounds but safe to have)
        return allCountries[Math.floor(Math.random() * allCountries.length)]
    }
    return available[Math.floor(Math.random() * available.length)]
  }

  function generateOptions(correct) {
    const opts = [correct]
    while (opts.length < 4) {
      // For options, we can pick any country, even if used before, 
      // but usually better to pick random ones. 
      // We don't need to exclude 'usedCountries' for distractors, only for the correct answer.
      const c = allCountries[Math.floor(Math.random() * allCountries.length)]
      if (!opts.find((o) => o.code === c.code)) opts.push(c)
    }
    return opts.sort(() => Math.random() - 0.5)
  }

  const startQuiz = async () => {
    try {
      setStage("running")
      setRound(1)
      setTimer(QUIZ_DURATION)
      setStatus("🎮 Iniciando desafio...")
      setUsedCountries([]) // Reset used countries

      recordedChunksRef.current = []
      isRecordingRef.current = false
      mediaRecorderRef.current = null
      setRecordingTime(0)
      clearRecordingTimers()

      setTimeout(() => {
        startRecording()
      }, 800)

      // Start first round after a small delay to ensure recording started
      setTimeout(() => {
          startRound([])
      }, 1000)
      
    } catch (err) {
      console.error("Erro ao iniciar quiz:", err)
      setStatus("❌ Erro ao iniciar")
    }
  }

  const startRound = async (currentUsed = usedCountries) => {
    const c = pickRandomCountry(currentUsed)
    
    // Update used countries
    const newUsed = [...currentUsed, c.code]
    setUsedCountries(newUsed)

    const img = await loadFlag(c.code)
    setCurrentCountry(c)
    setFlagImage(img)
    setOptions(generateOptions(c))
    setTimer(QUIZ_DURATION)
    setIsRevealing(false)
  }

  useEffect(() => {
    if (stage !== "running" || isRevealing) return

    if (timer > 0 && timer <= 5) {
      playTick()
    }

    if (timer <= 0) {
      revealFlag()
      return
    }

    const id = setTimeout(() => setTimer((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [stage, timer, isRevealing])

  const revealFlag = () => {
    setIsRevealing(true)
    stopSound(tick)

    createWaveParticles()

    if (currentCountry) {
      playCountryAudio(currentCountry.code)
    }

    setTimeout(async () => {
      if (round >= TOTAL_ROUNDS) {
        stopRecording()
      } else {
        await playTransition()
        setRound((r) => r + 1)
        startRound(usedCountries) // Pass current used countries
      }
    }, 3000)
  }

  const drawScene = (ctx) => {
    const w = CANVAS_W
    const h = CANVAS_H
    const time = Date.now() * 0.001

    pulseRef.current = time

    // Enhanced Background
    const bgGradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h))
    bgGradient.addColorStop(0, "#2a004d") // Slightly lighter purple center
    bgGradient.addColorStop(0.5, "#15002b")
    bgGradient.addColorStop(1, "#05000a") // Deep dark corners
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, w, h)

    // Background Particles (Floating blobs)
    bgParticlesRef.current.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY
        if (p.x < -p.size) p.x = w + p.size
        if (p.x > w + p.size) p.x = -p.size
        if (p.y < -p.size) p.y = h + p.size
        if (p.y > h + p.size) p.y = -p.size
        
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
    })

    // Grid
    ctx.strokeStyle = "rgba(138, 43, 226, 0.05)"
    ctx.lineWidth = 2
    const gridSize = 100
    const offsetX = (time * 15) % gridSize
    const offsetY = (time * 15) % gridSize

    // Perspective Grid Effect
    ctx.save()
    // ctx.translate(w/2, h/2)
    // ctx.scale(1 + Math.sin(time * 0.1) * 0.05, 1 + Math.sin(time * 0.1) * 0.05)
    // ctx.translate(-w/2, -h/2)
    
    for (let x = -offsetX; x < w; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }

    for (let y = -offsetY; y < h; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
    ctx.restore()

    // Active Particles
    particlesRef.current.forEach((p, i) => {
      const wave = Math.sin(time * p.speed + p.offset) * 50
      p.x = p.baseX + wave
      p.y = p.baseY + Math.cos(time * p.speed * 0.5 + p.offset) * 30

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
      gradient.addColorStop(0, p.color)
      gradient.addColorStop(1, "rgba(0,0,0,0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = "rgba(255,255,255,0.8)"
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
      ctx.fill()
    })

    // Wave Particles (Explosion effect)
    waveParticlesRef.current.forEach((p, i) => {
      const centerX = w / 2
      const centerY = h / 2

      const x = centerX + Math.cos(p.angle) * p.distance
      const y = centerY + Math.sin(p.angle) * p.distance

      ctx.fillStyle = p.color
      ctx.globalAlpha = p.life
      const shimmer = Math.sin(p.shimmer + time * 10) * 0.3 + 0.7
      ctx.beginPath()
      ctx.arc(x, y, p.size * p.life * shimmer, 0, Math.PI * 2)
      ctx.fill()

      p.distance += p.speed
      p.life -= 0.015

      if (p.life <= 0) {
        waveParticlesRef.current.splice(i, 1)
      }
    })

    // Confetti
    confettiRef.current.forEach((c, i) => {
      ctx.save()
      ctx.translate(c.x, c.y)
      ctx.rotate((c.rotation * Math.PI) / 180)

      ctx.globalAlpha = c.life
      const shimmer = Math.sin(c.shimmer + time * 5) * 0.3 + 0.7
      ctx.fillStyle = c.color
      ctx.shadowColor = c.color
      ctx.shadowBlur = 15 * shimmer

      if (c.shape === 0) {
        ctx.fillRect(-c.size / 2, -c.size / 3, c.size, c.size / 1.5)
      } else if (c.shape === 1) {
        ctx.beginPath()
        ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2)
        ctx.fill()
      } else if (c.shape === 2) {
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
          const x = (Math.cos(angle) * c.size) / 2
          const y = (Math.sin(angle) * c.size) / 2
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
      } else {
        ctx.beginPath()
        ctx.moveTo(0, -c.size / 2)
        ctx.quadraticCurveTo(c.size / 2, -c.size / 3, c.size / 2, 0)
        ctx.quadraticCurveTo(c.size / 2, c.size / 3, 0, c.size / 2)
        ctx.quadraticCurveTo(-c.size / 2, c.size / 3, -c.size / 2, 0)
        ctx.quadraticCurveTo(-c.size / 2, -c.size / 3, 0, -c.size / 2)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()

      c.x += c.vx
      c.y += c.vy
      c.vy += c.gravity
      c.rotation += c.rotationSpeed
      c.life -= 0.01
      c.vx *= 0.99
      c.shimmer += 0.1

      if (c.life <= 0) {
        confettiRef.current.splice(i, 1)
      }
    })

    ctx.globalAlpha = 1
    ctx.shadowBlur = 0

    // Glitch Effect for Title
    if (timer <= 5 && timer > 0) {
      glitchOffsetRef.current = {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
      }
    } else {
      glitchOffsetRef.current = { x: 0, y: 0 }
    }

    ctx.textAlign = "center"

    // Title Rendering
    const titleY = 100
    ctx.font = "900 80px 'Arial Black', sans-serif"

    const titleText = quizMode === "capital" ? "DESAFIO DAS CAPITAIS" : "DESAFIO DAS BANDEIRAS"

    if (timer <= 5 && timer > 0) {
      ctx.fillStyle = "rgba(255, 0, 255, 0.7)"
      ctx.fillText(titleText, w / 2 - 4, titleY - 4)

      ctx.fillStyle = "rgba(0, 255, 255, 0.7)"
      ctx.fillText(titleText, w / 2 + 4, titleY + 4)
    }

    ctx.shadowColor = "rgba(0,0,0,0.8)"
    ctx.shadowBlur = 20
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText(titleText, w / 2 + glitchOffsetRef.current.x, titleY + glitchOffsetRef.current.y)
    ctx.shadowBlur = 0

    // Progress Bar
    const progressBarWidth = 700
    const progressBarHeight = 16
    const progressBarX = (w - progressBarWidth) / 2
    const progressBarY = 200

    // Bar Background
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    ctx.beginPath()
    ctx.roundRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight, 8)
    ctx.fill()

    // Current Progress
    const progress = (round - 1) / TOTAL_ROUNDS
    const currentProgressWidth = progressBarWidth * progress

    const progressGradient = ctx.createLinearGradient(progressBarX, progressBarY, progressBarX + progressBarWidth, progressBarY)
    progressGradient.addColorStop(0, "#8A2BE2")
    progressGradient.addColorStop(0.5, "#FF1493")
    progressGradient.addColorStop(1, "#FFD700")

    ctx.fillStyle = progressGradient
    ctx.shadowColor = "#FF1493"
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.roundRect(progressBarX, progressBarY, currentProgressWidth, progressBarHeight, 8)
    ctx.fill()
    ctx.shadowBlur = 0

    // Round Text
    ctx.font = "bold 42px 'Arial', sans-serif"
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.shadowColor = "rgba(0,0,0,0.8)"
    ctx.shadowBlur = 10
    ctx.fillText(`RODADA ${round}/${TOTAL_ROUNDS}`, w / 2, 170)
    ctx.shadowBlur = 0

    // Flag Box
    const flagBoxX = w * 0.1
    const flagBoxY = h * 0.26
    const flagBoxW = w * 0.8
    const flagBoxH = h * 0.45

    const borderPulse = Math.sin(time * 3) * 0.2 + 0.8

    // Box Shadow/Glow
    ctx.shadowColor = "rgba(138, 43, 226, 0.4)"
    ctx.shadowBlur = 50 * borderPulse
    
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
    ctx.beginPath()
    ctx.roundRect(flagBoxX, flagBoxY, flagBoxW, flagBoxH, 30)
    ctx.fill()
    ctx.shadowBlur = 0

    // Inner Border
    ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(flagBoxX + 15, flagBoxY + 15, flagBoxW - 30, flagBoxH - 30, 20)
    ctx.stroke()

    // Tech Corners
    const cornerSize = 40
    const cornerThick = 6
    ctx.strokeStyle = "#FFD700"
    ctx.lineWidth = cornerThick
    ctx.lineCap = "round"
    ctx.shadowColor = "#FFD700"
    ctx.shadowBlur = 15

    // Top Left
    ctx.beginPath()
    ctx.moveTo(flagBoxX, flagBoxY + cornerSize)
    ctx.lineTo(flagBoxX, flagBoxY)
    ctx.lineTo(flagBoxX + cornerSize, flagBoxY)
    ctx.stroke()

    // Top Right
    ctx.beginPath()
    ctx.moveTo(flagBoxX + flagBoxW - cornerSize, flagBoxY)
    ctx.lineTo(flagBoxX + flagBoxW, flagBoxY)
    ctx.lineTo(flagBoxX + flagBoxW, flagBoxY + cornerSize)
    ctx.stroke()

    // Bottom Left
    ctx.beginPath()
    ctx.moveTo(flagBoxX, flagBoxY + flagBoxH - cornerSize)
    ctx.lineTo(flagBoxX, flagBoxY + flagBoxH)
    ctx.lineTo(flagBoxX + cornerSize, flagBoxY + flagBoxH)
    ctx.stroke()

    // Bottom Right
    ctx.beginPath()
    ctx.moveTo(flagBoxX + flagBoxW - cornerSize, flagBoxY + flagBoxH)
    ctx.lineTo(flagBoxX + flagBoxW, flagBoxY + flagBoxH)
    ctx.lineTo(flagBoxX + flagBoxW, flagBoxY + flagBoxH - cornerSize)
    ctx.stroke()

    ctx.shadowBlur = 0
    ctx.lineCap = "butt"

    // Flag Image
    if (flagImage) {
      const img = flagImage
      const ar = img.width / img.height
      let dw = flagBoxW * 0.7
      let dh = dw / ar

      if (dh > flagBoxH * 0.7) {
        dh = flagBoxH * 0.7
        dw = dh * ar
      }

      const dx = (w - dw) / 2
      const dy = flagBoxY + (flagBoxH - dh) / 2

      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 8
      ctx.strokeRect(dx - 4, dy - 4, dw + 8, dh + 8)

      ctx.shadowColor = "rgba(0, 0, 0, 0.8)"
      ctx.shadowBlur = 30
      ctx.shadowOffsetY = 10
      ctx.drawImage(img, dx, dy, dw, dh)
      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0
    }

    // Timer
    const timerX = w / 2
    const timerY = flagBoxY + flagBoxH + 70

    const timerPulse = Math.sin(time * 5) * 0.1 + 0.9

    // Timer Background Ring
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 15
    ctx.beginPath()
    ctx.arc(timerX, timerY, 60, 0, Math.PI * 2)
    ctx.stroke()

    // Timer Progress Ring
    const progressTimer = timer / QUIZ_DURATION
    const angle = -Math.PI / 2 + Math.PI * 2 * progressTimer

    if (timer <= 5) {
      ctx.strokeStyle = `rgba(255, 50, 50, ${timerPulse})`
      ctx.shadowColor = "#FF3232"
      ctx.shadowBlur = 25
    } else {
      ctx.strokeStyle = "#00FF88"
      ctx.shadowColor = "#00FF88"
      ctx.shadowBlur = 15
    }

    ctx.lineWidth = 15
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.arc(timerX, timerY, 60, -Math.PI / 2, angle)
    ctx.stroke()
    ctx.lineCap = "butt"
    ctx.shadowBlur = 0

    // Timer Text
    ctx.fillStyle = timer <= 5 ? "#FF3232" : "#FFFFFF"
    ctx.font = "bold 60px 'Arial', sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    if (timer <= 5) {
      ctx.shadowColor = "#FF3232"
      ctx.shadowBlur = 20
    }

    ctx.fillText(timer.toString(), timerX, timerY + 4) // +4 for visual centering
    ctx.shadowBlur = 0

    // Options
    const optionsContainerY = timerY + 70
    const optionHeight = 75
    const optionSpacing = 20

    const optionsPerRow = 2
    const optionWidth = (w * 0.8) / optionsPerRow - optionSpacing

    options.forEach((opt, i) => {
      const row = Math.floor(i / optionsPerRow)
      const col = i % optionsPerRow
      
      // Centering logic
      const startX = w * 0.1 + optionSpacing / 2
      const x = startX + col * (optionWidth + optionSpacing)
      const y = optionsContainerY + row * (optionHeight + optionSpacing)
      
      const isCorrect = isRevealing && opt.code === currentCountry?.code
      const isWrong = isRevealing && opt.code !== currentCountry?.code

      // Option Background
      ctx.fillStyle = "rgba(20, 20, 30, 0.8)"
      ctx.beginPath()
      ctx.roundRect(x, y, optionWidth, optionHeight, 15)
      ctx.fill()

      if (isCorrect) {
        const correctGrad = ctx.createLinearGradient(x, y, x + optionWidth, y)
        correctGrad.addColorStop(0, "rgba(0, 255, 136, 0.6)")
        correctGrad.addColorStop(1, "rgba(0, 200, 100, 0.6)")
        ctx.fillStyle = correctGrad
        ctx.fill()
        
        ctx.strokeStyle = "#00FF88"
        ctx.lineWidth = 4
        ctx.stroke()
      } else if (isWrong) {
        ctx.fillStyle = "rgba(255, 68, 68, 0.3)"
        ctx.fill()
        
        ctx.strokeStyle = "#FF4444"
        ctx.lineWidth = 3
        ctx.stroke()
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Option Text
      ctx.font = "bold 34px 'Arial', sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillStyle = "#FFFFFF"

      if (isCorrect) {
        ctx.shadowColor = "#00FF88"
        ctx.shadowBlur = 10
        ctx.fillStyle = "#FFFFFF"
      } else if (isWrong) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
      }

      const textX = x + optionWidth / 2
      const textY = y + optionHeight / 2
      
      // Quebra de texto para nomes longos
      const textToDisplay = quizMode === "capital" ? opt.capital : opt.name
      const words = textToDisplay.toUpperCase().split(' ')
      let lines = []
      let currentLine = words[0]
      
      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i]
        const metrics = ctx.measureText(testLine)
        if (metrics.width < optionWidth - 60) {
          currentLine = testLine
        } else {
          lines.push(currentLine)
          currentLine = words[i]
        }
      }
      lines.push(currentLine)
      
      if (lines.length === 1) {
        ctx.fillText(lines[0], textX, textY)
      } else {
        const lineHeight = 36
        const startY = textY - (lines.length - 1) * lineHeight / 2
        lines.forEach((line, index) => {
          ctx.fillText(line, textX, startY + index * lineHeight)
        })
      }
      
      ctx.shadowBlur = 0

      if (isCorrect) {
        ctx.fillStyle = "#FFD700"
        ctx.font = "bold 45px 'Arial', sans-serif"
        ctx.shadowColor = "#FFD700"
        ctx.shadowBlur = 20
        ctx.fillText("✓", x + optionWidth - 40, textY)
        ctx.shadowBlur = 0
      }
    })

    // Reveal Banner
    if (isRevealing && currentCountry) {
      const bannerHeight = 120
      const bannerY = timerY - 140

      // Banner Background with Glow
      const bannerGrad = ctx.createLinearGradient(0, bannerY, 0, bannerY + bannerHeight)
      bannerGrad.addColorStop(0, "rgba(0, 0, 0, 0.6)")
      bannerGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.9)")
      bannerGrad.addColorStop(1, "rgba(0, 0, 0, 0.6)")
      ctx.fillStyle = bannerGrad
      ctx.fillRect(0, bannerY, w, bannerHeight)

      // Gold Borders
      ctx.strokeStyle = "#FFD700"
      ctx.lineWidth = 4
      ctx.shadowColor = "#FFD700"
      ctx.shadowBlur = 20
      
      ctx.beginPath()
      ctx.moveTo(0, bannerY)
      ctx.lineTo(w, bannerY)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, bannerY + bannerHeight)
      ctx.lineTo(w, bannerY + bannerHeight)
      ctx.stroke()
      ctx.shadowBlur = 0

      // Answer Text
      ctx.font = "900 80px 'Arial Black', sans-serif"
      ctx.textAlign = "center"

      const answerText = quizMode === "capital" ? currentCountry.capital : currentCountry.name
      
      // Text Shadow/Outline
      ctx.strokeStyle = "black"
      ctx.lineWidth = 8
      ctx.strokeText(answerText.toUpperCase(), w / 2, bannerY + 85)

      ctx.fillStyle = "#00FF88"
      ctx.shadowColor = "#00FF88"
      ctx.shadowBlur = 30
      ctx.fillText(answerText.toUpperCase(), w / 2, bannerY + 85)
      ctx.shadowBlur = 0
    }
  }

  useEffect(() => {
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2
        if (height < 2 * radius) radius = height / 2
        this.beginPath()
        this.moveTo(x + radius, y)
        this.arcTo(x + width, y, x + width, y + height, radius)
        this.arcTo(x + width, y + height, x, y + height, radius)
        this.arcTo(x, y + height, x, y, radius)
        this.arcTo(x, y, x + width, y, radius)
        this.closePath()
        return this
      }
    }
  }, [])

  useEffect(() => {
    if (stage !== "running") return

    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return

    const loop = (currentTime) => {
      if (currentTime - lastTimeRef.current >= frameInterval) {
        drawScene(ctx)
        lastTimeRef.current = currentTime
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [stage, flagImage, options, timer, status, isRevealing, round, currentCountry, recordingTime, quizMode, usedCountries])

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #1a0033 0%, #000000 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        padding: 20,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {stage === "idle" && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at center, rgba(138, 43, 226, 0.1) 0%, transparent 70%)",
              animation: "pulse 4s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(138, 43, 226, 0.8);
          }
        }
      `}</style>

      {stage === "idle" ? (
        <div
          style={{
            textAlign: "center",
            maxWidth: 900,
            width: "100%",
            zIndex: 2,
            background: "rgba(10, 10, 20, 0.6)",
            backdropFilter: "blur(20px)",
            padding: "60px",
            borderRadius: "30px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <h1
              style={{
                fontSize: "4.5rem",
                marginBottom: "10px",
                background: "linear-gradient(to right, #fff, #ccc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "900",
                letterSpacing: "-2px",
                marginTop: "0",
                filter: "drop-shadow(0 0 30px rgba(138, 43, 226, 0.5))",
              }}
            >
              QUIZ STUDIO
            </h1>
            <div
              style={{
                height: "4px",
                width: "100px",
                background: "linear-gradient(90deg, transparent, #8A2BE2, transparent)",
                margin: "0 auto",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              width: "100%",
              marginBottom: "10px",
            }}
          >
            <button
              onClick={() => setQuizMode("flag")}
              style={{
                padding: "30px",
                borderRadius: "20px",
                border: "2px solid",
                borderColor: quizMode === "flag" ? "#FFD700" : "rgba(255, 255, 255, 0.1)",
                background: quizMode === "flag" 
                  ? "linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.05) 100%)" 
                  : "rgba(255, 255, 255, 0.03)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.borderColor = "#FFD700"
              }}
              onMouseOut={(e) => {
                if (quizMode !== "flag") {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"
                } else {
                  e.currentTarget.style.transform = "translateY(0)"
                }
              }}
            >
              <span style={{ fontSize: "3.5rem", filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.4))" }}>🏳️</span>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#FFF", marginBottom: "5px" }}>BANDEIRAS</div>
                <div style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.6)" }}>Adivinhe o país pela bandeira</div>
              </div>
              {quizMode === "flag" && (
                <div style={{ 
                  position: "absolute", top: "15px", right: "15px", 
                  background: "#FFD700", color: "#000", padding: "5px 10px", 
                  borderRadius: "10px", fontSize: "0.8rem", fontWeight: "bold" 
                }}>
                  ATIVO
                </div>
              )}
            </button>

            <button
              onClick={() => setQuizMode("capital")}
              style={{
                padding: "30px",
                borderRadius: "20px",
                border: "2px solid",
                borderColor: quizMode === "capital" ? "#00FF88" : "rgba(255, 255, 255, 0.1)",
                background: quizMode === "capital" 
                  ? "linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.05) 100%)" 
                  : "rgba(255, 255, 255, 0.03)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.borderColor = "#00FF88"
              }}
              onMouseOut={(e) => {
                if (quizMode !== "capital") {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)"
                } else {
                  e.currentTarget.style.transform = "translateY(0)"
                }
              }}
            >
              <span style={{ fontSize: "3.5rem", filter: "drop-shadow(0 0 20px rgba(0, 255, 136, 0.4))" }}>🏙️</span>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#FFF", marginBottom: "5px" }}>CAPITAIS</div>
                <div style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.6)" }}>Adivinhe a capital do país</div>
              </div>
              {quizMode === "capital" && (
                <div style={{ 
                  position: "absolute", top: "15px", right: "15px", 
                  background: "#00FF88", color: "#000", padding: "5px 10px", 
                  borderRadius: "10px", fontSize: "0.8rem", fontWeight: "bold" 
                }}>
                  ATIVO
                </div>
              )}
            </button>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              padding: "20px 40px",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              gap: "40px",
              alignItems: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: "900", color: "#FFF" }}>{TOTAL_ROUNDS}</div>
              <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.6 }}>Rodadas</div>
            </div>
            <div style={{ width: "1px", height: "40px", background: "rgba(255, 255, 255, 0.1)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: "900", color: "#FFF" }}>{QUIZ_DURATION}s</div>
              <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.6 }}>Por Rodada</div>
            </div>
            <div style={{ width: "1px", height: "40px", background: "rgba(255, 255, 255, 0.1)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: "900", color: "#FFF" }}>16:9</div>
              <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.6 }}>YouTube</div>
            </div>
          </div>

          <button
            onClick={startQuiz}
            style={{
              background: "linear-gradient(135deg, #8A2BE2 0%, #FF1493 100%)",
              border: "none",
              padding: "25px 80px",
              fontSize: "1.5rem",
              borderRadius: "50px",
              cursor: "pointer",
              color: "#FFF",
              fontWeight: "900",
              boxShadow: "0 10px 40px rgba(138, 43, 226, 0.4)",
              transition: "all 0.3s",
              textTransform: "uppercase",
              letterSpacing: "1px",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px) scale(1.02)"
              e.target.style.boxShadow = "0 20px 50px rgba(138, 43, 226, 0.6)"
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0) scale(1)"
              e.target.style.boxShadow = "0 10px 40px rgba(138, 43, 226, 0.4)"
            }}
          >
            INICIAR GRAVAÇÃO
          </button>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{
            width: "100%",
            maxWidth: 800,
            height: "auto",
            borderRadius: "20px",
            boxShadow: "0 0 40px rgba(138, 43, 226, 0.5), 0 20px 60px rgba(0, 0, 0, 0.5)",
            border: "2px solid rgba(138, 43, 226, 0.5)",
            animation: "glow 2s ease-in-out infinite",
          }}
        />
      )}
    </div>
  )
}