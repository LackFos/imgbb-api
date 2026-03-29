import { open } from "lmdb"; // or require

export const createConnection = () => {
  return open("database", {
    compression: true,
  });
};
