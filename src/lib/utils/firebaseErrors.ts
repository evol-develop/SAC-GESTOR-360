export const firebaseErrors = (code: string) => {
  switch (code) {
    case "auth/invalid-email":
      return {
        code: "email",
        message: "Email inválido",
      };
    case "auth/weak-password":
      return {
        code: "password",
        message: "Contraseña débil",
      };
    case "auth/email-already-in-use":
      return {
        code: "email",
        message: "Email en uso",
      };
    case "auth/user-not-found":
      return {
        code: "email",
        message: "Email no encontrado",
      };
    case "auth/wrong-password":
      return {
        code: "password",
        message: "Contraseña incorrecta",
      };
    case "auth/invalid-credential":
      return {
        code: "email",
        message: "Credenciales inválidas",
      };
    default:
      return {
        code: "email",
        message: "Error desconocido",
      };
  }
};
