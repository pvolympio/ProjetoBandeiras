"use client"


import { useEffect, useRef, useState } from "react"
import countries from "../../data/countries"


// --- CONFIGURAÇÕES GERAIS ---
const CANVAS_W = 1080
const CANVAS_H = 1920
const TOTAL_ROUNDS = 5
const QUIZ_DURATION = 8


// Coloque seu @ aqui para aparecer no rodapé (Opcional)
const MY_USER = "@MisterCreative02"


const SOUNDS = {
  correct: "/audio/sounds/correct.mp3",
  tick: "/audio/sounds/tick.mp3",
  background: "/audio/sounds/background-music.mp3",
  transition: "/audio/sounds/transition.mp3",
}


// --- BANCO DE DADOS E LÓGICA (Mantido do seu código) ---
const EASY_COUNTRIES = ["br", "us", "ar", "pt", "es", "fr", "de", "it", "jp", "cn", "ru", "gb", "ca", "au", "mx", "in", "kr"]
const MEDIUM_COUNTRIES = ["za", "eg", "tr", "gr", "se", "no", "fi", "dk", "nl", "be", "ch", "at", "co", "cl", "pe", "uy", "ua", "pl", "ie", "sa", "ae", "th", "id", "nz", "jm", "cu"]


const AMERICAS_CODES = ["br", "us", "ar", "ca", "mx", "cl", "co", "pe", "uy", "ve", "bo", "py", "ec", "cu", "jm", "ht", "do", "cr", "pa", "sv", "gt", "hn", "ni", "bs", "bb", "tt"]
const EUROPE_CODES = ["pt", "es", "fr", "de", "it", "gb", "ru", "ua", "pl", "nl", "be", "ch", "at", "gr", "tr", "se", "no", "fi", "dk", "ie", "cz", "hu", "ro", "bg", "hr", "rs", "ba", "al", "xk", "is"]
const ASIA_CODES = ["jp", "cn", "kr", "in", "id", "th", "vn", "ph", "my", "sg", "pk", "bd", "sa", "ae", "qa", "kw", "bh", "om", "lb", "il", "jo", "sy", "iq", "ir", "kz", "uz", "mn"]
const AFRICA_CODES = ["za", "eg", "ng", "gh", "ke", "tz", "ma", "dz", "tn", "sn", "ci", "cm", "ao", "mz", "et", "ug", "zw", "na", "mg", "td", "so", "ly"]


const CONFUSING_FLAGS = {
  "td": ["ro", "md", "ad"], "ro": ["td", "md", "be"], "id": ["mc", "pl", "sg"],
  "mc": ["id", "pl", "at"], "pl": ["id", "mc", "bh"], "au": ["nz", "gb", "fj"],
  "nz": ["au", "gb", "ms"], "ie": ["ci", "it", "in"], "ci": ["ie", "it", "gn"],
  "ml": ["gn", "gh", "sn"], "gn": ["ml", "gh", "bo"], "ve": ["ec", "co", "am"],
  "ec": ["ve", "co", "gh"], "co": ["ec", "ve", "am"], "mx": ["it", "hu", "ir"],
  "it": ["mx", "hu", "ie"], "nl": ["lu", "fr", "py"], "lu": ["nl", "fr", "hr"],
  "ru": ["si", "sk", "fr"], "us": ["lr", "my", "cu"], "lr": ["us", "my", "tg"],
  "cu": ["pr", "ph", "cz"], "cl": ["cz", "tx", "pl"], "jp": ["bd", "pw", "gl"],
  "bd": ["jp", "pw", "sa"]
}


const THEMES = [
  { id: 'mix', label: '🔥 Viral Mix', color: 'from-purple-600 to-pink-600', title: 'VOCÊ É UM GÊNIO?' },
  { id: 'americas', label: '🌎 Américas', color: 'from-blue-500 to-green-500', title: 'CONHECE SEU CONTINENTE?' },
  { id: 'europe', label: '🇪🇺 Europa', color: 'from-blue-700 to-indigo-500', title: 'NÍVEL: VIAJANTE ✈️' },
  { id: 'asia', label: '⛩️ Ásia', color: 'from-red-500 to-yellow-500', title: 'MODO ASIÁTICO 🧠' },
  { id: 'africa', label: '🌍 África', color: 'from-green-600 to-yellow-600', title: 'NINGUÉM ACERTA A 3ª' },
  { id: 'hard', label: '💀 Insano', color: 'from-red-700 to-black', title: 'SÓ PARA ESPECIALISTAS' },
]


