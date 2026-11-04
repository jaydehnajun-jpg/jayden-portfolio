// Dev-only sandbox (#/lab) for 3D ideas. Not part of the live site: it is only included in dev builds.
// Real WebGL (three.js) with studio lighting, glass and soft contact shadows, so the ideas read as
// finished objects rather than diagrams. Each scene pauses when off-screen.
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const BG = '#E9E6E0';
const INK = '#1A1A18';
const RED = 0xe3000f, GREEN = 0x00a86b, PURPLE = 0x4b2e83, DARKRED = 0x990000;
const BRAND = [RED, GREEN, PURPLE, DARKRED];

const CSS = `
.l3-page{max-width:1160px;margin:0 auto;padding:110px 40px 120px;font-family:'Open Sauce Sans',sans-serif;color:${INK}}
.l3-page h1{font-size:34px;font-weight:600;letter-spacing:-.03em;margin-bottom:8px}
.l3-lede{font-size:15px;color:rgba(26,26,24,.55);margin-bottom:48px;max-width:620px;line-height:1.6}
.l3-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px}
@media (max-width:860px){.l3-grid{grid-template-columns:1fr}}
.l3-card{background:#fff;border:1px solid rgba(26,26,24,.1);display:flex;flex-direction:column}
.l3-stage{height:380px;position:relative;overflow:hidden;background:${BG};cursor:grab;touch-action:none;user-select:none}
.l3-stage:active{cursor:grabbing}
.l3-stage canvas{display:block;width:100%;height:100%}
.l3-meta{padding:18px 20px 22px;display:flex;flex-direction:column;gap:8px}
.l3-tag{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:rgba(26,26,24,.45)}
.l3-title{font-size:18px;font-weight:600;letter-spacing:-.01em}
.l3-note{font-size:13px;line-height:1.6;color:rgba(26,26,24,.6)}
.l3-hint{position:absolute;left:12px;bottom:10px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.06em;color:rgba(26,26,24,.4);pointer-events:none}
`;

// ── shared stage: renderer, studio lighting, soft shadow, pointer + drag state, pause off-screen ──
function Stage({ build, hint }) {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

    // pointer (-1..1, y up), smoothed; drag turns the object and keeps a little momentum
    const st = { px: 0, py: 0, sx: 0, sy: 0, inside: false, down: false, yaw: 0.6, pitch: -0.2, vyaw: 0, idle: reduced ? 0 : 0.25 };
    const local = (e) => { const r = el.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)]; };
    let lx = 0, ly = 0;
    const onDown = (e) => { st.down = true; lx = e.clientX; ly = e.clientY; };
    const onUp = () => { st.down = false; };
    const onMove = (e) => {
      [st.px, st.py] = local(e); st.inside = true;
      if (st.down) {
        const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
        st.vyaw = dx * 0.012; st.yaw += dx * 0.012; st.pitch = Math.max(-0.9, Math.min(0.9, st.pitch + dy * 0.01));
      }
    };
    const onLeave = () => { st.inside = false; st.px = 0; st.py = 0; };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    const tick = build({ scene, camera, renderer, st });

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.set(0, 0, 9 * Math.max(1, 1.15 / camera.aspect));
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);

    const clock = new THREE.Clock();
    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible) return;
      st.sx += (st.px - st.sx) * Math.min(1, dt * 6);
      st.sy += (st.py - st.sy) * Math.min(1, dt * 6);
      if (!st.down) {
        st.yaw += (st.idle + st.vyaw * 4) * dt;
        st.vyaw *= 0.94;
        st.pitch += (-0.2 + st.sy * 0.3 - st.pitch) * Math.min(1, dt * 2);
      }
      tick(dt, clock.elapsedTime);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      el.removeEventListener('pointerdown', onDown); window.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave);
      scene.traverse((o) => { o.geometry?.dispose(); const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x) => { x.map?.dispose(); x.dispose(); }); });
      scene.environment?.dispose(); pmrem.dispose(); renderer.dispose();
      renderer.domElement.remove();
    };
  }, [build]);

  return <div className="l3-stage" ref={mount}><span className="l3-hint">{hint}</span></div>;
}

// soft contact shadow: a radial-gradient plane under the object
function addShadow(scene, y, size = 5, strength = 0.32) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, `rgba(30,24,16,${strength})`); grd.addColorStop(0.55, `rgba(30,24,16,${strength * 0.35})`); grd.addColorStop(1, 'rgba(30,24,16,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, toneMapped: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = y; m.renderOrder = -1;
  scene.add(m);
  return m;
}

const rbox = (w, h, d, r, seg = 6) => new RoundedBoxGeometry(w, h, d, seg, r);

