import React, {useRef, useEffect, useCallback} from 'react';
import * as THREE from 'three';
import styles from '../styles/lobby.module.scss';
import {getElementSizeById, sampleShader} from '../utils';

interface PlaylistVisualProps {
  title: string;
  subtitle: string;
  fullSize?: boolean;
  animate?: boolean;
}

function PlaylistVisual({
  title,
  subtitle,
  fullSize = true,
  animate = true,
}: PlaylistVisualProps): JSX.Element {
  const parentRef = useRef(null);
  const animationFunctionRef = useRef(null);
  const animationFrameRef = useRef(null);

  const getVisualSize = useCallback(() => {
    if (fullSize) {
      return getElementSizeById(styles.visual, {
        width: parseInt(styles.defaultVisualWidth),
        height: parseInt(styles.defaultVisualHeight),
      });
    }
    return {
      width: parseInt(styles.visualCircleSize),
      height: parseInt(styles.visualCircleSize),
    };
  }, [fullSize]);

  useEffect(() => {
    const size = getVisualSize();
    const w = size?.width ?? window.innerWidth;
    const h = size?.height ?? window.innerHeight;

    const clock = new THREE.Clock();
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    parentRef.current.appendChild(renderer.domElement);

    const uniforms = {
      u_time: {
        value: 0.0,
      },
      u_resolution: {
        value: new THREE.Vector2(w, h),
      },
      u_mouse: {
        value: new THREE.Vector2(Math.random() * w, Math.random() * h),
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

    // requestAnimationFrame expects cb with timestamp as first parameter
    function animateCanvas(ts?: DOMHighResTimeStamp, play = true) {
      if (play) {
        animationFrameRef.current = requestAnimationFrame(animateCanvas);
      }
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }
    animationFunctionRef.current = animateCanvas;

    return () => {
      parentRef.current?.removeChild(renderer.domElement);
      window.removeEventListener('mousemove', handleMouseMove, false);
    };
  }, []);

  useEffect(() => {
    if (animationFunctionRef.current != null) {
      animationFunctionRef.current(null, animate);
    }
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [animate]);

  return (
    <div ref={parentRef} id={fullSize ? styles.visual : styles['visual-circle']}>
      <div id={styles.caption}>
        <h1>{title}</h1>
        <h4>{subtitle}</h4>
      </div>
    </div>
  );
}

export default PlaylistVisual;
