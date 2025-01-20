export function generateRoomId(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;

  return Array.from({ length: 4 }, () =>
    characters.charAt(Math.floor(Math.random() * charactersLength))
  ).join("");
}
