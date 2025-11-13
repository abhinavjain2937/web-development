
const MOCK_PRODUCTS = [
    { id: 1, name: "Responsive Portfolio", category: "Frontend", price: 250, rating: 4.5, desc: "A personal site built with Flexbox and Grid, adapted for all screens." },
    { id: 2, name: "Task Manager (CRUD)", category: "Fullstack", price: 450, rating: 4.8, desc: "Create, read, update, and delete functionality using JavaScript objects and local persistence." },
    { id: 3, name: "E-commerce Landing", category: "Design", price: 300, rating: 4.2, desc: "Modern, high-converting product landing page design using solid colors and modern typography." },
    { id: 4, name: "Data Dashboard", category: "Frontend", price: 500, rating: 4.7, desc: "Interactive visualization using mock data and charts. Highly responsive." },
    { id: 5, name: "API Fetch Tool", category: "Fullstack", price: 350, rating: 4.1, desc: "Tool to fetch and display data from an external public API, including error handling." },
    { id: 6, name: "Simple Calculator", category: "Design", price: 150, rating: 3.9, desc: "Basic utility application with clean interface and core mathematical logic." }
];

// --- DOM Elements ---
const productList = document.getElementById('productList');
const categoryFilter = document.getElementById('categoryFilter');
const sortOrder = document.getElementById('sortOrder');
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');
const wishlistCount = document.getElementById('wishlistCount');
const wishlistModal = document.getElementById('wishlistModal');
const wishlistItems = document.getElementById('wishlistItems');
const emptyWishlist = document.getElementById('emptyWishlist');
const wishlistButton = document.getElementById('wishlistButton');
const closeModal = document.getElementById('closeModal');
const clearWishlistBtn = document.getElementById('clearWishlist');
const toastContainer = document.getElementById('toastContainer');
        
// --- LOCAL STORAGE KEY ---
const WISHLIST_KEY = 'task4_wishlist';

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'success') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-sky-500'
    };

    const toast = document.createElement('div');
    toast.className = `p-4 rounded-lg shadow-xl text-white font-semibold ${colors[type]} transform transition-all duration-300 translate-x-full opacity-0`;
    toast.textContent = message;

    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 10); 

    // Animate out and remove
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

// --- STEP 2: LOCAL STORAGE FUNCTIONS ---

function getWishlist() {
    try {
        const data = localStorage.getItem(WISHLIST_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error reading localStorage:", error);
        return [];
    }
}

function saveWishlist(wishlist) {
    try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        updateWishlistUI();
    } catch (error) {
         console.error("Error writing to localStorage:", error);
    }
}

function addToWishlist(product) {
    const wishlist = getWishlist();
    if (!wishlist.some(item => item.id === product.id)) {
        wishlist.push(product);
        saveWishlist(wishlist);
        showToast(`${product.name} added to Wishlist.`, 'success');
    } else {
        showToast(`${product.name} is already in Wishlist.`, 'info');
    }
}

function removeFromWishlist(id) {
    let wishlist = getWishlist();
    const productName = wishlist.find(item => item.id === id)?.name;
    wishlist = wishlist.filter(item => item.id !== id);
    saveWishlist(wishlist);
    showToast(`${productName || 'Item'} removed.`, 'error');
}

function updateWishlistUI() {
    const wishlist = getWishlist();
    wishlistCount.textContent = wishlist.length;
    renderWishlistModal();
}

function renderWishlistModal() {
    const wishlist = getWishlist();
    wishlistItems.innerHTML = '';

    if (wishlist.length === 0) {
        emptyWishlist.classList.remove('hidden');
        clearWishlistBtn.classList.add('hidden');
    } else {
        emptyWishlist.classList.add('hidden');
        clearWishlistBtn.classList.remove('hidden');
        
        wishlist.forEach(product => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-200';
            li.innerHTML = `
                <span class="font-semibold text-slate-800">${product.name}</span>
                <button data-id="${product.id}" class="remove-item text-red-500 hover:text-red-700 font-medium text-sm transition py-1 px-2 rounded">
                    Remove
                </button>
            `;
            wishlistItems.appendChild(li);
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                removeFromWishlist(id);
            });
        });
    }
}

