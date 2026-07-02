let allDocs = [];
let allCollections = [];
let allCategories = [];
let currentCategory = '';
let currentCollection = '';
let currentLang = 'vi';
let uploadSection = false;
let isAdmin = false;
let currentPage = 1;
let currentViewerId = null;
const ITEMS_PER_PAGE = 12;
const IMAGE_EXTS = ['png','jpg','jpeg','gif','webp','svg'];
const PDF_EXTS = ['pdf'];
const selectedDocs = new Set();

// ========== i18n ==========
const i18n = {
  vi: {
    // Header & Nav
    all: 'Tất cả', recent: 'Gần đây', other: 'Khác',
    uploadBtn: '＋ Upload', dashboardBtn: '📊 Dashboard',
    logoutBtn: 'Đăng xuất', loginBtn: '🔐 Đăng nhập',
    searchPlaceholder: 'Tìm tài liệu...', emptyState: 'Chưa có tài liệu',
    emptyDesc: 'Upload tài liệu đầu tiên của bạn',

    // Stats
    statDocs: 'Tài liệu', statSize: 'Tổng dung lượng', statDownloads: 'Lượt tải',

    // Sort & Filter
    newest: 'Mới nhất', oldest: 'Cũ nhất',
    nameAsc: 'Tên A → Z', nameDesc: 'Tên Z → A',
    mostDownloads: 'Nhiều lượt tải', sizeLarge: 'Dung lượng lớn', sizeSmall: 'Dung lượng nhỏ',
    allTypes: 'Tất cả loại file', image: 'Ảnh', text: 'Văn bản',
    allCollections: 'Tất cả BST', showLess: 'Ẩn bớt',

    // Upload Section
    dropTitle: 'Kéo thả file vào đây',
    dropDesc: 'hoặc click để chọn file — PDF, Word, Excel, PowerPoint, ảnh, text',
    dropLimit: 'Tối đa 100MB mỗi file',
    labelCategory: 'Danh mục', labelDescription: 'Mô tả ngắn (tùy chọn)',
    descPlaceholder: 'Mô tả về tài liệu...',

    // Document Card
    viewBtn: 'Xem', pinTooltip: 'Ghim lên đầu', unpinTooltip: 'Bỏ ghim',
    pinnedBadge: 'Được ghim', newBadge: 'Mới',

    // Viewer
    hideComments: 'Ẩn bình luận', showComments: 'Hiện bình luận',
    copyLink: 'Copy Link', downloadBtn: 'Tải xuống', closeBtn: 'Đóng',
    noPreview: (ext) => `Định dạng <strong>.${ext}</strong> không thể xem trực tiếp`,
    downloadToOpen: '⬇ Tải xuống để mở',
    loadingPdf: 'Đang tải nội dung PDF...',
    pdfTooLong: 'Tài liệu quá dài, chỉ hiển thị 20 trang đầu. Vui lòng tải xuống để xem toàn bộ.',
    pdfError: 'Lỗi không thể tải PDF trực tiếp. Vui lòng tải xuống để xem.',

    // Comments & Reactions
    commentsTitle: 'Bình luận & Đánh giá',
    noComments: 'Chưa có bình luận nào',
    likeBtn: 'Thích', dislikeBtn: 'Không thích',
    authorPlaceholder: 'Tên (tùy chọn)',
    commentPlaceholder: 'Viết bình luận...',
    submitComment: 'Gửi bình luận',
    deleteCommentBtn: 'Xóa',

    // Login Modal
    loginTitle: 'Đăng nhập Admin',
    loginSubtitle: 'Nhập thông tin để quản lý tài liệu',
    labelUsername: 'Tên đăng nhập', labelPassword: 'Mật khẩu',
    loginSubmit: 'Đăng nhập', loginCancel: 'Hủy',

    // Selection Bar
    selected: 'Đã chọn', documents: 'tài liệu',
    selectAll: 'Chọn tất cả', deselect: '✕ Bỏ chọn',
    bulkDownload: '⬇ Tải xuống', bulkDelete: '🗑 Xóa',

    // Admin Dashboard
    dashTitle: 'Quản trị viên - Dashboard', dashClose: '✕ Đóng',
    dashTotalDocs: 'Tổng tài liệu', dashTotalViews: 'Tổng lượt xem', dashTotalDownloads: 'Tổng lượt tải',
    manageTitle: 'Quản lý Danh mục & Bộ sưu tập',
    newCategoryPlaceholder: 'Tên danh mục mới', addCategory: 'Thêm DM',
    newCollectionPlaceholder: 'Tên bộ sưu tập mới', createCollection: 'Tạo BST',
    addSelectedDocs: '+ Thêm tài liệu đang chọn',
    deleteBtn: 'Xóa',
    docsCount: 'tài liệu',
    logsTitle: 'Nhật ký hoạt động (Logs)', noLogs: 'Chưa có log',

    // Settings
    settingsTitle: 'Cấu hình Giao diện Chung (Global Settings)',
    themeLabel: 'Chế độ hiển thị (Theme):',
    themeDark: 'Đen (Mặc định)', themeLight: 'Trắng (Sáng)',
    themeBlue: 'Xanh dương (Blue)', themeGreen: 'Xanh lá (Green)',
    themePink: 'Hồng (Pink)', themePurple: 'Tím (Purple)',
    themeOrange: 'Cam (Orange)', themeRed: 'Đỏ (Red)',
    appNameLabel: 'Tên ứng dụng:', hideAppNameLabel: 'Ẩn tên ứng dụng',
    logoLabel: 'Logo (Thay dòng chữ DocShare):',
    clearLogoLabel: 'Xóa logo hiện tại (trở về chữ mặc định)',
    bgColorLabel: 'Màu nền trang (Mã HEX):',
    bgImageLabel: 'Ảnh nền trang:',
    clearBgLabel: 'Xóa ảnh nền hiện tại',
    saveSettings: 'Lưu cấu hình',

    // Footer
    footerDesc: 'Hệ thống chia sẻ tài liệu nội bộ.<br>Upload, xem và quản lý tài liệu dễ dàng.',
    footerCategory: 'Danh mục', footerAllDocs: 'Tất cả tài liệu',
    footerRecent: 'Gần đây', footerGuide: 'Hướng dẫn', footerReport: 'Báo cáo',
    footerSupport: 'Hỗ trợ', footerSettings: 'Cài đặt giao diện', footerLogin: 'Đăng nhập Admin',

    // Toasts
    loginSuccess: 'Đăng nhập thành công!',
    loginFailed: 'Đăng nhập thất bại',
    loginError: 'Lỗi kết nối máy chủ',
    loggedOut: 'Đã đăng xuất',
    docDeleted: 'Đã xóa tài liệu',
    needAdmin: 'Bạn cần đăng nhập admin để xóa',
    deleteError: 'Lỗi khi xóa',
    sessionExpired: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
    uploadError: 'Lỗi upload',
    connectionError: 'Lỗi kết nối',
    downloading: (n) => `Đang tải ${n} tài liệu...`,
    confirmBulkDelete: (n) => `Xóa ${n} tài liệu đã chọn?`,
    bulkDeleted: (n) => `Đã xóa ${n} tài liệu`,
    confirmDelete: 'Xóa tài liệu này?',
    pinned: '📌 Đã ghim tài liệu', unpinned: 'Đã bỏ ghim',
    needAdminPin: 'Bạn cần đăng nhập admin',
    linkCopied: 'Đã copy link chia sẻ',
    commentEmpty: 'Vui lòng nhập nội dung',
    commentSent: 'Đã gửi bình luận',
    reacted: (type) => `Đã ${type === 'like' ? 'thích' : 'không thích'}`,
    confirmDeleteComment: 'Xóa bình luận này?',
    deleted: 'Đã xóa',
    categoryAdded: 'Đã thêm danh mục', categoryDeleted: 'Đã xóa danh mục',
    confirmDeleteCategory: (name) => `Xóa danh mục ${name}?`,
    inputName: 'Vui lòng nhập tên',
    collectionCreated: 'Đã tạo BST',
    confirmDeleteCollection: 'Xóa BST này? Các tài liệu sẽ không bị xóa.',
    collectionDeleted: 'Đã xóa',
    noDocsSelected: 'Chưa chọn tài liệu nào',
    addedToCollection: 'Đã thêm vào BST',
    settingsSaved: 'Đã lưu cấu hình giao diện',
    settingsFailed: 'Lưu cấu hình thất bại',
    anonymous: 'Ẩn danh',

    categories: {
      'Chung': 'Chung',
      'Hướng dẫn': 'Hướng dẫn',
      'Báo cáo': 'Báo cáo',
      'Hợp đồng': 'Hợp đồng',
      'Kỹ thuật': 'Kỹ thuật',
      'Nhân sự': 'Nhân sự',
      'Tài chính': 'Tài chính'
    }
  },

  en: {
    // Header & Nav
    all: 'All', recent: 'Recent', other: 'Other',
    uploadBtn: '＋ Upload', dashboardBtn: '📊 Dashboard',
    logoutBtn: 'Logout', loginBtn: '🔐 Sign in',
    searchPlaceholder: 'Search documents...', emptyState: 'No documents yet',
    emptyDesc: 'Upload your first document to get started',

    // Stats
    statDocs: 'Documents', statSize: 'Total Size', statDownloads: 'Downloads',

    // Sort & Filter
    newest: 'Newest First', oldest: 'Oldest First',
    nameAsc: 'Name A → Z', nameDesc: 'Name Z → A',
    mostDownloads: 'Most Downloads', sizeLarge: 'Largest First', sizeSmall: 'Smallest First',
    allTypes: 'All File Types', image: 'Images', text: 'Text Files',
    allCollections: 'All Collections', showLess: 'Show less',

    // Upload Section
    dropTitle: 'Drop files here',
    dropDesc: 'or click to browse — PDF, Word, Excel, PowerPoint, images, text',
    dropLimit: 'Up to 100 MB per file',
    labelCategory: 'Category', labelDescription: 'Description (optional)',
    descPlaceholder: 'Brief description...',

    // Document Card
    viewBtn: 'View', pinTooltip: 'Pin to top', unpinTooltip: 'Unpin',
    pinnedBadge: 'Pinned', newBadge: 'New',

    // Viewer
    hideComments: 'Hide comments', showComments: 'Show comments',
    copyLink: 'Copy Link', downloadBtn: 'Download', closeBtn: 'Close',
    noPreview: (ext) => `<strong>.${ext}</strong> files cannot be previewed`,
    downloadToOpen: '⬇ Download to open',
    loadingPdf: 'Loading PDF...',
    pdfTooLong: 'Document too long — showing first 20 pages. Download for the full version.',
    pdfError: 'Unable to load PDF inline. Please download to view.',

    // Comments & Reactions
    commentsTitle: 'Comments & Reviews',
    noComments: 'No comments yet',
    likeBtn: 'Like', dislikeBtn: 'Dislike',
    authorPlaceholder: 'Name (optional)',
    commentPlaceholder: 'Write a comment...',
    submitComment: 'Post Comment',
    deleteCommentBtn: 'Delete',

    // Login Modal
    loginTitle: 'Admin Sign In',
    loginSubtitle: 'Enter your credentials to manage documents',
    labelUsername: 'Username', labelPassword: 'Password',
    loginSubmit: 'Sign In', loginCancel: 'Cancel',

    // Selection Bar
    selected: 'Selected', documents: 'documents',
    selectAll: 'Select All', deselect: '✕ Deselect',
    bulkDownload: '⬇ Download', bulkDelete: '🗑 Delete',

    // Admin Dashboard
    dashTitle: 'Admin Dashboard', dashClose: '✕ Close',
    dashTotalDocs: 'Total Documents', dashTotalViews: 'Total Views', dashTotalDownloads: 'Total Downloads',
    manageTitle: 'Categories & Collections',
    newCategoryPlaceholder: 'New category name', addCategory: 'Add',
    newCollectionPlaceholder: 'New collection name', createCollection: 'Create',
    addSelectedDocs: '+ Add selected docs',
    deleteBtn: 'Delete',
    docsCount: 'docs',
    logsTitle: 'Activity Log', noLogs: 'No activity yet',

    // Settings
    settingsTitle: 'Appearance Settings',
    themeLabel: 'Theme:',
    themeDark: 'Dark (Default)', themeLight: 'Light',
    themeBlue: 'Blue', themeGreen: 'Green',
    themePink: 'Pink', themePurple: 'Purple',
    themeOrange: 'Orange', themeRed: 'Red',
    appNameLabel: 'App Name:', hideAppNameLabel: 'Hide app name',
    logoLabel: 'Logo:',
    clearLogoLabel: 'Remove current logo',
    bgColorLabel: 'Background Color:',
    bgImageLabel: 'Background Image:',
    clearBgLabel: 'Remove background image',
    saveSettings: 'Save Settings',

    // Footer
    footerDesc: 'Internal document sharing platform.<br>Upload, view, and manage documents with ease.',
    footerCategory: 'Categories', footerAllDocs: 'All Documents',
    footerRecent: 'Recent', footerGuide: 'Guides', footerReport: 'Reports',
    footerSupport: 'Support', footerSettings: 'Appearance', footerLogin: 'Admin Sign In',

    // Toasts
    loginSuccess: 'Signed in successfully!',
    loginFailed: 'Sign-in failed',
    loginError: 'Unable to connect to server',
    loggedOut: 'Signed out',
    docDeleted: 'Document deleted',
    needAdmin: 'Admin access required',
    deleteError: 'Failed to delete',
    sessionExpired: 'Session expired — please sign in again.',
    uploadError: 'Upload failed',
    connectionError: 'Connection error',
    downloading: (n) => `Downloading ${n} document${n > 1 ? 's' : ''}...`,
    confirmBulkDelete: (n) => `Delete ${n} selected document${n > 1 ? 's' : ''}?`,
    bulkDeleted: (n) => `${n} document${n > 1 ? 's' : ''} deleted`,
    confirmDelete: 'Delete this document?',
    pinned: '📌 Pinned to top', unpinned: 'Unpinned',
    needAdminPin: 'Admin access required',
    linkCopied: 'Link copied to clipboard',
    commentEmpty: 'Please enter a comment',
    commentSent: 'Comment posted',
    reacted: (type) => type === 'like' ? 'Liked!' : 'Disliked',
    confirmDeleteComment: 'Delete this comment?',
    deleted: 'Deleted',
    categoryAdded: 'Category added', categoryDeleted: 'Category deleted',
    confirmDeleteCategory: (name) => `Delete category "${name}"?`,
    inputName: 'Please enter a name',
    collectionCreated: 'Collection created',
    confirmDeleteCollection: 'Delete this collection? Documents will not be removed.',
    collectionDeleted: 'Deleted',
    noDocsSelected: 'No documents selected',
    addedToCollection: 'Added to collection',
    settingsSaved: 'Settings saved',
    settingsFailed: 'Failed to save settings',
    anonymous: 'Anonymous',
    
    categories: {
      'Chung': 'General',
      'Hướng dẫn': 'Guides',
      'Báo cáo': 'Reports',
      'Hợp đồng': 'Contracts',
      'Kỹ thuật': 'Engineering',
      'Nhân sự': 'Human Resources',
      'Tài chính': 'Finance'
    }
  }
};

