"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { CalculationSummary, DovetailParams } from "./types";
import { num } from "@/lib/format";

// Ported from the Drive reference's ThreeDCornerVisualizer.tsx + utils/woodTextures.ts.
// The reference exposed a wood-species switch in its types but never wired a UI control
// for it (species was hardcoded to 'oak' everywhere it was used) – simplified here to
// the one reachable path instead of carrying five unused material branches.

function createOakGrainTexture(isEndGrain: boolean): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const size = isEndGrain ? 512 : 1024;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const baseColor = "#c89d6b";
  const grainDark = "#8f6236";
  const grainLight = "#dec096";
  const poreColor = "#704720";

  if (isEndGrain) {
    ctx.fillStyle = grainDark;
    ctx.fillRect(0, 0, size, size);

    const centerX = size * 0.45;
    const centerY = size * 1.35;
    const ringCount = 35;
    for (let i = 0; i < ringCount; i++) {
      const radius = 60 + i * (size / ringCount) * 1.2;
      const ringWidth = 4 + (i % 3) * 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = i % 2 === 0 ? baseColor : grainLight;
      ctx.lineWidth = ringWidth;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + ringWidth * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = poreColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1;
    for (let a = -Math.PI * 0.4; a < Math.PI * 0.4; a += 0.04) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.sin(a) * size * 1.8, centerY - Math.cos(a) * size * 1.8);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(0, 0, size, size);
  } else {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, size, size);

    for (let y = 0; y < size; y += 4) {
      const alpha = 0.05 + Math.sin(y * 0.04) * 0.04;
      ctx.fillStyle = y % 8 === 0 ? grainDark : grainLight;
      ctx.globalAlpha = alpha;
      ctx.fillRect(0, y, size, 2);
    }
    ctx.globalAlpha = 1.0;

    ctx.lineWidth = 2.5;
    const waves = 14;
    for (let i = 0; i < waves; i++) {
      const baseX = (i / waves) * size + 20;
      ctx.beginPath();
      ctx.moveTo(baseX, 0);

      const freq1 = 0.005 + (i % 4) * 0.002;
      const amp1 = 25 + (i % 3) * 15;
      const freq2 = 0.015;
      const amp2 = 6;

      for (let y = 0; y <= size; y += 8) {
        const xOffset = Math.sin(y * freq1) * amp1 + Math.cos(y * freq2) * amp2;
        ctx.lineTo(baseX + xOffset, y);
      }

      ctx.strokeStyle = i % 3 === 0 ? grainDark : poreColor;
      ctx.globalAlpha = 0.25 + (i % 2) * 0.15;
      ctx.stroke();
    }

    ctx.globalAlpha = 0.15;
    ctx.fillStyle = poreColor;
    for (let p = 0; p < 800; p++) {
      const px = Math.random() * size;
      const py = Math.random() * size;
      const plen = 4 + Math.random() * 12;
      ctx.fillRect(px, py, 1.2, plen);
    }
    ctx.globalAlpha = 1.0;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  if (!isEndGrain) texture.repeat.set(1, 2);
  return texture;
}

function createOakMaterials() {
  const faceMaterial = new THREE.MeshStandardMaterial({
    map: createOakGrainTexture(false),
    roughness: 0.55,
    metalness: 0.02,
  });
  const endGrainMaterial = new THREE.MeshStandardMaterial({
    map: createOakGrainTexture(true),
    roughness: 0.75,
    metalness: 0.02,
  });
  return { faceMaterial, endGrainMaterial };
}

type CameraPreset = "corner_ext" | "corner_int" | "top" | "tail_face" | "pin_face";

