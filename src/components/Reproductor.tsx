type ReproductorProps = {
    audioUrl: string;
  };
  
  const Reproductor = ({ audioUrl }: ReproductorProps) => {
    return (
      <audio controls autoPlay>
        <source src={audioUrl} type="audio/webm" />
        Tu navegador no soporta el elemento de audio.
      </audio>
    );
  };
  
  export default Reproductor;
  