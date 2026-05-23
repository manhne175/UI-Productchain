// Supabase Configuration
// REPLACE THESE WITH YOUR ACTUAL SUPABASE CREDENTIALS
const SUPABASE_URL = 'https://seeqjhjpjaqumebtzvfb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PUsPLPWG1GDuW3aC0VtngA_82EN569q';
let supabaseClient = null;
try {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } else {
        alert("DEBUG: window.supabase is undefined. The Supabase CDN script did not load.");
    }
} catch (e) {
    alert("DEBUG: Supabase createClient failed: " + e.message);
}

// Product Data
let products = [];

async function fetchProducts() {
    if (!supabaseClient) {
        console.warn("Supabase not configured, cannot fetch products.");
        return;
    }
    
    // Show a loading state if we want, or just wait
    try {
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .order('id', { ascending: true });
            
        if (error) throw error;
        
        if (data && data.length > 0) {
            products = data;
        } else {
            // Seed database if empty
            console.log("Seeding empty database...");
            const defaultProducts = [
                {
                    name: "Blue Morpho Butterfly",
                    price: 55.00,
                    image: "assets/blue_morpho_1774333912767.png",
                    description: "Blue Morpho butterfly (Morpho menelaus) specimen with brilliant shimmering blue wings under the light. Displayed in a premium oak frame lined with pale yellow fine art paper, offering an elegant beauty."
                },
                {
                    name: "Giant Rhinoceros Beetle",
                    price: 45.00,
                    image: "assets/rhino_beetle_1774333931194.png",
                    description: "Asian Giant Rhinoceros Beetle with a powerful form and shiny shell. Professionally processed specimen, maintaining original colors, enclosed in an elegant transparent protective glass box."
                },
                {
                    name: "Elegant Luna Moth",
                    price: 65.00,
                    image: "assets/luna_moth_1774333947893.png",
                    description: "Luna Moth - one of the most beautiful moth species with a fragile pale emerald green color on premium fine art paper, encased in a handmade matte white frame."
                },
                {
                    name: "Jewel Beetles Set",
                    price: 95.00,
                    image: "assets/jewel_beetles_1774333962648.png",
                    description: "A dazzling collection of Jewel Beetles featuring natural metallic colors blending from green, strawberry red to golden. A true masterpiece of art from nature."
                }
            ];
            
            const { data: insertedData, error: insertError } = await supabaseClient
                .from('products')
                .insert(defaultProducts)
                .select();
                
            if (insertError) throw insertError;
            products = insertedData || defaultProducts;
        }
        
        renderProducts(products);
    } catch (err) {
        console.error("Error fetching products:", err);
    }
}

// Document Elements
const productGrid = document.getElementById('productGrid');
const modal = document.getElementById('productModal');
const closeModal = document.querySelector('.close-modal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const addToCartBtn = document.getElementById('addToCartBtn');
const successMsg = document.getElementById('successMsg');
const cartCount = document.querySelector('.cart-count');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalAmount = document.getElementById('cartTotalAmount');
const searchIcon = document.getElementById('searchIcon');
const searchInput = document.getElementById('searchInput');
const userIcon = document.getElementById('userIcon');
const loginModal = document.getElementById('loginModal');
const closeLogin = document.getElementById('closeLogin');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

let cart = [];
let cartQuantity = 0;
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let currentSelectedProduct = null;
let isProductModalOpen = false;
let isLoginModalOpen = false;
let isAdminModalOpen = false;

// Initialize Webpage
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Render Products
function renderProducts(productsToRender = products) {
    productGrid.innerHTML = '';

    if (productsToRender.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); font-size: 1.1rem; padding: 2rem;">No products found matching your search.</p>';
        return;
    }

    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" loading="lazy" alt="${product.name}">
                <div class="add-to-cart-quick" onclick="event.stopPropagation(); quickAddToCart(event, ${product.id})">Quick Add</div>
                ${isLoggedIn ? `<div class="edit-product-btn" onclick="event.stopPropagation(); openEditModal(${product.id})"><i class="fas fa-edit"></i></div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
            </div>
        `;

        card.addEventListener('click', () => openModal(product));
        productGrid.appendChild(card);
    });
}

