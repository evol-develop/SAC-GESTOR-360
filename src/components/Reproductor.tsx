type ReproductorProps = {
    audioUrl: string;
    className?: string;
  };
  
  const Reproductor = ({ audioUrl, className }: ReproductorProps) => {
    return (
      <audio controls autoPlay>
        <source src={audioUrl} type="audio/webm" className={className} />
        Tu navegador no soporta el elemento de audio.
      </audio>
    );
  };
  
  export default Reproductor;
  