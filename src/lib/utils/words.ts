type Words = {
  /**
   * @param date - Fecha en formato "lunes, 1 de enero de 2022"
   * @returns - Fecha en formato "Lunes, 1 de Enero de 2022"
   */
  dateToUpperCase: (date: string) => string;
};

const dateToUpperCase = (date: string) => {
  return date
    .split(" ")
    .map((word) =>
      word !== "de" ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join(" ");
};

export const words: Words = {
  dateToUpperCase,
};