const CAMERA_BUTTONS: { key: CameraPreset; label: string; title: string }[] = [
  { key: "corner_ext", label: "Ecke außen (90°)", title: "90° Eckverbindung von außen betrachten" },
  { key: "corner_int", label: "Ecke innen", title: "90° Eckverbindung von innen betrachten" },
  { key: "top", label: "Draufsicht", title: "Draufsicht auf die Zinken" },
  { key: "tail_face", label: "Schwalbenseite", title: "Schwalbenseite (Schubladenseite)" },
  { key: "pin_face", label: "Zinkenseite", title: "Zinkenseite (Vorderstück)" },
];

interface ThreeDCornerVisualizerProps {
  summary: CalculationSummary;
  params: DovetailParams;
  hoveredElementId: string | null;
  onHoverElement: (id: string | null) => void;
  explosionProgress: number;
  onExplosionChange: (val: number) => void;
}

export default function ThreeDCornerVisualizer({
  summary,
  params,
  hoveredElementId,
  onHoverElement,
  explosionProgress,
  onExplosionChange,
}: ThreeDCornerVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const tailBoardGroupRef = useRef<THREE.Group | null>(null);
  const pinBoardGroupRef = useRef<THREE.Group | null>(null);
  const shadowPlaneRef = useRef<THREE.Mesh | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const meshesByIdRef = useRef<Map<string, THREE.Mesh[]>>(new Map());

  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isAnimatingCycle, setIsAnimatingCycle] = useState(false);
  const [activeCameraView, setActiveCameraView] = useState<CameraPreset>("corner_ext");
  const cycleAnimRef = useRef<number | null>(null);

  const onHoverElementRef = useRef(onHoverElement);
  useEffect(() => {
    onHoverElementRef.current = onHoverElement;
  }, [onHoverElement]);

  const { boardWidth, boardThickness, pinBoardThickness, jointType, halfBlindLap, unit } = params;
  const unitLabel = unit === "mm" ? "mm" : "in";
  const boardLength = Math.max(90, boardWidth * 0.75);

  // Scene setup – runs once on mount.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f2ec);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 3000);
    camera.position.set(boardWidth * 1.2, boardWidth * 0.9, boardWidth * 1.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.minDistance = 30;
    controls.maxDistance = 1500;
    controls.target.set(0, 0, pinBoardThickness * 0.5);
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    keyLight.position.set(180, 300, 220);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 10;
    keyLight.shadow.camera.far = 1000;
    const d = boardWidth * 1.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xdbeafe, 0.9);
    rimLight.position.set(-180, 100, -200);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xfef3c7, 0.5);
    fillLight.position.set(0, -200, 100);
    scene.add(fillLight);

    const shadowPlaneGeo = new THREE.PlaneGeometry(2000, 2000);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -boardThickness - 1;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);
    shadowPlaneRef.current = shadowPlane;

    const gridHelper = new THREE.GridHelper(Math.max(600, boardWidth * 4), 30, 0xd6d3d1, 0xe7e5e4);
    gridHelper.position.y = shadowPlane.position.y;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    const tailGroup = new THREE.Group();
    tailGroup.name = "tailBoardGroup";
    scene.add(tailGroup);
    tailBoardGroupRef.current = tailGroup;

    const pinGroup = new THREE.Group();
    pinGroup.name = "pinBoardGroup";
    scene.add(pinGroup);
    pinBoardGroupRef.current = pinGroup;

    let isRunning = true;
    const animate = () => {
      if (!isRunning) return;
      animationFrameIdRef.current = requestAnimationFrame(animate);
      controlsRef.current?.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();
    setIsSceneReady(true);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: PointerEvent) => {
      if (!rendererRef.current || !cameraRef.current) return;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const candidates: THREE.Object3D[] = [];
      if (tailBoardGroupRef.current) candidates.push(...tailBoardGroupRef.current.children);
      if (pinBoardGroupRef.current) candidates.push(...pinBoardGroupRef.current.children);

      const intersects = raycaster.intersectObjects(candidates, false);
      const hit = intersects.find((i) => i.object.userData && i.object.userData.id);
      onHoverElementRef.current?.(hit ? hit.object.userData.id : null);
    };

    const handlePointerLeave = () => onHoverElementRef.current?.(null);

    const canvasDom = renderer.domElement;
    canvasDom.addEventListener("pointermove", handlePointerMove);
    canvasDom.addEventListener("pointerleave", handlePointerLeave);

    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      isRunning = false;
      setIsSceneReady(false);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      canvasDom.removeEventListener("pointermove", handlePointerMove);
      canvasDom.removeEventListener("pointerleave", handlePointerLeave);
      resizeObserver.disconnect();
      rendererRef.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
      controlsRef.current.autoRotateSpeed = 1.4;
    }
  }, [isAutoRotating]);

  useEffect(() => {
    const floorY = -boardThickness - 1;
    if (shadowPlaneRef.current) shadowPlaneRef.current.position.y = floorY;
    if (gridHelperRef.current) gridHelperRef.current.position.y = floorY;
  }, [boardThickness]);

  // Auto-fügen cycle animation.
  useEffect(() => {
    if (!isAnimatingCycle) {
      if (cycleAnimRef.current) cancelAnimationFrame(cycleAnimRef.current);
      return;
    }
    const startTime = performance.now();
    const runCycle = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const val = (Math.sin(elapsed * 1.95 - Math.PI / 2) + 1) * 0.5 * 55;
      onExplosionChange(Math.round(val));
      cycleAnimRef.current = requestAnimationFrame(runCycle);
    };
    cycleAnimRef.current = requestAnimationFrame(runCycle);
    return () => {
      if (cycleAnimRef.current) cancelAnimationFrame(cycleAnimRef.current);
    };
  }, [isAnimatingCycle, onExplosionChange]);

  // Build the 3D corner mesh geometry whenever parameters or summary change.
  useEffect(() => {
    if (!sceneRef.current || !tailBoardGroupRef.current || !pinBoardGroupRef.current) return;

    const tailGroup = tailBoardGroupRef.current;
    const pinGroup = pinBoardGroupRef.current;

    while (tailGroup.children.length > 0) {
      const child = tailGroup.children[0] as THREE.Mesh;
      child.geometry?.dispose();
      tailGroup.remove(child);
    }
    while (pinGroup.children.length > 0) {
      const child = pinGroup.children[0] as THREE.Mesh;
      child.geometry?.dispose();
      pinGroup.remove(child);
    }
    meshesByIdRef.current.clear();

    const { faceMaterial, endGrainMaterial } = createOakMaterials();

    const jointDepth = jointType === "half_blind" ? pinBoardThickness - halfBlindLap : pinBoardThickness;
    const cx = -boardWidth / 2;

    const edgeMat = new THREE.LineBasicMaterial({ color: 0x542912, transparent: true, opacity: 0.32 });

    // 1. Tail board (Schwalbenbrett): horizontal, tails project in +Z.
    const tailBodyGeo = new THREE.BoxGeometry(boardWidth, boardThickness, boardLength);
    const tailBodyMesh = new THREE.Mesh(tailBodyGeo, faceMaterial);
    tailBodyMesh.position.set(0, -boardThickness / 2, -boardLength / 2);
    tailBodyMesh.castShadow = true;
    tailBodyMesh.receiveShadow = true;
    tailBodyMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(tailBodyGeo), edgeMat));
    tailGroup.add(tailBodyMesh);

    summary.elements.forEach((el) => {
      if (el.type !== "tail") return;

      const xBaseL = cx + el.leftBase;
      const xBaseR = cx + el.rightBase;
      const xTipL = cx + el.leftTip;
      const xTipR = cx + el.rightTip;
      const yBottom = -boardThickness;
      const yTop = 0;

      const positions = new Float32Array([
        xTipL, yBottom, jointDepth, xTipR, yBottom, jointDepth, xTipR, yTop, jointDepth,
        xTipL, yBottom, jointDepth, xTipR, yTop, jointDepth, xTipL, yTop, jointDepth,

        xTipL, yTop, jointDepth, xTipR, yTop, jointDepth, xBaseR, yTop, 0,
        xTipL, yTop, jointDepth, xBaseR, yTop, 0, xBaseL, yTop, 0,

        xBaseL, yBottom, 0, xBaseR, yBottom, 0, xTipR, yBottom, jointDepth,
        xBaseL, yBottom, 0, xTipR, yBottom, jointDepth, xTipL, yBottom, jointDepth,

        xBaseL, yBottom, 0, xTipL, yBottom, jointDepth, xTipL, yTop, jointDepth,
        xBaseL, yBottom, 0, xTipL, yTop, jointDepth, xBaseL, yTop, 0,

        xTipR, yBottom, jointDepth, xBaseR, yBottom, 0, xBaseR, yTop, 0,
        xTipR, yBottom, jointDepth, xBaseR, yTop, 0, xTipR, yTop, jointDepth,
      ]);

      // Same 0/0-1/0-1/1-0/1 UV quad repeated for all five faces (front tip, top, bottom, left, right).
      const uvs = new Float32Array([
        0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
        0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
      ]);

      const tailGeo = new THREE.BufferGeometry();
      tailGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      tailGeo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
      tailGeo.computeVertexNormals();
      tailGeo.addGroup(0, 6, 1);
      tailGeo.addGroup(6, 24, 0);

      const tailMesh = new THREE.Mesh(tailGeo, [faceMaterial.clone(), endGrainMaterial.clone()]);
      tailMesh.castShadow = true;
      tailMesh.receiveShadow = true;
      tailMesh.userData = { id: el.id, label: el.label, type: "tail" };
      tailMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(tailGeo, 18), edgeMat));
      tailGroup.add(tailMesh);

      meshesByIdRef.current.set(el.id, [tailMesh]);
    });

    // 2. Pin board (Zinkenbrett): stands upright above the shoulder line.
    const pinBodyGeo = new THREE.BoxGeometry(boardWidth, boardLength, pinBoardThickness);
    const pinBodyMesh = new THREE.Mesh(pinBodyGeo, faceMaterial);
    pinBodyMesh.position.set(0, boardLength / 2, pinBoardThickness / 2);
    pinBodyMesh.castShadow = true;
    pinBodyMesh.receiveShadow = true;
    pinBodyMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(pinBodyGeo), edgeMat));
    pinGroup.add(pinBodyMesh);

    if (jointType === "half_blind") {
      const lapGeo = new THREE.BoxGeometry(boardWidth, boardThickness, halfBlindLap);
      const lapMesh = new THREE.Mesh(lapGeo, faceMaterial);
      lapMesh.position.set(0, -boardThickness / 2, jointDepth + halfBlindLap / 2);
      lapMesh.castShadow = true;
      lapMesh.receiveShadow = true;
      lapMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(lapGeo), edgeMat));
      pinGroup.add(lapMesh);
    }

    summary.elements.forEach((el) => {
      if (el.type !== "pin" && el.type !== "half_pin") return;

      const xBL = cx + el.leftBase;
      const xBR = cx + el.rightBase;
      const xTL = cx + el.leftTip;
      const xTR = cx + el.rightTip;
      const zMin = 0;
      const zMax = jointDepth;
      const yTop = 0;
      const yBottom = -boardThickness;

      const positions = new Float32Array([
        xBL, yBottom, zMin, xBR, yBottom, zMin, xTR, yBottom, zMax,
        xBL, yBottom, zMin, xTR, yBottom, zMax, xTL, yBottom, zMax,

        xBL, yTop, zMin, xTL, yTop, zMax, xTR, yTop, zMax,
        xBL, yTop, zMin, xTR, yTop, zMax, xBR, yTop, zMin,

        xBL, yTop, zMin, xBR, yTop, zMin, xBR, yBottom, zMin,
        xBL, yTop, zMin, xBR, yBottom, zMin, xBL, yBottom, zMin,

        xTL, yTop, zMax, xTL, yBottom, zMax, xTR, yBottom, zMax,
        xTL, yTop, zMax, xTR, yBottom, zMax, xTR, yTop, zMax,

        xBL, yTop, zMin, xBL, yBottom, zMin, xTL, yBottom, zMax,
        xBL, yTop, zMin, xTL, yBottom, zMax, xTL, yTop, zMax,

        xBR, yTop, zMin, xTR, yTop, zMax, xTR, yBottom, zMax,
        xBR, yTop, zMin, xTR, yBottom, zMax, xBR, yBottom, zMin,
      ]);

      const uvs = new Float32Array([
        // Bottom (Hirnholz / end grain)
        0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
        // Top (shoulder)
        0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0,
        // Back
        0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0,
        // Front
        0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
        // Left
        0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
        // Right
        0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0,
      ]);

      const pinGeo = new THREE.BufferGeometry();
      pinGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      pinGeo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
      pinGeo.computeVertexNormals();
      pinGeo.addGroup(0, 6, 1);
      pinGeo.addGroup(6, 30, 0);

      const pinMesh = new THREE.Mesh(pinGeo, [faceMaterial.clone(), endGrainMaterial.clone()]);
      pinMesh.castShadow = true;
      pinMesh.receiveShadow = true;
      pinMesh.userData = { id: el.id, label: el.label, type: el.type };
      pinMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(pinGeo, 18), edgeMat));
      pinGroup.add(pinMesh);

      meshesByIdRef.current.set(el.id, [pinMesh]);
    });
  }, [isSceneReady, summary, boardWidth, boardThickness, pinBoardThickness, jointType, halfBlindLap, boardLength]);

  // Explosion offset: tail board stationary, pin board lifts along +Y.
  useEffect(() => {
    if (!pinBoardGroupRef.current || !tailBoardGroupRef.current) return;
    tailBoardGroupRef.current.position.set(0, 0, 0);
    const maxShift = Math.max(65, boardThickness * 3.5);
    const shiftY = (explosionProgress / 100) * maxShift;
    pinBoardGroupRef.current.position.set(0, shiftY, 0);
  }, [isSceneReady, explosionProgress, boardThickness]);

  // Hover highlight.
  useEffect(() => {
    meshesByIdRef.current.forEach((meshes, id) => {
      const isHovered = hoveredElementId === id;
      meshes.forEach((mesh) => {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.emissive.setHex(isHovered ? 0xf59e0b : 0x000000);
              mat.emissiveIntensity = isHovered ? 0.35 : 0;
            }
          });
        }
      });
    });
  }, [hoveredElementId]);

  const setCameraPreset = (preset: CameraPreset) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    setActiveCameraView(preset);
    const dist = boardWidth * 1.5;

    switch (preset) {
      case "corner_ext":
        camera.position.set(dist * 0.85, dist * 0.75, dist * 1.15);
        controls.target.set(0, 0, pinBoardThickness * 0.5);
        break;
      case "corner_int":
        camera.position.set(dist * 0.8, dist * 0.75, -dist * 0.9);
        controls.target.set(0, 0, 0);
        break;
      case "top":
        camera.position.set(0, dist * 1.5, pinBoardThickness * 0.5);
        controls.target.set(0, 0, pinBoardThickness * 0.5);
        break;
      case "tail_face":
        camera.position.set(0, dist * 1.15, -boardLength * 0.5 - 20);
        controls.target.set(0, 0, -boardLength * 0.5);
        break;
      case "pin_face":
        camera.position.set(0, boardLength * 0.5, dist * 1.3);
        controls.target.set(0, boardLength * 0.5, pinBoardThickness);
        break;
    }
    controls.update();
  };

  const activeElement = summary.elements.find((e) => e.id === hoveredElementId);

  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-b-[var(--radius)] bg-surface select-none">
      <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

      <div className="pointer-events-none absolute top-3 right-3 left-3 flex flex-wrap items-center justify-between gap-2">
        <div className="pointer-events-auto flex items-center gap-1 rounded-lg border border-border bg-paper/95 p-1 text-xs shadow-sm backdrop-blur-xs">
          <span className="px-2 text-[11px] font-semibold text-ink-faint">Blickwinkel:</span>
          {CAMERA_BUTTONS.map((btn) => (
            <button
              key={btn.key}
              type="button"
              onClick={() => setCameraPreset(btn.key)}
              title={btn.title}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                activeCameraView === btn.key
                  ? "bg-accent text-accent-contrast"
                  : "text-ink-muted hover:bg-surface hover:text-ink"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="pointer-events-auto flex items-center gap-2 rounded-lg border border-border bg-paper/95 p-1 text-xs shadow-sm backdrop-blur-xs">
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            title="3D-Modell automatisch um die Ecke rotieren"
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 font-medium transition-colors ${
              isAutoRotating ? "bg-accent-soft text-accent" : "text-ink-muted hover:text-ink"
            }`}
          >
            {isAutoRotating ? "Stop" : "Drehen"}
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute right-3 bottom-3 left-3 flex flex-wrap items-end justify-between gap-3">
        <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-border bg-paper/95 px-3.5 py-2.5 shadow-md backdrop-blur-xs">
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold tracking-wide text-ink-muted uppercase">
                Verbindung öffnen / schließen:
              </span>
              <span className="font-mono text-xs font-semibold text-accent">
                {explosionProgress === 0 ? "0% (gefügt)" : `${explosionProgress}% offen`}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onExplosionChange(0)}
                className={`rounded px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                  explosionProgress === 0 ? "bg-accent text-accent-contrast" : "bg-surface text-ink-muted hover:text-ink"
                }`}
              >
                Passung (0 %)
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={explosionProgress}
                onChange={(e) => onExplosionChange(Number(e.target.value))}
                className="w-36 accent-accent"
              />
              <button
                type="button"
                onClick={() => onExplosionChange(60)}
                className={`rounded px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                  explosionProgress === 60 ? "bg-accent text-accent-contrast" : "bg-surface text-ink-muted hover:text-ink"
                }`}
              >
                Offen (60 %)
              </button>
              <button
                type="button"
                onClick={() => setIsAnimatingCycle(!isAnimatingCycle)}
                title="Verbindung kontinuierlich öffnen und schließen"
                className={`rounded px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                  isAnimatingCycle
                    ? "bg-accent text-accent-contrast"
                    : "border border-accent/30 bg-accent-soft text-accent"
                }`}
              >
                Auto-Fügen
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {activeElement && (
            <div className="pointer-events-auto flex items-center gap-2.5 rounded-lg border border-ink/10 bg-ink px-3 py-2 text-xs text-paper shadow-lg">
              <span className="font-bold text-accent">{activeElement.label}</span>
              <span className="opacity-60">•</span>
              <span>
                Grund: <strong>{num(activeElement.baseWidth, 1)} {unitLabel}</strong>
              </span>
              <span className="opacity-60">•</span>
              <span>
                Hirnholz: <strong>{num(activeElement.tipWidth, 1)} {unitLabel}</strong>
              </span>
            </div>
          )}

          <div className="pointer-events-auto flex items-center gap-2.5 rounded-lg border border-border bg-paper/95 px-3 py-1.5 text-[11px] font-medium text-ink-muted shadow-sm backdrop-blur-xs">
            <span className="inline-block size-2 rounded-full bg-accent" />
            <span>90° Eckverbindung ({jointType === "half_blind" ? "halbverdeckt" : "offen durchgesteckt"})</span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute top-14 left-3 hidden rounded border border-border bg-paper/70 px-2 py-1 text-[10px] text-ink-faint backdrop-blur-xs sm:block">
        Linksklick: Drehen • Rechtsklick: Verschieben • Rad: Zoomen
      </div>
    </div>
  );
}
