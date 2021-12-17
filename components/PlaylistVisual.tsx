import React, {useRef, useEffect} from 'react';
import * as THREE from 'three';
import {sampleShader} from '../utils';

interface PlaylistVisualProps {
  width?: number;
  height?: number;
}

function PlaylistVisual({width, height}: PlaylistVisualProps): JSX.Element {
  const ref = useRef(null);

  useEffect(() => {
    const w = width ?? window.innerWidth;
    const h = height ?? window.innerHeight;

    const clock = new THREE.Clock();
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    ref.current.appendChild(renderer.domElement);

    const uniforms = {
      u_time: {
        value: 0.0,
      },
      u_resolution: {
        value: new THREE.Vector2(w, h),
      },
      u_mouse: {
        value: new THREE.Vector2(w, h),
      },
    };

    const geometry = new THREE.PlaneBufferGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: sampleShader.vertex,
      fragmentShader: sampleShader.fragment,
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    function handleMouseMove(evt: MouseEvent) {
      uniforms.u_mouse.value.set(evt.pageX, w - evt.pageY);
    }
    window.addEventListener('mousemove', handleMouseMove, false);

    function animate() {
      requestAnimationFrame(animate);
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      ref.current.removeChild(renderer.domElement);
      window.removeEventListener('mousemove', handleMouseMove, false);
    };
  }, []);

  return (
    <div ref={ref} />
  );
}

export default PlaylistVisual;
