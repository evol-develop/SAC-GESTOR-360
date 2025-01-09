import { useDropzone } from "react-dropzone";
import { useState, useCallback, useRef } from "react";
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

type CropImageProps = {
  form: UseFormReturn<any, any, undefined>;
  name: string;
  setValue: UseFormSetValue<any>;
};

export const CropImage = ({ form, name, setValue }: CropImageProps) => {
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
    setImage(URL.createObjectURL(file));
    setDialogOpen(true);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
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
      setCroppedImage(URL.createObjectURL(croppedFile));
      setValue(name, croppedFile);
    }
    setDialogOpen(false);
  }, [completedCrop, image, name, setValue]);

  return (
    <div>
      <div className="md:flex-row h-[161px] flex flex-col gap-2">
        <div
          {...getRootProps()}
          className="border-muted md:w-3/4 flex items-center justify-center w-full p-4 text-center border border-dashed rounded-md cursor-pointer"
        >
          <input {...getInputProps()} />
          <p className="text-muted-foreground text-sm">
            Arrastra y suelta una imagen aquí o haz clic para seleccionar una
            imagen
          </p>
        </div>

        <div className="md:mt-0 md:w-1/4 w-full mt-4">
          {croppedImage ? (
            <img
              src={croppedImage}
              alt="Cropped"
              className="aspect-square object-contain h-auto max-w-full rounded-md"
            />
          ) : (
            <div className="aspect-square border-muted flex items-center justify-center p-2 border rounded-md">
              <p className="text-muted-foreground text-sm text-center">
                Vista previa de la imagen
              </p>
            </div>
          )}
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