// Quick Add To Cart Animation
window.quickAddToCart = function (event, productId) {
    if (event) {
        event.preventDefault();
    }

    const product = products.find(p => p.id === productId);
    updateCart(product);

    // Create animated bubble
    const bubble = document.createElement('div');
    bubble.style.position = 'fixed';

    // Start from cursor position if event exists, otherwise center
    if (event && event.clientX) {
        bubble.style.left = event.clientX + 'px';
        bubble.style.top = event.clientY + 'px';
    } else {
        bubble.style.top = '50%';
        bubble.style.left = '50%';
    }

    bubble.style.transform = 'translate(-50%, -50%)';
    bubble.style.backgroundColor = '#2c2921';
    bubble.style.color = '#fff';
    bubble.style.padding = '8px 16px';
    bubble.style.borderRadius = '30px';
    bubble.style.zIndex = '3000';
    bubble.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    bubble.innerText = '+1 Added';
    bubble.style.transition = 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
    bubble.style.pointerEvents = 'none';

    document.body.appendChild(bubble);

    // Get cart icon position
    const cartIconEl = document.querySelector('.cart-icon-container');
    const rect = cartIconEl.getBoundingClientRect();

    // Animate to cart icon
    setTimeout(() => {
        bubble.style.top = (rect.top + 10) + 'px';
        bubble.style.left = (rect.left + 10) + 'px';
        bubble.style.opacity = '0';
        bubble.style.transform = 'scale(0.5)';
    }, 50);

    setTimeout(() => {
        if (document.body.contains(bubble)) {
            document.body.removeChild(bubble);
        }
    }, 850);
}

// Modal Functions
function openModal(product) {
    currentSelectedProduct = product;
    modalImg.src = product.image;
    modalTitle.innerText = product.name;
    modalPrice.innerText = `$${product.price}`;
    modalDesc.innerText = product.description;
    successMsg.style.display = 'none';
    addToCartBtn.innerText = "Add to Cart";
    addToCartBtn.style.backgroundColor = "";

    modal.style.display = 'block';

    // Trigger reflow for animation
    void modal.offsetWidth;

    modal.classList.add('show');
    isProductModalOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

closeModal.addEventListener('click', (e) => {
    e.stopPropagation();
    closeProductModal();
});

function closeProductModal() {
    modal.classList.remove('show');
    isProductModalOpen = false;
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }, 400); // matches CSS transition duration
}

// Add to Cart from Modal
addToCartBtn.addEventListener('click', () => {
    if (currentSelectedProduct) {
        updateCart(currentSelectedProduct);
    }
    addToCartBtn.innerText = "Added ✓";
    addToCartBtn.style.backgroundColor = "#ccbea0";
    successMsg.style.display = 'block';

    setTimeout(() => {
        closeProductModal();
    }, 1200);
});

function updateCart(product) {
    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Update count
    cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.innerText = cartQuantity;

    // Animate cart count pop
    cartCount.style.transform = 'scale(1.5)';
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 300);

    renderCartItems();
}

// Cart Sidebar Logic
cartIcon.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    renderCartItems();
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('show');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Your cart is currently empty</p>';
        cartTotalAmount.innerText = '$0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        // Parse price
        const itemPrice = parseFloat(item.price);
        total += itemPrice * item.quantity;

        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">$${item.price}</p>
                <div class="cart-item-actions">
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateItemQuantity(${item.id}, -1)">-</button>
                        <span class="item-qty">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateItemQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeItem(${item.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });

    // Format total price
    cartTotalAmount.innerText = '$' + total.toFixed(2);
}

window.updateItemQuantity = function (productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(productId);
        } else {
            // Update UI count
            cartQuantity = cart.reduce((total, i) => total + i.quantity, 0);
            cartCount.innerText = cartQuantity;
            renderCartItems();
        }
    }
};

window.removeItem = function (productId) {
    cart = cart.filter(i => i.id !== productId);
    cartQuantity = cart.reduce((total, i) => total + i.quantity, 0);
    cartCount.innerText = cartQuantity;
    renderCartItems();

    if (cart.length === 0) {
        cartCount.innerText = '0';
    }
};