function t(key, ...args) {
  const val = i18n[currentLang][key] || key;
  if (typeof val === 'function') return val(...args);
  return val;
}

function tCat(cat) {
  if (i18n[currentLang].categories && i18n[currentLang].categories[cat]) {
    return i18n[currentLang].categories[cat];
  }
  return cat;
}

function toggleLanguage() {
  currentLang = currentLang === 'vi' ? 'en' : 'vi';
  document.getElementById('langBtn').textContent = currentLang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN';
  document.documentElement.lang = currentLang;
  
  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t(key);
    } else {
      el.textContent = t(key);
    }
  });
  // Update data-i18n-html (for elements using innerHTML)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = t('searchPlaceholder');
  
  renderHeaderActions();
  renderDynamicCategories();
  renderCollections();
  filterDocs();
}

// ========== AUTH ==========

async function checkAuth() {
  try {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    isAdmin = data.isAdmin;
  } catch {
    isAdmin = false;
  }
  renderHeaderActions();
}

function renderHeaderActions() {
  const container = document.getElementById('headerActions');
  if (isAdmin) {
    container.innerHTML = `
      <button class="btn btn-ghost btn-sm" onclick="toggleUpload()">${t('uploadBtn')}</button>
      <button class="btn btn-ghost btn-sm" onclick="openAdminDashboard()">${t('dashboardBtn')}</button>
      <span class="admin-badge">👤 Admin</span>
      <button class="btn btn-ghost btn-sm" onclick="handleLogout()">${t('logoutBtn')}</button>
    `;
  } else {
    container.innerHTML = `
      <button class="btn btn-primary btn-sm" onclick="openLogin()">${t('loginBtn')}</button>
    `;
  }
  // Ẩn upload section khi mất quyền admin
  if (!isAdmin) {
    uploadSection = false;
    document.getElementById('uploadSection').style.display = 'none';
  }
}

