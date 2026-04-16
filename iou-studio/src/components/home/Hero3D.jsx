import { useEffect, useRef } from "react";
import { useTheme } from "../../theme/useTheme.js";

const DESKTOP_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const LOW_END_MEMORY_GB = 4;
const LOW_END_CORE_COUNT = 4;

const NODE_BLUEPRINTS = [
  {
    colorKey: "accent",
    drift: 0.18,
    geometry: (THREE) => new THREE.IcosahedronGeometry(0.56, 0),
    opacity: 0.44,
    phase: 0.14,
    position: [1.2, 1.35, -1.8],
    rotation: [0.28, 0.34, 0.08],
    spin: [0.12, 0.18, 0.08],
  },
  {
    colorKey: "soft",
    drift: 0.14,
    geometry: (THREE) => new THREE.BoxGeometry(0.58, 0.58, 0.58),
    opacity: 0.28,
    phase: 1.4,
    position: [2.35, 0.18, -0.55],
    rotation: [0.42, 0.14, 0.34],
    spin: [0.09, 0.12, 0.16],
  },
  {
    colorKey: "warm",
    drift: 0.16,
    geometry: (THREE) => new THREE.SphereGeometry(0.34, 24, 24),
    opacity: 0.24,
    phase: 0.88,
    position: [1.42, -1.22, -1.05],
    rotation: [0.12, 0.24, 0.22],
    spin: [0.06, 0.1, 0.04],
  },
  {
    colorKey: "accent",
    drift: 0.12,
    flatShading: false,
    geometry: (THREE) => new THREE.TorusGeometry(0.5, 0.06, 18, 64),
    opacity: 0.22,
    phase: 2.18,
    position: [0.14, 0.58, 0.26],
    rotation: [1.08, 0.2, 0.62],
    spin: [0.05, 0.08, 0.14],
  },
  {
    colorKey: "soft",
    drift: 0.1,
    geometry: (THREE) => new THREE.OctahedronGeometry(0.44, 0),
    opacity: 0.26,
    phase: 2.74,
    position: [0.58, -1.52, 0.36],
    rotation: [0.34, 0.58, 0.12],
    spin: [0.08, 0.14, 0.1],
  },
  {
    colorKey: "warm",
    drift: 0.08,
    geometry: (THREE) => new THREE.BoxGeometry(0.34, 1.02, 0.34),
    opacity: 0.18,
    phase: 1.9,
    position: [2.82, -1.05, 0.92],
    rotation: [0.22, 0.32, 0.08],
    spin: [0.04, 0.08, 0.02],
  },
];

function getPalette(isDark) {
  return isDark
    ? {
        accent: "#b794f6",
        ambientLight: "#a78bfa",
        border: "rgba(255, 255, 255, 0.08)",
        fade:
          "linear-gradient(90deg, rgba(6, 7, 11, 0.84) 0%, rgba(6, 7, 11, 0.68) 28%, rgba(6, 7, 11, 0.16) 62%, rgba(6, 7, 11, 0.42) 100%)",
        fog: "#080910",
        glowPrimary: "rgba(124, 58, 237, 0.18)",
        glowSecondary: "rgba(147, 197, 253, 0.12)",
        keyLight: "#c4b5fd",
        shell:
          "linear-gradient(160deg, rgba(255, 255, 255, 0.04), rgba(124, 58, 237, 0.1) 48%, rgba(6, 7, 11, 0.04) 100%)",
        soft: "#8b5cf6",
        topFade:
          "linear-gradient(180deg, rgba(6, 7, 11, 0.18) 0%, rgba(6, 7, 11, 0) 34%, rgba(6, 7, 11, 0.34) 100%)",
        warm: "#dbeafe",
      }
    : {
        accent: "#9476f2",
        ambientLight: "#d6bcfa",
        border: "rgba(113, 84, 62, 0.12)",
        fade:
          "linear-gradient(90deg, rgba(246, 239, 231, 0.94) 0%, rgba(246, 239, 231, 0.76) 28%, rgba(246, 239, 231, 0.16) 62%, rgba(246, 239, 231, 0.5) 100%)",
        fog: "#f4ece3",
        glowPrimary: "rgba(148, 118, 242, 0.16)",
        glowSecondary: "rgba(190, 143, 94, 0.14)",
        keyLight: "#c4b5fd",
        shell:
          "linear-gradient(160deg, rgba(255, 255, 255, 0.22), rgba(148, 118, 242, 0.08) 48%, rgba(255, 255, 255, 0.04) 100%)",
        soft: "#6d4de0",
        topFade:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0) 34%, rgba(246, 239, 231, 0.22) 100%)",
        warm: "#be8f5e",
      };
}

