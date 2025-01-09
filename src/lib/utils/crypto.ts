import CryptoJS from "crypto-js";

import { appConfig } from "@/appConfig";

export function encrypt(word: string): string {
  const key = CryptoJS.SHA256(appConfig.SECRET_KEY); // Crear clave derivada
  const iv = CryptoJS.lib.WordArray.random(16); // Generar IV aleatorio
  const encrypted = CryptoJS.AES.encrypt(word, key, { iv });
  return `${iv.toString()}:${encrypted.toString()}`; // Concatenar IV y texto cifrado
}

export function decrypt(encryptedData: string): string {
  const [iv, encrypted] = encryptedData.split(":");
  const key = CryptoJS.SHA256(appConfig.SECRET_KEY); // Crear clave derivada
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
