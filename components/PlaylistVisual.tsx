import React, {useRef, useEffect} from 'react';
import * as THREE from 'three';
import styles from '../styles/lobby.module.scss';
import {getElementSizeById, sampleShader} from '../utils';

interface PlaylistVisualProps {
  title: string;
  subtitle: string;
}

function PlaylistVisual({
  title,
  subtitle,
}: PlaylistVisualProps): JSX.Element {
  const ref = useRef(null);

  const getVisualSize = () => {
    return getElementSizeById(styles.visual, {
      width: parseInt(styles.defaultVisualWidth),
      height: parseInt(styles.defaultVisualHeight),
    });
  };

  useEffect(() => {
    const size = getVisualSize();
    const w = size?.width ?? window.innerWidth;
    const h = size?.height ?? window.innerHeight;

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

    function handleResize() {
      const {width: newW, height: newH} = getVisualSize();
      renderer.setSize(newW, newH);
    }
    window.addEventListener('resize', handleResize, false);

    function animate() {
      requestAnimationFrame(animate);
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      ref.current?.removeChild(renderer.domElement);
      window.removeEventListener('mousemove', handleMouseMove, false);
    };
  }, []);

  return (
    <div ref={ref} id={styles.visual}>
      <div id={styles.caption}>
        <h1>{title}</h1>
        <h4>{subtitle}</h4>
      </div>
    </div>
  );
}

export default PlaylistVisual;
