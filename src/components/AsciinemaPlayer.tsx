import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    AsciinemaPlayer: any;
  }
}

interface AsciinemaPlayerProps {
  src: string;
  id?: string;
  theme?: string;
  autoPlay?: boolean;
  loop?: boolean;
  poster?: string;
  cols?: number;
  rows?: number;
}

const AsciinemaPlayer: React.FC<AsciinemaPlayerProps> = ({
  src,
  id,
  theme = "asciinema",
  autoPlay = false,
  loop = false,
  poster = "npt:0:0",
  cols,
  rows,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load the player script if not already loaded
    if (!window.AsciinemaPlayer) {
      const script = document.createElement("script");
      script.src = "/asciinema-player.min.js";
      script.onload = () => {
        if (window.AsciinemaPlayer && ref.current) {
          window.AsciinemaPlayer.create(src, ref.current, {
            theme,
            autoPlay,
            loop,
            poster,
            cols,
            rows,
          });
        }
      };
      document.body.appendChild(script);
    } else if (ref.current) {
      window.AsciinemaPlayer.create(src, ref.current, {
        theme,
        autoPlay,
        loop,
        poster,
        cols,
        rows,
      });
    }
    // Cleanup: remove player on unmount
    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [src, theme, autoPlay, loop, poster, cols, rows]);

  return (
    <div ref={ref} id={id} />   
  );
};

export default AsciinemaPlayer; 