function openLogin() {
  document.getElementById('loginError').textContent = '';
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginModal').classList.add('open');
  setTimeout(() => document.getElementById('loginUsername').focus(), 200);
}

function closeLogin() {
  document.getElementById('loginModal').classList.remove('open');
}

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  errorEl.textContent = '';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (data.success) {
      isAdmin = true;
      closeLogin();
      renderHeaderActions();
      filterDocs();
      showToast(t('loginSuccess'), 'success');
    } else {
      errorEl.textContent = data.error || t('loginFailed');
    }
  } catch {
    errorEl.textContent = t('loginError');
  }
}

async function handleLogout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch { /* ignore */ }
  isAdmin = false;
  renderHeaderActions();
  filterDocs(); // Re-render cards bỏ nút xóa
  showToast(t('loggedOut'), 'success');
}

// Click outside login modal to close
document.getElementById('loginModal').addEventListener('click', function(e) {
  if (e.target === this) closeLogin();
});

// ========== DOCUMENTS ==========

async function loadDocs() {
  const [docsRes, colsRes, catRes] = await Promise.all([
    fetch('/api/documents'),
    fetch('/api/collections'),
    fetch('/api/categories')
  ]);
  allDocs = await docsRes.json();
  allCollections = await colsRes.json();
  allCategories = await catRes.json();
  
  renderDynamicCategories();
  renderCollections();
  renderStats();
  filterDocs();
}