// ── 1. Glass cube with pixels suspended inside ──
function buildGlass({ scene, st }) {
  const grp = new THREE.Group(); scene.add(grp);
  const glass = new THREE.Mesh(rbox(2.2, 2.2, 2.2, 0.28, 8), new THREE.MeshPhysicalMaterial({
    color: 0xffffff, transmission: 1, thickness: 1.6, roughness: 0.04, ior: 1.5,
    clearcoat: 1, clearcoatRoughness: 0.04, attenuationColor: new THREE.Color(0xdfe8ff), attenuationDistance: 5, envMapIntensity: 1.2,
  }));
  grp.add(glass);
  const inner = new THREE.Group(); grp.add(inner);
  const geo = rbox(0.4, 0.4, 0.4, 0.07, 3);
  const spots = [[-1, 1, -1, RED], [0, 1, 1, GREEN], [1, 0, -1, PURPLE], [-1, 0, 0, GREEN], [0, 0, 1, RED], [1, -1, 0, DARKRED], [-1, -1, 1, PURPLE], [0, -1, -1, RED]];
  spots.forEach(([x, y, z, c]) => {
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: c, roughness: 0.3, metalness: 0 }));
    m.position.set(x * 0.5, y * 0.5, z * 0.5); inner.add(m);
  });
  const shadow = addShadow(scene, -1.75);
  return (dt, t) => {
    grp.rotation.set(st.pitch, st.yaw, 0);
    grp.position.y = Math.sin(t * 0.9) * 0.06;
    inner.rotation.set(t * 0.2, -t * 0.3, 0);
    shadow.scale.setScalar(1 - Math.sin(t * 0.9) * 0.03);
  };
}

