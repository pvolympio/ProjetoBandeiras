import { FastAverageColor } from "fast-average-color";

const fac = new FastAverageColor();
const cache = new Map();

/** Calcula distância entre cores RGB */
function colorDistance(c1, c2) {
  return Math.sqrt(
    Math.pow(c1[0] - c2[0], 2) +
    Math.pow(c1[1] - c2[1], 2) +
    Math.pow(c1[2] - c2[2], 2)
  );
}

/** Calcula diferença de brilho/contraste */
function brightness(c) {
  return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
}

/** Detecta padrão básico de layout pela análise horizontal/vertical */
async function detectLayout(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);

  const data = ctx.getImageData(0, 0, img.width, img.height).data;

  let horizontalDiff = 0, verticalDiff = 0;
  for (let y = 0; y < img.height - 1; y++) {
    for (let x = 0; x < img.width - 1; x++) {
      const i = (y * img.width + x) * 4;
      const r1 = data[i], g1 = data[i + 1], b1 = data[i + 2];
      const r2 = data[i + 4], g2 = data[i + 5], b2 = data[i + 6];
      const r3 = data[i + img.width * 4], g3 = data[i + img.width * 4 + 1], b3 = data[i + img.width * 4 + 2];

      horizontalDiff += colorDistance([r1, g1, b1], [r2, g2, b2]);
      verticalDiff += colorDistance([r1, g1, b1], [r3, g3, b3]);
    }
  }

  return horizontalDiff > verticalDiff
    ? "vertical"
    : verticalDiff > horizontalDiff * 1.2
    ? "horizontal"
    : "misto";
}

/** Extrai assinatura visual (cor + brilho + layout) */
async function getVisualSignature(country) {
  if (!country || !country.code) return null;
  if (cache.has(country.code)) return cache.get(country.code);

  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = `/flags/${country.code}.svg`;

  const signature = await new Promise((resolve) => {
    img.onload = async () => {
      try {
        const avg = await fac.getColorAsync(img);
        const layout = await detectLayout(img);
        const sig = {
          avgColor: avg.value.slice(0, 3),
          brightness: brightness(avg.value),
          layout,
        };
        cache.set(country.code, sig);
        resolve(sig);
      } catch {
        resolve({ avgColor: [128, 128, 128], brightness: 100, layout: "misto" });
      }
    };
    img.onerror = () => resolve({ avgColor: [128, 128, 128], brightness: 100, layout: "misto" });
  });

  return signature;
}

/** Similaridade entre duas bandeiras */
function visualSimilarity(sigA, sigB) {
  const colorSim = colorDistance(sigA.avgColor, sigB.avgColor);
  const brightSim = Math.abs(sigA.brightness - sigB.brightness);
  const layoutSim = sigA.layout === sigB.layout ? 0 : 80; // penaliza layouts diferentes

  // Peso composto: 60% cor, 20% brilho, 20% layout
  return colorSim * 0.6 + brightSim * 0.2 + layoutSim * 0.2;
}

/** Retorna bandeiras visualmente semelhantes */
export async function getSimilarFlags(target, all, n = 3, difficulty = "médio") {
  try {
    const targetSig = await getVisualSignature(target);

    // Tamanho da amostra (quantas bandeiras vão ser analisadas)
    const poolSize =
      difficulty === "fácil" ? 100 :
      difficulty === "médio" ? 180 :
      all.length;

    // Seleciona um subconjunto aleatório
    const pool = [...all]
      .filter((c) => c.code !== target.code)
      .sort(() => Math.random() - 0.5)
      .slice(0, poolSize);

    // Calcula similaridade visual
    const scored = await Promise.all(
      pool.map(async (c) => {
        const sig = await getVisualSignature(c);
        const sim = visualSimilarity(targetSig, sig);
        return { c, sim };
      })
    );

    // Ajuste de comportamento conforme a dificuldade
    if (difficulty === "fácil") {
      // Queremos as MAIS DIFERENTES
      return scored
        .sort((a, b) => b.sim - a.sim) // maior distância
        .slice(0, n)
        .map((x) => x.c);
    } else if (difficulty === "médio") {
      // Queremos medianamente parecidas → mistura de médias
      const sorted = scored.sort((a, b) => a.sim - b.sim);
      const mid = Math.floor(sorted.length / 2);
      return [...sorted.slice(mid - 3, mid + 3)]
        .sort(() => Math.random() - 0.5)
        .slice(0, n)
        .map((x) => x.c);
    } else {
      // DIFÍCIL → quer as MAIS PARECIDAS
      return scored
        .sort((a, b) => a.sim - b.sim) // menor distância
        .slice(0, n)
        .map((x) => x.c);
    }
  } catch (err) {
    console.error("Erro ao comparar bandeiras:", err);
    return all.slice(0, n);
  }
}

