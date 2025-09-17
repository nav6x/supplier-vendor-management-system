const API_BASE_URL = 'http://localhost:3000/api';

let currentUser = null;
let authToken = null;

const loginLink = document.getElementById('loginLink');
const logoutLink = document.getElementById('logoutLink');
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const loginForm = document.getElementById('loginForm');
const content = document.getElementById('content');
const mainNav = document.querySelectorAll('#mainNav a');

loginLink.addEventListener('click', () => {
    loginModal.show();
});

logoutLink.addEventListener('click', logout);

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.access_token;
            
            const payload = JSON.parse(atob(authToken.split('.')[1]));
            currentUser = { 
                id: payload.sub, 
                username: payload.username, 
                roleId: payload.roleId 
            };
            
            console.log('Current user:', currentUser);
            
            loginModal.hide();
            loginLink.classList.add('d-none');
            logoutLink.classList.remove('d-none');
            
            const userManagementNav = document.getElementById('userManagementNav');
            if (currentUser.roleId === 1) {
                userManagementNav.style.display = 'block';
            } else {
                userManagementNav.style.display = 'none';
            }
            
            showDashboard();
        } else {
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login.');
    }
});

mainNav.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = e.target.getAttribute('data-view');
        switch (view) {
            case 'dashboard':
                showDashboard();
                break;
            case 'suppliers':
                showSuppliers();
                break;
            case 'products':
                showProducts();
                break;
            case 'purchase-orders':
                showPurchaseOrders();
                break;
            case 'invoices':
                showInvoices();
                break;
            case 'reports':
                showReports();
                break;
            case 'user-management':
                showUserManagement();
                break;
        }
    });
});

function showDashboard() {
    content.innerHTML = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <h2 class="mb-4">Dashboard</h2>
                </div>
            </div>
            
            <div class="row g-4">
                <div class="col-md-6 col-lg-4">
                    <div class="card border-primary h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title text-primary">
                                <i class="bi bi-building me-2"></i>Suppliers
                            </h5>
                            <p class="card-text">Manage your supplier information and contacts.</p>
                            <button class="btn btn-outline-primary" data-view="suppliers">
                                <i class="bi bi-eye me-1"></i>View Suppliers
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 col-lg-4">
                    <div class="card border-success h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title text-success">
                                <i class="bi bi-box-seam me-2"></i>Products
                            </h5>
                            <p class="card-text">Manage your product catalog and categories.</p>
                            <button class="btn btn-outline-success" data-view="products">
                                <i class="bi bi-eye me-1"></i>View Products
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 col-lg-4">
                    <div class="card border-info h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title text-info">
                                <i class="bi bi-file-earmark-text me-2"></i>Purchase Orders
                            </h5>
                            <p class="card-text">Create and manage purchase orders.</p>
                            <button class="btn btn-outline-info" data-view="purchase-orders">
                                <i class="bi bi-eye me-1"></i>View POs
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 col-lg-4">
                    <div class="card border-warning h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title text-warning">
                                <i class="bi bi-receipt me-2"></i>Invoices
                            </h5>
                            <p class="card-text">Manage invoices and payments.</p>
                            <button class="btn btn-outline-warning" data-view="invoices">
                                <i class="bi bi-eye me-1"></i>View Invoices
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 col-lg-4">
                    <div class="card border-danger h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title text-danger">
                                <i class="bi bi-graph-up me-2"></i>Reports
                            </h5>
                            <p class="card-text">View system reports and analytics.</p>
                            <button class="btn btn-outline-danger" data-view="reports">
                                <i class="bi bi-eye me-1"></i>View Reports
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    content.querySelectorAll('button[data-view]').forEach(button => {
        button.addEventListener('click', (e) => {
            const view = e.target.getAttribute('data-view') || e.target.closest('button').getAttribute('data-view');
            switch (view) {
                case 'suppliers':
                    showSuppliers();
                    break;
                case 'products':
                    showProducts();
                    break;
                case 'purchase-orders':
                    showPurchaseOrders();
                    break;
                case 'invoices':
                    showInvoices();
                    break;
                case 'reports':
                    showReports();
                    break;
            }
        });
    });
}

function showSuppliers() {
    content.innerHTML = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>
                            <i class="bi bi-building me-2"></i>Suppliers
                        </h2>
                        <button class="btn btn-primary" id="addSupplierBtn">
                            <i class="bi bi-plus-lg me-1"></i>Add New Supplier
                        </button>
                    </div>
                    
                    <div class="card border-primary">
                        <div class="card-header bg-primary text-white">
                            <i class="bi bi-list me-2"></i>Supplier List
                        </div>
                        <div class="card-body">
                            <div id="suppliersList">
                                <div class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <p class="mt-2">Loading suppliers...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadSuppliers();
    
    document.getElementById('addSupplierBtn').addEventListener('click', showAddSupplierForm);
}

function showAddSupplierForm() {
    content.innerHTML = `
        <h2>Add New Supplier</h2>
        <form id="addSupplierForm">
            <div class="mb-3">
                <label for="supplierName" class="form-label">Name</label>
                <input type="text" class="form-control" id="supplierName" required>
            </div>
            <div class="mb-3">
                <label for="supplierEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="supplierEmail" required>
            </div>
            <div class="mb-3">
                <label for="supplierContact" class="form-label">Contact Person</label>
                <input type="text" class="form-control" id="supplierContact">
            </div>
            <div class="mb-3">
                <label for="supplierPhone" class="form-label">Phone</label>
                <input type="text" class="form-control" id="supplierPhone">
            </div>
            <div class="mb-3">
                <label for="supplierAddress" class="form-label">Address</label>
                <textarea class="form-control" id="supplierAddress" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Save Supplier</button>
            <button type="button" class="btn btn-secondary" id="cancelAddSupplier">Cancel</button>
        </form>
    `;
    
    document.getElementById('addSupplierForm').addEventListener('submit', addSupplier);
    document.getElementById('cancelAddSupplier').addEventListener('click', showSuppliers);
}

