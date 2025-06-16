import { db } from '../db';
import { appVersions } from '../db/schemas';

export class AppVersionService {
  async createAppVersion(data: {
    appId: string;
    versionName: string;
    versionCode: number;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileHash: string;
    mimeType?: string;
    minSdkVersion?: number;
    targetSdkVersion?: number;
    supportedAbis?: string[];
    permissions?: string[];
    releaseNotes?: string;
    releaseNotesLanguage?: string;
    status?: string;
    rolloutPercentage?: number;
    downloadCount?: number;
    crashRate?: string;
  }) {
    const newAppVersion = await db.insert(appVersions).values({
      app_id: data.appId,
      version_name: data.versionName,
      version_code: data.versionCode,
      file_name: data.fileName,
      file_path: data.filePath,
      file_size: data.fileSize,
      file_hash: data.fileHash,
      mime_type: data.mimeType ?? 'application/vnd.android.package-archive',
      min_sdk_version: data.minSdkVersion,
      target_sdk_version: data.targetSdkVersion,
      supported_abis: data.supportedAbis,
      permissions: data.permissions,
      release_notes: data.releaseNotes,
      release_notes_language: data.releaseNotesLanguage ?? 'en',
      status: data.status ?? 'draft',
      rollout_percentage: data.rolloutPercentage ?? 100,
      download_count: data.downloadCount ?? 0,
      crash_rate: data.crashRate ?? '0.0000'
    }).returning();

    return newAppVersion[0];
  }
}