function renderDynamicCategories() {
  const wrapper = document.getElementById('filterChipsWrapper');
  if (!wrapper) return;
  // Keep the first 4 elements (Tất cả, Gần đây, Khác, ...)
  const defaultChips = Array.from(wrapper.children).slice(0, 4);
  wrapper.innerHTML = '';
  defaultChips.forEach(c => wrapper.appendChild(c));
  
  allCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-chip hidden-chip ${currentCategory === cat ? 'active' : ''}`;
    btn.textContent = tCat(cat);
    btn.onclick = function() { setCategory(cat, this); };
    wrapper.appendChild(btn);
  });
  
  // Update upload select (id="categoryInput" trong HTML)
  const uploadCat = document.getElementById('categoryInput');
  if (uploadCat && allCategories.length > 0) {
    uploadCat.innerHTML = allCategories.map(c => `<option value="${escHtml(c)}">${escHtml(tCat(c))}</option>`).join('') + `<option value="Khác">${t('other')}</option>`;
  }
}

function renderCollections() {
  const wrapper = document.getElementById('collectionsWrapper');
  const chipsContainer = document.getElementById('collectionsChips');
  if (allCollections.length === 0) {
    wrapper.style.display = 'none';
    return;
  }
  wrapper.style.display = 'block';
  let html = `<button class="filter-chip ${currentCollection === '' ? 'active' : ''}" onclick="setCollection('')">${t('allCollections')}</button>`;
  allCollections.forEach(c => {
    html += `<button class="filter-chip ${currentCollection === c.id ? 'active' : ''}" onclick="setCollection('${c.id}')">${escHtml(c.name)}</button>`;
  });
  chipsContainer.innerHTML = html;
}

function setCollection(colId) {
  currentCollection = colId;
  currentPage = 1;
  renderCollections();
  filterDocs();
}

function renderStats() {
  document.getElementById('totalDocs').textContent = allDocs.length;
  const total = allDocs.reduce((s, d) => s + d.size, 0);
  document.getElementById('totalSize').textContent = formatSize(total);
  document.getElementById('totalDownloads').textContent = allDocs.reduce((s, d) => s + (d.downloads||0), 0);
}

function filterDocs() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const sortBy = document.getElementById('sortSelect').value;
  const typeFilter = document.getElementById('typeFilter').value;
  
  let filtered = [...allDocs];
  
  // Lọc theo loại file
  if (typeFilter) {
    filtered = filtered.filter(d => {
      const ext = d.originalName.split('.').pop().toLowerCase();
      switch (typeFilter) {
        case 'pdf': return ext === 'pdf';
        case 'word': return ['doc', 'docx'].includes(ext);
        case 'excel': return ['xls', 'xlsx'].includes(ext);
        case 'ppt': return ['ppt', 'pptx'].includes(ext);
        case 'image': return IMAGE_EXTS.includes(ext);
        case 'text': return ['txt', 'md'].includes(ext);
        default: return true;
      }
    });
  }
  
  // Lọc theo bộ sưu tập
  if (currentCollection) {
    filtered = filtered.filter(d => d.collectionIds && d.collectionIds.includes(currentCollection));
  }
  
  // Lọc theo danh mục
  filtered = filtered.filter(d => {
    let matchCat = true;
    if (currentCategory === 'recent') {
      matchCat = true;
    } else if (currentCategory === 'Khác') {
      matchCat = !allCategories.includes(d.category);
    } else if (currentCategory) {
      matchCat = d.category === currentCategory;
    }
    const matchQ = !q || d.originalName.toLowerCase().includes(q) || (d.description||'').toLowerCase().includes(q);
    return matchCat && matchQ;
  });
  
  // Nếu chọn "Gần đây" và không có tìm kiếm, chỉ lấy top 10
  if (currentCategory === 'recent' && !q) {
    filtered = filtered.slice(0, 10);
  }
  
  // Sắp xếp: pinned luôn lên đầu, sau đó theo tiêu chí
  filtered.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    switch (sortBy) {
      case 'oldest': return new Date(a.uploadedAt) - new Date(b.uploadedAt);
      case 'name-asc': return a.originalName.localeCompare(b.originalName, 'vi');
      case 'name-desc': return b.originalName.localeCompare(a.originalName, 'vi');
      case 'downloads': return (b.downloads||0) - (a.downloads||0);
      case 'size-desc': return b.size - a.size;
      case 'size-asc': return a.size - b.size;
      default: return new Date(b.uploadedAt) - new Date(a.uploadedAt); // newest
    }
  });

  // Phân trang
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;
  
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageDocs = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  renderDocs(pageDocs);
  renderPagination(totalItems);
}

function setCategory(cat, el) {
  currentCategory = cat;
  currentPage = 1;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  
  // Cập nhật URL để người dùng có thể chia sẻ link
  const url = new URL(window.location);
  if (cat) {
    url.searchParams.set('cat', cat);
  } else {
    url.searchParams.delete('cat');
  }
  history.pushState({}, '', url);
  
  filterDocs();
}

function toggleMoreCategories() {
  const wrapper = document.getElementById('filterChipsWrapper');
  wrapper.classList.toggle('expanded');
  const btn = document.getElementById('moreCategoriesBtn');
  btn.textContent = wrapper.classList.contains('expanded') ? t('showLess') : '...';
}

function goToPage(page) {
  currentPage = page;
  filterDocs();
  // Cuộn lên phần danh sách tài liệu
  document.getElementById('docsGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderPagination(totalItems) {
  const container = document.getElementById('pagination');
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // Nút Trước
  html += `<button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;
  
  // Tính toán dải trang hiển thị (hiện tối đa 5 nút trang)
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  if (startPage > 1) {
    html += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
    if (startPage > 2) html += `<span class="page-dots">…</span>`;
  }
  
  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) html += `<span class="page-dots">…</span>`;
    html += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }
  
  // Nút Sau
  html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>›</button>`;
  
  container.innerHTML = html;
}

function renderDocs(docs) {
  const grid = document.getElementById('docsGrid');
  if (!docs.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="icon">📂</div>
      <h3>${t('emptyState')}</h3>
      <p>${t('emptyDesc')}</p>
    </div>`;
    return;
  }
  grid.innerHTML = docs.map(d => docCard(d)).join('');
  
  // Render PDF previews sau khi DOM đã được cập nhật
  renderPdfPreviews();
}

function docCard(d) {
  const ext = d.originalName.split('.').pop().toLowerCase();
  const [iconClass, emoji] = getIcon(ext);
  const date = new Date(d.uploadedAt).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US');

  // Nút xóa chỉ hiện khi đã đăng nhập admin
  const deleteBtn = isAdmin
    ? `<button class="btn btn-danger btn-sm" onclick="deleteDoc('${d.id}', event)">🗑</button>`
    : '';
    
  // Nút ghim chỉ hiện cho admin
  const pinBtn = isAdmin
    ? `<button class="pin-btn ${d.pinned ? 'pinned' : ''}" onclick="togglePin('${d.id}', event)" title="${d.pinned ? t('unpinTooltip') : t('pinTooltip')}">${d.pinned ? '📌' : '📌'}</button>`
    : '';
  
  // Badge ghim cho người dùng thường
  const pinBadge = (!isAdmin && d.pinned) ? `<span class="pin-badge" title="${t('pinnedBadge')}">📌</span>` : '';
  
  // Badge "Mới" nếu upload trong 3 ngày gần đây
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const isNew = new Date(d.uploadedAt) > threeDaysAgo;
  const newBadge = isNew ? `<span class="new-badge">${t('newBadge')}</span>` : '';

  // Xây dựng phần preview
  let previewHtml = '';
  if (IMAGE_EXTS.includes(ext)) {
    previewHtml = `<img src="/api/view/${d.id}" alt="${escHtml(d.originalName)}" loading="lazy">`;
  } else if (PDF_EXTS.includes(ext)) {
    previewHtml = `<canvas class="pdf-thumb" data-pdf-id="${d.id}"></canvas>`;
  } else {
    previewHtml = `<div class="doc-preview-icon">${emoji}</div>`;
  }

  const isChecked = selectedDocs.has(d.id);

  const checkboxHtml = isAdmin ? `<label class="doc-checkbox" onclick="event.stopPropagation()">
      <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleSelect('${d.id}', this)">
      <span class="checkmark"></span>
    </label>` : '';

  return `<div class="doc-card ${isChecked ? 'selected' : ''} ${d.pinned ? 'pinned-card' : ''}" data-id="${d.id}">
    ${checkboxHtml}
    <div class="doc-preview" onclick="viewDoc('${d.id}','${escHtml(d.originalName)}','${ext}')" style="cursor:pointer">
      ${previewHtml}
    </div>
    <div class="doc-body">
      <div class="doc-header">
        <div class="doc-icon ${iconClass}">${emoji}</div>
        <div class="doc-info">
          <div class="doc-name" title="${escHtml(d.originalName)}">${escHtml(d.originalName)}${newBadge}${pinBadge}</div>
          <div class="doc-meta">${formatSize(d.size)} • ${date} • 👁${d.views||0} • ⬇${d.downloads||0}</div>
        </div>
      </div>
      ${d.description ? `<div class="doc-description">${escHtml(d.description)}</div>` : ''}
      <div class="doc-footer">
        <span class="category-badge">${escHtml(tCat(d.category))}</span>
        <div class="doc-actions">
          ${pinBtn}
          <button class="btn btn-ghost btn-sm" onclick="viewDoc('${d.id}','${escHtml(d.originalName)}','${ext}')">👁 ${t('viewBtn')}</button>
          <a class="btn btn-ghost btn-sm" href="/api/download/${d.id}">⬇</a>
          ${deleteBtn}
        </div>
      </div>
    </div>
  </div>`;
}

