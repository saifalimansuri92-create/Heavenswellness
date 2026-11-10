import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface TruffleSceneProps {
  finish: 'dark' | 'milk' | 'gold';
  isAutoRotate: boolean;
}

export const TruffleScene: React.FC<TruffleSceneProps> = ({ finish, isAutoRotate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const truffleGroupRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number>(0);

  // Procedural Texture Generator
  const createChocolateTexture = (type: 'dark' | 'milk' | 'gold') => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base color
    const colors = {
      dark: '#1a0d00',
      milk: '#4d2600',
      gold: '#ffd700'
    };
    ctx.fillStyle = colors[type];
    ctx.fillRect(0, 0, 512, 512);

    // Noise/Texture
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const alpha = Math.random() * 0.05;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(x, y, 1, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // --- SETUP ---
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, 0.15);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: !isSoftwareGl, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controlsRef.current = controls;

    // --- LIGHTING ---
    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // --- TRUFFLE MODEL (Procedural Composite) ---
    const truffleGroup = new THREE.Group();
    scene.add(truffleGroup);
    truffleGroupRef.current = truffleGroup;

    // 1. Inner Core (The center of the truffle)
    const innerGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const innerMat = new THREE.MeshPhysicalMaterial({ color: 0x331a00, roughness: 0.8 });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    truffleGroup.add(inner);

    // 2. Outer Shell (The main body)
    const shellGeo = new THREE.SphereGeometry(0.8, 64, 64);
    const pos = shellGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const noise = Math.sin(x * 6) * Math.cos(y * 6) * Math.sin(z * 6) * 0.06;
      pos.setXYZ(i, x + noise, y + noise, z + noise);
    }
    shellGeo.computeVertexNormals();
    
    const chocolateMat = new THREE.MeshPhysicalMaterial({
      roughness: 0.35,
      metalness: 0.1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      map: createChocolateTexture(finish)
    });

    const shell = new THREE.Mesh(shellGeo, chocolateMat);
    shell.castShadow = true;
    shell.receiveShadow = true;
    truffleGroup.add(shell);

    // 3. Gold Foil (The decorative wrap)
    const foilMat = new THREE.MeshPhysicalMaterial({
      color: 0xD4AF37,
      metalness: 0.95,
      roughness: 0.15,
      clearcoat: 1.0,
      anisotropy: 0.8
    });

    const foilGeo = new THREE.CylinderGeometry(1.2, 0.9, 0.4, 32, 1, true);
    const foil = new THREE.Mesh(foilGeo, foilMat);
    foil.position.y = -0.6;
    foil.rotation.x = Math.PI * 0.1;
    truffleGroup.add(foil);

    // 4. Logo Seal (Small disc on top)
    const sealGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
    const sealMat = new THREE.MeshPhysicalMaterial({ color: 0xD4AF37, metalness: 1, roughness: 0.1 });
    const seal = new THREE.Mesh(sealGeo, sealMat);
    seal.position.set(0, 0.82, 0);
    seal.rotation.x = Math.PI * 0.05;
    truffleGroup.add(seal);

    // 5. Artisanal Accent (A small "berry" or "nut" piece)
    const berryGeo = new THREE.IcosahedronGeometry(0.1, 2);
    const berryMat = new THREE.MeshPhysicalMaterial({ color: 0x800000, roughness: 0.4, clearcoat: 1 });
    const berry = new THREE.Mesh(berryGeo, berryMat);
    berry.position.set(0.3, 0.75, 0.2);
    truffleGroup.add(berry);

    // 6. Drizzle (Signature swirl)
    const drizzlePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.8, 0.5, 0),
      new THREE.Vector3(-0.4, 0.8, 0.4),
      new THREE.Vector3(0, 0.7, 0.8),
      new THREE.Vector3(0.4, 0.9, 0.4),
      new THREE.Vector3(0.8, 0.6, 0),
    ]);
    const drizzleGeo = new THREE.TubeGeometry(drizzlePath, 64, 0.03, 8, false);
    const drizzleMat = new THREE.MeshPhysicalMaterial({
      color: finish === 'dark' ? 0xffffff : 0x221100,
      roughness: 0.2,
      metalness: 0,
      clearcoat: 1.0
    });
    const drizzle = new THREE.Mesh(drizzleGeo, drizzleMat);
    truffleGroup.add(drizzle);

    // 7. Gold Sprinkles (Small edible flakes)
    const sprinkleGeo = new THREE.BoxGeometry(0.04, 0.01, 0.04);
    const sprinkleMat = new THREE.MeshPhysicalMaterial({ color: 0xD4AF37, metalness: 1, roughness: 0.1 });
    for (let i = 0; i < 12; i++) {
      const sprinkle = new THREE.Mesh(sprinkleGeo, sprinkleMat);
      const angle = Math.random() * Math.PI * 2;
      const r = 0.75 + Math.random() * 0.05;
      sprinkle.position.set(
        Math.cos(angle) * r,
        0.5 + Math.random() * 0.3,
        Math.sin(angle) * r
      );
      sprinkle.rotation.set(Math.random(), Math.random(), Math.random());
      truffleGroup.add(sprinkle);
    }

    // Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(3, 3);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0,0,0,0.6)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(shadowCanvas),
      transparent: true,
      depthWrite: false
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.81;
    scene.add(shadow);

    // --- ANIMATION ---
    const clock = new THREE.Clock();
    const tick = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (truffleGroupRef.current) {
        if (isAutoRotate) {
          truffleGroupRef.current.rotation.y += delta * 0.2;
        }
        truffleGroupRef.current.position.y = Math.sin(elapsed) * 0.05;
      }

      controls.update();
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(tick);
    };

    if (isSoftwareGl) {
      // Pace for software GL
      const softTick = () => {
        const delta = clock.getDelta();
        if (truffleGroupRef.current && isAutoRotate) truffleGroupRef.current.rotation.y += delta * 0.2;
        renderer.render(scene, camera);
        frameIdRef.current = window.setTimeout(softTick, 80);
      };
      softTick();
    } else {
      tick();
    }

    // --- RESIZE ---
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      window.clearTimeout(frameIdRef.current);
      renderer.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      shellGeo.dispose();
      chocolateMat.dispose();
      foilGeo.dispose();
      foilMat.dispose();
      sealGeo.dispose();
      sealMat.dispose();
      berryGeo.dispose();
      berryMat.dispose();
      drizzleGeo.dispose();
      drizzleMat.dispose();
      sprinkleGeo.dispose();
      sprinkleMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
    };
  }, []);

  // Update material on finish change
  useEffect(() => {
    if (!truffleGroupRef.current) return;
    const shell = truffleGroupRef.current.children[1] as THREE.Mesh;
    if (shell && shell.material instanceof THREE.MeshPhysicalMaterial) {
      shell.material.map = createChocolateTexture(finish);
      shell.material.needsUpdate = true;
    }
  }, [finish]);

  return <div ref={containerRef} className="w-full h-full" />;
};
