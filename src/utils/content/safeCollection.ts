import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

type CollectionName = "posts" | "memory" | "instructions";

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
  slug: string
): Promise<CollectionEntry<T> | null> {
  try {
    const entries = await getCollection(collection);
    return entries.find((entry) => entry.slug === slug) || null;
  } catch (error) {
    console.error(`[Content Error] Failed to get entry "${slug}" from "${collection}":`);
    console.error(error);
    return null;
  }
}