async function loadSuppliers() {
    try {
        const response = await fetch(`${API_BASE_URL}/suppliers`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const suppliers = await response.json();
            displaySuppliers(suppliers);
        } else {
            document.getElementById('suppliersList').innerHTML = '<p>Failed to load suppliers.</p>';
        }
    } catch (error) {
        console.error('Error loading suppliers:', error);
        document.getElementById('suppliersList').innerHTML = '<p>Error loading suppliers.</p>';
    }
}

function displaySuppliers(suppliers) {
    const suppliersList = document.getElementById('suppliersList');
    
    if (suppliers.length === 0) {
        suppliersList.innerHTML = '<p>No suppliers found.</p>';
        return;
    }
    
    let html = '<div class="row">';
    suppliers.forEach(supplier => {
        html += `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${supplier.name}</h5>
                        <p class="card-text">
                            <strong>Email:</strong> ${supplier.email}<br>
                            <strong>Contact:</strong> ${supplier.contactPerson || 'N/A'}<br>
                            <strong>Phone:</strong> ${supplier.phone || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    suppliersList.innerHTML = html;
}

async function addSupplier(e) {
    e.preventDefault();
    
    const supplierData = {
        name: document.getElementById('supplierName').value,
        email: document.getElementById('supplierEmail').value,
        contactPerson: document.getElementById('supplierContact').value,
        phone: document.getElementById('supplierPhone').value,
        address: document.getElementById('supplierAddress').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/suppliers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(supplierData)
        });
        
        if (response.ok) {
            alert('Supplier added successfully!');
            showSuppliers();
        } else {
            alert('Failed to add supplier.');
        }
    } catch (error) {
        console.error('Error adding supplier:', error);
        alert('Error adding supplier.');
    }
}

function showProducts() {
    content.innerHTML = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>
                            <i class="bi bi-box-seam me-2"></i>Products
                        </h2>
                        <div class="btn-group">
                            <button class="btn btn-primary" id="addProductBtn">
                                <i class="bi bi-plus-lg me-1"></i>Add New Product
                            </button>
                            <button class="btn btn-secondary" id="manageCategoriesBtn">
                                <i class="bi bi-tags me-1"></i>Manage Categories
                            </button>
                        </div>
                    </div>
                    
                    <div class="card border-success">
                        <div class="card-header bg-success text-white">
                            <i class="bi bi-list me-2"></i>Product Catalog
                        </div>
                        <div class="card-body">
                            <div id="productsList">
                                <div class="text-center py-5">
                                    <div class="spinner-border text-success" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <p class="mt-2">Loading products...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadProducts();
    
    document.getElementById('addProductBtn').addEventListener('click', showAddProductForm);
    document.getElementById('manageCategoriesBtn').addEventListener('click', showManageCategories);
}

function showAddProductForm() {
    content.innerHTML = `
        <h2>Add New Product</h2>
        <form id="addProductForm">
            <div class="mb-3">
                <label for="productName" class="form-label">Name</label>
                <input type="text" class="form-control" id="productName" required>
            </div>
            <div class="mb-3">
                <label for="productDescription" class="form-label">Description</label>
                <textarea class="form-control" id="productDescription" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <label for="productPrice" class="form-label">Price</label>
                <input type="number" class="form-control" id="productPrice" step="0.01" min="0" required>
            </div>
            <div class="mb-3">
                <label for="productCategory" class="form-label">Category</label>
                <select class="form-select" id="productCategory" required>
                    <option value="">Select a category</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Save Product</button>
            <button type="button" class="btn btn-secondary" id="cancelAddProduct">Cancel</button>
        </form>
    `;
    
    loadCategoriesForProductForm();
    
    document.getElementById('addProductForm').addEventListener('submit', addProduct);
    document.getElementById('cancelAddProduct').addEventListener('click', showProducts);
}

async function loadCategoriesForProductForm() {
    try {
        console.log('Loading categories with auth token:', authToken);
        const response = await fetch(`${API_BASE_URL}/products/categories`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        console.log('Categories response status:', response.status);
        
        if (response.ok) {
            const categories = await response.json();
            console.log('Categories loaded:', categories);
            const select = document.getElementById('productCategory');
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        } else {
            console.log('Categories response error:', response.status, response.statusText);
            const errorText = await response.text();
            console.log('Categories error details:', errorText);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const products = await response.json();
            displayProducts(products);
        } else {
            document.getElementById('productsList').innerHTML = '<p>Failed to load products.</p>';
        }
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsList').innerHTML = '<p>Error loading products.</p>';
    }
}

function displayProducts(products) {
    const productsList = document.getElementById('productsList');
    
    if (products.length === 0) {
        productsList.innerHTML = '<p>No products found.</p>';
        return;
    }
    
    let html = '<div class="row">';
    products.forEach(product => {
        html += `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">
                            <strong>Description:</strong> ${product.description || 'N/A'}<br>
                            <strong>Price:</strong> ${parseFloat(product.price).toFixed(2)}<br>
                        </p>
                        <button class="btn btn-sm btn-primary edit-product-btn" data-id="${product.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-product-btn" data-id="${product.id}">Delete</button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    productsList.innerHTML = html;
    
    document.querySelectorAll('.edit-product-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-product-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
}

async function addProduct(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value)
    };
    
    const categoryId = document.getElementById('productCategory').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            const product = await response.json();
            
            if (categoryId) {
                await assignProductToCategory(product.id, categoryId);
            }
            
            alert('Product added successfully!');
            showProducts();
        } else {
            const error = await response.text();
            alert(`Failed to add product: ${error}`);
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Error adding product.');
    }
}

async function assignProductToCategory(productId, categoryId) {
    console.log(`Would assign product ${productId} to category ${categoryId}`);
}

function editProduct(productId) {
    alert(`Edit functionality for product ID ${productId} would be implemented here.`);
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            alert('Product deleted successfully!');
            showProducts();
        } else {
            const error = await response.text();
            alert(`Failed to delete product: ${error}`);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product.');
    }
}

function showManageCategories() {
    content.innerHTML = `
        <h2>Manage Categories</h2>
        <button class="btn btn-primary mb-3" id="addCategoryBtn">Add New Category</button>
        <div id="categoriesList">
            <p>Loading categories...</p>
        </div>
    `;
    
    loadCategories();
    
    document.getElementById('addCategoryBtn').addEventListener('click', showAddCategoryForm);
}

