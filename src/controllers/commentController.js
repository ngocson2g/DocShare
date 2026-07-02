const Comment = require('../models/Comment');

exports.list = async (req, res, next) => {
  try {
    const comments = await Comment.find({ documentId: req.params.docId })
      .sort({ createdAt: -1 })
      .exec();
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

exports.add = async (req, res, next) => {
  try {
    const { author, content, reaction } = req.body;
    if (!content && !reaction) {
      return res.status(400).json({ error: req.t('commentContentRequired') });
    }

    const comment = await Comment.create({
      documentId: req.params.docId,
      author: author || 'Ẩn danh',
      content: content || '',
      reaction: reaction || null, 
    });

    res.json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await Comment.findByIdAndDelete(req.params.id).exec();
    if (!result) return res.status(404).json({ error: req.t('commentNotFound') });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.stats = async (req, res, next) => {
  try {
    // Note: reaction logic might need schema update to `reaction: String`
    const comments = await Comment.find({ documentId: req.params.docId }).exec();
    // Assuming we added `reaction` to schema:
    const likes = comments.filter(c => c.get('reaction') === 'like').length;
    const dislikes = comments.filter(c => c.get('reaction') === 'dislike').length;
    const total = comments.filter(c => c.content).length;
    res.json({ likes, dislikes, totalComments: total });
  } catch (error) {
    next(error);
  }
};
