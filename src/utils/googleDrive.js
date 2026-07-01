const { google } = require('googleapis');
const fs = require('fs');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

if (process.env.GOOGLE_REFRESH_TOKEN) {
  oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
}

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

const isDriveConfigured = () => {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN && process.env.GOOGLE_DRIVE_FOLDER_ID);
};

const uploadToDrive = async (filePath, mimeType, originalName) => {
  if (!isDriveConfigured()) throw new Error('Google Drive is not fully configured in .env');

  const fileMetadata = {
    name: originalName,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
  };

  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
  };

  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    return file.data.id;
  } catch (err) {
    console.error('Lỗi khi upload lên Google Drive:', err);
    throw err;
  }
};

const deleteFromDrive = async (driveId) => {
  if (!isDriveConfigured()) return;
  try {
    await drive.files.delete({ fileId: driveId });
  } catch (err) {
    console.error(`Không thể xóa file ${driveId} trên Google Drive:`, err.message);
  }
};

const getDriveFileStream = async (driveId, res) => {
  if (!isDriveConfigured()) throw new Error('Google Drive is not fully configured in .env');
  
  try {
    const response = await drive.files.get(
      { fileId: driveId, alt: 'media' },
      { responseType: 'stream' }
    );
    
    return new Promise((resolve, reject) => {
      response.data
        .on('end', () => resolve())
        .on('error', err => reject(err))
        .pipe(res);
    });
  } catch (err) {
    console.error('Lỗi khi tải file từ Google Drive:', err);
    throw err;
  }
};

module.exports = {
  isDriveConfigured,
  uploadToDrive,
  deleteFromDrive,
  getDriveFileStream
};
