import type lmdb from "lmdb";

export const lmdbService = (db: lmdb.RootDatabase) => {
  function put<T>(slug: string, value: T): boolean {
    const existingData = db.get(slug);

    if (existingData) return existingData;

    db.put(slug, value);

    return true;
  }

  function get<T>(slug: string): T | null {
    const data = db.get(slug);

    if (!data) return null;

    return data;
  }

  return { put, get };
};
