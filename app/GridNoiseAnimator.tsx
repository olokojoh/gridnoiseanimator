"use client";

import {
  type ChangeEvent,
  type DragEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { GIFEncoder, applyPalette, quantize } from "gifenc";

type MediaSource = HTMLImageElement | HTMLVideoElement;
type ExportFormat = "mp4" | "webm" | "gif";
type NoiseType = "white" | "blue";
type Region = { x: number; y: number; width: number; height: number };

const LANGUAGES = [
  ["en", "English"],
  ["ja", "日本語"],
  ["ko", "한국어"],
  ["zh-hans", "中文(简)"],
  ["zh-hant", "中文(繁)"],
] as const;

const COPY: Record<
  string,
  {
    title: string;
    subtitle: string;
    select: string;
    drop: string;
    play: string;
    stop: string;
    export: string;
  }
> = {
  en: {
    title: "Grid Noise Animator",
    subtitle: "Animate images with grid-based color noise.",
    select: "Select Image or Video",
    drop: "Click or drag & drop",
    play: "Play",
    stop: "Stop",
    export: "Export",
  },
  ja: {
    title: "グリッドノイズアニメーター",
    subtitle: "画像にグリッド状のカラーノイズアニメーションを追加します。",
    select: "画像・動画を選択",
    drop: "クリックまたはドラッグ＆ドロップ",
    play: "再生",
    stop: "停止",
    export: "書き出し",
  },
  ko: {
    title: "그리드 노이즈 애니메이터",
    subtitle: "격자 기반 색상 노이즈로 이미지를 애니메이션화합니다.",
    select: "이미지 또는 동영상 선택",
    drop: "클릭하거나 드래그 앤 드롭",
    play: "재생",
    stop: "정지",
    export: "내보내기",
  },
  "zh-hans": {
    title: "网格噪声动画器",
    subtitle: "使用基于网格的颜色噪声制作图片动画。",
    select: "选择图片或视频",
    drop: "点击或拖放文件",
    play: "播放",
    stop: "停止",
    export: "导出",
  },
  "zh-hant": {
    title: "網格噪聲動畫器",
    subtitle: "使用網格色彩噪聲製作圖片動畫。",
    select: "選擇圖片或影片",
    drop: "點擊或拖放檔案",
    play: "播放",
    stop: "停止",
    export: "匯出",
  },
};

function hash(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function signedNoise(seed: number, type: NoiseType) {
  if (type === "blue") {
    return (((seed * 0.61803398875) % 1) * 2 - 1) * 0.84;
  }
  return hash(seed) * 2 - 1;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="control-panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  suffix,
  prefix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  prefix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="slider-row">
      <span>
        {label}
        <strong>
          {prefix}
          {value}
          {suffix}
        </strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function GridNoiseAnimator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<MediaSource | null>(null);
  const sourceUrlRef = useRef<string | null>(null);
  const frameRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const [language, setLanguage] = useState("en");
  const [fileName, setFileName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [mediaKind, setMediaKind] = useState<"image" | "video">("image");
  const [playing, setPlaying] = useState(false);
  const [gridSize, setGridSize] = useState(32);
  const [enhanced, setEnhanced] = useState(false);
  const [variationInterval, setVariationInterval] = useState(10);
  const [detail, setDetail] = useState(false);
  const [depth, setDepth] = useState(25);
  const [edgeStrength, setEdgeStrength] = useState(10);
  const [noiseType, setNoiseType] = useState<NoiseType>("white");
  const [hue, setHue] = useState(15);
  const [lightness, setLightness] = useState(5);
  const [saturation, setSaturation] = useState(5);
  const [syncCycle, setSyncCycle] = useState(1);
  const [blurEnabled, setBlurEnabled] = useState(true);
  const [blur, setBlur] = useState(1);
  const [warpEnabled, setWarpEnabled] = useState(true);
  const [warp, setWarp] = useState(2);
  const [mlProtection, setMlProtection] = useState(true);
  const [previewFps, setPreviewFps] = useState(60);
  const [watermark, setWatermark] = useState(true);
  const [exportFps, setExportFps] = useState(60);
  const [duration, setDuration] = useState(1);
  const [format, setFormat] = useState<ExportFormat>("mp4");
  const [strongOverlay, setStrongOverlay] = useState(false);
  const [overlayStrength, setOverlayStrength] = useState(30);
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState("Load an image to get started");
  const [drawRegion, setDrawRegion] = useState(false);
  const [region, setRegion] = useState<Region | null>(null);
  const [applyInside, setApplyInside] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const optionsRef = useRef({
    gridSize,
    enhanced,
    variationInterval,
    detail,
    depth,
    edgeStrength,
    noiseType,
    hue,
    lightness,
    saturation,
    syncCycle,
    blurEnabled,
    blur,
    warpEnabled,
    warp,
    mlProtection,
    watermark,
    region,
    applyInside,
    strongOverlay,
    overlayStrength,
  });

  useEffect(() => {
    optionsRef.current = {
      gridSize,
      enhanced,
      variationInterval,
      detail,
      depth,
      edgeStrength,
      noiseType,
      hue,
      lightness,
      saturation,
      syncCycle,
      blurEnabled,
      blur,
      warpEnabled,
      warp,
      mlProtection,
      watermark,
      region,
      applyInside,
      strongOverlay,
      overlayStrength,
    };
  }, [
    gridSize,
    enhanced,
    variationInterval,
    detail,
    depth,
    edgeStrength,
    noiseType,
    hue,
    lightness,
    saturation,
    syncCycle,
    blurEnabled,
    blur,
    warpEnabled,
    warp,
    mlProtection,
    watermark,
    region,
    applyInside,
    strongOverlay,
    overlayStrength,
  ]);

  useEffect(() => {
    localStorage.setItem("grid-noise-language", language);
  }, [language]);

  const drawProtection = useCallback(
    (
      context: CanvasRenderingContext2D,
      width: number,
      height: number,
      deep: boolean,
      strength: number,
    ) => {
      const tile = document.createElement("canvas");
      tile.width = 4;
      tile.height = 4;
      const tileContext = tile.getContext("2d");
      if (!tileContext) return;

      const alpha = deep ? 0.03 + (strength / 100) * 0.11 : 0.032;
      tileContext.fillStyle = `rgba(96, 138, 255, ${alpha})`;
      tileContext.fillRect(0, 0, 2, 2);
      tileContext.fillRect(2, 2, 2, 2);
      tileContext.fillStyle = `rgba(255, 82, 157, ${alpha * 0.82})`;
      tileContext.fillRect(2, 0, 2, 2);
      tileContext.fillRect(0, 2, 2, 2);

      const pattern = context.createPattern(tile, "repeat");
      if (pattern) {
        context.save();
        context.globalCompositeOperation = deep ? "soft-light" : "overlay";
        context.fillStyle = pattern;
        context.fillRect(0, 0, width, height);
        context.restore();
      }
    },
    [],
  );

  const renderFrame = useCallback(
    (
      target: HTMLCanvasElement,
      frame: number,
      showRegion = true,
    ) => {
      const source = sourceRef.current;
      const context = target.getContext("2d", {
        alpha: false,
        willReadFrequently: false,
      });
      if (!source || !context) return;

      const width = target.width;
      const height = target.height;
      const options = optionsRef.current;
      const cells = options.gridSize;
      const cellWidth = width / cells;
      const cellHeight = height / cells;
      const changeFrame = options.enhanced
        ? Math.floor(frame / Math.max(1, options.variationInterval))
        : Math.floor(frame / Math.max(1, options.syncCycle));

      context.save();
      context.fillStyle = "#050506";
      context.fillRect(0, 0, width, height);
      context.drawImage(source, 0, 0, width, height);
      context.restore();

      context.save();
      if (options.region) {
        const scaleX = width / (canvasRef.current?.width || width);
        const scaleY = height / (canvasRef.current?.height || height);
        const selected = {
          x: options.region.x * scaleX,
          y: options.region.y * scaleY,
          width: options.region.width * scaleX,
          height: options.region.height * scaleY,
        };

        const path = new Path2D();
        if (options.applyInside) {
          path.rect(
            selected.x,
            selected.y,
            selected.width,
            selected.height,
          );
          context.clip(path);
        } else {
          path.rect(0, 0, width, height);
          path.rect(
            selected.x,
            selected.y,
            selected.width,
            selected.height,
          );
          context.clip(path, "evenodd");
        }
      }

      for (let row = 0; row < cells; row += 1) {
        for (let column = 0; column < cells; column += 1) {
          const index = row * cells + column;
          const seed = index * 17.17 + changeFrame * 131.31;
          const hueShift =
            signedNoise(seed, options.noiseType) * options.hue;
          const lightShift =
            signedNoise(seed + 7.7, options.noiseType) * options.lightness;
          const saturationShift =
            signedNoise(seed + 19.1, options.noiseType) *
            options.saturation;
          const warpX = options.warpEnabled
            ? signedNoise(seed + 31.4, options.noiseType) * options.warp
            : 0;
          const warpY = options.warpEnabled
            ? signedNoise(seed + 43.8, options.noiseType) * options.warp
            : 0;
          const x = column * cellWidth;
          const y = row * cellHeight;
          const jitter = options.enhanced
            ? signedNoise(seed + 55.2, options.noiseType) * cellWidth * 0.08
            : 0;

          context.save();
          context.filter = [
            `hue-rotate(${hueShift}deg)`,
            `brightness(${Math.max(0.2, 1 + lightShift / 100)})`,
            `saturate(${Math.max(0, 1 + saturationShift / 100)})`,
            options.blurEnabled ? `blur(${options.blur}px)` : "",
          ]
            .filter(Boolean)
            .join(" ");
          context.drawImage(
            source,
            (x / width) *
              ("videoWidth" in source ? source.videoWidth : source.naturalWidth),
            (y / height) *
              ("videoHeight" in source
                ? source.videoHeight
                : source.naturalHeight),
            (cellWidth / width) *
              ("videoWidth" in source ? source.videoWidth : source.naturalWidth),
            (cellHeight / height) *
              ("videoHeight" in source
                ? source.videoHeight
                : source.naturalHeight),
            x + warpX + jitter,
            y + warpY,
            cellWidth + 1,
            cellHeight + 1,
          );
          context.restore();
        }
      }

      if (options.detail) {
        context.save();
        context.globalAlpha = Math.min(0.42, options.edgeStrength / 100);
        context.globalCompositeOperation = "soft-light";
        context.filter = `contrast(${1 + options.depth / 45}) saturate(1.1)`;
        context.drawImage(source, 0, 0, width, height);
        context.restore();
      }

      if (options.mlProtection) {
        drawProtection(context, width, height, false, 0);
      }
      if (options.strongOverlay) {
        drawProtection(context, width, height, true, options.overlayStrength);
      }
      context.restore();

      if (options.watermark) {
        context.save();
        const fontSize = Math.max(11, Math.round(width / 90));
        context.font = `600 ${fontSize}px system-ui, sans-serif`;
        context.textAlign = "right";
        context.fillStyle = "rgba(255,255,255,.72)";
        context.shadowColor = "rgba(0,0,0,.5)";
        context.shadowBlur = 4;
        context.fillText(
          "GRID NOISE",
          width - fontSize,
          height - fontSize,
        );
        context.restore();
      }

      if (showRegion && options.region) {
        context.save();
        context.strokeStyle = "#7da0ff";
        context.lineWidth = 2;
        context.setLineDash([7, 5]);
        context.strokeRect(
          options.region.x,
          options.region.y,
          options.region.width,
          options.region.height,
        );
        context.restore();
      }
    },
    [drawProtection],
  );

  useEffect(() => {
    if (!loaded || playing || !canvasRef.current) return;
    renderFrame(canvasRef.current, frameRef.current);
  }, [
    loaded,
    playing,
    renderFrame,
    gridSize,
    enhanced,
    variationInterval,
    detail,
    depth,
    edgeStrength,
    noiseType,
    hue,
    lightness,
    saturation,
    syncCycle,
    blurEnabled,
    blur,
    warpEnabled,
    warp,
    mlProtection,
    watermark,
    region,
    applyInside,
    strongOverlay,
    overlayStrength,
  ]);

  useEffect(() => {
    if (!playing || !loaded) return;

    const loop = (time: number) => {
      if (time - lastFrameTimeRef.current >= 1000 / previewFps) {
        frameRef.current += 1;
        if (canvasRef.current) {
          renderFrame(canvasRef.current, frameRef.current);
        }
        lastFrameTimeRef.current = time;
      }
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [loaded, playing, previewFps, renderFrame]);

  useEffect(
    () => () => {
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    },
    [],
  );

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setStatus("Choose an image or video file.");
      return;
    }

    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    const url = URL.createObjectURL(file);
    sourceUrlRef.current = url;
    setFileName(file.name);
    setPlaying(false);
    setRegion(null);
    frameRef.current = 0;

    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.src = url;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.onloadedmetadata = () => {
        const scale = Math.min(1, 1280 / video.videoWidth);
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
        sourceRef.current = video;
        setMediaKind("video");
        setLoaded(true);
        setStatus("Video ready — press Play or adjust the effect");
        void video.play();
      };
    } else {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 1280 / image.naturalWidth);
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        sourceRef.current = image;
        setMediaKind("image");
        setLoaded(true);
        setStatus("Image ready — press Play or adjust the effect");
      };
      image.src = url;
    }
  }, []);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) loadFile(file);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files[0];
    if (file) loadFile(file);
  };

  const getPointer = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawRegion || !loaded) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = getPointer(event);
    dragStartRef.current = point;
    setRegion({ x: point.x, y: point.y, width: 0, height: 0 });
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const start = dragStartRef.current;
    if (!start) return;
    const point = getPointer(event);
    setRegion({
      x: Math.min(start.x, point.x),
      y: Math.min(start.y, point.y),
      width: Math.abs(point.x - start.x),
      height: Math.abs(point.y - start.y),
    });
  };

  const onPointerUp = () => {
    dragStartRef.current = null;
    setDrawRegion(false);
  };

  const addAudioTrack = async (stream: MediaStream) => {
    if (!audioFile) return { stream, stop: () => undefined };
    const audioUrl = URL.createObjectURL(audioFile);
    const audio = new Audio(audioUrl);
    audio.loop = true;
    const AudioContextClass =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;
    if (!AudioContextClass) return { stream, stop: () => undefined };
    const audioContext = new AudioContextClass();
    const source = audioContext.createMediaElementSource(audio);
    const destination = audioContext.createMediaStreamDestination();
    source.connect(destination);
    destination.stream
      .getAudioTracks()
      .forEach((track) => stream.addTrack(track));
    await audio.play();
    return {
      stream,
      stop: () => {
        audio.pause();
        void audioContext.close();
        URL.revokeObjectURL(audioUrl);
      },
    };
  };

  const exportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const requestedMime =
      format === "mp4"
        ? "video/mp4;codecs=avc1.42E01E"
        : "video/webm;codecs=vp9";
    if (!MediaRecorder.isTypeSupported(requestedMime)) {
      setStatus(
        format === "mp4"
          ? "MP4 export is not supported in this browser. Choose WebM."
          : "VP9 WebM export is not supported in this browser.",
      );
      return;
    }

    setExporting(true);
    setStatus(`Exporting ${format.toUpperCase()}…`);
    const canvasStream = canvas.captureStream(exportFps);
    const audio = await addAudioTrack(canvasStream);
    const recorder = new MediaRecorder(audio.stream, {
      mimeType: requestedMime,
      videoBitsPerSecond: 8_000_000,
    });
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data);
    };

    const finished = new Promise<void>((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: format === "mp4" ? "video/mp4" : "video/webm",
        });
        downloadBlob(blob, `grid-noise-animation.${format}`);
        audio.stop();
        setExporting(false);
        setStatus(`${format.toUpperCase()} export complete`);
        resolve();
      };
    });

    recorder.start();
    const startedAt = performance.now();
    const exportLoop = () => {
      const elapsed = performance.now() - startedAt;
      frameRef.current = Math.floor((elapsed / 1000) * exportFps);
      renderFrame(canvas, frameRef.current, false);
      if (elapsed < duration * 1000) {
        requestAnimationFrame(exportLoop);
      } else {
        recorder.stop();
      }
    };
    requestAnimationFrame(exportLoop);
    await finished;
  };

  const exportGif = async () => {
    const preview = canvasRef.current;
    if (!preview) return;
    setExporting(true);
    setStatus("Encoding GIF in your browser…");

    const gifCanvas = document.createElement("canvas");
    const scale = Math.min(1, 720 / preview.width);
    gifCanvas.width = Math.max(1, Math.round(preview.width * scale));
    gifCanvas.height = Math.max(1, Math.round(preview.height * scale));
    const context = gifCanvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const gif = GIFEncoder();
    const gifFps = Math.min(exportFps, 30);
    const totalFrames = Math.max(1, Math.round(duration * gifFps));
    for (let index = 0; index < totalFrames; index += 1) {
      renderFrame(preview, index, false);
      context.drawImage(
        preview,
        0,
        0,
        gifCanvas.width,
        gifCanvas.height,
      );
      const rgba = context.getImageData(
        0,
        0,
        gifCanvas.width,
        gifCanvas.height,
      ).data;
      const palette = quantize(rgba, 256);
      const indexed = applyPalette(rgba, palette);
      gif.writeFrame(indexed, gifCanvas.width, gifCanvas.height, {
        palette,
        delay: Math.round(1000 / gifFps),
        repeat: 0,
      });
      if (index % 4 === 0) {
        setStatus(`Encoding GIF ${index + 1}/${totalFrames}…`);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    gif.finish();
    downloadBlob(
      new Blob([gif.bytes()], { type: "image/gif" }),
      "grid-noise-animation.gif",
    );
    setExporting(false);
    setStatus("GIF export complete");
    renderFrame(preview, frameRef.current);
  };

  const handleExport = async () => {
    if (!loaded || exporting) return;
    if (format === "gif") {
      await exportGif();
    } else {
      await exportVideo();
    }
  };

  const copy = COPY[language] || COPY.en;
  const noiseStrength = Math.min(
    100,
    Math.round(
      hue * 0.9 +
        lightness * 1.1 +
        saturation +
        (warpEnabled ? warp * 1.4 : 0) +
        (mlProtection ? 12 : 0) +
        (strongOverlay ? overlayStrength / 4 : 0),
    ),
  );

  return (
    <div className="tool-shell">
      <header className="tool-header">
        <div>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>
        <label className="language-picker">
          <span>◉ LANGUAGE</span>
          <select
            aria-label="Language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {LANGUAGES.map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
          <small>Translates the main labels. Body text stays English.</small>
        </label>
      </header>

      <div className="workspace">
        <aside className="controls" aria-label="Animation controls">
          <Panel title={copy.select}>
            <label
              className={`drop-zone ${dragActive ? "is-dragging" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
            >
              <input
                id="media-input"
                type="file"
                accept="image/*,video/*"
                onChange={onFileChange}
              />
              <span>{fileName || copy.drop}</span>
              {fileName && <small>{mediaKind.toUpperCase()} · LOCAL</small>}
            </label>
          </Panel>

          <Panel title="GRID SETTINGS">
            <label className="field-row">
              <span>Grid size</span>
              <select
                aria-label="Grid size"
                value={gridSize}
                onChange={(event) => setGridSize(Number(event.target.value))}
              >
                {[16, 32, 64, 128].map((size) => (
                  <option key={size} value={size}>
                    {size} × {size}
                  </option>
                ))}
              </select>
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                checked={enhanced}
                onChange={(event) => setEnhanced(event.target.checked)}
              />
              <span>Enhanced mode</span>
            </label>
            {enhanced && (
              <Slider
                label="Variation interval"
                value={variationInterval}
                min={1}
                max={120}
                suffix=" f"
                onChange={setVariationInterval}
              />
            )}
            <label className="check-row separated">
              <input
                type="checkbox"
                checked={detail}
                onChange={(event) => setDetail(event.target.checked)}
              />
              <span>Detail mode</span>
            </label>
            {detail && (
              <>
                <Slider
                  label="Depth"
                  value={depth}
                  min={1}
                  max={30}
                  suffix="px"
                  onChange={setDepth}
                />
                <Slider
                  label="Edge strength"
                  value={edgeStrength}
                  min={0}
                  max={100}
                  suffix="%"
                  onChange={setEdgeStrength}
                />
                <button
                  className="secondary-button"
                  disabled={!loaded}
                  onClick={() =>
                    canvasRef.current &&
                    renderFrame(canvasRef.current, frameRef.current)
                  }
                >
                  Reprocess
                </button>
              </>
            )}
          </Panel>

          <Panel title="EFFECT SETTINGS">
            <label className="stacked-field">
              <span>Noise Type</span>
              <select
                aria-label="Noise type"
                value={noiseType}
                onChange={(event) =>
                  setNoiseType(event.target.value as NoiseType)
                }
              >
                <option value="white">White Noise (fully random)</option>
                <option value="blue">Blue Noise (evenly spread)</option>
              </select>
            </label>
            <Slider
              label="Hue variance"
              value={hue}
              min={0}
              max={90}
              prefix="± "
              suffix="°"
              onChange={setHue}
            />
            <Slider
              label="Lightness variance"
              value={lightness}
              min={0}
              max={25}
              prefix="± "
              suffix="%"
              onChange={setLightness}
            />
            <Slider
              label="Saturation variance"
              value={saturation}
              min={0}
              max={25}
              prefix="± "
              suffix="%"
              onChange={setSaturation}
            />
            <Slider
              label="Sync cycle"
              value={syncCycle}
              min={1}
              max={12}
              prefix="×"
              suffix={syncCycle === 1 ? " (off)" : ""}
              onChange={setSyncCycle}
            />
            <div className="inline-toggle">
              <span>
                Blur <strong>{blur}px</strong>
              </span>
              <label>
                <input
                  type="checkbox"
                  checked={blurEnabled}
                  onChange={(event) => setBlurEnabled(event.target.checked)}
                />{" "}
                ON
              </label>
            </div>
            <input
              aria-label="Blur"
              type="range"
              min={1}
              max={10}
              value={blur}
              disabled={!blurEnabled}
              onChange={(event) => setBlur(Number(event.target.value))}
            />
            <div className="inline-toggle">
              <span>
                Warp <strong>{warp}px</strong>
              </span>
              <label>
                <input
                  type="checkbox"
                  checked={warpEnabled}
                  onChange={(event) => setWarpEnabled(event.target.checked)}
                />{" "}
                ON
              </label>
            </div>
            <input
              aria-label="Warp"
              type="range"
              min={1}
              max={20}
              value={warp}
              disabled={!warpEnabled}
              onChange={(event) => setWarp(Number(event.target.value))}
            />
            <label className="check-row protection-check">
              <input
                type="checkbox"
                checked={mlProtection}
                onChange={(event) => setMlProtection(event.target.checked)}
              />
              <span>High-frequency overlay</span>
            </label>
            <p className="helper">
              Embeds a fixed pattern that survives frame averaging. It is a
              deterrent, not guaranteed protection.
            </p>
          </Panel>

          <Panel title="PREVIEW CONTROLS">
            <Slider
              label="FPS"
              value={previewFps}
              min={1}
              max={180}
              suffix=" fps"
              onChange={setPreviewFps}
            />
            <label className="check-row">
              <input
                type="checkbox"
                checked={watermark}
                onChange={(event) => setWatermark(event.target.checked)}
              />
              <span>Watermark</span>
            </label>
          </Panel>

          <Panel title="EXPORT VIDEO">
            <label className="number-row">
              <span>Frame rate</span>
              <input
                aria-label="Export frame rate"
                type="number"
                min={1}
                max={60}
                value={exportFps}
                onChange={(event) => setExportFps(Number(event.target.value))}
              />
              <small>fps</small>
            </label>
            <label className="number-row">
              <span>Duration</span>
              <input
                aria-label="Duration"
                type="number"
                min={1}
                max={120}
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value))}
              />
              <small>sec</small>
            </label>
            <label className="stacked-field">
              <span>Format</span>
              <select
                aria-label="Export format"
                value={format}
                onChange={(event) =>
                  setFormat(event.target.value as ExportFormat)
                }
              >
                <option value="mp4">MP4 (H.264)</option>
                <option value="webm">WebM (VP9)</option>
                <option value="gif">GIF Animation</option>
              </select>
            </label>
            {format !== "gif" && (
              <label className="audio-field">
                <span>Optional audio track</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(event) =>
                    setAudioFile(event.target.files?.[0] || null)
                  }
                />
                <small>{audioFile?.name || "No audio selected"}</small>
              </label>
            )}
            <label className="check-row separated">
              <input
                type="checkbox"
                checked={strongOverlay}
                onChange={(event) => setStrongOverlay(event.target.checked)}
              />
              <span>Strong overlay</span>
            </label>
            {strongOverlay && (
              <div className="deep-settings">
                <Slider
                  label="Intensity"
                  value={overlayStrength}
                  min={10}
                  max={100}
                  suffix="%"
                  onChange={setOverlayStrength}
                />
                <p className="helper">
                  Tints every frame with the same fixed checkerboard at higher
                  opacity. Higher intensity is easier to see in the export.
                </p>
              </div>
            )}
            <button
              className="export-button"
              disabled={!loaded || exporting}
              onClick={() => void handleExport()}
            >
              {exporting ? "Processing…" : copy.export}
            </button>
            <p className="status-text" aria-live="polite">
              {status}
            </p>
          </Panel>
        </aside>

        <section className="preview-column" aria-label="Animation preview">
          <div className={`preview-stage ${loaded ? "has-media" : ""}`}>
            {!loaded && (
              <p>Preview will appear here after loading an image</p>
            )}
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              aria-label="Grid noise animation preview"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className={drawRegion ? "drawing-region" : ""}
            />
            {loaded && (
              <>
                <div className="region-tools">
                  <button
                    className={drawRegion ? "is-active" : ""}
                    onClick={() => setDrawRegion(!drawRegion)}
                  >
                    ✎ Draw Region
                  </button>
                  <button onClick={() => setRegion(null)}>× Clear</button>
                  <button onClick={() => setApplyInside(!applyInside)}>
                    ● {applyInside ? "Inside" : "Outside"}
                  </button>
                </div>
                <div className="noise-meter">
                  <span>NOISE STRENGTH</span>
                  <strong>{noiseStrength}%</strong>
                  <i>
                    <b style={{ width: `${noiseStrength}%` }} />
                  </i>
                  <small>
                    {noiseType === "white" ? "white noise" : "blue noise"}
                  </small>
                </div>
              </>
            )}
          </div>
          <div className="preview-buttons">
            <button
              disabled={!loaded}
              onClick={() => {
                setPlaying(true);
                if (
                  sourceRef.current &&
                  "play" in sourceRef.current &&
                  mediaKind === "video"
                ) {
                  void sourceRef.current.play();
                }
              }}
            >
              ▶ {copy.play}
            </button>
            <button
              disabled={!loaded}
              onClick={() => {
                setPlaying(false);
                if (
                  sourceRef.current &&
                  "pause" in sourceRef.current &&
                  mediaKind === "video"
                ) {
                  sourceRef.current.pause();
                }
              }}
            >
              ■ {copy.stop}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
