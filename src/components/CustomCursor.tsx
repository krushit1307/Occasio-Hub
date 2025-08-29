import { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsPointer(
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.getAttribute('role') === 'button' ||
        target.closest('button') !== null ||
        target.closest('a') !== null
      );
    };

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseover', updateCursor);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseover', updateCursor);
    };
  }, []);

  return (
    <div
      className="cursor-glow"
      style={{
        left: `${position.x - 10}px`,
        top: `${position.y - 10}px`,
        transform: isPointer ? 'scale(1.5)' : 'scale(1)',
      }}
    />
  );
};