// --- STEP 3: FILTERING, SORTING, AND SEARCH LOGIC ---

function populateFilters() {
    const categories = [...new Set(MOCK_PRODUCTS.map(p => p.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function applyFiltersAndSort() {
    const selectedCategory = categoryFilter.value;
    const selectedSortOrder = sortOrder.value;
    const searchTerm = searchInput.value.toLowerCase().trim();

    let filteredProducts = MOCK_PRODUCTS;
    
    // 1. Filtering by Category
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
    }

    // 2. Filtering by Search Term
    if (searchTerm.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.desc.toLowerCase().includes(searchTerm) || 
            p.category.toLowerCase().includes(searchTerm)
        );
    }

    // 3. Sorting by Price
    if (selectedSortOrder === 'lowToHigh') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSortOrder === 'highToLow') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }
    
    renderProducts(filteredProducts);
}

function renderProducts(products) {
    productList.innerHTML = '';
    
    if (products.length === 0) {
        noResults.classList.remove('hidden');
        return;
    }
    noResults.classList.add('hidden');

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white p-6 rounded-xl card-shadow flex flex-col justify-between transform hover:scale-[1.02] transition duration-300 border-t-4 border-cyan-400';
        
        card.innerHTML = `
            <div>
                <span class="inline-block bg-cyan-100 text-cyan-800 text-xs font-medium px-3 py-1 rounded-full mb-3">${product.category}</span>
                <h3 class="text-xl font-bold text-slate-900 mb-2">${product.name}</h3>
                <p class="text-slate-600 text-sm mb-4">${product.desc}</p>
            </div>
            <div>
                <div class="flex justify-between items-center mb-4 pt-3 border-t border-slate-100">
                    <span class="text-2xl font-extrabold text-cyan-600">$${product.price}</span>
                    <span class="text-sm text-slate-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.071 3.298a1 1 0 00.95.698h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.031a1 1 0 00-.364 1.118l1.07 3.298c.3.921-.755 1.688-1.54 1.118l-2.8-2.031a1 1 0 00-1.175 0l-2.8 2.031c-.784.57-1.838-.197-1.539-1.118l1.07-3.298a1 1 0 00-.364-1.118L2.8 8.743c-.784-.57-.382-1.81.588-1.81h3.461a1 1 0 00.95-.698l1.07-3.298z"/></svg>
                        ${product.rating.toFixed(1)}
                    </span>
                </div>
                <button data-id="${product.id}" class="add-to-wishlist w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition font-semibold shadow-md">
                    Add to Wishlist (Local Storage)
                </button>
            </div>
        `;
        productList.appendChild(card);
    });
    
    // Attach listeners to wishlist buttons
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const product = MOCK_PRODUCTS.find(p => p.id === id);
            if (product) {
                addToWishlist(product);
            }
        });
    });
}

// --- Event Listeners and Initialization ---

// Attach listeners to filter/sort/search controls
categoryFilter.addEventListener('change', applyFiltersAndSort);
sortOrder.addEventListener('change', applyFiltersAndSort);
searchInput.addEventListener('input', applyFiltersAndSort); 

// Modal controls
wishlistButton.addEventListener('click', () => {
    wishlistModal.classList.remove('hidden');
    wishlistModal.classList.add('flex');
});

closeModal.addEventListener('click', () => {
    wishlistModal.classList.add('hidden');
    wishlistModal.classList.remove('flex');
});

// Clear wishlist button (Using confirm for simplicity)
clearWishlistBtn.addEventListener('click', () => {
     if (confirm("Are you sure you want to clear your entire wishlist?")) {
         saveWishlist([]); 
         showToast("Wishlist cleared!", 'error');
         wishlistModal.classList.add('hidden');
         wishlistModal.classList.remove('flex');
     }
});

// Initial setup
window.onload = function() {
    populateFilters();
    applyFiltersAndSort(); // Render initial list
    updateWishlistUI();    // Load and show initial wishlist count
};