import { z } from "zod";

// Document Schema
export const DOCUMENT_SCHEMA = z
  .instanceof(File)
  .refine(
    (file) =>
      [
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type),
    { message: "Invalid document file type" }
  );

// Image Schema
export const IMAGE_SCHEMA = z.union([
  z
    .instanceof(File)
    .refine(
      (file) =>
        [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/svg+xml",
          "image/gif",
        ].includes(file.type),
      { message: "Tipo de imagen no válido" }
    ),
  z.unknown(),
]);
