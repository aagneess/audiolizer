import React, { useRef, useState, createContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide } from 'three';
import Figures from '../Figures';
import Spheres from '../Spheres';

const makeFigures = (num) => {
  const figures = [];
  for (let i = 0; i < num; i++) {
    figures.push(<Figures key={figures.length} index={figures.length} />);
  }
  return figures;
};

const makeSpheres = (num) => {
  const spheres = [];
  for (let i = 10; i < num; i++) {
    spheres.push(<Spheres key={spheres.length} index={spheres.length} />);
  }
  return spheres;
};

export const soundContext = createContext();

const Background = ({ num, analyser, player, play, ...rest }) => {
  const mesh = useRef();
  const [soundArray, setSoundArray] = useState(() => Array(num).fill(0));

  useFrame(() => {
    if (!analyser) return;
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);
    setSoundArray(frequencyData);
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]} rotation={[0, 0, 0]} {...rest}>
      {/* args={[size of background]} */}
      <sphereBufferGeometry attach="geometry" args={[100]} />
      <meshBasicMaterial
        attach="material"
        //Changes the background
        // + 100=hue 100%=background saturation 50%=lightness
        color={`hsl(0, 0%, 10%)`}
        side={BackSide}
      />

      <soundContext.Provider value={soundArray}>
        {makeFigures(num)}
        {makeSpheres(num)}
      </soundContext.Provider>
    </mesh>
  );
};

export default Background;