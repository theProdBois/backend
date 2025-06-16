import { db } from '../db';
import { categories } from '../db/schemas';

export class CategoryService {
  async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    iconUrl?: string;
    sortOrder?: number;
  }) {
    const newCategory = await db.insert(categories).values({
      name: data.name,
      slug: data.slug,
      description: data.description,
      icon_url: data.iconUrl,
      sort_order: data.sortOrder ?? 0
    }).returning();

    return newCategory[0];
  }
}