// Global cache for PDF thumbnails to prevent heavy re-rendering
const pdfThumbCache = {};

/**
 * Render PDF previews trên tất cả canvas có class .pdf-thumb
 * Sử dụng pdf.js để vẽ trang đầu tiên của mỗi file PDF.
 */
function renderPdfPreviews() {
  if (typeof pdfjsLib === 'undefined') return;
  
  const canvases = document.querySelectorAll('.pdf-thumb[data-pdf-id]');
  canvases.forEach(canvas => {
    const docId = canvas.dataset.pdfId;
    if (!docId || canvas.dataset.rendered) return;
    canvas.dataset.rendered = 'true'; // Đánh dấu để tránh render lại
    
    // Nếu đã cache dataURL, nạp thẳng từ cache
    if (pdfThumbCache[docId] && typeof pdfThumbCache[docId] === 'string' && pdfThumbCache[docId] !== 'rendering' && pdfThumbCache[docId] !== 'error') {
       const img = new Image();
       img.onload = () => {
         canvas.width = img.width;
         canvas.height = img.height;
         canvas.getContext('2d').drawImage(img, 0, 0);
       };
       img.src = pdfThumbCache[docId];
       return;
    }
    
    // Nếu đang render, bỏ qua để tránh spam CPU
    if (pdfThumbCache[docId] === 'rendering') return;
    pdfThumbCache[docId] = 'rendering';
    
    const url = `/api/view/${docId}`;
    pdfjsLib.getDocument(url).promise.then(pdf => {
      return pdf.getPage(1);
    }).then(page => {
      // Tính toán scale dựa trên chiều rộng container
      const containerWidth = canvas.parentElement.clientWidth || 300;
      const viewport = page.getViewport({ scale: 1 });
      const scale = containerWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale });
      
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;
      
      const ctx = canvas.getContext('2d');
      return page.render({ canvasContext: ctx, viewport: scaledViewport }).promise.then(() => {
        const dataUrl = canvas.toDataURL();
        pdfThumbCache[docId] = dataUrl;
        
        // Cập nhật lại tất cả các canvas khác của cùng docId (trong trường hợp spam re-render)
        document.querySelectorAll(`.pdf-thumb[data-pdf-id="${docId}"]`).forEach(c => {
          if (c !== canvas) {
             const img = new Image();
             img.onload = () => {
               c.width = img.width;
               c.height = img.height;
               c.getContext('2d').drawImage(img, 0, 0);
             };
             img.src = dataUrl;
          }
        });
      });
    }).catch(() => {
      // Nếu lỗi, hiển thị icon thay thế
      canvas.parentElement.innerHTML = '<div class="doc-preview-icon">PDF</div>';
      pdfThumbCache[docId] = 'error';
    });
  });
}

function getIcon(ext) {
  if (['pdf'].includes(ext)) return ['icon-pdf', 'PDF'];
  if (['doc','docx'].includes(ext)) return ['icon-word', 'DOC'];
  if (['xls','xlsx'].includes(ext)) return ['icon-excel', 'XLS'];
  if (['ppt','pptx'].includes(ext)) return ['icon-ppt', 'PPT'];
  if (['png','jpg','jpeg','gif','webp','svg'].includes(ext)) return ['icon-image', '🖼'];
  return ['icon-text', 'TXT'];
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/1024/1024).toFixed(1) + ' MB';
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ========== VIEWER ==========

