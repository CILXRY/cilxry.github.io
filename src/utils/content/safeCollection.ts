import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

type CollectionName = "posts" | "memory";

export async function safeGetCollection<T extends CollectionName>(
  collection: T,
  filter?: (entry: CollectionEntry<T>) => boolean
): Promise<CollectionEntry<T>[]> {
  try {
    if (filter) {
      return await getCollection(collection, filter);
    }
    return await getCollection(collection);
  } catch (error) {
    console.error(`[Content Error] Failed to get collection "${collection}":`);
    console.error(error);
    return [];
  }
}

export async function safeGetEntry<T extends CollectionName>(
  collection: T,
  id: string
): Promise<CollectionEntry<T> | null> {
  try {
    const entries = await getCollection(collection);
    return entries.find((entry) => entry.id === id) || null;
  } catch (error) {
    console.error(`[Content Error] Failed to get entry "${id}" from "${collection}":`);
    console.error(error);
    return null;
  }
}