function showAddCategoryForm() {
    content.innerHTML = `
        <h2>Add New Category</h2>
        <form id="addCategoryForm">
            <div class="mb-3">
                <label for="categoryName" class="form-label">Name</label>
                <input type="text" class="form-control" id="categoryName" required>
            </div>
            <button type="submit" class="btn btn-primary">Save Category</button>
            <button type="button" class="btn btn-secondary" id="cancelAddCategory">Cancel</button>
        </form>
    `;
    
    document.getElementById('addCategoryForm').addEventListener('submit', addCategory);
    document.getElementById('cancelAddCategory').addEventListener('click', showManageCategories);
}

async function loadCategories() {
    try {
        console.log('Loading categories with auth token:', authToken);
        const response = await fetch(`${API_BASE_URL}/products/categories`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        console.log('Categories response status:', response.status);
        
        if (response.ok) {
            const categories = await response.json();
            console.log('Categories loaded:', categories);
            displayCategories(categories);
        } else {
            console.log('Categories response error:', response.status, response.statusText);
            const errorText = await response.text();
            console.log('Categories error details:', errorText);
            document.getElementById('categoriesList').innerHTML = '<p>Failed to load categories.</p>';
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        document.getElementById('categoriesList').innerHTML = '<p>Error loading categories.</p>';
    }
}

function displayCategories(categories) {
    const categoriesList = document.getElementById('categoriesList');
    
    if (categories.length === 0) {
        categoriesList.innerHTML = '<p>No categories found.</p>';
        return;
    }
    
    let html = '<div class="row">';
    categories.forEach(category => {
        html += `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${category.name}</h5>
                        <button class="btn btn-sm btn-danger delete-category-btn" data-id="${category.id}">Delete</button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    categoriesList.innerHTML = html;
    
    document.querySelectorAll('.delete-category-btn').forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-id');
            deleteCategory(categoryId);
        });
    });
}

async function addCategory(e) {
    e.preventDefault();
    
    const categoryData = {
        name: document.getElementById('categoryName').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(categoryData)
        });
        
        if (response.ok) {
            alert('Category added successfully!');
            showManageCategories();
        } else {
            const error = await response.text();
            alert(`Failed to add category: ${error}`);
        }
    } catch (error) {
        console.error('Error adding category:', error);
        alert('Error adding category.');
    }
}

async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            alert('Category deleted successfully!');
            showManageCategories();
        } else {
            const error = await response.text();
            alert(`Failed to delete category: ${error}`);
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category.');
    }
}

function showPurchaseOrders() {
    content.innerHTML = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>
                            <i class="bi bi-file-earmark-text me-2"></i>Purchase Orders
                        </h2>
                        <button class="btn btn-primary" id="createPOBtn">
                            <i class="bi bi-plus-lg me-1"></i>Create New PO
                        </button>
                    </div>
                    
                    <div class="card border-info">
                        <div class="card-header bg-info text-white">
                            <i class="bi bi-list me-2"></i>Purchase Order List
                        </div>
                        <div class="card-body">
                            <div id="purchaseOrdersList">
                                <div class="text-center py-5">
                                    <div class="spinner-border text-info" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <p class="mt-2">Loading purchase orders...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadPurchaseOrders();
    
    document.getElementById('createPOBtn').addEventListener('click', showCreatePOForm);
}

function showCreatePOForm() {
    content.innerHTML = `
        <h2>Create New Purchase Order</h2>
        <form id="createPOForm">
            <div class="mb-3">
                <label for="supplierSelect" class="form-label">Supplier</label>
                <select class="form-select" id="supplierSelect" required>
                    <option value="">Select a supplier</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="orderDate" class="form-label">Order Date</label>
                <input type="date" class="form-control" id="orderDate" required>
            </div>
            <div class="mb-3">
                <h5>Items</h5>
                <div id="poItems">
                    <div class="po-item row mb-2">
                        <div class="col-md-4">
                            <select class="form-select product-select" required>
                                <option value="">Select a product</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <input type="number" class="form-control quantity-input" placeholder="Quantity" min="1" required>
                        </div>
                        <div class="col-md-3">
                            <input type="number" class="form-control price-input" placeholder="Unit Price" step="0.01" min="0" required>
                        </div>
                        <div class="col-md-2">
                            <button type="button" class="btn btn-danger remove-item">Remove</button>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn btn-secondary" id="addItemBtn">Add Item</button>
            </div>
            <button type="submit" class="btn btn-primary">Create Purchase Order</button>
            <button type="button" class="btn btn-secondary" id="cancelCreatePO">Cancel</button>
        </form>
    `;
    
    document.getElementById('orderDate').valueAsDate = new Date();
    
    loadSuppliersForPO();
    loadProductsForPO();
    
    document.getElementById('createPOForm').addEventListener('submit', createPurchaseOrder);
    document.getElementById('addItemBtn').addEventListener('click', addItemRow);
    document.getElementById('cancelCreatePO').addEventListener('click', showPurchaseOrders);
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            if (document.querySelectorAll('.po-item').length > 1) {
                this.closest('.po-item').remove();
            }
        });
    });
}

function addItemRow() {
    const itemsContainer = document.getElementById('poItems');
    const newItem = document.createElement('div');
    newItem.className = 'po-item row mb-2';
    newItem.innerHTML = `
        <div class="col-md-4">
            <select class="form-select product-select" required>
                <option value="">Select a product</option>
            </select>
        </div>
        <div class="col-md-3">
            <input type="number" class="form-control quantity-input" placeholder="Quantity" min="1" required>
        </div>
        <div class="col-md-3">
            <input type="number" class="form-control price-input" placeholder="Unit Price" step="0.01" min="0" required>
        </div>
        <div class="col-md-2">
            <button type="button" class="btn btn-danger remove-item">Remove</button>
        </div>
    `;
    itemsContainer.appendChild(newItem);
    
    loadProductsForPO();
    
    newItem.querySelector('.remove-item').addEventListener('click', function() {
        if (document.querySelectorAll('.po-item').length > 1) {
            this.closest('.po-item').remove();
        }
    });
}

async function loadSuppliersForPO() {
    try {
        const response = await fetch(`${API_BASE_URL}/suppliers`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const suppliers = await response.json();
            const select = document.getElementById('supplierSelect');
            
            suppliers.forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier.id;
                option.textContent = supplier.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading suppliers:', error);
    }
}

async function loadProductsForPO() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const products = await response.json();
            const selects = document.querySelectorAll('.product-select');
            
            selects.forEach(select => {
                select.innerHTML = '<option value="">Select a product</option>';
                
                products.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.textContent = product.name;
                    select.appendChild(option);
                });
            });
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function createPurchaseOrder(e) {
    e.preventDefault();
    
    const supplierId = parseInt(document.getElementById('supplierSelect').value);
    const orderDate = document.getElementById('orderDate').value;
    const createdById = currentUser.id;
    
    const items = [];
    const itemRows = document.querySelectorAll('.po-item');
    
    for (const row of itemRows) {
        const productId = parseInt(row.querySelector('.product-select').value);
        const quantity = parseInt(row.querySelector('.quantity-input').value);
        const unitPrice = parseFloat(row.querySelector('.price-input').value);
        
        if (productId && quantity && unitPrice) {
            items.push({ productId, quantity, unitPrice });
        }
    }
    
    if (items.length === 0) {
        alert('Please add at least one item to the purchase order.');
        return;
    }
    
    const poData = {
        supplierId,
        createdById,
        orderDate,
        items
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/purchase-orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(poData)
        });
        
        if (response.ok) {
            alert('Purchase order created successfully!');
            showPurchaseOrders();
        } else {
            const error = await response.text();
            alert(`Failed to create purchase order: ${error}`);
        }
    } catch (error) {
        console.error('Error creating purchase order:', error);
        alert('Error creating purchase order.');
    }
}

async function loadPurchaseOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/purchase-orders`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const purchaseOrders = await response.json();
            displayPurchaseOrders(purchaseOrders);
        } else {
            document.getElementById('purchaseOrdersList').innerHTML = '<p>Failed to load purchase orders.</p>';
        }
    } catch (error) {
        console.error('Error loading purchase orders:', error);
        document.getElementById('purchaseOrdersList').innerHTML = '<p>Error loading purchase orders.</p>';
    }
}

function displayPurchaseOrders(purchaseOrders) {
    const container = document.getElementById('purchaseOrdersList');
    
    if (purchaseOrders.length === 0) {
        container.innerHTML = '<p>No purchase orders found.</p>';
        return;
    }
    
    let html = '<div class="row">';
    purchaseOrders.forEach(po => {
        html += `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">PO #${po.id}</h5>
                        <p class="card-text">
                            <strong>Supplier:</strong> ${po.supplier?.name || 'N/A'}<br>
                            <strong>Date:</strong> ${po.orderDate}<br>
                            <strong>Status:</strong> ${po.status}<br>
                            <strong>Items:</strong> ${po.purchaseOrderItems?.length || 0}
                        </p>
                        <button class="btn btn-sm btn-primary view-po-btn" data-id="${po.id}">View Details</button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
    
    document.querySelectorAll('.view-po-btn').forEach(button => {
        button.addEventListener('click', function() {
            const poId = this.getAttribute('data-id');
            viewPODetails(poId);
        });
    });
}

function viewPODetails(poId) {
    content.innerHTML = `
        <h2>Purchase Order Details</h2>
        <div id="poDetails">
            <p>Loading purchase order details...</p>
        </div>
        <button class="btn btn-secondary mt-3" id="backToPOs">Back to Purchase Orders</button>
    `;
    
    loadPODetails(poId);
    
    document.getElementById('backToPOs').addEventListener('click', showPurchaseOrders);
}

async function loadPODetails(poId) {
    try {
        const response = await fetch(`${API_BASE_URL}/purchase-orders/${poId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const po = await response.json();
            displayPODetails(po);
        } else {
            document.getElementById('poDetails').innerHTML = '<p>Failed to load purchase order details.</p>';
        }
    } catch (error) {
        console.error('Error loading purchase order details:', error);
        document.getElementById('poDetails').innerHTML = '<p>Error loading purchase order details.</p>';
    }
}

function displayPODetails(po) {
    const container = document.getElementById('poDetails');
    
    const orderDate = new Date(po.orderDate).toLocaleDateString();
    
    let html = `
        <div class="card mb-3">
            <div class="card-header">
                <h3>Purchase Order #${po.id}</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Supplier:</strong> ${po.supplier?.name || 'N/A'}</p>
                        <p><strong>Contact:</strong> ${po.supplier?.contactPerson || 'N/A'}</p>
                        <p><strong>Email:</strong> ${po.supplier?.email || 'N/A'}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Order Date:</strong> ${orderDate}</p>
                        <p><strong>Status:</strong> <span class="badge bg-${getStatusBadgeClass(po.status)}">${po.status}</span></p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h4>Items</h4>
            </div>
            <div class="card-body">
    `;
    
    if (po.purchaseOrderItems && po.purchaseOrderItems.length > 0) {
        html += `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        let subtotal = 0;
        po.purchaseOrderItems.forEach(item => {
            const itemTotal = item.quantity * item.unitPrice;
            subtotal += itemTotal;
            html += `
                <tr>
                    <td>${item.product?.name || 'N/A'}</td>
                    <td>${item.quantity}</td>
                    <td>${parseFloat(item.unitPrice).toFixed(2)}</td>
                    <td>${itemTotal.toFixed(2)}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
                <div class="row">
                    <div class="col-md-6"></div>
                    <div class="col-md-6">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td><strong>Subtotal:</strong></td>
                                    <td>${subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Tax (0%):</strong></td>
                                    <td>$0.00</td>
                                </tr>
                                <tr>
                                    <td><strong>Total:</strong></td>
                                    <td><strong>${subtotal.toFixed(2)}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
        `;
    } else {
        html += '<p>No items found for this purchase order.</p>';
    }
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function getStatusBadgeClass(status) {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'warning';
        case 'approved':
            return 'primary';
        case 'shipped':
            return 'info';
        case 'completed':
            return 'success';
        case 'cancelled':
            return 'danger';
        default:
            return 'secondary';
    }
}

function showInvoices() {
    content.innerHTML = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>
                            <i class="bi bi-receipt me-2"></i>Invoices
                        </h2>
                        <button class="btn btn-primary" id="createInvoiceBtn">
                            <i class="bi bi-plus-lg me-1"></i>Create New Invoice
                        </button>
                    </div>
                    
                    <div class="card border-warning">
                        <div class="card-header bg-warning text-white">
                            <i class="bi bi-list me-2"></i>Invoice List
                        </div>
                        <div class="card-body">
                            <div id="invoicesList">
                                <div class="text-center py-5">
                                    <div class="spinner-border text-warning" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <p class="mt-2">Loading invoices...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadInvoices();
    
    document.getElementById('createInvoiceBtn').addEventListener('click', showCreateInvoiceForm);
}

async function loadInvoices() {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const invoices = await response.json();
            displayInvoices(invoices);
        } else {
            document.getElementById('invoicesList').innerHTML = '<p>Failed to load invoices.</p>';
        }
    } catch (error) {
        console.error('Error loading invoices:', error);
        document.getElementById('invoicesList').innerHTML = '<p>Error loading invoices.</p>';
    }
}

function displayInvoices(invoices) {
    const container = document.getElementById('invoicesList');
    
    if (invoices.length === 0) {
        container.innerHTML = '<p>No invoices found.</p>';
        return;
    }
    
    let html = '<div class="row">';
    invoices.forEach(invoice => {
        const invoiceDate = new Date(invoice.invoiceDate).toLocaleDateString();
        const dueDate = new Date(invoice.dueDate).toLocaleDateString();
        
        html += `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Invoice #${invoice.id}</h5>
                        <p class="card-text">
                            <strong>PO #:</strong> ${invoice.purchaseOrder?.id || 'N/A'}<br>
                            <strong>Invoice Date:</strong> ${invoiceDate}<br>
                            <strong>Due Date:</strong> ${dueDate}<br>
                            <strong>Status:</strong> <span class="badge bg-${getInvoiceStatusBadgeClass(invoice.status)}">${invoice.status}</span><br>
                        </p>
                        <button class="btn btn-sm btn-primary view-invoice-btn" data-id="${invoice.id}">View Details</button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
    
    document.querySelectorAll('.view-invoice-btn').forEach(button => {
        button.addEventListener('click', function() {
            const invoiceId = this.getAttribute('data-id');
            viewInvoiceDetails(invoiceId);
        });
    });
}

function getInvoiceStatusBadgeClass(status) {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'warning';
        case 'paid':
            return 'success';
        case 'overdue':
            return 'danger';
        default:
            return 'secondary';
    }
}

function showCreateInvoiceForm() {
    content.innerHTML = `
        <h2>Create New Invoice</h2>
        <form id="createInvoiceForm">
            <div class="mb-3">
                <label for="poSelect" class="form-label">Purchase Order</label>
                <select class="form-select" id="poSelect" required>
                    <option value="">Select a purchase order</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="invoiceDate" class="form-label">Invoice Date</label>
                <input type="date" class="form-control" id="invoiceDate" required>
            </div>
            <div class="mb-3">
                <label for="dueDate" class="form-label">Due Date</label>
                <input type="date" class="form-control" id="dueDate" required>
            </div>
            <button type="submit" class="btn btn-primary">Create Invoice</button>
            <button type="button" class="btn btn-secondary" id="cancelCreateInvoice">Cancel</button>
        </form>
    `;
    
    const today = new Date();
    document.getElementById('invoiceDate').valueAsDate = today;
    
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);
    document.getElementById('dueDate').valueAsDate = dueDate;
    
    loadPOsForInvoice();
    
    document.getElementById('createInvoiceForm').addEventListener('submit', createInvoice);
    document.getElementById('cancelCreateInvoice').addEventListener('click', showInvoices);
}

async function loadPOsForInvoice() {
    try {
        const response = await fetch(`${API_BASE_URL}/purchase-orders`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const pos = await response.json();
            const select = document.getElementById('poSelect');
            
            pos.forEach(po => {
                const option = document.createElement('option');
                option.value = po.id;
                option.textContent = `PO #${po.id} - ${po.supplier?.name || 'N/A'}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading purchase orders:', error);
    }
}

async function createInvoice(e) {
    e.preventDefault();
    
    const invoiceData = {
        purchaseOrderId: parseInt(document.getElementById('poSelect').value),
        invoiceDate: document.getElementById('invoiceDate').value,
        dueDate: document.getElementById('dueDate').value,
        status: 'Pending'
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/invoices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(invoiceData)
        });
        
        if (response.ok) {
            alert('Invoice created successfully!');
            showInvoices();
        } else {
            const error = await response.text();
            alert(`Failed to create invoice: ${error}`);
        }
    } catch (error) {
        console.error('Error creating invoice:', error);
        alert('Error creating invoice.');
    }
}

function viewInvoiceDetails(invoiceId) {
    content.innerHTML = `
        <h2>Invoice Details</h2>
        <div id="invoiceDetails">
            <p>Loading invoice details...</p>
        </div>
        <button class="btn btn-secondary mt-3" id="backToInvoices">Back to Invoices</button>
        <button class="btn btn-success mt-3 ms-2" id="recordPaymentBtn" data-id="${invoiceId}">Record Payment</button>
    `;
    
    loadInvoiceDetails(invoiceId);
    
    document.getElementById('backToInvoices').addEventListener('click', showInvoices);
    document.getElementById('recordPaymentBtn').addEventListener('click', function() {
        const invId = this.getAttribute('data-id');
        showRecordPaymentForm(invId);
    });
}

async function loadInvoiceDetails(invoiceId) {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const invoice = await response.json();
            displayInvoiceDetails(invoice);
        } else {
            document.getElementById('invoiceDetails').innerHTML = '<p>Failed to load invoice details.</p>';
        }
    } catch (error) {
        console.error('Error loading invoice details:', error);
        document.getElementById('invoiceDetails').innerHTML = '<p>Error loading invoice details.</p>';
    }
}

function displayInvoiceDetails(invoice) {
    const container = document.getElementById('invoiceDetails');
    
    const invoiceDate = new Date(invoice.invoiceDate).toLocaleDateString();
    const dueDate = new Date(invoice.dueDate).toLocaleDateString();
    
    let html = `
        <div class="card mb-3">
            <div class="card-header">
                <h3>Invoice #${invoice.id}</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>PO #:</strong> ${invoice.purchaseOrder?.id || 'N/A'}</p>
                        <p><strong>Supplier:</strong> ${invoice.purchaseOrder?.supplier?.name || 'N/A'}</p>
                        <p><strong>Contact:</strong> ${invoice.purchaseOrder?.supplier?.contactPerson || 'N/A'}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
                        <p><strong>Due Date:</strong> ${dueDate}</p>
                        <p><strong>Status:</strong> <span class="badge bg-${getInvoiceStatusBadgeClass(invoice.status)}">${invoice.status}</span></p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h4>Invoice Items</h4>
            </div>
            <div class="card-body">
    `;
    
    if (invoice.purchaseOrder && invoice.purchaseOrder.purchaseOrderItems && invoice.purchaseOrder.purchaseOrderItems.length > 0) {
        html += `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        let subtotal = 0;
        invoice.purchaseOrder.purchaseOrderItems.forEach(item => {
            const itemTotal = item.quantity * item.unitPrice;
            subtotal += itemTotal;
            html += `
                <tr>
                    <td>${item.product?.name || 'N/A'}</td>
                    <td>${item.quantity}</td>
                    <td>${parseFloat(item.unitPrice).toFixed(2)}</td>
                    <td>${itemTotal.toFixed(2)}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
                <div class="row">
                    <div class="col-md-6"></div>
                    <div class="col-md-6">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td><strong>Subtotal:</strong></td>
                                    <td>${subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Tax (0%):</strong></td>
                                    <td>$0.00</td>
                                </tr>
                                <tr>
                                    <td><strong>Total:</strong></td>
                                    <td><strong>${subtotal.toFixed(2)}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
        `;
    } else {
        html += '<p>No items found for this invoice.</p>';
    }
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function showRecordPaymentForm(invoiceId) {
    content.innerHTML = `
        <h2>Record Payment</h2>
        <form id="recordPaymentForm">
            <div class="mb-3">
                <label for="paymentDate" class="form-label">Payment Date</label>
                <input type="date" class="form-control" id="paymentDate" required>
            </div>
            <div class="mb-3">
                <label for="paymentAmount" class="form-label">Amount</label>
                <input type="number" class="form-control" id="paymentAmount" step="0.01" min="0" required>
            </div>
            <button type="submit" class="btn btn-primary">Record Payment</button>
            <button type="button" class="btn btn-secondary" id="cancelRecordPayment">Cancel</button>
        </form>
    `;
    
    document.getElementById('paymentDate').valueAsDate = new Date();
    
    document.getElementById('recordPaymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        recordPayment(invoiceId);
    });
    document.getElementById('cancelRecordPayment').addEventListener('click', function() {
        viewInvoiceDetails(invoiceId);
    });
}

async function recordPayment(invoiceId) {
    const paymentData = {
        invoiceId: parseInt(invoiceId),
        paymentDate: document.getElementById('paymentDate').value,
        amount: parseFloat(document.getElementById('paymentAmount').value)
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(paymentData)
        });
        
        if (response.ok) {
            await updateInvoiceStatus(invoiceId, 'Paid');
            alert('Payment recorded successfully!');
            viewInvoiceDetails(invoiceId);
        } else {
            const error = await response.text();
            alert(`Failed to record payment: ${error}`);
        }
    } catch (error) {
        console.error('Error recording payment:', error);
        alert('Error recording payment.');
    }
}

async function updateInvoiceStatus(invoiceId, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ status })
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error updating invoice status:', error);
        return false;
    }
}

function showReports() {
    content.innerHTML = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>
                            <i class="bi bi-graph-up me-2"></i>Reports & Analytics
                        </h2>
                        <button class="btn btn-secondary" disabled>
                            <i class="bi bi-download me-1"></i>Export Report
                        </button>
                    </div>
                    
                    <div class="row g-4">
                        <div class="col-md-6 col-lg-4">
                            <div class="card h-100 border-primary shadow-sm">
                                <div class="card-header bg-primary text-white">
                                    <h5 class="mb-0">
                                        <i class="bi bi-building me-2"></i>Supplier Performance
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <p class="card-text">Analyze supplier performance metrics and delivery times.</p>
                                    <button class="btn btn-primary report-btn" data-report="supplier">
                                        <i class="bi bi-bar-chart me-1"></i>View Report
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 col-lg-4">
                            <div class="card h-100 border-info shadow-sm">
                                <div class="card-header bg-info text-white">
                                    <h5 class="mb-0">
                                        <i class="bi bi-file-earmark-text me-2"></i>Purchase Order Status
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <p class="card-text">Track purchase order statuses and completion rates.</p>
                                    <button class="btn btn-info report-btn" data-report="po">
                                        <i class="bi bi-bar-chart me-1"></i>View Report
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 col-lg-4">
                            <div class="card h-100 border-success shadow-sm">
                                <div class="card-header bg-success text-white">
                                    <h5 class="mb-0">
                                        <i class="bi bi-currency-dollar me-2"></i>Financial Summary
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <p class="card-text">View financial summaries and metrics.</p>
                                    <button class="btn btn-success report-btn" data-report="financial">
                                        <i class="bi bi-bar-chart me-1"></i>View Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card mt-4 border-dark">
                        <div class="card-header bg-dark text-white">
                            <h4 class="mb-0">
                                <i class="bi bi-file-bar-graph me-2"></i>Report Preview
                            </h4>
                        </div>
                        <div class="card-body">
                            <div id="reportContent">
                                <div class="text-center py-5">
                                    <i class="bi bi-graph-up fs-1 text-muted"></i>
                                    <h4 class="mt-3">Select a report to view details</h4>
                                    <p class="text-muted">Choose from the options above to generate a comprehensive report.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll('.report-btn').forEach(button => {
        button.addEventListener('click', function() {
            const reportType = this.getAttribute('data-report');
            generateReport(reportType);
        });
    });
}

function generateReport(reportType) {
    const reportContent = document.getElementById('reportContent');
    
    switch(reportType) {
        case 'supplier':
            generateSupplierReport(reportContent);
            break;
        case 'po':
            generatePOReport(reportContent);
            break;
        case 'financial':
            generateFinancialReport(reportContent);
            break;
        default:
            reportContent.innerHTML = '<p>Select a report type to view details.</p>';
    }
}

async function generateSupplierReport(container) {
    container.innerHTML = '<p>Loading supplier performance report...</p>';
    
    try {
        
        let html = `
            <h3>Supplier Performance Report</h3>
            <p>This report shows supplier performance metrics including:</p>
            <ul>
                <li>On-time delivery rates</li>
                <li>Quality ratings</li>
                <li>Order volumes</li>
                <li>Average payment terms</li>
            </ul>
            
            <div class="card">
                <div class="card-header">
                    <h4>Top Performing Suppliers</h4>
                </div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Supplier</th>
                                <th>Rating</th>
                                <th>On-Time Delivery %</th>
                                <th>Avg. Order Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>ABC Supplies Co.</td>
                                <td>4.5/5</td>
                                <td>95%</td>
                                <td>$12,500</td>
                            </tr>
                            <tr>
                                <td>XYZ Manufacturing</td>
                                <td>4.8/5</td>
                                <td>98%</td>
                                <td>$18,200</td>
                            </tr>
                            <tr>
                                <td>Global Tech Solutions</td>
                                <td>4.2/5</td>
                                <td>92%</td>
                                <td>$8,750</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error generating supplier report:', error);
        container.innerHTML = '<p>Error loading supplier performance report.</p>';
    }
}

async function generatePOReport(container) {
    container.innerHTML = '<p>Loading purchase order status report...</p>';
    
    try {
        
        let html = `
            <h3>Purchase Order Status Report</h3>
            <p>This report shows the status of all purchase orders:</p>
            
            <div class="card">
                <div class="card-header">
                    <h4>PO Status Summary</h4>
                </div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Count</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Pending</td>
                                <td>12</td>
                                <td>25%</td>
                            </tr>
                            <tr>
                                <td>Approved</td>
                                <td>18</td>
                                <td>37.5%</td>
                            </tr>
                            <tr>
                                <td>Shipped</td>
                                <td>10</td>
                                <td>20.8%</td>
                            </tr>
                            <tr>
                                <td>Completed</td>
                                <td>6</td>
                                <td>12.5%</td>
                            </tr>
                            <tr>
                                <td>Cancelled</td>
                                <td>2</td>
                                <td>4.2%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error generating PO report:', error);
        container.innerHTML = '<p>Error loading purchase order status report.</p>';
    }
}

async function generateFinancialReport(container) {
    container.innerHTML = '<p>Loading financial summary report...</p>';
    
    try {
        
        let html = `
            <h3>Financial Summary Report</h3>
            <p>This report shows financial metrics:</p>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Monthly Spend</h5>
                            <h3>$45,678.90</h3>
                            <p class="text-success">↓ 2.3% from last month</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Outstanding Invoices</h5>
                            <h3>$12,345.67</h3>
                            <p class="text-warning">↑ 5.7% from last month</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h4>Spend by Category</h4>
                </div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Electronics</td>
                                <td>$18,450.00</td>
                                <td>40.4%</td>
                            </tr>
                            <tr>
                                <td>Furniture</td>
                                <td>$12,300.00</td>
                                <td>26.9%</td>
                            </tr>
                            <tr>
                                <td>Software</td>
                                <td>$8,900.00</td>
                                <td>19.5%</td>
                            </tr>
                            <tr>
                                <td>Office Supplies</td>
                                <td>$4,200.00</td>
                                <td>9.2%</td>
                            </tr>
                            <tr>
                                <td>Services</td>
                                <td>$1,828.90</td>
                                <td>4.0%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error generating financial report:', error);
        container.innerHTML = '<p>Error loading financial summary report.</p>';
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    loginLink.classList.remove('d-none');
    logoutLink.classList.add('d-none');
    
    const userManagementNav = document.getElementById('userManagementNav');
    userManagementNav.style.display = 'none';
    
    content.innerHTML = '<h2>Welcome to Supplier & Vendor Management System</h2><p>Please login to continue.</p>';
}

function showUserManagement() {
    content.innerHTML = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>
                            <i class="bi bi-people me-2"></i>User Management
                        </h2>
                        <button class="btn btn-primary" id="addUserBtn">
                            <i class="bi bi-plus-lg me-1"></i>Add New User
                        </button>
                    </div>
                    
                    <div class="card border-primary">
                        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-list me-2"></i>User List</span>
                            <span id="userCount">0 users</span>
                        </div>
                        <div class="card-body">
                            <div id="usersList">
                                <div class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <p class="mt-2">Loading users...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadUsers();
    
    document.getElementById('addUserBtn').addEventListener('click', showAddUserForm);
}

function showAddUserForm() {
    content.innerHTML = `
        <h2>Add New User</h2>
        <form id="addUserForm">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" required>
            </div>
            <div class="mb-3">
                <label for="roleId" class="form-label">Role</label>
                <select class="form-select" id="roleId" required>
                    <option value="">Select a role</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Save User</button>
            <button type="button" class="btn btn-secondary" id="cancelAddUser">Cancel</button>
        </form>
    `;
    
    setTimeout(() => {
        loadRolesForUserForm();
    }, 100);
    
    document.getElementById('addUserForm').addEventListener('submit', addUser);
    document.getElementById('cancelAddUser').addEventListener('click', showUserManagement);
}

async function loadRolesForUserForm() {
    try {
        console.log('Loading roles with auth token:', authToken);
        const response = await fetch(`${API_BASE_URL}/users/roles`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        console.log('Roles response status:', response.status);
        
        if (response.ok) {
            const roles = await response.json();
            console.log('Roles loaded:', roles);
            const select = document.getElementById('roleId');
            
            select.innerHTML = '<option value="">Select a role</option>';
            
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.roleName;
                select.appendChild(option);
            });
        } else {
            console.log('Roles response error:', response.status, response.statusText);
            const errorText = await response.text();
            console.log('Roles error details:', errorText);
            const select = document.getElementById('roleId');
            select.innerHTML = `
                <option value="">Error loading roles</option>
                <option value="1">Administrator</option>
                <option value="2">Procurement Manager</option>
                <option value="3">Finance User</option>
                <option value="4">Standard User</option>
            `;
        }
    } catch (error) {
        console.error('Error loading roles:', error);
        const select = document.getElementById('roleId');
        select.innerHTML = `
            <option value="">Error loading roles</option>
            <option value="1">Administrator</option>
            <option value="2">Procurement Manager</option>
            <option value="3">Finance User</option>
            <option value="4">Standard User</option>
        `;
    }
}

async function loadUsers() {
    try {
        console.log('Loading users with auth token:', authToken);
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        console.log('Users response status:', response.status);
        
        if (response.ok) {
            let users = await response.json();
            console.log('Users loaded:', users);
            
            users = applyFiltersAndSorting(users);
            
            document.getElementById('userCount').textContent = `${users.length} user${users.length !== 1 ? 's' : ''}`;
            
            displayUsers(users);
        } else {
            console.log('Users response error:', response.status, response.statusText);
            const errorText = await response.text();
            console.log('Users error details:', errorText);
            document.getElementById('usersList').innerHTML = '<p>Failed to load users.</p>';
        }
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersList').innerHTML = '<p>Error loading users.</p>';
    }
}

function applyFiltersAndSorting(users) {
    const searchUsername = document.getElementById('searchUsername')?.value.toLowerCase() || '';
    const filterRole = document.getElementById('filterRole')?.value || '';
    const sortOption = document.getElementById('sortUsers')?.value || 'username-asc';
    
    let filteredUsers = users.filter(user => {
        const matchesUsername = !searchUsername || user.username.toLowerCase().includes(searchUsername);
        
        const matchesRole = !filterRole || user.roleId == filterRole;
        
        return matchesUsername && matchesRole;
    });
    
    filteredUsers.sort((a, b) => {
        switch (sortOption) {
            case 'username-asc':
                return a.username.localeCompare(b.username);
            case 'username-desc':
                return b.username.localeCompare(a.username);
            case 'role-asc':
                return (a.role?.roleName || '').localeCompare(b.role?.roleName || '');
            case 'role-desc':
                return (b.role?.roleName || '').localeCompare(a.role?.roleName || '');
            case 'id-asc':
                return a.id - b.id;
            case 'id-desc':
                return b.id - a.id;
            default:
                return a.username.localeCompare(b.username);
        }
    });
    
    return filteredUsers;
}

function clearFilters() {
    document.getElementById('searchUsername').value = '';
    document.getElementById('filterRole').value = '';
    document.getElementById('sortUsers').value = 'username-asc';
    loadUsers();
}

function displayUsers(users) {
    const usersList = document.getElementById('usersList');
    
    if (users.length === 0) {
        usersList.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-person-x fs-1 text-muted"></i>
                <h4 class="mt-3">No users found</h4>
                <p class="text-muted">Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="row">';
    users.forEach(user => {
        html += `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${user.username}</h5>
                        <p class="card-text">
                            <strong>Email:</strong> ${user.email}<br>
                            <strong>Role:</strong> ${user.role?.roleName || 'N/A'}<br>
                        </p>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-sm btn-outline-primary edit-user-btn me-2" data-id="${user.id}">
                                <i class="bi bi-pencil"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-user-btn" data-id="${user.id}">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    usersList.innerHTML = html;
    
    document.querySelectorAll('.edit-user-btn').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            editUser(userId);
        });
    });
    
    document.querySelectorAll('.delete-user-btn').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            deleteUser(userId);
        });
    });
}

