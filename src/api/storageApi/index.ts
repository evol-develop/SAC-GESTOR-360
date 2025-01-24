import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firebaseStorage } from "@/firebase/firebase-config";

export const uploadImage = async (file: File, path = "images") => {
  try {
    if (!file) throw new Error("No file provided");

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