// --- SISTEMA DE PARTÍCULAS (NOVO) ---
const PARTICLES_COUNT = 60
const particlesInit = Array.from({ length: PARTICLES_COUNT }).map(() => ({
  x: Math.random() * CANVAS_W,
  y: Math.random() * CANVAS_H,
  vx: (Math.random() - 0.5) * 1.5,
  vy: (Math.random() - 0.5) * 1.5,
  size: Math.random() * 3 + 1,
  alpha: Math.random()
}))


export default function QuizTikTok() {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const lastTimeRef = useRef(0)
  const frameInterval = 1000 / 30


  // Novo: Ref para Partículas
  const particlesRef = useRef(particlesInit)


  // Refs de Mídia
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const isRecordingRef = useRef(false)
  const bgVideoRef = useRef(null)
 
  // Refs Lógicos
  const usedCountriesRef = useRef(new Set())
  const audioCtxRef = useRef(null)
  const destinationRef = useRef(null)
  const bgm = useRef(null)
  const tick = useRef(null)


  // Estados
  const [stage, setStage] = useState("idle")
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0])
  const [round, setRound] = useState(1)
  const [timer, setTimer] = useState(QUIZ_DURATION)
  const [isRevealing, setIsRevealing] = useState(false)
  const [scoreBoard, setScoreBoard] = useState([])
 
  const [currentCountry, setCurrentCountry] = useState(null)
  const [flagImage, setFlagImage] = useState(null)
  const [options, setOptions] = useState([])
  const [status, setStatus] = useState("")


  // --- INICIALIZAÇÃO DO VÍDEO DE FUNDO ---
  useEffect(() => {
    // Tenta carregar se existir na pasta public
    if (typeof document !== 'undefined') {
        const vid = document.createElement("video")
        vid.src = "/background.mp4"
        vid.loop = true; vid.muted = true; vid.playsInline = true;
        vid.load()
        bgVideoRef.current = vid
    }
  }, [])
 
  // --- HELPERS LÓGICOS (Mantidos) ---
  const getDifficultyByRound = (r) => {
    if (r <= 2) return "easy"
    if (r === 3) return "medium"
    return "hard"
  }


  const getRegionCodes = (code) => {
    if (AMERICAS_CODES.includes(code)) return AMERICAS_CODES
    if (EUROPE_CODES.includes(code)) return EUROPE_CODES
    if (ASIA_CODES.includes(code)) return ASIA_CODES
    if (AFRICA_CODES.includes(code)) return AFRICA_CODES
    return []
  }


  // --- ÁUDIO SYSTEM (Mantido) ---
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
      if (!res.ok) return null
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
    } catch (err) { return null }
  }


  const stopSound = (ref) => {
    if (ref?.current) {
      try { ref.current.stop() } catch {}
      ref.current = null
    }
  }


  // --- SELEÇÃO DE PAÍSES (Mantido) ---
  function pickRandomCountry() {
    let pool = []
    switch (selectedTheme.id) {
      case 'mix':
        const difficulty = getDifficultyByRound(round)
        if (difficulty === "easy") pool = countries.filter(c => EASY_COUNTRIES.includes(c.code))
        else if (difficulty === "medium") pool = countries.filter(c => MEDIUM_COUNTRIES.includes(c.code))
        else pool = countries.filter(c => !EASY_COUNTRIES.includes(c.code) && !MEDIUM_COUNTRIES.includes(c.code))
        break;
      case 'americas': pool = countries.filter(c => AMERICAS_CODES.includes(c.code)); break;
      case 'europe': pool = countries.filter(c => EUROPE_CODES.includes(c.code)); break;
      case 'asia': pool = countries.filter(c => ASIA_CODES.includes(c.code)); break;
      case 'africa': pool = countries.filter(c => AFRICA_CODES.includes(c.code)); break;
      case 'hard': pool = countries.filter(c => !EASY_COUNTRIES.includes(c.code) && !MEDIUM_COUNTRIES.includes(c.code)); break;
      default: pool = countries;
    }
    let available = pool.filter(c => !usedCountriesRef.current.has(c.code))
    if (available.length === 0) {
        if (pool.length > 0) available = pool
        else available = countries.filter(c => !usedCountriesRef.current.has(c.code))
    }
    const selected = available[Math.floor(Math.random() * available.length)] || countries[0]
    usedCountriesRef.current.add(selected.code)
    return selected
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


  // --- CONTROLE DE FLUXO (Mantido) ---
  const startQuiz = async () => {
    usedCountriesRef.current.clear()
    setScoreBoard([])
    setStage("running")
    setRound(1)
   
    await initAudioSystem()
    stopSound(bgm)
    bgm.current = await playSound(SOUNDS.background, 0.2, true)
   
    if(bgVideoRef.current) bgVideoRef.current.play().catch(() => {})
   
    setTimeout(() => startRecording(), 600)
    startRound()
  }


  const startRound = async () => {
    const c = pickRandomCountry()
    const img = await loadFlag(c.code)
   
    let distractors = []
    // Lógica de distratores mantida
    if (CONFUSING_FLAGS[c.code]) {
       const confusingCodes = CONFUSING_FLAGS[c.code]
       distractors = countries.filter(country => confusingCodes.includes(country.code))
    }
    if (distractors.length < 3) {
        const regionCodes = getRegionCodes(c.code)
        const regionalCandidates = countries.filter(country =>
            regionCodes.includes(country.code) && country.code !== c.code &&
            !distractors.find(d => d.code === country.code)
        )
        const randomRegional = regionalCandidates.sort(() => Math.random() - 0.5)
        distractors = [...distractors, ...randomRegional].slice(0, 3 - distractors.length + distractors.length)
    }
    while (distractors.length < 3) {
        const random = countries[Math.floor(Math.random() * countries.length)]
        if (random.code !== c.code && !distractors.find(d => d.code === random.code)) {
            distractors.push(random)
        }
    }
   
    const finalDistractors = distractors.slice(0, 3)
    const finalOptions = [c, ...finalDistractors].sort(() => Math.random() - 0.5)
   
    setCurrentCountry(c)
    setFlagImage(img)
    setOptions(finalOptions)
    setTimer(QUIZ_DURATION)
    setIsRevealing(false)
  }


  // Timer Effect
  useEffect(() => {
    if (stage !== "running" || isRevealing) return
    if (timer > 0 && timer <= 3) {
      stopSound(tick)
      playSound(SOUNDS.tick, 0.5)
    }
    if (timer <= 0) {
      revealFlag()
      return
    }
    const id = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timer, isRevealing, stage])


  const revealFlag = () => {
    setIsRevealing(true)
    playSound(SOUNDS.correct, 0.7)
   
    const newScore = [...scoreBoard, 'played']
    setScoreBoard(newScore)


    setTimeout(async () => {
      if (round >= TOTAL_ROUNDS) {
        stopRecording()
      } else {
        playSound(SOUNDS.transition, 0.4)
        setRound(r => r + 1)
        startRound()
      }
    }, 2500)
  }


  // --- GRAVAÇÃO (Mantido) ---
  const startRecording = () => {
    try {
      const stream = canvasRef.current.captureStream(30)
      const audioStream = destinationRef.current.stream
      const mixed = new MediaStream([...stream.getTracks(), ...audioStream.getAudioTracks()])
     
      const recorder = new MediaRecorder(mixed, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 6000000
      })


      recordedChunksRef.current = []
      recorder.ondataavailable = e => { if (e.data.size > 0) recordedChunksRef.current.push(e.data) }
      recorder.onstop = saveVideo
      recorder.start()
      mediaRecorderRef.current = recorder
      isRecordingRef.current = true
      setStatus("🔴 GRAVANDO...")
    } catch (e) {
      console.error(e)
      setStatus("❌ ERRO GRAVAÇÃO")
    }
  }


  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecordingRef.current) {
      mediaRecorderRef.current.stop()
      isRecordingRef.current = false
      stopSound(bgm)
      stopSound(tick)
      if(bgVideoRef.current) bgVideoRef.current.pause()
      setStatus("💾 PROCESSANDO...")
    }
  }


  const saveVideo = () => {
    const blob = new Blob(recordedChunksRef.current, { type: "video/webm" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `quiz_${selectedTheme.id}_${Date.now()}.webm`
    a.click()
    setStatus("✅ PRONTO!")
    setTimeout(() => {
      setStage("idle")
      setStatus("")
    }, 3000)
  }


  // --- CANVAS RENDER (AQUI ESTÁ A MÁGICA - ATUALIZADO) ---
  const drawTextStroke = (ctx, text, x, y, size, color = "#FFF", strokeColor = "#000", lineWidth = 8) => {
    ctx.font = `900 ${size}px 'Arial Black', 'Verdana', sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.lineJoin = "round"
    ctx.miterLimit = 2
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = lineWidth
    ctx.strokeText(text, x, y)
    ctx.fillStyle = color
    ctx.fillText(text, x, y)
  }
const drawScene = (ctx) => {
    const w = CANVAS_W
    const h = CANVAS_H
    const time = Date.now() * 0.001


    // 1. FUNDO C/ PARTÍCULAS
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, "#1a0033")
    g.addColorStop(1, "#0d001a")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)


    if (bgVideoRef.current && bgVideoRef.current.readyState >= 2) {
        ctx.globalAlpha = 0.4
        ctx.drawImage(bgVideoRef.current, 0, 0, w, h)
        ctx.globalAlpha = 1.0
    }


    // Grid Cyberpunk
    ctx.strokeStyle = "rgba(255,255,255,0.05)"
    ctx.lineWidth = 1
    const gridY = (time * 50) % 100
    for(let i=0; i<w; i+=100) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,h); ctx.stroke(); }


    // Atualiza e desenha partículas
    particlesRef.current.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0) p.x = w; if(p.x > w) p.x = 0;
        if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(Math.sin(time + p.x)) * 0.5})`
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill()
    })


    // 2. Cabeçalho
    const titleText = selectedTheme.title
    ctx.shadowColor = "#00ffff"; ctx.shadowBlur = 15;
    drawTextStroke(ctx, titleText, w/2, 100, 55, "#FFF", "#000", 12)
    ctx.shadowBlur = 0;


    // Status da Rodada
    let statusText = `NÍVEL ${round}/${TOTAL_ROUNDS}`
    let statusColor = "#FFD700"
    if (selectedTheme.id === 'mix') {
        const diff = getDifficultyByRound(round)
        statusText = diff === 'easy' ? 'FÁCIL 🟢' : diff === 'medium' ? 'MÉDIO 🟡' : 'IMPOSSÍVEL 🔴'
        statusColor = diff === 'easy' ? '#00FF88' : diff === 'medium' ? '#FFD700' : '#FF0055'
    }
    drawTextStroke(ctx, statusText, w/2, 170, 35, statusColor)


    // 3. Placar
    const scoreY = 230
    const dotGap = 60
    for(let i=0; i<TOTAL_ROUNDS; i++) {
        const x = w/2 - ((TOTAL_ROUNDS-1)*dotGap)/2 + i*dotGap
        const isActive = i < scoreBoard.length
        ctx.beginPath()
        ctx.arc(x, scoreY, 15, 0, Math.PI*2)
        ctx.fillStyle = isActive ? "#00FF88" : "rgba(255,255,255,0.2)"
        ctx.fill()
        if(i === round - 1) {
            ctx.strokeStyle = "#FFF"; ctx.lineWidth = 4; ctx.stroke()
        }
    }


    // 4. BANDEIRA COM LASER SCANNER
    const boxY = 300
    const boxH = 520
    const boxW = 900
    const boxX = (w - boxW)/2


    ctx.save()
 
    // Máscara da caixa
    ctx.beginPath(); ctx.roundRect(boxX, boxY, boxW, boxH, 40); ctx.clip()
    ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(boxX, boxY, boxW, boxH)


    if (flagImage) {
        // Cálculo do progresso do scan (0 a 1)
        const progress = isRevealing ? 1 : (1 - (timer / QUIZ_DURATION))
        const scanHeight = boxH * progress


        const img = flagImage
        const scale = Math.min((boxW)/img.width, (boxH)/img.height) // Fit contain inside box
        // Ou use Math.max para cover (preencher tudo)
        const scaleCover = Math.max(boxW/img.width, boxH/img.height)
       
        const dw = img.width * scaleCover
        const dh = img.height * scaleCover
        const dx = boxX + (boxW - dw)/2
        const dy = boxY + (boxH - dh)/2


        // A. Desenha versão escura/cinza (fundo)
        ctx.filter = "grayscale(100%) brightness(25%) blur(2px)"
        ctx.drawImage(img, dx, dy, dw, dh)
        ctx.filter = "none"


        // B. Desenha versão colorida (revelada)
        ctx.save()
        ctx.beginPath()
        ctx.rect(boxX, boxY, boxW, scanHeight)
        ctx.clip()
        ctx.drawImage(img, dx, dy, dw, dh)
        ctx.restore()


        // C. Desenha o Laser
        if (!isRevealing) {
            const laserY = boxY + scanHeight
            ctx.shadowColor = "#00FF00"; ctx.shadowBlur = 30;
            ctx.strokeStyle = "#00FF88"; ctx.lineWidth = 8;
            ctx.beginPath(); ctx.moveTo(boxX, laserY); ctx.lineTo(boxX+boxW, laserY); ctx.stroke();
            ctx.strokeStyle = "#FFF"; ctx.lineWidth = 2; ctx.stroke(); // Core branco
            ctx.shadowBlur = 0;
        }
    }
    // Borda da caixa
    ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 4; ctx.strokeRect(boxX, boxY, boxW, boxH)
    ctx.restore()


    // 5. Timer (Barra abaixo da imagem)
    const timerY = boxY + boxH + 40
    const barW = 800
    const tProgress = timer / QUIZ_DURATION
    ctx.fillStyle = "rgba(255,255,255,0.1)"; ctx.beginPath(); ctx.roundRect((w-barW)/2, timerY, barW, 15, 8); ctx.fill()
    ctx.fillStyle = timer <= 3 ? "#FF0055" : "#00FF88"
    ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.roundRect((w-barW)/2, timerY, barW * tProgress, 15, 8); ctx.fill()
    ctx.shadowBlur = 0;


    // 6. Opções
    const startOptY = timerY + 80
    const optH = 110
    const optGap = 30


    options.forEach((opt, i) => {
        const y = startOptY + i * (optH + optGap)
        const isCorrect = isRevealing && opt.code === currentCountry?.code
        const isWrong = isRevealing && opt.code !== currentCountry?.code
       
        let bgColor = "rgba(255,255,255,0.05)"
        let strokeColor = "rgba(255,255,255,0.1)"
        let textColor = "#FFF"
        let scale = 1


        if(!isRevealing) scale = 1 + Math.sin(time * 5 + i) * 0.003 // Pulsação leve


        if (isCorrect) {
            bgColor = "#00C853"; strokeColor = "#00E676"; scale = 1.05
        } else if (isWrong) {
            bgColor = "rgba(255,0,0,0.2)"; strokeColor = "#D50000"; textColor = "#AAA"
        }


        const optW = 900
        ctx.save()
        ctx.translate(w/2, y + optH/2)
        ctx.scale(scale, scale)
       
        ctx.fillStyle = bgColor
        ctx.beginPath(); ctx.roundRect(-optW/2, -optH/2, optW, optH, 20); ctx.fill()
        ctx.strokeStyle = strokeColor; ctx.lineWidth = 4; ctx.stroke()
       
        const fontSize = opt.name.length > 22 ? 30 : 40
        drawTextStroke(ctx, opt.name.toUpperCase(), 0, 0, fontSize, textColor, "rgba(0,0,0,0.8)", 6)
       
        if (isCorrect) {
             ctx.shadowColor = "gold"; ctx.shadowBlur = 20;
             drawTextStroke(ctx, "✓", optW/2 - 60, 0, 50, "#FFD700")
             ctx.shadowBlur = 0;
        }


        ctx.restore()
    })


    // 7. Marca D'água
    if(MY_USER) {
        ctx.font = "bold 24px 'Arial', sans-serif"
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
        ctx.textAlign = "center"
        ctx.fillText(MY_USER, w/2, h - 40)
    }
  }


  // Loop
  useEffect(() => {
    if (stage !== "running") return
    const ctx = canvasRef.current?.getContext("2d")
    const loop = (t) => {
        if (t - lastTimeRef.current >= frameInterval) {
            drawScene(ctx)
            lastTimeRef.current = t
        }
        rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [stage, timer, isRevealing, flagImage, options, scoreBoard, selectedTheme])


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 font-sans">
        {stage === 'idle' ? (
            <div className="w-full max-w-lg bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl p-6">
                <h1 className="text-3xl font-black text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    GERADOR VIRAL 🚀
                </h1>
               
                <p className="text-gray-400 text-sm mb-3 font-bold uppercase tracking-wider">Escolha o Tema:</p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {THEMES.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme)}
                        className={`
                        p-3 rounded-xl font-bold text-sm transition-all duration-200 border
                        ${selectedTheme.id === theme.id
                            ? `bg-gradient-to-br ${theme.color} border-white text-white shadow-lg transform scale-105`
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}
                        `}
                    >
                        {theme.label}
                    </button>
                    ))}
                </div>


                <div className="bg-gray-800 p-4 rounded-lg mb-6 text-sm text-gray-300">
                    <p>💡 <b>Dica:</b> O vídeo terá efeito de "Laser Scan" e partículas!</p>
                </div>


                <button
                    onClick={startQuiz}
                    className={`w-full py-4 rounded-xl text-white font-black text-lg uppercase tracking-wide shadow-lg transition-all active:scale-95 bg-gradient-to-r ${selectedTheme.color}`}
                >
                    GRAVAR VÍDEO AGORA 🎬
                </button>
            </div>
        ) : (
            <div className="relative w-full max-w-[400px]">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_W}
                    height={CANVAS_H}
                    className="w-full h-auto rounded-lg shadow-2xl border border-gray-800"
                />
                <div className="absolute bottom-4 left-0 w-full text-center">
                    <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-full text-xs shadow-lg animate-pulse">
                        {status}
                    </span>
                </div>
            </div>
        )}
    </div>
  )
}