// ── 2. A cube assembled from pixels that part around the cursor ──
function buildPixels({ scene, camera, st }) {
  const N = 6, s = 0.3, gap = 0.36;
  const grp = new THREE.Group(); scene.add(grp);
  const items = [];
  const o = (N - 1) / 2;
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    if (x > 0 && x < N - 1 && y > 0 && y < N - 1 && z > 0 && z < N - 1) continue; // shell only
    items.push(new THREE.Vector3((x - o) * gap, (y - o) * gap, (z - o) * gap));
  }
  const mesh = new THREE.InstancedMesh(rbox(s, s, s, 0.06, 3), new THREE.MeshPhysicalMaterial({ roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2 }), items.length);
  const col = new THREE.Color();
  items.forEach((p, i) => {
    const h = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    col.set(h > 0.82 ? BRAND[Math.floor(h * 100) % BRAND.length] : '#F5F2EC');
    mesh.setColorAt(i, col);
  });
  grp.add(mesh);
  const off = items.map(() => new THREE.Vector3());
  const dummy = new THREE.Object3D(), ray = new THREE.Raycaster(), inv = new THREE.Matrix4(), v = new THREE.Vector3(), tgt = new THREE.Vector3();
  const shadow = addShadow(scene, -1.75);
  return (dt, t) => {
    grp.rotation.set(st.pitch, st.yaw, 0);
    grp.updateMatrixWorld();
    ray.setFromCamera(new THREE.Vector2(st.px, st.py), camera);
    inv.copy(grp.matrixWorld).invert();
    const ro = ray.ray.origin.clone().applyMatrix4(inv);
    const rd = ray.ray.direction.clone().transformDirection(inv);
    items.forEach((p, i) => {
      // distance from this pixel to the cursor ray (in the cube's own space)
      v.copy(p).sub(ro); const along = v.dot(rd); const d2 = v.lengthSq() - along * along;
      const hit = st.inside && !st.down ? Math.exp(-d2 / 0.35) : 0;
      const breathe = 0.035 * (Math.sin(t * 1.4 + p.length() * 2.2) + 1);
      tgt.copy(p).normalize().multiplyScalar(hit * 1.0 + breathe);
      off[i].lerp(tgt, Math.min(1, dt * 7));
      dummy.position.copy(p).add(off[i]);
      dummy.rotation.set(off[i].y * 1.4, off[i].x * 1.4, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
}

// ── 3. Stack of frosted glass panes that fan open ──
function buildStack({ scene, st }) {
  const grp = new THREE.Group(); scene.add(grp);
  const tints = [PURPLE, GREEN, DARKRED, RED, 0xf3f1ec];
  const panes = tints.map((c, i) => {
    const pane = new THREE.Group();
    const glass = new THREE.Mesh(rbox(2.7, 1.8, 0.06, 0.1, 6), new THREE.MeshPhysicalMaterial({
      color: c, transparent: true, opacity: i === 4 ? 0.55 : 0.5, roughness: 0.12, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05,
      envMapIntensity: 1.6, depthWrite: false,
    }));
    pane.add(glass);
    [[-0.55, 0.55, 1.1, 0.12], [-0.8, 0.3, 0.6, 0.08]].forEach(([x, y, w, h]) => {
      const b = new THREE.Mesh(rbox(w, h, 0.03, 0.03, 3), new THREE.MeshStandardMaterial({ color: i === 4 ? INK : 0xffffff, roughness: 0.5, transparent: true, opacity: i === 4 ? 0.85 : 0.9 }));
      b.position.set(x, y, 0.06); pane.add(b);
    });
    grp.add(pane);
    return pane;
  });
  const shadow = addShadow(scene, -1.6, 6, 0.2);
  let open = 0.5;
  return (dt, t) => {
    open += ((st.inside ? 1 : 0.5) - open) * Math.min(1, dt * 3);
    grp.rotation.set(-0.12 + st.sy * 0.12, -0.45 + st.sx * 0.4 + Math.sin(t * 0.5) * 0.06, 0);
    panes.forEach((p, i) => {
      const k = i - 2;
      p.position.set(k * (0.12 + open * 0.2), -k * 0.06 + Math.sin(t * 0.8 + i) * 0.03, k * (0.32 + open * 0.18));
      p.rotation.z = k * 0.025 * (1 + open * 1.5);
    });
    shadow.position.x = -0.2;
  };
}

// ── 4. Pearl cube with pixel satellites ──
function buildPearl({ scene, st }) {
  const grp = new THREE.Group(); scene.add(grp);
  const cube = new THREE.Mesh(rbox(2.1, 2.1, 2.1, 0.34, 10), new THREE.MeshPhysicalMaterial({
    color: 0xf1eee9, metalness: 0.15, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.06,
    iridescence: 1, iridescenceIOR: 1.45, iridescenceThicknessRange: [250, 750], envMapIntensity: 1.3,
  }));
  grp.add(cube);
  const sat = new THREE.Group(); scene.add(sat);
  const sgeo = rbox(0.22, 0.22, 0.22, 0.05, 3);
  const sats = BRAND.concat([0xf6e04d, 0xffffff]).map((c, i) => {
    const m = new THREE.Mesh(sgeo, new THREE.MeshStandardMaterial({ color: c, roughness: 0.3 }));
    m.userData = { a: (i / 6) * Math.PI * 2, r: 2.2 + (i % 2) * 0.35, y: (i % 3 - 1) * 0.6, sp: 0.35 + i * 0.04 };
    sat.add(m); return m;
  });
  const shadow = addShadow(scene, -1.75);
  const l1 = new THREE.PointLight(RED, 18, 12); l1.position.set(-4, 1, 3); scene.add(l1);
  const l2 = new THREE.PointLight(PURPLE, 18, 12); l2.position.set(4, -1, 2); scene.add(l2);
  return (dt, t) => {
    grp.rotation.set(st.pitch, st.yaw, 0);
    grp.position.y = Math.sin(t * 0.9) * 0.08;
    sats.forEach((m) => {
      const u = m.userData, a = u.a + t * u.sp;
      m.position.set(Math.cos(a) * u.r, u.y + Math.sin(t + u.a) * 0.15, Math.sin(a) * u.r);
      m.rotation.set(t * 0.7, t * 0.5, 0);
    });
    shadow.scale.setScalar(1 - Math.sin(t * 0.9) * 0.04);
  };
}

const IDEAS = [
  { tag: 'Idea 1', title: 'Glass cube', hint: 'drag to turn', build: buildGlass, note: 'A clear, refracting cube with a few brand-colored pixels floating inside. Quiet and premium, like an Apple product render. Sits well beside the intro.' },
  { tag: 'Idea 2', title: 'Pixels that part', hint: 'move your cursor over it', build: buildPixels, note: 'A cube made of 200 tiny pixels. They part around your cursor and settle back, so the cube feels alive. The most literal pixel to cube idea.' },
  { tag: 'Idea 3', title: 'Glass panes', hint: 'hover to fan open', build: buildStack, note: 'A stack of frosted glass panes with placeholder UI on them, in the style of visionOS. It says "interface designer" without a word, and it fans open on hover.' },
  { tag: 'Idea 4', title: 'Pearl cube', hint: 'drag to turn', build: buildPearl, note: 'A soft, iridescent cube with small pixel cubes orbiting it. The most playful of the four while still feeling like a product shot.' },
];

export default function Lab3D() {
  return (
    <div className="l3-page">
      <style>{CSS}</style>
      <h1>3D ideas, round two</h1>
      <p className="l3-lede">Real lighting, glass and soft shadows this time. Drag or hover each one. Still rough: sizes, colors and motion would all be tuned for the real site. This page only exists in your local preview.</p>
      <div className="l3-grid">
        {IDEAS.map((d) => (
          <div className="l3-card" key={d.title}>
            <Stage build={d.build} hint={d.hint} />
            <div className="l3-meta"><span className="l3-tag">{d.tag}</span><span className="l3-title">{d.title}</span><p className="l3-note">{d.note}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
