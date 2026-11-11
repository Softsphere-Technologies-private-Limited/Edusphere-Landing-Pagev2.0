import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('input') ||
        target?.closest('select') ||
        target?.closest('.interactive-hover')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Smooth lerp for ring follower
  useEffect(() => {
    if (!isVisible) return;
    let animId: number;

    const lerp = () => {
      setFollowerPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      animId = requestAnimationFrame(lerp);
    };

    animId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animId);
  }, [pos, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Small Central Dot */}
      <div
        className={`fixed top-0 left-0 w-2.5 h-2.5 bg-emerald-400 rounded-full transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 ${
          isMouseDown ? 'scale-75' : isHovered ? 'scale-150 bg-teal-300' : ''
        }`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
        }}
      />

      {/* Smooth Glass/Ring Follower */}
      <div
        className={`fixed top-0 left-0 border rounded-full transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2 ${
          isHovered
            ? 'w-14 h-14 border-emerald-400 bg-emerald-500/10 backdrop-blur-[2px]'
            : 'w-8 h-8 border-teal-400/40 bg-transparent'
        }`}
        style={{
          transform: `translate3d(${followerPos.x}px, ${followerPos.y}px, 0) translate(-50%, -50%)`,
        }}
      />
    </div>
  );
};
