import {
  storedImageDTO,
  type StoredImageDTO,
} from "@/schemas/stored-image-dto";
import type lmdb from "lmdb";

export const lmdbService = (db: lmdb.RootDatabase) => {
  function put(slug: string, value: StoredImageDTO): boolean {
    const existingData = db.get(slug);

    if (existingData) return existingData;

    db.put(slug, value);

    return true;
  }

  function get(slug: string): StoredImageDTO | null {
    const data = db.get(slug);

    if (!data) return null;

    return storedImageDTO.parse(data);
  }

  return { put, get };
};