function addMediaListener(mediaQueryList, handler) {
  if ("addEventListener" in mediaQueryList) {
    mediaQueryList.addEventListener("change", handler);

    return () => mediaQueryList.removeEventListener("change", handler);
  }

  mediaQueryList.addListener(handler);

  return () => mediaQueryList.removeListener(handler);
}

function disposeMaterial(material) {
  if (Array.isArray(material)) {
    material.forEach(disposeMaterial);

    return;
  }

  material.dispose();
}

function isLowPowerDevice() {
  if (typeof navigator === "undefined") {
    return false;
  }

  const deviceMemory =
    typeof navigator.deviceMemory === "number" ? navigator.deviceMemory : null;
  const hardwareConcurrency =
    typeof navigator.hardwareConcurrency === "number"
      ? navigator.hardwareConcurrency
      : null;

  return (
    (deviceMemory !== null && deviceMemory <= LOW_END_MEMORY_GB) ||
    (hardwareConcurrency !== null &&
      hardwareConcurrency <= LOW_END_CORE_COUNT)
  );
}

function createScene({ THREE, canvas, container, isDark }) {
  const palette = getPalette(isDark);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
    powerPreference: "low-power",
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 24);
  const root = new THREE.Group();
  const clock = new THREE.Clock();
  const meshes = [];
  const rootBasePosition = { x: 0.64, y: 0.02 };
  let elapsed = 0;
  let frameId = 0;
  let resizeObserver;

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = isDark ? 0.9 : 1.04;
  renderer.setClearAlpha(0);

  scene.fog = new THREE.Fog(palette.fog, 8.5, 15.5);

  camera.position.set(0.28, 0.1, 8.7);

  const ambientLight = new THREE.AmbientLight(
    palette.ambientLight,
    isDark ? 1.1 : 1.25,
  );
  const keyLight = new THREE.PointLight(
    palette.keyLight,
    isDark ? 1.7 : 1.45,
    18,
    2,
  );
  const fillLight = new THREE.DirectionalLight(
    isDark ? "#93c5fd" : "#f4d1b1",
    isDark ? 0.5 : 0.74,
  );

  keyLight.position.set(4.2, 3.1, 6.8);
  fillLight.position.set(-4.5, -2.3, 4.4);

  root.rotation.set(-0.2, -0.46, 0.04);
  scene.add(ambientLight, keyLight, fillLight, root);

  NODE_BLUEPRINTS.forEach((blueprint) => {
    const geometry = blueprint.geometry(THREE);
    const material = new THREE.MeshStandardMaterial({
      color: palette[blueprint.colorKey],
      emissive: palette.accent,
      emissiveIntensity: isDark ? 0.14 : 0.08,
      flatShading: blueprint.flatShading ?? true,
      metalness: 0.06,
      opacity: blueprint.opacity,
      roughness: 0.72,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(...blueprint.position);
    mesh.rotation.set(...blueprint.rotation);
    root.add(mesh);

    meshes.push({
      basePosition: mesh.position.clone(),
      drift: blueprint.drift,
      mesh,
      phase: blueprint.phase,
      speed: 0.16 + blueprint.drift * 0.28,
      spin: blueprint.spin,
    });
  });

  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) {
      return;
    }

    const isCompact = width < 360;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);

    camera.aspect = width / height;
    camera.fov = isCompact ? 30 : 28;
    camera.position.x = isCompact ? 0.18 : 0.28;
    camera.position.z = isCompact ? 9.2 : 8.7;
    camera.updateProjectionMatrix();

    rootBasePosition.x = isCompact ? 0.28 : 0.64;
    rootBasePosition.y = isCompact ? 0.08 : 0.02;
    root.position.x = rootBasePosition.x;
    root.position.y = rootBasePosition.y;
  };

  const renderFrame = () => {
    frameId = window.requestAnimationFrame(renderFrame);

    const delta = Math.min(clock.getDelta(), 0.033);

    elapsed += delta;

    root.rotation.y = -0.46 + Math.sin(elapsed * 0.18) * 0.08;
    root.rotation.x = -0.2 + Math.cos(elapsed * 0.15) * 0.04;
    root.position.x = rootBasePosition.x;
    root.position.y = rootBasePosition.y + Math.sin(elapsed * 0.16) * 0.08;

    meshes.forEach((item) => {
      item.mesh.position.x =
        item.basePosition.x + Math.sin(elapsed * item.speed + item.phase) * item.drift;
      item.mesh.position.y =
        item.basePosition.y +
        Math.cos(elapsed * (item.speed * 0.92) + item.phase) * item.drift * 0.62;
      item.mesh.rotation.x += item.spin[0] * delta;
      item.mesh.rotation.y += item.spin[1] * delta;
      item.mesh.rotation.z += item.spin[2] * delta;
    });

    renderer.render(scene, camera);
  };

  resize();

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
  } else {
    window.addEventListener("resize", resize);
  }

  renderFrame();

  return {
    destroy() {
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);

      meshes.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        disposeMaterial(mesh.material);
      });

      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

