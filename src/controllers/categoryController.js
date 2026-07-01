const Category = require('../models/Category');
const redisClient = require('../config/redis');

exports.list = async (req, res, next) => {
  try {
    const cachedCategories = await redisClient.get('docshare:cache:categories');
    if (cachedCategories) {
      return res.json(JSON.parse(cachedCategories));
    }

    const categories = await Category.find().exec();
    const categoriesList = categories.map(c => c.name);
    
    await redisClient.setEx('docshare:cache:categories', 3600 * 24, JSON.stringify(categoriesList)); // Cache 24h
    
    res.json(categoriesList);
  } catch (error) {
    next(error);
  }
};

exports.add = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Tên danh mục không được để trống' });
    
    let category = await Category.findOne({ name }).exec();
    if (!category) {
      category = await Category.create({ name });
    }
    
    await redisClient.del('docshare:cache:categories');
    
    const categories = await Category.find().exec();
    res.json({ success: true, categories: categories.map(c => c.name) });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { name } = req.body;
    await Category.deleteOne({ name }).exec();
    
    await redisClient.del('docshare:cache:categories');
    
    const categories = await Category.find().exec();
    res.json({ success: true, categories: categories.map(c => c.name) });
  } catch (error) {
    next(error);
  }
};
