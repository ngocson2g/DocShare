const path = require('path');
const fs = require('fs');
const config = require('../config');
const { fixVietnameseName, contentDisposition } = require('../utils/fileHelpers');
const Document = require('../models/Document');
const { logAction } = require('../utils/logger');
const { isDriveConfigured, uploadToDrive, deleteFromDrive, getDriveFileStream } = require('../utils/googleDrive');
const redisClient = require('../config/redis');

exports.list = async (req, res, next) => {
  try {
    const cachedDocs = await redisClient.get('docshare:cache:documents');
    if (cachedDocs) {
      return res.json(JSON.parse(cachedDocs));
    }

    const docs = await Document.find()
      .sort({ pinned: -1, uploadedAt: -1 })
      .exec();
      
    await redisClient.setEx('docshare:cache:documents', 300, JSON.stringify(docs)); // Cache 5 phút để cập nhật lượt xem
    res.json(docs);
  } catch (error) {
    next(error);
  }
};

exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: req.t('noFile') });
    }

    const originalName = fixVietnameseName(req.file.originalname);
    const category = fixVietnameseName(req.body.category || 'Chung');
    const description = fixVietnameseName(req.body.description || '');
    
    let driveId = null;
    let filename = req.file.filename;

    if (isDriveConfigured()) {
      // Upload lên Google Drive
      driveId = await uploadToDrive(req.file.path, req.file.mimetype, originalName);
      // Xoá file local sau khi upload thành công
      fs.unlinkSync(req.file.path);
    }

    const doc = await Document.create({
      originalName,
      filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      driveId,
      category,
      description,
      pinned: false,
    });

    await logAction('UPLOAD', req.t('uploadLog', originalName));

    await redisClient.del('docshare:cache:documents');
    res.status(201).json({ success: true, doc });
  } catch (error) {
    // Xoá file local nếu có lỗi
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

exports.view = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id).exec();
    if (!doc) return res.status(404).json({ error: req.t('docNotFound') });

    doc.views = (doc.views || 0) + 1;
    await doc.save();

    res.setHeader('Content-Disposition', contentDisposition('inline', doc.originalName));
    
    if (doc.driveId) {
      return await getDriveFileStream(doc.driveId, res);
    }

    const filePath = path.join(config.uploadDir, doc.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: req.t('fileNotFound') });

    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

exports.download = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id).exec();
    if (!doc) return res.status(404).json({ error: req.t('docNotFound') });

    doc.downloads = (doc.downloads || 0) + 1;
    await doc.save();

    res.setHeader('Content-Disposition', contentDisposition('attachment', doc.originalName));
    
    if (doc.driveId) {
      return await getDriveFileStream(doc.driveId, res);
    }

    const filePath = path.join(config.uploadDir, doc.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: req.t('fileNotFound') });

    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updateData = {};
    if (req.body.category) updateData.category = fixVietnameseName(req.body.category);
    if (req.body.description !== undefined) updateData.description = fixVietnameseName(req.body.description);
    if (req.body.pinned !== undefined) updateData.pinned = Boolean(req.body.pinned);

    const doc = await Document.findByIdAndUpdate(req.params.id, updateData, { new: true }).exec();
    if (!doc) return res.status(404).json({ error: req.t('notFound') });

    await redisClient.del('docshare:cache:documents');
    res.json({ success: true, doc });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id).exec();
    if (!doc) return res.status(404).json({ error: req.t('notFound') });

    if (doc.driveId) {
      await deleteFromDrive(doc.driveId);
    } else {
      const filePath = path.join(config.uploadDir, doc.filename);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error('Không thể xóa file vật lý:', err);
      }
    }

    await logAction('DELETE', req.t('deleteLog', doc.originalName));

    await redisClient.del('docshare:cache:documents');
    res.json({ success: true, message: req.t('docDeleted') });
  } catch (error) {
    next(error);
  }
};
