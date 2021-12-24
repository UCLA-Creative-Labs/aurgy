import React, {useEffect, useRef, useState} from 'react';
import Layout from '../components/Layout';
import PlaylistVisual from '../components/PlaylistVisual';
import Shape, {Polygon} from '../components/Shape';
import {animatePolygon, animateNamePlate} from '../utils/animations';

interface NamePlateProps {
  name: string;
  shape: Polygon;
  owner?: boolean;
  expanded?: boolean;
}

function NamePlate({name, shape, owner = false, expanded = false}: NamePlateProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [isFirstAnimation, setIsFirstAnimation] = useState(true);

  const containerRef = useRef(null);
  const polygonRef = useRef(null);
  const shortNameRef = useRef(null);
  const longNameRef = useRef(null);

  useEffect(() => {
    if (isFirstAnimation) {
      setIsFirstAnimation(false);
      return;
    }

    animatePolygon(
      containerRef.current,
      polygonRef.current,
      shape,
      isHovered,
    );
    animateNamePlate(
      shortNameRef.current,
      longNameRef.current,
      isHovered,
    );
  }, [isHovered]);


  return (
    <div className={`namePlate ${owner ? 'owner' : ''} ${expanded ? 'expanded' : ''}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="namePlate-container" ref={containerRef}>
        <Shape polygon={shape} ref={polygonRef} />
      </div>
      <div className="namePlate-short" ref={shortNameRef}>{name[0]}</div>
      <div className="namePlate-long" ref={longNameRef}>{name}</div>
    </div>
  );
}

function ShaderDemo(): JSX.Element {
  return (
    <Layout>
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <PlaylistVisual width={1000} height={600} />
        <div className="usersBar">
          <NamePlate shape="circle" name="BRYAN" owner={true} expanded={true} />
          <NamePlate shape="circle" name="BRYAN" owner={true} />
          <NamePlate shape="pentagon" name="ARJUN" />
          <NamePlate shape="hexagon" name="JACK" />
          <NamePlate shape="heptagon" name="LUL" />
          <NamePlate shape="octagon" name="FLARG" />
        </div>
      </div>
    </Layout>
  );
}

export default ShaderDemo;
