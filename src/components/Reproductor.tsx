import React from "react";

type ReproductorProps = {
    audioUrl: string;
    style?: React.CSSProperties;
  };
  
  const Reproductor = ({ audioUrl, style }: ReproductorProps) => {
    return (
      <audio controls autoPlay style={style}>
        <source src={audioUrl} type="audio/webm"  />
        Tu navegador no soporta el elemento de audio.
      </audio>
    );
  };
  
  export default Reproductor;
  