import React, {useRef, useEffect} from 'react';
import * as THREE from 'three';
import styles from '../styles/lobby.module.scss';
import {Dimensions, sampleShader} from '../utils';

interface PlaylistVisualProps {
  title: string;
  subtitle: string;
  size: Dimensions;
  getResizeSize?: () => Dimensions;
}

function PlaylistVisual({
  title,
  subtitle,
  size,
  getResizeSize,
}: PlaylistVisualProps): JSX.Element {
  const ref = useRef(null);

  useEffect(() => {
    const w = size != null ? size.width : window.innerWidth;
    const h = size != null ? size.height : window.innerHeight;

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
      if (getResizeSize != null) {
        const {width: newW, height: newH} = getResizeSize();
        renderer.setSize(newW, newH);
      }
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
