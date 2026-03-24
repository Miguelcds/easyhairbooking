export const calculatePrice = (services) => {
  if (services.includes("Otro")) return 0;
  let precio = 0;
  if (services.includes("Cortar")) precio += 15;
  if (services.includes("Mechas")) precio += 30;
  if (services.includes("Peinar")) precio += 7;
  if (services.includes("Especial")) precio += 40;
  if (services.includes("Barba"))precio += 10;
  return precio;
};