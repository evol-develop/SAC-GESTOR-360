import { useDropzone } from "react-dropzone";
import { useState, useCallback, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { UseFormReturn, UseFormSetValue } from "react-hook-form";
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter,} from "@/components/ui/dialog";
import FormInput from "./form-base";
import { Button } from "@/components/ui/button";
import { cropImageToFile } from "@/lib/utils/cropImageToFile";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt, FaFileImage } from 'react-icons/fa'; // Íconos para distintos tipos de archivo
import { on } from "events";

type CropImageProps = {
  form: UseFormReturn<any, any, undefined>;
  name: string;
  setValue: UseFormSetValue<any>;
  onImageCropped?: (croppedFile: string) => void;
  showPreview?: boolean ;
  handleFile?: (file: File) => void;
};

export const CropImage = ({ form, name, setValue,onImageCropped, showPreview= true, handleFile }: CropImageProps) => {
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    if (file.type.startsWith("image/")) {
      // Si es una imagen, carga para recortarla
      setImage(URL.createObjectURL(file));
      setDialogOpen(true);
    } else {
      // Si no es imagen, solo muestra el nombre del archivo o un ícono representativo
      setImage(null);
      handleFile && handleFile(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { '*': [] }, // Acepta cualquier tipo de archivo
    multiple: false,
  });

  const handleCropComplete = useCallback((crop: PixelCrop) => {
    setCompletedCrop(crop);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    if (!croppedImage) {
      setImage(null);
    }
  }, [croppedImage]);

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

  const renderFilePreview = () => {
    if (file) {
      if (file.type.startsWith("image/")) {
        // Si es una imagen, muestra la vista previa
        return croppedImage ? (
          showPreview && <img
          src={croppedImage}
          alt="Cropped"
          className="object-contain h-auto max-w-full rounded-md aspect-square"
        />
        ) : (
          <div className="flex items-center justify-center p-2 border rounded-md aspect-square border-muted">
            <p className="text-sm text-center text-muted-foreground">
              Vista previa de la imagen
            </p>
          </div>
        );
      } else {
        
        let icon;
        if (file.type === "application/pdf") {
          icon = <FaFilePdf size={48} />;
        } else if (file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          icon = <FaFileWord size={48} />;
        } else if (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          icon = <FaFileExcel size={48} />;
        } else {
          icon = <FaFileAlt size={48} />;
        }

        return (
          showPreview && <div className="flex items-center justify-center p-2 border rounded-md aspect-square border-muted">
            <div className="text-center text-muted-foreground">
              {icon}
              <p className="mt-2 text-sm">{file.name}</p>
            </div>
          </div>
        );
        
      }
    }
    return null;
  };

  return (
    <div>
      <div className="md:flex-row h-[161px] flex flex-col gap-2">
        <div
          {...getRootProps()}
          className="flex items-center justify-center w-full p-4 text-center border border-dashed rounded-md cursor-pointer border-muted md:w-3/4"
        >
          <input {...getInputProps()} />
          <p className="text-sm text-muted-foreground">
            Arrastra y suelta un archivo aquí o haz clic para seleccionar un archivo
          </p>
        </div>

        <div className="w-full mt-4 md:mt-0 md:w-1/4">
          {renderFilePreview()}
        </div>
      </div>

      <FormInput form={form} name={name} label="" type="hidden" />

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
                onComplete={(c) => handleCropComplete(c)}
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
            <Button type="button" onClick={handleDialogClose} variant="outline">
              Cancelar
            </Button>
            <Button type="button" onClick={handleCropConfirm}>
              Confirmar Recorte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