// Search Logic
if (searchIcon && searchInput) {
    const heroSection = document.getElementById('home');
    const sectionHeader = document.querySelector('.section-header');
    let searchDebounce = null;

    function resetSearch() {
        searchInput.value = '';
        if (heroSection) heroSection.style.display = '';
        if (sectionHeader) sectionHeader.style.display = '';
        document.body.classList.remove('search-active');
        renderProducts(products);
    }

    searchIcon.addEventListener('click', () => {
        searchInput.classList.toggle('active');
        if (searchInput.classList.contains('active')) {
            searchInput.focus();
        } else {
            resetSearch();
        }
    });

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            const term = e.target.value.toLowerCase().trim();

            if (term === '') {
                resetSearch();
                return;
            }

            if (heroSection && heroSection.style.display !== 'none') {
                heroSection.style.display = 'none';
                if (sectionHeader) sectionHeader.style.display = 'none';
                document.body.classList.add('search-active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term)
            );
            renderProducts(filtered);
        }, 120);
    });
}

// Auth & Admin Logic

const userMenu = document.createElement('div');
userMenu.className = 'user-menu';
userMenu.innerHTML = `
    <button id="adminPanelBtn" style="display: none;">Add Product</button>
    <button id="logoutBtn">Logout</button>
`;
if (userIcon) userIcon.appendChild(userMenu);

const logoutBtn = document.getElementById('logoutBtn');
const adminPanelBtn = document.getElementById('adminPanelBtn');

function updateAuthUI() {
    if (isLoggedIn) {
        if (adminPanelBtn) adminPanelBtn.style.display = 'block';
    } else {
        if (userMenu) userMenu.classList.remove('show');
        if (adminPanelBtn) adminPanelBtn.style.display = 'none';
    }
}
updateAuthUI();

if(userIcon) {
    userIcon.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') { 
            if (isLoggedIn) {
                userMenu.classList.toggle('show');
            } else {
                if (loginError) loginError.style.display = 'none';
                if (loginModal) {
                    loginModal.style.display = 'block';
                    void loginModal.offsetWidth;
                    loginModal.classList.add('show');
                    isLoginModalOpen = true;
                    document.body.style.overflow = 'hidden';
                    if (loginForm) loginForm.reset();
                }
            }
        }
    });
}

if(closeLogin) {
    closeLogin.addEventListener('click', closeLoginModal);
}

function closeLoginModal() {
    if(!loginModal) return;
    loginModal.classList.remove('show');
    isLoginModalOpen = false;
    setTimeout(() => {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 400);
}

if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username')?.value;
        const pass = document.getElementById('password')?.value;

        if (user === 'admin' && pass === 'admin') {
            localStorage.setItem('isLoggedIn', 'true');
            isLoggedIn = true;
            closeLoginModal();
            updateAuthUI();
            renderProducts();
            showToast('Login Successful!', '#4CAF50');
        } else {
            if (loginError) loginError.style.display = 'block';
        }
    });
}

if(logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        localStorage.setItem('isLoggedIn', 'false');
        isLoggedIn = false;
        if(userMenu) userMenu.classList.remove('show');
        updateAuthUI();
        renderProducts();
        showToast('Logged Out', '#DBDBDB');
    });
}

const adminModal = document.getElementById('adminModal');
const closeAdmin = document.getElementById('closeAdmin');
const addProductForm = document.getElementById('addProductForm');

if(adminPanelBtn) {
    adminPanelBtn.addEventListener('click', () => {
        if(addProductForm) addProductForm.reset();
        document.getElementById('editProdId').value = '';
        document.getElementById('adminModalTitle').innerText = 'Add Product';
        const existingLabel = document.getElementById('existingImageLabel');
        if(existingLabel) existingLabel.style.display = 'none';
        
        if (adminModal) {
            adminModal.style.display = 'block';
            void adminModal.offsetWidth;
            adminModal.classList.add('show');
            isAdminModalOpen = true;
            document.body.style.overflow = 'hidden';
            if(userMenu) userMenu.classList.remove('show');
        }
    });
}

window.openEditModal = function(id) {
    const product = products.find(p => p.id === id);
    if(product) {
        document.getElementById('editProdId').value = product.id;
        document.getElementById('prodName').value = product.name;
        document.getElementById('prodPrice').value = product.price;
        document.getElementById('prodDesc').value = product.description;
        
        const fileInput = document.getElementById('prodImageFile');
        if(fileInput) fileInput.value = ''; // Reset file input
        const existingLabel = document.getElementById('existingImageLabel');
        if(existingLabel) existingLabel.style.display = 'block';
        
        document.getElementById('adminModalTitle').innerText = 'Edit Product';
        
        if (adminModal) {
            adminModal.style.display = 'block';
            void adminModal.offsetWidth;
            adminModal.classList.add('show');
            isAdminModalOpen = true;
            document.body.style.overflow = 'hidden';
            if(userMenu) userMenu.classList.remove('show');
        }
    }
};

