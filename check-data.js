// 检查localStorage中的数据
console.log('=== 检查localStorage数据 ===');

// 检查products数据
const products = localStorage.getItem('products');
console.log('Products数据:', products);

if (products) {
  const parsedProducts = JSON.parse(products);
  console.log('解析后的Products:', parsedProducts);
  
  // 遍历每个业主的商品
  Object.keys(parsedProducts).forEach(ownerId => {
    console.log(`\n=== 业主 ${ownerId} 的商品 ===`);
    parsedProducts[ownerId].forEach(product => {
      console.log(`商品: ${product.name}`);
      console.log(`图片URL: ${product.image}`);
      console.log(`是否有图片: ${!!product.image}`);
    });
  });
}

// 检查ownerCredentials数据
const ownerCredentials = localStorage.getItem('ownerCredentials');
console.log('\n=== Owner Credentials ===');
console.log(ownerCredentials);

// 检查currentOwnerId
const currentOwnerId = localStorage.getItem('currentOwnerId');
console.log('\n=== Current Owner ID ===');
console.log(currentOwnerId);
