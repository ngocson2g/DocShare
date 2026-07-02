/**
 * Backend i18n — Centralized message translations.
 * Detects language from Accept-Language header or ?lang= query param.
 */

const messages = {
  vi: {
    // Auth
    loginSuccess: 'Đăng nhập thành công',
    loginFailed: 'Sai tên đăng nhập hoặc mật khẩu',
    logoutSuccess: 'Đã đăng xuất',
    logoutError: 'Lỗi khi đăng xuất',
    unauthorized: 'Bạn cần đăng nhập với quyền admin',
    serverError: 'Lỗi server',

    // Documents
    noFile: 'Không có file',
    docNotFound: 'Không tìm thấy tài liệu',
    fileNotFound: 'File không tồn tại',
    notFound: 'Không tìm thấy',
    docDeleted: 'Đã xóa tài liệu',

    // Upload / File
    fileTooLarge: 'File quá lớn. Tối đa 100MB.',
    invalidFileType: 'Định dạng file không được hỗ trợ',
    internalError: 'Đã xảy ra lỗi máy chủ',

    // Collections
    collectionNameRequired: 'Tên bộ sưu tập không được để trống',
    collectionNotFound: 'Không tìm thấy collection',
    docIdsMustBeArray: 'docIds phải là mảng',

    // Categories
    categoryNameRequired: 'Tên danh mục không được để trống',

    // Comments
    commentContentRequired: 'Nội dung không được để trống',
    commentNotFound: 'Không tìm thấy',

    // Rate Limit
    tooManyRequests: 'Quá nhiều yêu cầu, vui lòng thử lại sau.',

    // Logger
    adminLogin: 'Admin đăng nhập thành công',
    uploadLog: (name) => `Admin đã tải lên file: ${name}`,
    deleteLog: (name) => `Admin đã xóa file: ${name}`,
  },

  en: {
    // Auth
    loginSuccess: 'Login successful',
    loginFailed: 'Invalid username or password',
    logoutSuccess: 'Logged out',
    logoutError: 'Failed to log out',
    unauthorized: 'Admin authentication required',
    serverError: 'Server error',

    // Documents
    noFile: 'No file provided',
    docNotFound: 'Document not found',
    fileNotFound: 'File not found',
    notFound: 'Not found',
    docDeleted: 'Document deleted',

    // Upload / File
    fileTooLarge: 'File too large. Maximum size is 100 MB.',
    invalidFileType: 'Unsupported file format',
    internalError: 'An internal server error occurred',

    // Collections
    collectionNameRequired: 'Collection name is required',
    collectionNotFound: 'Collection not found',
    docIdsMustBeArray: 'docIds must be an array',

    // Categories
    categoryNameRequired: 'Category name is required',

    // Comments
    commentContentRequired: 'Content is required',
    commentNotFound: 'Not found',

    // Rate Limit
    tooManyRequests: 'Too many requests — please try again later.',

    // Logger
    adminLogin: 'Admin logged in successfully',
    uploadLog: (name) => `Admin uploaded: ${name}`,
    deleteLog: (name) => `Admin deleted: ${name}`,
  },
};

/**
 * Get the preferred language from the request.
 * Priority: ?lang= query > Accept-Language header > default 'vi'
 */
function getLang(req) {
  if (req.query && req.query.lang) {
    const q = req.query.lang.toLowerCase();
    if (q === 'en' || q.startsWith('en')) return 'en';
    return 'vi';
  }
  const accept = req.headers && req.headers['accept-language'];
  if (accept && accept.toLowerCase().startsWith('en')) return 'en';
  return 'vi';
}

/**
 * Get a translated message.
 * @param {object} req - Express request object
 * @param {string} key - Message key
 * @param  {...any} args - Optional arguments for template functions
 */
function msg(req, key, ...args) {
  const lang = getLang(req);
  const val = messages[lang][key] || messages.vi[key] || key;
  if (typeof val === 'function') return val(...args);
  return val;
}

/**
 * Express middleware: attaches req.t(key, ...args) helper.
 */
function i18nMiddleware(req, res, next) {
  req.lang = getLang(req);
  req.t = (key, ...args) => {
    const val = messages[req.lang][key] || messages.vi[key] || key;
    if (typeof val === 'function') return val(...args);
    return val;
  };
  next();
}

module.exports = { messages, getLang, msg, i18nMiddleware };
