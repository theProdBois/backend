import { db } from '../db';
import { developers } from '../db/schemas';

export class DeveloperService {
  async createDeveloper(data: {
    name: string;
    email: string;
    company?: string;
    website?: string;
    verified?: boolean;
  }) {
    const newDeveloper = await db.insert(developers).values({
      name: data.name,
      email: data.email,
      company: data.company,
      website: data.website,
      verified: data.verified ?? false
    }).returning();

    return newDeveloper[0];
  }
}
