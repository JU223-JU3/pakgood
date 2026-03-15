// Supabase 配置 - 从 localStorage 读取或使用配置
let SUPABASE_URL = localStorage.getItem('https://wzqpqrgzftrpkyfzqsan.supabase.co') || '';
let SUPABASE_ANON_KEY = localStorage.getItem('sb_publishable_4oQBRHy0HFCJlsHfL506ng_3gjoJxwG') || '';

let supabaseClient = null;

// 检查 Supabase 是否配置
function isSupabaseConfigured() {
  return SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' && 
         SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';
}

// 保存 Supabase 配置
function setSupabaseConfig(url, key) {
  SUPABASE_URL = url;
  SUPABASE_ANON_KEY = key;
  localStorage.setItem('SUPABASE_URL', url);
  localStorage.setItem('SUPABASE_ANON_KEY', key);
  initSupabase();
}

// 初始化 Supabase 客户端
function initSupabase() {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase 未配置');
    return null;
  }
  
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase 初始化成功');
    return supabaseClient;
  }
  console.error('Supabase 库未加载');
  return null;
}

// 获取 Supabase 客户端
function getSupabase() {
  if (!supabaseClient) {
    initSupabase();
  }
  return supabaseClient;
}

// ==================== 业主凭证相关函数 ====================

// 获取所有业主凭证
async function getOwnerCredentials() {
  const supabase = getSupabase();
  if (!supabase) return {};
  
  try {
    const { data, error } = await supabase
      .from('owner_credentials')
      .select('owner_id, password_hash');
    
    if (error) {
      console.error('获取业主凭证失败:', error);
      return {};
    }
    
    const credentials = {};
    data.forEach(item => {
      credentials[item.owner_id] = item.password_hash;
    });
    return credentials;
  } catch (e) {
    console.error('获取业主凭证异常:', e);
    return {};
  }
}

// 添加业主凭证
async function addOwnerCredential(ownerId, passwordHash) {
  const supabase = getSupabase();
  if (!supabase) return false;
  
  try {
    const { data, error } = await supabase
      .from('owner_credentials')
      .upsert([
        { owner_id: ownerId, password_hash: passwordHash }
      ]);
    
    if (error) {
      console.error('添加业主凭证失败:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('添加业主凭证异常:', e);
    return false;
  }
}

// 删除业主凭证
async function deleteOwnerCredential(ownerId) {
  const supabase = getSupabase();
  if (!supabase) return false;
  
  try {
    const { error } = await supabase
      .from('owner_credentials')
      .delete()
      .eq('owner_id', ownerId);
    
    if (error) {
      console.error('删除业主凭证失败:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('删除业主凭证异常:', e);
    return false;
  }
}

// ==================== 商品数据相关函数 ====================

// 获取所有业主的商品数据
async function getAllProducts() {
  const supabase = getSupabase();
  if (!supabase) return {};
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('获取商品数据失败:', error);
      return {};
    }
    
    const allProducts = {};
    data.forEach(product => {
      if (!allProducts[product.owner_id]) {
        allProducts[product.owner_id] = [];
      }
      allProducts[product.owner_id].push({
        id: product.id,
        name: product.name,
        link: product.link || '',
        checked: product.checked || false,
        updatedAt: product.updated_at,
        brand: product.brand || '',
        size: product.size || { length: '', width: '', height: '' },
        image: product.image || '',
        notes: product.notes || ''
      });
    });
    return allProducts;
  } catch (e) {
    console.error('获取商品数据异常:', e);
    return {};
  }
}

// 获取指定业主的商品数据
async function getOwnerProducts(ownerId) {
  const supabase = getSupabase();
  if (!supabase) return [];
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('owner_id', ownerId);
    
    if (error) {
      console.error('获取业主商品失败:', error);
      return [];
    }
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      link: product.link || '',
      checked: product.checked || false,
      updatedAt: product.updated_at,
      brand: product.brand || '',
      size: product.size || { length: '', width: '', height: '' },
      image: product.image || '',
      notes: product.notes || ''
    }));
  } catch (e) {
    console.error('获取业主商品异常:', e);
    return [];
  }
}

// 保存商品数据
async function saveProducts(ownerId, products) {
  const supabase = getSupabase();
  if (!supabase) return false;
  
  try {
    const now = new Date().toISOString();
    
    const productData = products.map(product => ({
      id: product.id,
      owner_id: ownerId,
      name: product.name,
      link: product.link,
      checked: product.checked,
      updated_at: product.updatedAt || now,
      brand: product.brand,
      size: product.size,
      image: product.image,
      notes: product.notes
    }));
    
    const { error } = await supabase
      .from('products')
      .upsert(productData);
    
    if (error) {
      console.error('保存商品失败:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('保存商品异常:', e);
    return false;
  }
}

// 删除商品
async function deleteProduct(productId) {
  const supabase = getSupabase();
  if (!supabase) return false;
  
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (error) {
      console.error('删除商品失败:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('删除商品异常:', e);
    return false;
  }
}

// ==================== 管理员日志相关函数 ====================

// 获取管理员日志
async function getAdminLogs() {
  const supabase = getSupabase();
  if (!supabase) return [];
  
  try {
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error('获取日志失败:', error);
      return [];
    }
    
    return data.map(log => ({
      type: log.type,
      timestamp: log.timestamp,
      action: log.action
    }));
  } catch (e) {
    console.error('获取日志异常:', e);
    return [];
  }
}

// 添加管理员日志
async function addAdminLog(logEntry) {
  const supabase = getSupabase();
  if (!supabase) return false;
  
  try {
    const { error } = await supabase
      .from('admin_logs')
      .insert([{
        type: logEntry.type,
        timestamp: logEntry.timestamp,
        action: logEntry.action
      }]);
    
    if (error) {
      console.error('添加日志失败:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('添加日志异常:', e);
    return false;
  }
}

// 清空管理员日志
async function clearAdminLogs() {
  const supabase = getSupabase();
  if (!supabase) return false;
  
  try {
    const { error } = await supabase
      .from('admin_logs')
      .delete()
      .not('id', 'is', null);
    
    if (error) {
      console.error('清空日志失败:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('清空日志异常:', e);
    return false;
  }
}

// ==================== 数据迁移辅助函数 ====================

// 从 localStorage 迁移数据到 Supabase
async function migrateFromLocalStorage() {
  console.log('开始从 localStorage 迁移数据...');
  
  // 迁移业主凭证
  const localOwnerCredentials = JSON.parse(localStorage.getItem('ownerCredentials')) || {};
  for (const [ownerId, passwordHash] of Object.entries(localOwnerCredentials)) {
    await addOwnerCredential(ownerId, passwordHash);
  }
  
  // 迁移商品数据
  const localAllProducts = JSON.parse(localStorage.getItem('products')) || {};
  for (const [ownerId, products] of Object.entries(localAllProducts)) {
    await saveProducts(ownerId, products);
  }
  
  // 迁移管理员日志
  const localLogs = JSON.parse(localStorage.getItem('adminLogs')) || [];
  for (const log of localLogs) {
    await addAdminLog(log);
  }
  
  console.log('数据迁移完成');
}

// 初始化配置 - 用户需要先配置
function configureSupabase(url, key) {
  window.SUPABASE_URL = url;
  window.SUPABASE_ANON_KEY = key;
  initSupabase();
}