async function addUser(e) {
    e.preventDefault();
    
    const userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        roleId: parseInt(document.getElementById('roleId').value)
    };
    
    console.log('Adding user with data:', userData);
    
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(userData)
        });
        
        console.log('Add user response status:', response.status);
        
        if (response.ok) {
            alert('User added successfully!');
            showUserManagement();
        } else {
            const errorText = await response.text();
            console.log('Add user error details:', errorText);
            alert(`Failed to add user: ${errorText}`);
        }
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Error adding user.');
    }
}

async function editUser(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            showEditUserForm(user);
        } else {
            alert('Failed to load user details.');
        }
    } catch (error) {
        console.error('Error loading user:', error);
        alert('Error loading user details.');
    }
}

function showEditUserForm(user) {
    content.innerHTML = `
        <h2>Edit User</h2>
        <form id="editUserForm">
            <input type="hidden" id="userId" value="${user.id}">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" value="${user.username}" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" value="${user.email}" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password (leave blank to keep current)</label>
                <input type="password" class="form-control" id="password">
            </div>
            <div class="mb-3">
                <label for="roleId" class="form-label">Role</label>
                <select class="form-select" id="roleId" required>
                    <option value="">Select a role</option>
                    <option value="1" ${user.roleId === 1 ? 'selected' : ''}>Administrator</option>
                    <option value="2" ${user.roleId === 2 ? 'selected' : ''}>Procurement Manager</option>
                    <option value="3" ${user.roleId === 3 ? 'selected' : ''}>Finance User</option>
                    <option value="4" ${user.roleId === 4 ? 'selected' : ''}>Standard User</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Update User</button>
            <button type="button" class="btn btn-secondary" id="cancelEditUser">Cancel</button>
        </form>
    `;
    
    document.getElementById('editUserForm').addEventListener('submit', updateUser);
    document.getElementById('cancelEditUser').addEventListener('click', showUserManagement);
}

async function updateUser(e) {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        roleId: parseInt(document.getElementById('roleId').value)
    };
    
    const password = document.getElementById('password').value;
    if (password) {
        userData['password'] = password;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            alert('User updated successfully!');
            showUserManagement();
        } else {
            const errorText = await response.text();
            alert(`Failed to update user: ${errorText}`);
        }
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Error updating user.');
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            alert('User deleted successfully!');
            loadUsers();
        } else {
            const errorText = await response.text();
            alert(`Failed to delete user: ${errorText}`);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user.');
    }
}