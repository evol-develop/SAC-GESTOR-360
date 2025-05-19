import { ref, uploadBytesResumable, getDownloadURL,deleteObject } from "firebase/storage";
import { firebaseStorage } from "@/firebase/firebase-config";

export const deleteFile = async (file: string, subFolder: string ): Promise<any> => {
  
  const folder = (subFolder === null) ? '' : subFolder
  const fileRef   = await ref(firebaseStorage, `/${folder}/${file}`)
  const response  = await deleteObject(fileRef)

  return response
}

export const uploadImage = async (file: File, path = "images", archivoEliminar?: string) => {
  try {
    if (!file) throw new Error("No file provided");

    //Eliminar archivo anterior
    if (archivoEliminar !="") {
      await deleteFile(archivoEliminar as string, path);
    }

    // Crea una referencia en el storage con una ruta personalizada
    const fileRef = ref(firebaseStorage, `${path}/${Date.now()}-${file.name}`);

    // Sube el archivo con un manejador de progreso
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Puedes manejar el progreso aquí si lo deseas
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading file:", error);
          reject(error);
        },
        async () => {
          // Obtén la URL de descarga cuando el upload sea exitoso
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