export default function Hero3D({ className = "" }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { isDark } = useTheme();
  const palette = getPalette(isDark);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) {
      return undefined;
    }

    const desktopMedia = window.matchMedia(DESKTOP_QUERY);
    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
    let isDisposed = false;
    let isLoading = false;
    let sceneHandle;

    const canRenderScene = () =>
      desktopMedia.matches &&
      !reducedMotionMedia.matches &&
      !isLowPowerDevice();

    const stopScene = () => {
      sceneHandle?.destroy();
      sceneHandle = undefined;
      canvas.style.opacity = "0";
    };

    const startScene = async () => {
      if (isDisposed || isLoading || sceneHandle || !canRenderScene()) {
        return;
      }

      isLoading = true;

      const THREE = await import("three").catch(() => null);

      isLoading = false;

      if (!THREE || isDisposed || sceneHandle || !canRenderScene()) {
        return;
      }

      sceneHandle = createScene({
        THREE,
        canvas,
        container,
        isDark,
      });
      canvas.style.opacity = "1";
    };

    const syncScene = () => {
      if (canRenderScene()) {
        void startScene();

        return;
      }

      stopScene();
    };

    const detachDesktop = addMediaListener(desktopMedia, syncScene);
    const detachReducedMotion = addMediaListener(reducedMotionMedia, syncScene);

    syncScene();

    return () => {
      isDisposed = true;
      detachDesktop();
      detachReducedMotion();
      stopScene();
    };
  }, [isDark]);

  return (
    <div
      aria-hidden="true"
      ref={containerRef}
      className={[
        "absolute inset-0 overflow-hidden rounded-[28px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: palette.shell,
          border: `1px solid ${palette.border}`,
        }}
      />
      <div
        className="absolute -right-8 top-[-2rem] h-44 w-44 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${palette.glowPrimary} 0%, transparent 72%)`,
        }}
      />
      <div
        className="absolute bottom-[-3rem] left-[-2rem] h-40 w-40 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${palette.glowSecondary} 0%, transparent 72%)`,
        }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700"
      />

      <div
        className="absolute inset-0"
        style={{
          background: palette.fade,
        }}
      />
      <div
        className="absolute inset-0 opacity-75"
        style={{
          background: palette.topFade,
        }}
      />
    </div>
  );
}
