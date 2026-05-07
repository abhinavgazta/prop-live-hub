import { useEffect, useRef, useState } from "react";
import { X, Maximize2, RotateCcw, Eye, Users, Building2, Flame } from "lucide-react";
import type { LocalityInsight } from "@/lib/mockMapData";

type Props = {
  locality: LocalityInsight;
  onClose: () => void;
};

export function Locality3DView({ locality, onClose }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cleanupRef = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;

    (async () => {
      try {
        const THREE = await import("three");
        if (disposed || !mountRef.current) return;

        const mount = mountRef.current;
        const width = mount.clientWidth;
        const height = mount.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0b1020);
        scene.fog = new THREE.Fog(0x0b1020, 800, 1800);

        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
        camera.position.set(560, 480, 560);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mount.appendChild(renderer.domElement);

        // Ambient + directional + accent
        scene.add(new THREE.AmbientLight(0x6678aa, 0.55));
        const sun = new THREE.DirectionalLight(0xffeacc, 1.05);
        sun.position.set(420, 600, 240);
        sun.castShadow = true;
        sun.shadow.mapSize.set(1024, 1024);
        sun.shadow.camera.left = -800;
        sun.shadow.camera.right = 800;
        sun.shadow.camera.top = 800;
        sun.shadow.camera.bottom = -800;
        scene.add(sun);
        const accent = new THREE.PointLight(0xe11d48, 1.2, 1200);
        accent.position.set(0, 220, 0);
        scene.add(accent);

        // Locality plate (the boundary footprint)
        const plateGeo = new THREE.CylinderGeometry(380, 420, 14, 64);
        const plateMat = new THREE.MeshStandardMaterial({
          color: 0x1a1f3a,
          roughness: 0.85,
          metalness: 0.15,
        });
        const plate = new THREE.Mesh(plateGeo, plateMat);
        plate.position.y = -7;
        plate.receiveShadow = true;
        scene.add(plate);

        // Boundary ring — purple emissive outline
        const ringGeo = new THREE.TorusGeometry(395, 4, 12, 96);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0x5e23dc,
          emissive: 0x5e23dc,
          emissiveIntensity: 0.7,
          roughness: 0.4,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 1;
        scene.add(ring);

        // Concentric grid lines for scale
        const gridGeo = new THREE.RingGeometry(150, 152, 64);
        const gridMat = new THREE.MeshBasicMaterial({
          color: 0x32406a,
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide,
        });
        for (const r of [120, 220, 320]) {
          const innerR = r;
          const ringG = new THREE.RingGeometry(innerR, innerR + 1.2, 64);
          const m = new THREE.Mesh(ringG, gridMat);
          m.rotation.x = -Math.PI / 2;
          m.position.y = 0.5;
          scene.add(m);
        }
        gridGeo.dispose();

        // Buildings
        const buildingMaterials = {
          base: new THREE.MeshStandardMaterial({
            color: 0x9bb1ff,
            roughness: 0.45,
            metalness: 0.35,
          }),
          live: new THREE.MeshStandardMaterial({
            color: 0xe11d48,
            emissive: 0xe11d48,
            emissiveIntensity: 0.55,
            roughness: 0.3,
            metalness: 0.4,
          }),
        };

        const buildings: THREE.Mesh[] = [];
        for (const b of locality.buildings) {
          const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
          const mat = b.live ? buildingMaterials.live : buildingMaterials.base.clone();
          if (!b.live) {
            (mat as THREE.MeshStandardMaterial).color.setHSL(
              0.62 + Math.random() * 0.05,
              0.4,
              0.55 + Math.random() * 0.15,
            );
          }
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(b.x, b.h / 2, b.y);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          scene.add(mesh);
          buildings.push(mesh);

          if (b.live) {
            // Pulsing halo on top of live buildings
            const haloGeo = new THREE.RingGeometry(b.w * 0.9, b.w * 1.1, 32);
            const haloMat = new THREE.MeshBasicMaterial({
              color: 0xe11d48,
              transparent: true,
              opacity: 0.7,
              side: THREE.DoubleSide,
            });
            const halo = new THREE.Mesh(haloGeo, haloMat);
            halo.rotation.x = -Math.PI / 2;
            halo.position.set(b.x, b.h + 2, b.y);
            halo.userData.kind = "halo";
            scene.add(halo);
          }
        }

        // Floating viewer points orbiting live buildings
        const viewerGroup = new THREE.Group();
        scene.add(viewerGroup);
        const liveBuildings = locality.buildings.filter((b) => b.live);
        const viewers: Array<{ mesh: THREE.Mesh; cx: number; cz: number; r: number; phase: number; speed: number }> = [];
        const sphereGeo = new THREE.SphereGeometry(4, 12, 12);
        const viewerMat = new THREE.MeshStandardMaterial({
          color: 0xfde68a,
          emissive: 0xfacc15,
          emissiveIntensity: 0.6,
        });
        liveBuildings.forEach((b) => {
          for (let i = 0; i < 14; i++) {
            const m = new THREE.Mesh(sphereGeo, viewerMat);
            const r = b.w * 1.4 + Math.random() * 30;
            const phase = Math.random() * Math.PI * 2;
            m.position.set(b.x + Math.cos(phase) * r, b.h + 20 + Math.random() * 40, b.y + Math.sin(phase) * r);
            viewerGroup.add(m);
            viewers.push({ mesh: m, cx: b.x, cz: b.y, r, phase, speed: 0.4 + Math.random() * 0.6 });
          }
        });

        // Camera orbit controls (lightweight, no extra dep)
        let azimuth = Math.PI / 4;
        let polar = Math.PI / 3;
        let radius = 820;
        let dragging = false;
        let lastX = 0;
        let lastY = 0;
        let autoRotate = true;

        const updateCamera = () => {
          const x = radius * Math.sin(polar) * Math.cos(azimuth);
          const y = radius * Math.cos(polar);
          const z = radius * Math.sin(polar) * Math.sin(azimuth);
          camera.position.set(x, y, z);
          camera.lookAt(0, 80, 0);
        };
        updateCamera();

        const onPointerDown = (e: PointerEvent) => {
          dragging = true;
          autoRotate = false;
          lastX = e.clientX;
          lastY = e.clientY;
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        };
        const onPointerMove = (e: PointerEvent) => {
          if (!dragging) return;
          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;
          lastX = e.clientX;
          lastY = e.clientY;
          azimuth -= dx * 0.005;
          polar = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, polar - dy * 0.005));
          updateCamera();
        };
        const onPointerUp = (e: PointerEvent) => {
          dragging = false;
          (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
        };
        const onWheel = (e: WheelEvent) => {
          e.preventDefault();
          radius = Math.max(420, Math.min(1600, radius + e.deltaY * 0.6));
          updateCamera();
        };
        renderer.domElement.addEventListener("pointerdown", onPointerDown);
        renderer.domElement.addEventListener("pointermove", onPointerMove);
        renderer.domElement.addEventListener("pointerup", onPointerUp);
        renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

        const onResize = () => {
          if (!mountRef.current) return;
          const w = mountRef.current.clientWidth;
          const h = mountRef.current.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        const ro = new ResizeObserver(onResize);
        ro.observe(mount);

        let raf = 0;
        const start = performance.now();
        const animate = () => {
          const t = (performance.now() - start) / 1000;
          if (autoRotate) {
            azimuth += 0.0025;
            updateCamera();
          }
          // Halo pulse
          scene.traverse((obj) => {
            if (obj.userData.kind === "halo") {
              const m = obj as THREE.Mesh;
              m.scale.setScalar(1 + Math.sin(t * 3) * 0.15);
              (m.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(t * 3) * 0.3;
            }
          });
          // Orbit viewers
          for (const v of viewers) {
            const phase = v.phase + t * v.speed;
            v.mesh.position.x = v.cx + Math.cos(phase) * v.r;
            v.mesh.position.z = v.cz + Math.sin(phase) * v.r;
          }
          // Spin boundary ring slowly
          ring.rotation.z = t * 0.2;
          renderer.render(scene, camera);
          raf = requestAnimationFrame(animate);
        };
        animate();
        setReady(true);

        const resetView = () => {
          azimuth = Math.PI / 4;
          polar = Math.PI / 3;
          radius = 820;
          autoRotate = true;
          updateCamera();
        };
        (mountRef.current as any).__reset = resetView;

        cleanupRef.current = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          renderer.domElement.removeEventListener("pointerdown", onPointerDown);
          renderer.domElement.removeEventListener("pointermove", onPointerMove);
          renderer.domElement.removeEventListener("pointerup", onPointerUp);
          renderer.domElement.removeEventListener("wheel", onWheel);
          renderer.dispose();
          buildings.forEach((b) => {
            b.geometry.dispose();
            (b.material as THREE.Material).dispose();
          });
          sphereGeo.dispose();
          viewerMat.dispose();
          plateGeo.dispose();
          plateMat.dispose();
          ringGeo.dispose();
          ringMat.dispose();
          if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        };
      } catch (e: any) {
        setError(e?.message ?? "Failed to load 3D view");
      }
    })();

    return () => {
      disposed = true;
      cleanupRef.current?.();
    };
  }, [locality]);

  const handleReset = () => {
    const reset = (mountRef.current as any)?.__reset;
    if (typeof reset === "function") reset();
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal
      onClick={onClose}
    >
      <div
        className="relative flex h-[80vh] w-[min(1080px,92vw)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-white/60">
              <Building2 className="h-3.5 w-3.5" /> 3D Locality · WebGL
            </div>
            <div className="text-lg font-bold">{locality.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold hover:bg-white/10"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" /> Close
            </button>
          </div>
        </div>

        <div className="relative flex-1">
          <div ref={mountRef} className="h-full w-full" />
          {!ready && !error && (
            <div className="absolute inset-0 grid place-items-center text-sm text-white/70">
              Spinning up WebGL scene…
            </div>
          )}
          {error && (
            <div className="absolute inset-0 grid place-items-center text-sm text-rose-300">
              {error}
            </div>
          )}

          {/* Stats overlay */}
          <div className="pointer-events-none absolute left-3 top-3 grid grid-cols-2 gap-2">
            <Stat icon={<Eye className="h-3 w-3" />} label="Viewers / 7d" value={locality.totalViewersLast7d.toLocaleString()} />
            <Stat icon={<Users className="h-3 w-3" />} label="Live now" value={String(locality.liveSessions)} accent="live" />
            <Stat icon={<Flame className="h-3 w-3" />} label="Hotness" value={`${locality.hotness}/100`} accent="gold" />
            <Stat icon={<Building2 className="h-3 w-3" />} label="Inventory" value={`${locality.inventoryUnits} units`} />
          </div>

          <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-[10px] text-white/60">
            <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 backdrop-blur">
              Drag to orbit · scroll to zoom · red blocks are live tours
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 backdrop-blur">
              <Maximize2 className="mr-1 inline h-3 w-3" />
              ₹{locality.avgPriceCr} Cr avg · {locality.pricePerSqftK}k psf · +{locality.yoyAppreciation}% YoY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "live" | "gold";
}) {
  const tone =
    accent === "live"
      ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
      : accent === "gold"
        ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
        : "border-white/10 bg-white/5 text-white/85";
  return (
    <div className={`pointer-events-auto rounded-lg border px-2 py-1.5 backdrop-blur ${tone}`}>
      <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider opacity-80">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 text-sm font-bold leading-tight">{value}</div>
    </div>
  );
}

export default Locality3DView;
