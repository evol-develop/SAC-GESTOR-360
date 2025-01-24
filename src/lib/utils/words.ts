type Words = {
  /**
   * @param date - Fecha en formato "lunes, 1 de enero de 2022"
   * @returns - Fecha en formato "Lunes, 1 de Enero de 2022"
   */
  dateToUpperCase: (date: string) => string;
  /**
   * @param date - Fecha
   * @returns - Tiempo transcurrido, ej: "hace 2 días"
   */
  timeElapsed: (date: Date) => string;
};

const dateToUpperCase = (date: string) => {
  return date
    .split(" ")
    .map((word) =>
      word !== "de" ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join(" ");
};

// Funcion para convertir fecha a tiempo transcurrido
const timeElapsed = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return "Hace " + Math.floor(interval) + " año(s)";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return "Hace " + Math.floor(interval) + " mes(es)";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return "Hace " + Math.floor(interval) + " día(s)";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return "Hace " + Math.floor(interval) + " hora(s)";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return "Hace " + Math.floor(interval) + " minuto(s)";
  }
  return "Hace " + Math.floor(seconds) + " segundo(s)";
};

export const words: Words = {
  dateToUpperCase,
  timeElapsed,
};
