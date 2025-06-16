import type { Request, Response } from 'express';
import { AppVersionService } from '../services/appVersionService';

const appVersionService = new AppVersionService();

export const createAppVersion = async (req: Request, res: Response) => {
  try {
    const {
      appId,
      versionName,
      versionCode,
      fileName,
      filePath,
      fileSize,
      fileHash,
      mimeType,
      minSdkVersion,
      targetSdkVersion,
      supportedAbis,
      permissions,
      releaseNotes,
      releaseNotesLanguage,
      status,
      rolloutPercentage,
      downloadCount,
      crashRate
    } = req.body;

    const newAppVersion = await appVersionService.createAppVersion({
      appId,
      versionName,
      versionCode,
      fileName,
      filePath,
      fileSize,
      fileHash,
      mimeType,
      minSdkVersion,
      targetSdkVersion,
      supportedAbis,
      permissions,
      releaseNotes,
      releaseNotesLanguage,
      status,
      rolloutPercentage,
      downloadCount,
      crashRate
    });

    res.status(201).json(newAppVersion);
  } catch (error) {
    console.error('Error creating app version:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
