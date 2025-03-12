import React from "react";

type ReproductorProps = {
    audioUrl: string;
    style?: React.CSSProperties;
    autoPlay?: boolean;
  };
  
  const Reproductor = ({ audioUrl, style,autoPlay=true  }: ReproductorProps) => {
    return (
      <audio controls autoPlay={autoPlay} style={style}>
        <source src={audioUrl} type="audio/webm"  />
        Tu navegador no soporta el elemento de audio.
      </audio>
    );
  };
  
  export default Reproductor;
  