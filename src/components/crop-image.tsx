import { useDropzone } from "react-dropzone";
import { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { UseFormReturn, UseFormSetValue } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import FormInput from "./form-base";
import { Button } from "@/components/ui/button";
import { cropImageToFile } from "@/lib/utils/cropImageToFile";
import { FaCheckCircle } from "react-icons/fa";
import { FaFileImage } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { FaFileWord } from "react-icons/fa";


type CropImageProps = {
  form: UseFormReturn<any, any, undefined>;
  name: string;
  setValue: UseFormSetValue<any>;
  onImageCropped?: (croppedFile: string) => void;
  showPreview?: boolean;
  handleFile?: (file: File) => void;
  height?: string;
  width?: string;
  isDraggingFile?: boolean;

  
};
export const CropImage = ({
  form,
  name,
  setValue,
  onImageCropped,
  showPreview = true,
  handleFile,  // Asegúrate de que esto esté pasando desde el componente padre
  height = "161px",
  width = "100%",
  isDraggingFile = false,

}: CropImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.kind === "file") {
          const pastedFile = item.getAsFile();
          if (pastedFile) {
            setFile(pastedFile);

            if (pastedFile.type.startsWith("image/")) {
              setImage(URL.createObjectURL(pastedFile));
              setDialogOpen(true);
            } else {
              handleFile && handleFile(pastedFile);
            }
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    if (file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
      setDialogOpen(true); // Abre el diálogo de recorte si es una imagen
    } else {
      handleFile && handleFile(file); // Ejecuta handleFile si no es una imagen
    }
  }, [handleFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "*/*": [],
    },
    multiple: false, // Solo un archivo a la vez
  });

  const renderFilePreview = () => {
    if (file) {
      if (file.type.startsWith("image/")) {
        return croppedImage ? (
          <div className="relative">
            <img
              src={croppedImage}
              alt="Cropped"
              className="object-contain max-w-full h-auto rounded-md aspect-square"
            />
          </div>
        ) : (
          showPreview && (
            <div className="flex justify-center items-center p-2 rounded-md border aspect-square border-muted">
              <p className="text-sm text-center text-muted-foreground">
                Vista previa de la imagen
              </p>
            </div>
          )
        );
      } else {
        return showPreview && (
          <div className="flex justify-center items-center p-2 rounded-md border aspect-square border-muted">
            <div className="text-center text-muted-foreground">
              <p className="mt-2 text-sm">{file.name}</p>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  const handleCropConfirm = useCallback(async () => {
    if (completedCrop && imgRef.current && image) {
      const croppedFile = await cropImageToFile(
        imgRef.current,
        completedCrop,
        "image.jpg"
      );

      onImageCropped && onImageCropped(URL.createObjectURL(croppedFile));
      setCroppedImage(URL.createObjectURL(croppedFile));
      setValue(name, croppedFile);
    }
    setDialogOpen(false);
  }, [completedCrop, image, name, setValue]);

    const handleNoCropConfirm = () => {
    // Si no hay recorte, simplemente se pasa la imagen como está
    if (image) {
      onImageCropped && onImageCropped(image);
      setValue(name, image);
    }
    setDialogOpen(false);
  };
  return (
    < >
      <div ref={containerRef} className={`flex flex-col gap-2 md:flex-row`}
       style={{ height, width }}>
        <div
          {...getRootProps()}
          className={`flex justify-center items-center p-4 w-full text-center rounded-md border cursor-pointer md:w-3/4 border-muted}
          transition-all duration-300  ${isDraggingFile ? 'z-20 bg-white border-2 border-blue-500 shadow-lg' : ''}`}
        >
          <input {...getInputProps()} />
          <p className={`text-sm text-muted-foreground`}>
            Arrastra y suelta un archivo aquí, haz clic para seleccionar un archivo o usa Ctrl + V para pegar desde el portapapeles.
          </p>
        </div>
        {showPreview && (
          <div className="mt-4 w-full md:mt-0 md:w-1/4">
            {renderFilePreview()}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[800px] w-[90vw]">
          <DialogHeader>
            <DialogTitle>Recortar Imagen</DialogTitle>
          </DialogHeader>
          {image && (
            <div className="mx-auto mt-4">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
              >
                <img
                  ref={imgRef}
                  src={image}
                  alt="Upload"
                  style={{ maxWidth: "100%", maxHeight: "60vh" }}
                />
              </ReactCrop>
            </div>
          )}
          <DialogFooter>
            <Button type="button" onClick={() => setDialogOpen(false)} variant="outline">
              Cancelar
            </Button>
            <Button type="button" onClick={handleCropConfirm}>
              Confirmar Recorte
            </Button>
            <Button type="button" onClick={handleNoCropConfirm}>
              Sin Recorte
                  </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// export const CropImage = ({
//   form,
//   name,
//   setValue,
//   onImageCropped,
//   showPreview = true,
//   handleFile,
//   height = "161px",
//   width = "100%",
// }: CropImageProps) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [file, setFile] = useState<File | null>(null);
//   const [image, setImage] = useState<string | null>(null);
//   const [crop, setCrop] = useState<Crop>({
//     unit: "%",
//     x: 25,
//     y: 25,
//     width: 50,
//     height: 50,
//   });
//   const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
//   const [croppedImage, setCroppedImage] = useState<string | null>(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [shouldCrop, setShouldCrop] = useState(false);  // Nuevo estado para decidir si hay recorte
//   const imgRef = useRef<HTMLImageElement | null>(null);

//   useEffect(() => {
//     const handlePaste = async (event: ClipboardEvent) => {
//       const items = event.clipboardData?.items;
//       if (!items) return;

//       for (const item of items) {
//         if (item.kind === "file") {
//           const pastedFile = item.getAsFile();
//           if (pastedFile) {
//             setFile(pastedFile);

//             if (pastedFile.type.startsWith("image/")) {
//               setImage(URL.createObjectURL(pastedFile));
//               setDialogOpen(true);
//             } else {
//               handleFile && handleFile(pastedFile);
//             }
//           }
//         }
//       }
//     };

//     document.addEventListener("paste", handlePaste);
//     return () => document.removeEventListener("paste", handlePaste);
//   }, []);

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     const file = acceptedFiles[0];
//     setFile(file);
//     if (file.type.startsWith("image/")) {
//       setImage(URL.createObjectURL(file));
//       setDialogOpen(true);
//     } else {
//       handleFile && handleFile(file);
//     }
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       "*/*": [],
//     },
//     multiple: false,
//   });

//   const handleCropComplete = useCallback((crop: PixelCrop) => {
//     setCompletedCrop(crop);
//   }, []);

//   const handleDialogClose = useCallback(() => {
//     setDialogOpen(false);
//     if (!croppedImage) {
//       setImage(null);
//     }
//   }, [croppedImage]);

//   const handleCropConfirm = useCallback(async () => {
//     if (completedCrop && imgRef.current && image) {
//       const croppedFile = await cropImageToFile(
//         imgRef.current,
//         completedCrop,
//         "image.jpg"
//       );

//       onImageCropped && onImageCropped(URL.createObjectURL(croppedFile));
//       setCroppedImage(URL.createObjectURL(croppedFile));
//       setValue(name, croppedFile);
//     }
//     setDialogOpen(false);
//   }, [completedCrop, image, name, setValue]);

//   const handleNoCropConfirm = () => {
//     // Si no hay recorte, simplemente se pasa la imagen como está
//     if (image) {
//       onImageCropped && onImageCropped(image);
//       setValue(name, image);
//     }
//     setDialogOpen(false);
//   };

//   const renderFilePreview = () => {
//     if (file) {
//       if (file.type.startsWith("image/")) {
//         return croppedImage ? (
         
//             <div className="relative">
//               <img
//                 src={croppedImage}
//                 alt="Cropped"
//                 className="object-contain max-w-full h-auto rounded-md aspect-square"
//               />
//               <div className="absolute top-0 right-0 p-2 text-green-500">
//                 <FaCheckCircle size={24} />
//               </div>
//             </div>
          
//         ) : (
//           showPreview && (
//           <div className="flex justify-center items-center p-2 rounded-md border aspect-square border-muted">
//             <p className="text-sm text-center text-muted-foreground">
//               Vista previa de la imagen
//             </p>
//           </div>
//           )
//         );
//       } else {
//         let icon;
//         if (file.type === "application/pdf") {
//           icon = <FaFilePdf size={48} />;
//         } else {
//           icon = <FaFileImage size={48} />;
//         }

//         return (
//           showPreview && (
//             <div className="flex justify-center items-center p-2 rounded-md border aspect-square border-muted">
//               <div className="text-center text-muted-foreground">
//                 {icon}
//                 <p className="mt-2 text-sm">{file.name}</p>
//               </div>
//             </div>
//           )
//         );
//       }
//     }
//     return null;
//   };

//   return (
//     <div ref={containerRef}>
//       <div className="flex flex-col gap-2 md:flex-row" style={{ height, width }}>
//         <div
//           {...getRootProps()}
//           className={`flex justify-center items-center p-4 w-full text-center rounded-md border cursor-pointer md:w-3/4 ${
//             isDragActive ? "border-blue-500" : "border-muted"
//           }`}
//         >
//           <input {...getInputProps()} />
//           <p className="text-sm text-muted-foreground">
//             Arrastra y suelta un archivo aquí, haz clic para seleccionar un
//             archivo o usa Ctrl + V para pegar desde el portapapeles.
//           </p>
//         </div>

//         <div className="mt-4 w-full md:mt-0 md:w-1/4">{renderFilePreview()}</div>
//       </div>

//       <FormInput form={form} name={name} label="" type="hidden" />

//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent className="max-w-[800px] w-[90vw]">
//           <DialogHeader>
//             <DialogTitle>Recortar Imagen</DialogTitle>
//           </DialogHeader>
//           {image && (
//             <div className="mx-auto mt-4">
//               <ReactCrop
//                 crop={crop}
//                 onChange={(_, percentCrop) => setCrop(percentCrop)}
//                 onComplete={(c) => handleCropComplete(c)}
//                 aspect={1}
//               >
//                 <img
//                   ref={imgRef}
//                   src={image}
//                   alt="Upload"
//                   style={{ maxWidth: "100%", maxHeight: "60vh" }}
//                 />
//               </ReactCrop>
//             </div>
//           )}
//           <DialogFooter>
//             <Button type="button" onClick={handleDialogClose} variant="outline">
//               Cancelar
//             </Button>
//             <Button type="button" onClick={handleCropConfirm}>
//               Confirmar Recorte
//             </Button>
//             <Button type="button" onClick={handleNoCropConfirm}>
//               Sin Recorte
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