if(closeAdmin) {
    closeAdmin.addEventListener('click', closeAdminModal);
}

function closeAdminModal() {
    if(!adminModal) return;
    adminModal.classList.remove('show');
    isAdminModalOpen = false;
    setTimeout(() => {
        adminModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 400);
}

window.addEventListener('click', (e) => {
    if (isProductModalOpen && e.target === modal) closeProductModal();
    if (isLoginModalOpen && e.target === loginModal) closeLoginModal();
    if (isAdminModalOpen && e.target === adminModal) closeAdminModal();
    if (userIcon && !userIcon.contains(e.target) && userMenu && userMenu.classList.contains('show')) {
        userMenu.classList.remove('show');
    }
});

if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if(!supabaseClient || SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE') {
            alert("Supabase is not configured! Please add your API keys at the top of script.js.");
            return;
        }

        const name = document.getElementById('prodName').value;
        const price = document.getElementById('prodPrice').value;
        const desc = document.getElementById('prodDesc').value;
        const editId = document.getElementById('editProdId').value;
        const fileInput = document.getElementById('prodImageFile');
        const submitBtn = addProductForm.querySelector('button[type="submit"]');
        
        let imageUrl = '';
        
        if (editId) {
            const existingProduct = products.find(p => p.id == editId);
            if (existingProduct) {
                imageUrl = existingProduct.image; // Keep existing image by default
            }
        }
        
        // If a new file is selected, upload it
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `product_${Date.now()}.${fileExt}`;
            
            // Show loading state
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Uploading Image...';
            submitBtn.disabled = true;

            try {
                const { data, error } = await supabaseClient.storage
                    .from('product-images')
                    .upload(fileName, file, { cacheControl: '3600', upsert: false });

                if (error) throw error;
                
                const { data: publicData } = supabaseClient.storage
                    .from('product-images')
                    .getPublicUrl(fileName);
                    
                imageUrl = publicData.publicUrl;
            } catch (err) {
                console.error("Upload error:", err);
                alert("Image Upload Failed! Check your Supabase API keys, permissions, and bucket settings.");
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                return;
            }
            
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        } else if (!editId) {
            // New product but no image selected
            alert("Please select a product image to upload.");
            return;
        }

        try {
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Saving to Database...';
            submitBtn.disabled = true;

            if (editId) {
                const updateData = {
                    name: name,
                    price: parseFloat(price),
                    image: imageUrl,
                    description: desc
                };
                
                const { error: updateError } = await supabaseClient
                    .from('products')
                    .update(updateData)
                    .eq('id', editId);
                    
                if (updateError) throw updateError;
                showToast('Product Updated in Database!', '#4CAF50');
            } else {
                const insertData = {
                    name: name,
                    price: parseFloat(price),
                    image: imageUrl,
                    description: desc
                };
                
                const { error: insertError } = await supabaseClient
                    .from('products')
                    .insert([insertData]);
                    
                if (insertError) throw insertError;
                showToast('Product Added Successfully!', '#4CAF50');
            }
            
            // Re-fetch all products from Supabase to sync UI
            await fetchProducts();
            
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            
            closeAdminModal();
            addProductForm.reset();
        } catch (dbError) {
            console.error("Database error:", dbError);
            alert("Database Error: " + dbError.message);
            submitBtn.innerText = 'Add Product';
            submitBtn.disabled = false;
        }
    });
}

function showToast(message, bgColor) {
    const bubble = document.createElement('div');
    bubble.style.position = 'fixed';
    bubble.style.top = '20px';
    bubble.style.left = '50%';
    bubble.style.transform = 'translateX(-50%)';
    bubble.style.backgroundColor = bgColor;
    bubble.style.color = '#161616';
    bubble.style.padding = '12px 24px';
    bubble.style.borderRadius = '30px';
    bubble.style.zIndex = '4000';
    bubble.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    bubble.style.fontWeight = '600';
    bubble.innerText = message;
    bubble.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(bubble);
    
    setTimeout(() => bubble.style.opacity = '0', 2500);
    setTimeout(() => {
        if(document.body.contains(bubble)) document.body.removeChild(bubble);
    }, 3000);
}
