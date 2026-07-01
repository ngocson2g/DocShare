const Setting = require('../models/Setting');

const defaultSettings = {
  appName: 'DocShare',
  logoUrl: '',
  bgColor: '',
  bgImageUrl: '',
  theme: 'dark',
  hideAppName: 'false'
};

async function loadSettings() {
  const settingsArray = await Setting.find().exec();
  const settingsObj = { ...defaultSettings };
  settingsArray.forEach(s => {
    settingsObj[s.key] = s.value;
  });
  return settingsObj;
}

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await loadSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const updates = {};
    
    if (req.body.appName !== undefined) updates.appName = req.body.appName;
    if (req.body.bgColor !== undefined) updates.bgColor = req.body.bgColor;
    if (req.body.theme !== undefined) updates.theme = req.body.theme;
    if (req.body.hideAppName !== undefined) updates.hideAppName = req.body.hideAppName;
    
    if (req.body.clearBgImage === 'true') {
      updates.bgImageUrl = '';
    }
    if (req.body.clearLogo === 'true') {
      updates.logoUrl = '';
    }

    if (req.files) {
      if (req.files.logo && req.files.logo.length > 0) {
        updates.logoUrl = '/uploads/' + req.files.logo[0].filename;
      }
      if (req.files.bgImage && req.files.bgImage.length > 0) {
        updates.bgImageUrl = '/uploads/' + req.files.bgImage[0].filename;
      }
    }

    // Save to DB
    for (const [key, value] of Object.entries(updates)) {
      await Setting.findOneAndUpdate({ key }, { value }, { upsert: true }).exec();
    }

    const newSettings = await loadSettings();
    res.json({ success: true, settings: newSettings });
  } catch (error) {
    next(error);
  }
};
