const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testProductOperations() {
  console.log('Testing Product Operations...\n');
  
  console.log('1. Creating a new product...');
  try {
    const newProduct = {
      name: 'Test Product',
      description: 'A product for testing',
      price: 99.99
    };
    
    const createResponse = await axios.post(`${BASE_URL}/products`, newProduct);
    console.log('✓ Product created successfully:', createResponse.data);
    const productId = createResponse.data.id;
    
    console.log('\n2. Getting all products...');
    const getAllResponse = await axios.get(`${BASE_URL}/products`);
    console.log('✓ Retrieved', getAllResponse.data.length, 'products');
    
    console.log('\n3. Getting single product...');
    const getOneResponse = await axios.get(`${BASE_URL}/products/${productId}`);
    console.log('✓ Retrieved product:', getOneResponse.data.name);
    
    console.log('\n4. Updating product...');
    const updateData = {
      name: 'Updated Test Product',
      price: 149.99
    };
    const updateResponse = await axios.put(`${BASE_URL}/products/${productId}`, updateData);
    console.log('✓ Product updated:', updateResponse.data);
    
    console.log('\n5. Deleting product...');
    const deleteResponse = await axios.delete(`${BASE_URL}/products/${productId}`);
    console.log('✓ Product deleted:', deleteResponse.data);
    
    console.log('\n6. Verifying product deletion...');
    try {
      await axios.get(`${BASE_URL}/products/${productId}`);
      console.log('✗ Product still exists after deletion');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✓ Product successfully deleted (not found)');
      } else {
        console.log('✗ Unexpected error when checking for deleted product:', error.message);
      }
    }
    
    console.log('\n✓ All product operations completed successfully!');
  } catch (error) {
    console.error('✗ Error during product operations:', error.response ? error.response.data : error.message);
  }
}

async function testSpecificProductUpdate(productId) {
  console.log(`\nTesting update of specific product ID: ${productId}...\n`);
  
  try {
    console.log('1. Getting current product data...');
    const getProductResponse = await axios.get(`${BASE_URL}/products/${productId}`);
    console.log('✓ Current product data:', getProductResponse.data);
    
    console.log('\n2. Updating product with ID:', productId);
    const updateData = {
      name: 'Updated Product Name via ID',
      price: 199.99
    };
    
    const updateResponse = await axios.put(`${BASE_URL}/products/${productId}`, updateData);
    console.log('✓ Product with ID', productId, 'updated successfully:', updateResponse.data);
    
    console.log('\n3. Verifying update...');
    const verifyResponse = await axios.get(`${BASE_URL}/products/${productId}`);
    console.log('✓ Updated product data:', verifyResponse.data);
    
    console.log('\n✓ Specific product update test completed successfully!');
  } catch (error) {
    console.error('✗ Error during specific product update test:', error.response ? error.response.data : error.message);
  }
}

async function runAllTests() {
  await testProductOperations();
  await testSpecificProductUpdate(2);
}

runAllTests();