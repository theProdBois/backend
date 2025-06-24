import type { Request, Response } from 'express';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../db';
import { apps, appVersions } from '../db/schemas';

export const addApp = async (req: Request, res: Response) => {
  try {
    const {
      packageName,
      name,
      shortDescription,
      fullDescription,
      developerId,
      developerName,
      categoryId,
      tags,
      apkFilePath
    } = req.body;

    // Insert app
    const [newApp] = await db.insert(apps).values({
      package_name: packageName,
      name,
      short_description: shortDescription,
      full_description: fullDescription,
      developer_id: developerId,
      developer_name: developerName,
      category_id: categoryId,
      tags,
      status: 'pending'
    }).returning();

    // Insert app version with apkFilePath as file_path
    await db.insert(appVersions).values({
      app_id: newApp.id,
      version_name: '1.0.0',
      version_code: 1,
      file_name: apkFilePath.split('/').pop(),
      file_path: apkFilePath,
      file_size: 0, // You may want to calculate actual file size
      file_hash: '',
      mime_type: 'application/vnd.android.package-archive',
      status: 'draft'
    });

    res.status(201).json({ message: 'App added successfully', app: newApp });
  } catch (error) {
    console.error('Error adding app:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listAllApks = async (req: Request, res: Response) => {
  try {
    // Select all apps with their related versions (appVersions)
    const allAppsWithVersions = await db.query.apps.findMany({
      with: {
        versions: true
      }
    });
    res.json(allAppsWithVersions);
  } catch (error) {
    console.error('Error fetching APKs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listApksByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const appsInCategory = await db.select().from(apps).where(eq(apps.category_id, categoryId));
    const appIds = appsInCategory.map(app => app.id);
    const apks = await db.select().from(appVersions).where(inArray(appVersions.app_id, appIds));
    res.json(apks);
  } catch (error) {
    console.error('Error fetching APKs by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