function viewDoc(id, name, ext) {
  currentViewerId = id;
  document.getElementById('viewerTitle').textContent = name;
  document.getElementById('viewerDownload').href = `/api/download/${id}`;
  const body = document.getElementById('viewerBody');
  const viewUrl = `/api/view/${id}`;
  const absoluteUrl = window.location.origin + viewUrl;
  
  const imageExts = ['png','jpg','jpeg','gif','webp','svg'];
  const pdfExt = ['pdf'];
  const officeExts = ['doc','docx','xls','xlsx','ppt','pptx'];
  
  if (pdfExt.includes(ext)) {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      body.innerHTML = `<div id="mobilePdfViewer" style="height:100%; overflow-y:auto; background:var(--surface2); padding:10px; text-align:center;"><div style="padding:20px;">${t('loadingPdf')}</div></div>`;
      renderFullPdf(viewUrl, 'mobilePdfViewer');
    } else {
      body.innerHTML = `<iframe src="${viewUrl}#toolbar=1" title="${escHtml(name)}" width="100%" height="100%" style="border:none;"></iframe>`;
    }
  } else if (imageExts.includes(ext)) {
    body.innerHTML = `<img src="${viewUrl}" alt="${escHtml(name)}">`;
  } else if (['txt','md'].includes(ext)) {
    body.innerHTML = `<iframe src="${viewUrl}" title="${escHtml(name)}"></iframe>`;
  } else if (officeExts.includes(ext)) {
    const msViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteUrl)}`;
    body.innerHTML = `<iframe src="${msViewer}" title="${escHtml(name)}" width="100%" height="100%" frameborder="0"></iframe>`;
  } else {
    body.innerHTML = `<div class="no-preview">
      <div class="icon">📄</div>
      <p>${t('noPreview', ext)}</p>
      <a class="btn btn-primary" href="/api/download/${id}">${t('downloadToOpen')}</a>
    </div>`;
  }
  document.getElementById('viewerModal').classList.add('open');
  // Reset comments sidebar state when opening
  const isMobile = window.innerWidth <= 768;
  const sidebar = document.getElementById('commentsSidebar');
  const btn = document.getElementById('toggleCommentsBtn');
  
  if (isMobile) {
    sidebar.classList.add('hidden');
    btn.innerHTML = `💬<span class="hide-on-mobile"> ${t('showComments')}</span>`;
  } else {
    sidebar.classList.remove('hidden');
    btn.innerHTML = `💬<span class="hide-on-mobile"> ${t('hideComments')}</span>`;
  }
  
  loadComments(id);
  
  // Update URL for deep linking
  const url = new URL(window.location);
  url.searchParams.set('doc', id);
  history.pushState({}, '', url);
}

function closeViewer() {
  currentViewerId = null;
  document.getElementById('viewerModal').classList.remove('open');
  document.getElementById('viewerBody').innerHTML = '';
  
  // Remove doc from URL
  const url = new URL(window.location);
  url.searchParams.delete('doc');
  history.pushState({}, '', url);
  
  loadDocs(); // Reload docs to update view count
}

document.getElementById('viewerModal').addEventListener('click', function(e) {
  if (e.target === this) closeViewer();
});

async function renderFullPdf(url, containerId) {
  if (typeof pdfjsLib === 'undefined') return;
  const container = document.getElementById(containerId);
  try {
    const pdf = await pdfjsLib.getDocument(url).promise;
    container.innerHTML = '';
    
    // Giới hạn hiển thị 20 trang đầu tiên trên mobile để tránh treo máy
    const maxPages = Math.min(pdf.numPages, 20); 
    
    for (let i = 1; i <= maxPages; i++) {
      const canvas = document.createElement('canvas');
      canvas.style.maxWidth = '100%';
      canvas.style.marginBottom = '12px';
      canvas.style.borderRadius = '4px';
      canvas.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      container.appendChild(canvas);
      
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 }); // Scale 1.5 để nét hơn trên mobile
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport: viewport }).promise;
    }
    
    if (pdf.numPages > 20) {
      const notice = document.createElement('div');
      notice.style.padding = '16px';
      notice.style.color = 'var(--muted)';
      notice.innerHTML = t('pdfTooLong');
      container.appendChild(notice);
    }
  } catch (e) {
    container.innerHTML = `<div style="padding:20px; color:var(--danger);">${t('pdfError')}</div>`;
  }
}

// ========== SELECTION ==========

function toggleSelect(id, checkbox) {
  if (checkbox.checked) {
    selectedDocs.add(id);
  } else {
    selectedDocs.delete(id);
  }
  // Toggle visual state on card
  const card = checkbox.closest('.doc-card');
  if (card) card.classList.toggle('selected', checkbox.checked);
  updateSelectionBar();
}

function selectAllOnPage() {
  const cards = document.querySelectorAll('.doc-card[data-id]');
  cards.forEach(card => {
    const id = card.dataset.id;
    selectedDocs.add(id);
    card.classList.add('selected');
    const cb = card.querySelector('input[type="checkbox"]');
    if (cb) cb.checked = true;
  });
  updateSelectionBar();
}

function clearSelection() {
  selectedDocs.clear();
  document.querySelectorAll('.doc-card.selected').forEach(c => {
    c.classList.remove('selected');
    const cb = c.querySelector('input[type="checkbox"]');
    if (cb) cb.checked = false;
  });
  updateSelectionBar();
}

function updateSelectionBar() {
  const bar = document.getElementById('selectionBar');
  const count = selectedDocs.size;
  if (count > 0) {
    bar.classList.add('show');
    document.getElementById('selectionCount').textContent = count;
  } else {
    bar.classList.remove('show');
  }
}

async function bulkDownload() {
  if (selectedDocs.size === 0) return;
  for (const id of selectedDocs) {
    // Tạo link tải ẩn và click
    const a = document.createElement('a');
    a.href = `/api/download/${id}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Đợi 300ms giữa các file để tránh chặn popup
    await new Promise(r => setTimeout(r, 300));
  }
  showToast(t('downloading', selectedDocs.size), 'success');
}

async function bulkDelete() {
  if (selectedDocs.size === 0) return;
  if (!confirm(t('confirmBulkDelete', selectedDocs.size))) return;
  
  let successCount = 0;
  for (const id of selectedDocs) {
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) successCount++;
      else if (res.status === 401) {
        showToast(t('needAdmin'), 'error');
        break;
      }
    } catch { /* ignore */ }
  }
  
  selectedDocs.clear();
  updateSelectionBar();
  if (successCount > 0) {
    showToast(t('bulkDeleted', successCount), 'success');
    loadDocs();
  }
}

// ========== DELETE ==========

async function deleteDoc(id, e) {
  e.stopPropagation();
  if (!confirm(t('confirmDelete'))) return;
  const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
  if (res.ok) { showToast(t('docDeleted'), 'success'); loadDocs(); }
  else if (res.status === 401) { showToast(t('needAdmin'), 'error'); }
  else showToast(t('deleteError'), 'error');
}

// ========== UPLOAD ==========

function toggleUpload() {
  if (!isAdmin) {
    openLogin();
    return;
  }
  uploadSection = !uploadSection;
  document.getElementById('uploadSection').style.display = uploadSection ? 'block' : 'none';
}

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault(); dropZone.classList.remove('dragover');
  uploadFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', () => uploadFiles(fileInput.files));

async function uploadFiles(files) {
  if (!files.length) return;
  const category = document.getElementById('categoryInput').value;
  const description = document.getElementById('descInput').value;
  const bar = document.getElementById('progressBar');
  const fill = document.getElementById('progressFill');
  bar.style.display = 'block';
  let done = 0;
  for (const file of files) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('category', category);
    fd.append('description', description);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.status === 401) {
        showToast(t('sessionExpired'), 'error');
        isAdmin = false;
        renderHeaderActions();
        break;
      }
      const data = await res.json();
      if (data.success) showToast(`✓ ${file.name}`, 'success');
      else showToast(data.error || t('uploadError'), 'error');
    } catch { showToast(t('connectionError'), 'error'); }
    done++;
    fill.style.width = (done / files.length * 100) + '%';
  }
  setTimeout(() => { bar.style.display = 'none'; fill.style.width = '0%'; }, 1000);
  fileInput.value = '';
  document.getElementById('descInput').value = '';
  loadDocs();
}

// ========== PIN ==========

