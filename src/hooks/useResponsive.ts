import { useEffect, useState } from 'react';

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handler = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const cameraConfig = isMobile
    ? { fov: 55, basePos: [0, 4.0, 10] as [number,number,number] }
    : { fov: 42, basePos: [0, 4.6, 12] as [number,number,number] };

  return { isMobile, isTablet, width, height, cameraConfig };
}
