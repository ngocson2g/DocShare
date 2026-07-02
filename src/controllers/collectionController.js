const Collection = require('../models/Collection');
const Document = require('../models/Document');
const { fixVietnameseName } = require('../utils/fileHelpers');

exports.list = async (req, res, next) => {
  try {
    const cols = await Collection.find().exec();
    res.json(cols);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: req.t('collectionNameRequired') });

    const newCol = await Collection.create({
      name: fixVietnameseName(name),
      description: fixVietnameseName(description || ''),
    });

    res.json({ success: true, collection: newCol });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const updateData = {};
    if (name) updateData.name = fixVietnameseName(name);
    if (description !== undefined) updateData.description = fixVietnameseName(description);

    const col = await Collection.findByIdAndUpdate(req.params.id, updateData, { new: true }).exec();
    if (!col) return res.status(404).json({ error: req.t('notFound') });

    res.json({ success: true, collection: col });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const col = await Collection.findByIdAndDelete(req.params.id).exec();
    if (!col) return res.status(404).json({ error: req.t('notFound') });

    // Assuming we do not remove documents, just the collection.
    // The previous implementation used `collectionIds` array on docs, but my Document model didn't have it.
    // Or Collection model has `documentIds`. Let's update `documentIds` in Collection model instead.

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.addDocs = async (req, res, next) => {
  try {
    const { docIds } = req.body;
    if (!Array.isArray(docIds)) return res.status(400).json({ error: req.t('docIdsMustBeArray') });

    const col = await Collection.findById(req.params.id).exec();
    if (!col) return res.status(404).json({ error: req.t('collectionNotFound') });

    const newDocs = docIds.filter(id => !col.documentIds.includes(id));
    col.documentIds.push(...newDocs);
    await col.save();

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.removeDocs = async (req, res, next) => {
  try {
    const { docIds } = req.body;
    if (!Array.isArray(docIds)) return res.status(400).json({ error: req.t('docIdsMustBeArray') });

    const col = await Collection.findById(req.params.id).exec();
    if (!col) return res.status(404).json({ error: req.t('collectionNotFound') });

    col.documentIds = col.documentIds.filter(id => !docIds.includes(id.toString()));
    await col.save();

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