async function togglePin(id, e) {
  e.stopPropagation();
  const doc = allDocs.find(d => d.id === id);
  if (!doc) return;
  
  const newPinned = !doc.pinned;
  try {
    const res = await fetch(`/api/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinned: newPinned }),
    });
    if (res.ok) {
      doc.pinned = newPinned;
      showToast(newPinned ? t('pinned') : t('unpinned'), 'success');
      filterDocs();
    } else if (res.status === 401) {
      showToast(t('needAdminPin'), 'error');
    }
  } catch {
    showToast(t('connectionError'), 'error');
  }
}

// ========== COPY LINK ==========
function copyLink(id) {
  const url = new URL(window.location);
  url.searchParams.set('doc', id);
  navigator.clipboard.writeText(url.toString()).then(() => {
    showToast(t('linkCopied'), 'success');
  });
}

// ========== COMMENTS & REACTIONS ==========
async function loadComments(docId) {
  try {
    const [commentsRes, statsRes] = await Promise.all([
      fetch(`/api/comments/${docId}`),
      fetch(`/api/comments/${docId}/stats`)
    ]);
    const comments = await commentsRes.json();
    const stats = await statsRes.json();
    
    document.getElementById('reactionStats').textContent = `👍 ${stats.likes} | 👎 ${stats.dislikes}`;
    
    const list = document.getElementById('commentsList');
    if (comments.filter(c => c.content).length === 0) {
      list.innerHTML = `<div style="color:var(--muted); font-size:13px; text-align:center;">${t('noComments')}</div>`;
      return;
    }
    
    list.innerHTML = comments.filter(c => c.content).map(c => `
      <div style="background:var(--surface2); padding:10px; border-radius:8px; font-size:13px; position:relative;">
        <div style="font-weight:600; color:var(--accent); margin-bottom:4px;">${escHtml(c.author)} <span style="color:var(--muted); font-weight:normal; font-size:11px;">${new Date(c.createdAt).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US')}</span></div>
        <div style="color:var(--text); line-height:1.4;">${escHtml(c.content)}</div>
        ${isAdmin ? `<button class="btn btn-ghost btn-sm" style="position:absolute; top:4px; right:4px; padding:2px; font-size:10px;" onclick="deleteComment('${c.id}', '${docId}')">${t('deleteCommentBtn')}</button>` : ''}
      </div>
    `).join('');
  } catch (e) {
    console.error(e);
  }
}

async function postComment() {
  if (!currentViewerId) return;
  const author = document.getElementById('commentAuthor').value;
  const content = document.getElementById('commentContent').value;
  if (!content.trim()) return showToast(t('commentEmpty'), 'error');
  
  try {
    const res = await fetch(`/api/comments/${currentViewerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, content })
    });
    if (res.ok) {
      document.getElementById('commentContent').value = '';
      loadComments(currentViewerId);
      showToast(t('commentSent'), 'success');
    }
  } catch {}
}

async function postReaction(type) {
  if (!currentViewerId) return;
  try {
    const res = await fetch(`/api/comments/${currentViewerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reaction: type })
    });
    if (res.ok) {
      loadComments(currentViewerId);
      showToast(t('reacted', type), 'success');
    }
  } catch {}
}

async function deleteComment(id, docId) {
  if (!confirm(t('confirmDeleteComment'))) return;
  try {
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadComments(docId);
      showToast(t('deleted'), 'success');
    }
  } catch {}
}

function toggleCommentsSidebar() {
  const sidebar = document.getElementById('commentsSidebar');
  const btn = document.getElementById('toggleCommentsBtn');
  if (sidebar.classList.contains('hidden')) {
    sidebar.classList.remove('hidden');
    btn.innerHTML = `💬<span class="hide-on-mobile"> ${t('hideComments')}</span>`;
  } else {
    sidebar.classList.add('hidden');
    btn.innerHTML = `💬<span class="hide-on-mobile"> ${t('showComments')}</span>`;
  }
}

// ========== ADMIN DASHBOARD ==========
function openAdminDashboard() {
  document.getElementById('adminDashboardModal').classList.add('open');
  // Update stats
  document.getElementById('dashTotalDocs').textContent = allDocs.length;
  const totalViews = allDocs.reduce((s, d) => s + (d.views||0), 0);
  const totalDLs = allDocs.reduce((s, d) => s + (d.downloads||0), 0);
  document.getElementById('dashTotalViews').textContent = totalViews;
  document.getElementById('dashTotalDownloads').textContent = totalDLs;
  
  renderAdminCollections();
  renderAdminCategories();
  loadAdminLogs();
}

function closeAdminDashboard() {
  document.getElementById('adminDashboardModal').classList.remove('open');
}

function renderAdminCategories() {
  const list = document.getElementById('adminCategoriesList');
  list.innerHTML = allCategories.map(c => `
    <div style="background:var(--surface); padding:4px 8px; border-radius:12px; display:flex; align-items:center; gap:8px; border:1px solid var(--border);">
      <span>${escHtml(c)}</span>
      <button class="btn btn-ghost btn-sm" style="color:var(--danger); padding:0 4px;" onclick="deleteCategory('${escHtml(c)}')">✕</button>
    </div>
  `).join('');
}

async function createCategory() {
  const name = document.getElementById('newCategoryName').value;
  if (!name.trim()) return;
  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      document.getElementById('newCategoryName').value = '';
      allCategories = (await res.json()).categories;
      renderAdminCategories();
      renderDynamicCategories();
      showToast(t('categoryAdded'), 'success');
    }
  } catch {}
}

async function deleteCategory(name) {
  if (!confirm(t('confirmDeleteCategory', name))) return;
  try {
    const res = await fetch('/api/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      allCategories = (await res.json()).categories;
      renderAdminCategories();
      renderDynamicCategories();
      showToast(t('categoryDeleted'), 'success');
    }
  } catch {}
}

async function loadAdminLogs() {
  try {
    const res = await fetch('/api/auth/logs');
    if (!res.ok) return;
    const logs = await res.json();
    const list = document.getElementById('adminLogsList');
    if (logs.length === 0) {
      list.innerHTML = `<div style="color:var(--muted); text-align:center;">${t('noLogs')}</div>`;
      return;
    }
    list.innerHTML = logs.map(l => `
      <div style="border-bottom:1px solid var(--border); padding-bottom:4px;">
        <span style="color:var(--muted);">${new Date(l.timestamp).toLocaleString(currentLang === 'vi' ? 'vi-VN' : 'en-US')}</span> - 
        <strong style="color:var(--accent);">${l.action}</strong>: 
        <span>${escHtml(l.details)}</span>
      </div>
    `).join('');
  } catch {}
}

function renderAdminCollections() {
  const list = document.getElementById('adminColsList');
  list.innerHTML = allCollections.map(c => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--surface2); padding:8px 12px; border-radius:8px;">
      <div>
        <strong style="color:var(--text);">${escHtml(c.name)}</strong>
        <div style="font-size:12px; color:var(--muted);">${allDocs.filter(d => d.collectionIds && d.collectionIds.includes(c.id)).length} ${t('docsCount')}</div>
      </div>
      <div>
        <button class="btn btn-ghost btn-sm" onclick="addSelectedToCol('${c.id}')">${t('addSelectedDocs')}</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCollection('${c.id}')">${t('deleteBtn')}</button>
      </div>
    </div>
  `).join('');
}

async function createCollection() {
  const name = document.getElementById('newColName').value;
  if (!name.trim()) return showToast(t('inputName'), 'error');
  try {
    const res = await fetch('/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      document.getElementById('newColName').value = '';
      await loadDocs(); // reload to get new collections
      renderAdminCollections();
      showToast(t('collectionCreated'), 'success');
    }
  } catch {}
}

async function deleteCollection(id) {
  if (!confirm(t('confirmDeleteCollection'))) return;
  try {
    const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadDocs();
      renderAdminCollections();
      showToast(t('collectionDeleted'), 'success');
    }
  } catch {}
}

