import React, { useEffect, useRef, useState } from "react";
import countries from "../../data/countries";

const CANVAS_W = 1080;
const CANVAS_H = 1920;
const TOTAL_ROUNDS = 5;
const QUIZ_DURATION = 8;

// Calcular duração total aproximada do vídeo
const ROUND_TIME = QUIZ_DURATION + 3; // 8s quiz + 3s revelação
const TOTAL_VIDEO_TIME = (ROUND_TIME * TOTAL_ROUNDS); // ~55 segundos

const SOUNDS = {
  correct: "/audio/sounds/correct.mp3",
  tick: "/audio/sounds/tick.mp3",
  background: "/audio/sounds/background-music.mp3",
  transition: "/audio/sounds/transition.mp3",
};

export default function QuizTikTok() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);
  const frameInterval = 1000 / 45;

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const isRecordingRef = useRef(false);
  const recordingTimeoutRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const recordingStartTimeRef = useRef(0);
  const videoSegmentsRef = useRef([]);

  const audioCtxRef = useRef(null);
  const destinationRef = useRef(null);

  const bgm = useRef(null);
  const tick = useRef(null);
  const voice = useRef(null);

  const [stage, setStage] = useState("idle");
  const [round, setRound] = useState(1);
  const [timer, setTimer] = useState(QUIZ_DURATION);
  const [isRevealing, setIsRevealing] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [flagImage, setFlagImage] = useState(null);
  const [options, setOptions] = useState([]);
  const [status, setStatus] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);

  const allCountries = countries;

  // ---------------------
  // Audio system
  // ---------------------
  const initAudioSystem = async () => {
    if (!audioCtxRef.current) {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();
      audioCtxRef.current = audioCtx;
      destinationRef.current = dest;
    }
    
    if (audioCtxRef.current.state === "suspended") {
      await audioCtxRef.current.resume();
    }
    
    return audioCtxRef.current;
  };

  const playSound = async (url, volume = 1, loop = false) => {
    try {
      const audioCtx = audioCtxRef.current;
      if (!audioCtx) return null;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Falha ao carregar: ${url}`);
      
      const buf = await res.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(buf);
      
      const src = audioCtx.createBufferSource();
      const gain = audioCtx.createGain();
      
      src.buffer = audioBuffer;
      src.loop = loop;
      gain.gain.value = volume;
      
      src.connect(gain);
      gain.connect(destinationRef.current);
      gain.connect(audioCtx.destination);
      
      src.start(0);
      return src;
    } catch (err) {
      console.warn("Erro ao tocar:", url, err.message);
      return null;
    }
  };

  const stopSound = (ref) => {
    if (ref?.current) {
      try {
        ref.current.onended = null;
        ref.current.stop();
      } catch {}
      ref.current = null;
    }
  };

  const playBackground = async () => {
    stopSound(bgm);
    bgm.current = await playSound(SOUNDS.background, 0.2, true);
  };

  const playTick = async () => {
    stopSound(tick);
    tick.current = await playSound(SOUNDS.tick, 0.4);
  };

  const playCountryAudio = async (code) => {
    stopSound(voice);
    voice.current = await playSound(`/audio/countries/${code}.mp3`, 0.9);
    
    if (voice.current) {
      voice.current.onended = async () => {
        await playSound(SOUNDS.correct, 0.7);
      };
    } else {
      await playSound(SOUNDS.correct, 0.7);
    }
  };

  const playTransition = async () => {
    await playSound(SOUNDS.transition, 0.6);
  };

  const stopAllAudio = () => {
    stopSound(bgm);
    stopSound(tick);
    stopSound(voice);
  };

  // ---------------------
  // Recording System - SOLUÇÃO RADICAL
  // ---------------------
  const startRecording = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas não encontrado");

      await initAudioSystem();

      const canvasStream = canvas.captureStream(30);
      const audioStream = destinationRef.current.stream;

      const mixedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      // FORÇA CODECS ESPECÍFICOS para melhor compatibilidade
      const options = { 
        mimeType: "video/webm;codecs=vp8,opus",
        videoBitsPerSecond: 2500000,
        audioBitsPerSecond: 128000
      };

      // Testa compatibilidade
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "video/webm";
        console.warn("VP8 não suportado, usando WebM básico");
      }

      console.log("Iniciando gravação com:", options.mimeType);

      recordedChunksRef.current = [];
      videoSegmentsRef.current = [];
      const recorder = new MediaRecorder(mixedStream, options);

      // COLETA DADOS FREQUENTEMENTE para metadados precisos
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
          console.log("Chunk recebido:", e.data.size, "bytes");
        }
      };

      recorder.onstop = () => {
        console.log("MediaRecorder parado, chunks:", recordedChunksRef.current.length);
        processFinalVideo();
      };

      // INICIA com timeslice CURTO para metadados precisos
      recorder.start(500); // Coleta a cada 500ms para metadados precisos
      mediaRecorderRef.current = recorder;
      isRecordingRef.current = true;
      recordingStartTimeRef.current = Date.now();
      setRecordingTime(0);
      
      // Timer para mostrar tempo de gravação
      recordingIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
        setRecordingTime(elapsed);
      }, 1000);
      
      // TEMPO LIMITE ABSOLUTO - não pode passar de 60s
      recordingTimeoutRef.current = setTimeout(() => {
        console.log("⏰ TEMPO LIMITE: Forçando parada após 60s");
        forceStopRecording();
      }, 60000); // Máximo absoluto de 60 segundos
      
     
      await playBackground();

    } catch (err) {
      console.error("Erro ao iniciar gravação:", err);
      setStatus("❌ Erro ao iniciar gravação");
    }
  };

  const clearRecordingTimers = () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  const forceStopRecording = () => {
    if (isRecordingRef.current && mediaRecorderRef.current) {
      console.log("🛑 FORÇANDO PARADA DA GRAVAÇÃO");
      
      // Para o MediaRecorder PRIMEIRO
      if (mediaRecorderRef.current.state === "recording") {
        console.log("Parando MediaRecorder...");
        mediaRecorderRef.current.stop();
      }
      
      // DEPOIS para as tracks
      if (mediaRecorderRef.current.stream) {
        console.log("Parando tracks...");
        mediaRecorderRef.current.stream.getTracks().forEach(track => {
          track.stop();
          console.log("Track parada:", track.kind);
        });
      }
      
      isRecordingRef.current = false;
      stopAllAudio();
      clearRecordingTimers();
      
      setStatus("⏳ Finalizando gravação...");
    }
  };

  const stopRecording = () => {
    console.log("🛑 Parada normal da gravação");
    forceStopRecording();
  };

  // ---------------------
  // Processamento final do vídeo
  // ---------------------
  const processFinalVideo = () => {
    try {
      setStatus("🎬 Processando vídeo final...");
      
      const chunks = recordedChunksRef.current;
      if (!chunks || chunks.length === 0) {
        throw new Error("Nenhum dado foi gravado");
      }

      console.log("Processando", chunks.length, "chunks de vídeo");

      // Cria o blob FINAL
      const finalBlob = new Blob(chunks, { 
        type: "video/webm" 
      });

      console.log("Vídeo final criado:", {
        tamanho: finalBlob.size + " bytes",
        duraçãoGravada: recordingTime + " segundos",
        chunks: chunks.length
      });

      if (finalBlob.size === 0) {
        throw new Error("Vídeo final vazio");
      }

      // Força download IMEDIATO
      downloadVideo(finalBlob);

    } catch (err) {
      console.error("Erro no processamento:", err);
      setStatus("❌ Erro ao processar vídeo");
      // Tenta baixar mesmo assim
      try {
        const chunks = recordedChunksRef.current;
        if (chunks && chunks.length > 0) {
          const blob = new Blob(chunks, { type: "video/webm" });
          downloadVideo(blob);
        }
      } catch (fallbackErr) {
        console.error("Falha total:", fallbackErr);
      }
    }
  };

  // ---------------------
  // Download do vídeo
  // ---------------------
  const downloadVideo = (blob) => {
    try {
      setStatus("📦 Preparando download...");
      
      // Cria URL e força download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quiz-tiktok-${recordingTime}s-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      console.log("✅ Download iniciado para vídeo de", recordingTime + "s");

      // Limpeza e reset
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setStatus(`✅ Vídeo de ${recordingTime}s baixado!`);
        
        // Reset para estado inicial
        setTimeout(() => {
          setStage("idle");
          setRound(1);
          setRecordingTime(0);
          setStatus("");
        }, 3000);
      }, 1000);

    } catch (err) {
      console.error("Erro no download:", err);
      setStatus("❌ Erro ao baixar vídeo");
      
      // Reset mesmo em caso de erro
      setTimeout(() => {
        setStage("idle");
        setRound(1);
        setRecordingTime(0);
      }, 3000);
    }
  };

  // ---------------------
  // Quiz logic
  // ---------------------
  async function loadFlag(code) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `/flags/${code}.svg`;
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`Bandeira ${code} não carregada`);
        resolve(null);
      };
    });
  }

  function pickRandomCountry() {
    return allCountries[Math.floor(Math.random() * allCountries.length)];
  }

  function generateOptions(correct) {
    const opts = [correct];
    while (opts.length < 4) {
      const c = pickRandomCountry();
      if (!opts.find((o) => o.code === c.code)) opts.push(c);
    }
    return opts.sort(() => Math.random() - 0.5);
  }

  const startQuiz = async () => {
    try {
      setStage("running");
      setRound(1);
      setTimer(QUIZ_DURATION);
     
      
      // Limpa estado anterior COMPLETAMENTE
      recordedChunksRef.current = [];
      videoSegmentsRef.current = [];
      isRecordingRef.current = false;
      mediaRecorderRef.current = null;
      setRecordingTime(0);
      clearRecordingTimers();
      
      // Delay para garantir que canvas está pronto
      setTimeout(() => {
        startRecording();
      }, 800);

      startRound();
    } catch (err) {
      console.error("Erro ao iniciar quiz:", err);
      setStatus("❌ Erro ao iniciar");
    }
  };

  const startRound = async () => {
    const c = pickRandomCountry();
    const img = await loadFlag(c.code);
    setCurrentCountry(c);
    setFlagImage(img);
    setOptions(generateOptions(c));
    setTimer(QUIZ_DURATION);
    setIsRevealing(false);
  };

  useEffect(() => {
    if (stage !== "running" || isRevealing) return;

    if (timer > 0 && timer <= 3) {
      playTick();
    }

    if (timer <= 0) {
      revealFlag();
      return;
    }

    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [stage, timer, isRevealing]);

  const revealFlag = () => {
    setIsRevealing(true);
    stopSound(tick);

    if (currentCountry) {
      playCountryAudio(currentCountry.code);
    }

    setTimeout(async () => {
      if (round >= TOTAL_ROUNDS) {
        console.log("🎯 Última rodada concluída - parando gravação");
        stopRecording();
      } else {
        await playTransition();
        setRound((r) => r + 1);
        startRound();
      }
    }, 3000);
  };

  // ---------------------
  // Canvas draw
  // ---------------------
  const drawScene = (ctx) => {
    const w = CANVAS_W;
    const h = CANVAS_H;
    const time = Date.now() * 0.001;

    // Fundo animado
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    const hueShift = Math.sin(time * 0.1) * 10;
    grad.addColorStop(0, `hsl(${280 + hueShift}, 100%, 8%)`);
    grad.addColorStop(1, `hsl(${300 + hueShift}, 100%, 4%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Header
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 72px 'Poppins', sans-serif";
    ctx.fillText("QUAL É ESSA BANDEIRA?", w / 2, 120);

    ctx.font = "600 36px 'Poppins', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillText(`Rodada ${round}/${TOTAL_ROUNDS}`, w / 2, 180);

    // Container da bandeira
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 3;
    if (ctx.roundRect) {
      ctx.roundRect(80, 220, w - 160, 550, 20);
    } else {
      ctx.rect(80, 220, w - 160, 550);
    }
    ctx.fill();
    ctx.stroke();

    // Bandeira
    if (flagImage) {
      const img = flagImage;
      const maxWidth = w - 240;
      const maxHeight = 450;
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (w - dw) / 2;
      const dy = 220 + (550 - dh) / 2;
      
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    // Timer
    ctx.font = "bold 52px 'Poppins', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${timer}s`, w / 2, 820);

    // Barra de progresso do timer
    const progress = timer / QUIZ_DURATION;
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(200, 840, w - 400, 12);
    ctx.fillStyle = `hsl(${progress * 120}, 100%, 60%)`;
    ctx.fillRect(200, 840, (w - 400) * progress, 12);

    // Opções
    options.forEach((opt, i) => {
      const y = 900 + i * 120;
      const isCorrect = isRevealing && opt.code === currentCountry?.code;
      const isWrong = isRevealing && opt.code !== currentCountry?.code;
      
      ctx.fillStyle = isCorrect 
        ? "rgba(0,255,200,0.15)" 
        : isWrong
        ? "rgba(255,80,80,0.1)"
        : "rgba(255,255,255,0.08)";
      
      if (ctx.roundRect) {
        ctx.roundRect(120, y, w - 240, 100, 15);
      } else {
        ctx.rect(120, y, w - 240, 100);
      }
      ctx.fill();
      
      ctx.strokeStyle = isCorrect 
        ? "#00FFCC" 
        : isWrong
        ? "#FF5555"
        : "rgba(255,255,255,0.3)";
      ctx.lineWidth = isCorrect ? 4 : 2;
      ctx.stroke();
      
      ctx.fillStyle = isCorrect 
        ? "#00FFCC" 
        : isWrong
        ? "#FF8888"
        : "#ffffff";
      ctx.font = "600 34px 'Poppins', sans-serif";
      ctx.fillText(opt.name.toUpperCase(), w / 2, y + 60);
    });

    // Status e tempo de gravação
    ctx.font = "24px 'Poppins', sans-serif";
    ctx.fillStyle = status.includes("❌") 
      ? "#FF4444" 
      : status.includes("✅") 
      ? "#00FFAA" 
      : status.includes("🔴")
      ? "#FF5555"
      : "#00CCFF";
    
    ctx.fillText(status, w / 2, h - 60);
    
    // Tempo de gravação
    if (recordingTime > 0) {
      ctx.font = "20px 'Poppins', sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
     
    }

    // Efeito de revelação
    if (isRevealing && currentCountry) {
      ctx.fillStyle = "rgba(0,255,200,0.15)";
      ctx.font = "bold 44px 'Poppins', sans-serif";
      ctx.fillText(`✓ ${currentCountry.name.toUpperCase()}`, w / 2, 780);
    }
  };

  // Polyfill para roundRect
  useEffect(() => {
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        return this;
      };
    }
  }, []);

  useEffect(() => {
    if (stage !== "running") return;
    
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const loop = (currentTime) => {
      if (currentTime - lastTimeRef.current >= frameInterval) {
        drawScene(ctx);
        lastTimeRef.current = currentTime;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stage, flagImage, options, timer, status, isRevealing, round, currentCountry, recordingTime]);

  // ---------------------
  // Render
  // ---------------------
  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0a0010, #220022)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
        padding: 20,
        overflow: 'hidden'
      }}
    >
      {stage === "idle" ? (
        <div style={{ textAlign: "center", maxWidth: 520 }}>
          <h1
            style={{
              fontSize: 48,
              marginBottom: 10,
              background: "linear-gradient(90deg, #FF00FF, #00FFFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🌍 QUIZ DE BANDEIRAS
          </h1>
          <p style={{ fontSize: 18, opacity: 0.8, marginBottom: 10 }}>
            Vídeo de ~{TOTAL_VIDEO_TIME} segundos
          </p>
          <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 30 }}>
            {TOTAL_ROUNDS} rodadas • Tempo limite: 60s
          </p>
          <button
            onClick={startQuiz}
            style={{
              background: "linear-gradient(90deg, #FF00FF, #00FFFF)",
              border: "none",
              padding: "16px 40px",
              fontSize: 20,
              borderRadius: 50,
              cursor: "pointer",
              color: "#fff",
              fontWeight: "600",
              boxShadow: "0 0 30px rgba(255, 0, 255, 0.5)",
            }}
          >
            🚀 INICIAR GRAVAÇÃO
          </button>
          <p style={{ fontSize: 14, opacity: 0.6, marginTop: 20 }}>
            O vídeo será baixado automaticamente ao final
          </p>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            style={{
              width: "100%",
              maxWidth: 400,
              height: "auto",
              borderRadius: 20,
              boxShadow: "0 0 60px rgba(255, 0, 255, 0.4)",
            }}
          />
         
        </>
      )}
    </div>
  );
}