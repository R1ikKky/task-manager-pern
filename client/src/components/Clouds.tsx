const cloudShapes = [
  "M20 40h24a12 12 0 100-24 16 16 0 10-32 0 12 12 0 108 24z",
  "M18 35c2-10 14-15 20-10s10-4 16 4 0 16-10 16H20a10 10 0 01-2-10z",
  "M22 38c0-8 10-13 16-9s10-7 18 2 2 16-8 16H26c-4 0-6-3-4-9z",
  "M16 36c2-12 16-14 20-8s12-5 18 6 0 18-10 18H20a10 10 0 01-4-16z",
  "M24 42c-6-12 14-18 18-10s12-6 16 4 2 16-10 16H28a8 8 0 01-4-10z",
  "M20 34c0-8 10-14 18-10s10-6 14 6-2 16-12 16H26a6 6 0 01-6-12z"
];

const Clouds = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {[...Array(40)].map((_, i) => {
        const size = Math.floor(Math.random() * 150) + 300;
        const top = Math.floor(Math.random() * 100);
        const duration = Math.floor(Math.random() * 60) + 60;
        const delay = Math.floor(Math.random() * 50);
        const blur = Math.random() > 0.5 ? 'blur(2px)' : 'blur(4px)';
        const opacity = Math.random() * 0.4 + 0.6;
        const shape = cloudShapes[Math.floor(Math.random() * cloudShapes.length)];
        const directionLeft = i % 2 === 0;

        return (
          <svg
            key={i}
            className={`absolute ${directionLeft ? 'animate-cloud-left' : 'animate-cloud'}`}
            style={{
              top: `${top}%`,
              left: directionLeft ? '-400px' : '100%',
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              fill: '#ffffff',
              opacity,
              filter: blur,
            }}
            viewBox="0 0 64 64"
          >
            <path d={shape} />
          </svg>
        );
      })}
    </div>
  );
};

export default Clouds;