async function addSelectedToCol(colId) {
  if (selectedDocs.size === 0) return showToast(t('noDocsSelected'), 'error');
  const docIds = Array.from(selectedDocs);
  try {
    const res = await fetch(`/api/collections/${colId}/docs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docIds })
    });
    if (res.ok) {
      await loadDocs();
      renderAdminCollections();
      clearSelection();
      showToast(t('addedToCollection'), 'success');
    }
  } catch {}
}

// ========== TOAST ==========

function showToast(msg, type='success') {
  const toastEl = document.getElementById('toast');
  toastEl.textContent = msg; toastEl.className = `toast ${type}`;
  setTimeout(() => toastEl.classList.add('show'), 10);
  setTimeout(() => toastEl.classList.remove('show'), 2800);
}

async function saveGlobalSettings() {
  const formData = new FormData();
  formData.append('appName', document.getElementById('settingAppName').value);
  formData.append('hideAppName', document.getElementById('settingHideAppName').checked ? 'true' : 'false');
  formData.append('bgColor', document.getElementById('settingBgColor').value);
  formData.append('theme', document.getElementById('settingTheme').value);
  
  if (document.getElementById('settingClearLogo').checked) formData.append('clearLogo', 'true');
  if (document.getElementById('settingClearBgImage').checked) formData.append('clearBgImage', 'true');
  
  const logoFile = document.getElementById('settingLogo').files[0];
  if (logoFile) formData.append('logo', logoFile);
  
  const bgFile = document.getElementById('settingBgImage').files[0];
  if (bgFile) formData.append('bgImage', bgFile);
  
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      applyGlobalSettings(data.settings);
      showToast(t('settingsSaved'), 'success');
      
      // Reset file inputs
      document.getElementById('settingLogo').value = '';
      document.getElementById('settingBgImage').value = '';
      document.getElementById('settingClearLogo').checked = false;
      document.getElementById('settingClearBgImage').checked = false;
    } else {
      showToast(t('settingsFailed'), 'error');
    }
  } catch {
    showToast(t('connectionError'), 'error');
  }
}

function applyGlobalSettings(settings) {
  if (!settings) return;
  // Update App Name
  document.title = settings.appName || 'DocShare';
  document.getElementById('settingAppName').value = settings.appName || '';
  const hideAppNameCb = document.getElementById('settingHideAppName');
  if (hideAppNameCb) hideAppNameCb.checked = settings.hideAppName === 'true';
  
  // Update Logo
  const logoDivs = document.querySelectorAll('.logo');
  let iconHtml = '';
  if (settings.logoUrl) {
    iconHtml = `<img src="${settings.logoUrl}" alt="Icon" style="max-height: 32px; vertical-align: middle; margin-right: 8px; border-radius: 4px;">`;
  }
  
  let textHtml = '';
  if (settings.hideAppName !== 'true') {
    textHtml = escHtml(settings.appName || 'DocShare');
    if (textHtml === 'DocShare') textHtml = 'Doc<span>Share</span>';
  }
  
  logoDivs.forEach(div => {
    div.innerHTML = `${iconHtml}${textHtml}`;
  });
  
  // Update Background Color
  if (settings.bgColor) {
    document.body.style.backgroundColor = settings.bgColor;
    document.getElementById('settingBgColor').value = settings.bgColor;
  } else {
    document.body.style.backgroundColor = '';
    document.getElementById('settingBgColor').value = '#121212';
  }
  
  // Update Theme (must be applied BEFORE background image so overlay color is correct)
  const theme = settings.theme || 'dark';
  document.getElementById('settingTheme').value = theme;
  document.body.classList.remove('light-theme', 'blue-theme', 'green-theme', 'pink-theme', 'purple-theme', 'orange-theme', 'red-theme');
  if (theme !== 'dark') {
    document.body.classList.add(`${theme}-theme`);
  }

  // Update Background Image
  if (settings.bgImageUrl) {
    // Use theme-appropriate overlay for readability
    const isLight = theme === 'light';
    const overlay = isLight
      ? 'rgba(245, 245, 240, 0.82)'
      : 'rgba(0, 0, 0, 0.65)';
    document.body.style.backgroundImage = `linear-gradient(${overlay}, ${overlay}), url('${settings.bgImageUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  } else {
    document.body.style.backgroundImage = '';
  }
}

// ========== INIT ==========

async function init() {
  // Load settings first
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const settings = await res.json();
      applyGlobalSettings(settings);
    }
  } catch {}
  
  await checkAuth();
  
  // Đọc danh mục từ URL (hỗ trợ chia sẻ link)
  const urlParams = new URLSearchParams(window.location.search);
  const urlCat = urlParams.get('cat');
  if (urlCat) {
    currentCategory = urlCat;
    // Tìm và highlight chip tương ứng
    document.querySelectorAll('.filter-chip').forEach(c => {
      c.classList.remove('active');
      // So sánh nội dung text với danh mục (cho các chip hiện sẵn)
      if (c.textContent.trim() === urlCat || 
          (urlCat === 'recent' && c.textContent.trim() === 'Gần đây') ||
          (urlCat === '' && c.textContent.trim() === 'Tất cả')) {
        c.classList.add('active');
      }
    });
  }
  
  await loadDocs();
  
  // Xử lý chia sẻ link tài liệu (Deep linking)
  const urlDoc = urlParams.get('doc');
  if (urlDoc) {
    const doc = allDocs.find(d => d.id === urlDoc);
    if (doc) {
      const ext = doc.originalName.split('.').pop().toLowerCase();
      viewDoc(doc.id, doc.originalName, ext);
    }
  }
}

// Hỗ trợ nút Back/Forward trình duyệt
window.addEventListener('popstate', () => {
  const urlParams = new URLSearchParams(window.location.search);
  currentCategory = urlParams.get('cat') || '';
  currentPage = 1;
  filterDocs();
});

init();
