/**
 * Perender deterministik Bejana Dual-Strata AKG (ASI + MPASI) pada kanvas 2D.
 * Tidak menggunakan Math.random() maupun fisika stokastik (sesuai K-13 & INV-18).
 */
export function gambarSemuaBejana(akar: ParentNode = document): void {
  if (typeof window === "undefined" || typeof akar.querySelectorAll !== "function") return;
  const kanvasList = akar.querySelectorAll<HTMLCanvasElement>(".bejana__kanvas");
  if (!kanvasList.length) return;

  const gaya = getComputedStyle(document.documentElement);
  const warna = {
    asi: gaya.getPropertyValue("--asi-color").trim() || "#C47B2B",
    mpasi: gaya.getPropertyValue("--mpasi-color").trim() || "#2E6B47",
    danger: gaya.getPropertyValue("--danger").trim() || "#B42318",
    warn: gaya.getPropertyValue("--warn").trim() || "#9A5B13",
    ink3: gaya.getPropertyValue("--ink-3").trim() || "#6E6458",
    hair: gaya.getPropertyValue("--hairline-strong").trim() || "#CFC2AF",
    bg2: gaya.getPropertyValue("--bg-2").trim() || "#F2EAE0",
  };

  kanvasList.forEach((cv) => {
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = cv.getContext("2d");
    } catch {
      ctx = null;
    }
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = cv.getBoundingClientRect();
    const w = Math.max(76, Math.round(rect.width || 88));
    const h = Math.max(108, Math.round(rect.height || 118));
    cv.width = w * dpr;
    cv.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const status = cv.dataset.status || "ok";
    const asiPct = Math.max(0, Math.min(130, Number(cv.dataset.asi) || 0));
    const mpasiPct = Math.max(0, Math.min(130, Number(cv.dataset.mpasi) || 0));
    const totalPct = Math.min(125, asiPct + mpasiPct);

    const padX = 8;
    const padTop = 12;
    const padBot = 8;
    const vw = w - padX * 2;
    const vh = h - padTop - padBot;
    const y100 = padTop + vh * (1 - 100 / 125);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(padX, padTop, vw, vh, [5, 5, 11, 11]);
    ctx.fillStyle = warna.bg2;
    ctx.fill();
    ctx.clip();

    if (status === "kosong") {
      ctx.strokeStyle = warna.hair;
      ctx.lineWidth = 1;
      for (let y = padTop + 6; y < padTop + vh; y += 9) {
        for (let x = padX + 6; x < padX + vw; x += 9) {
          ctx.strokeRect(x - 2, y - 2, 4, 4);
        }
      }
      ctx.fillStyle = warna.ink3;
      ctx.font = '600 9px "Atkinson Mono", monospace';
      ctx.textAlign = "center";
      ctx.fillText("DATA TKPI", w / 2, padTop + vh / 2 - 3);
      ctx.fillText("BELUM LENGKAP", w / 2, padTop + vh / 2 + 9);
    } else {
      const hAsi = (asiPct / 125) * vh;
      const hMpasi = (mpasiPct / 125) * vh;
      const yAsiTop = padTop + vh - hAsi;
      const yTotalTop = padTop + vh - (hAsi + hMpasi);

      if (hAsi > 0.5) {
        ctx.fillStyle = warna.asi;
        ctx.globalAlpha = 0.86;
        ctx.fillRect(padX, yAsiTop, vw, hAsi + 2);
      }

      if (hMpasi > 0.5) {
        ctx.fillStyle =
          totalPct < 70
            ? warna.danger
            : totalPct < 90
              ? warna.warn
              : warna.mpasi;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(padX, yAsiTop + 1);
        ctx.lineTo(padX, yTotalTop + 2);
        ctx.bezierCurveTo(
          padX + vw * 0.33,
          yTotalTop - 2.5,
          padX + vw * 0.66,
          yTotalTop + 3.5,
          padX + vw,
          yTotalTop + 1,
        );
        ctx.lineTo(padX + vw, yAsiTop + 1);
        ctx.closePath();
        ctx.fill();
      }

      if (totalPct < 100) {
        ctx.globalAlpha = 0.42;
        ctx.fillStyle = totalPct < 70 ? warna.danger : warna.warn;
        for (let y = y100 + 4; y < yTotalTop - 3; y += 6) {
          for (let x = padX + 6; x < padX + vw - 4; x += 6) {
            ctx.beginPath();
            ctx.arc(x, y, 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    ctx.restore();

    ctx.save();
    ctx.setLineDash([3, 2]);
    ctx.strokeStyle = warna.ink3;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX - 2, y100);
    ctx.lineTo(padX + vw + 2, y100);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(padX, padTop, vw, vh, [5, 5, 11, 11]);
    ctx.strokeStyle = status === "awas" ? warna.danger : warna.hair;
    ctx.lineWidth = status === "awas" ? 1.6 : 1.15;
    ctx.stroke();
    ctx.restore();
  });
}
