//  DATA STRUCTURE
const restaurantData = {
    restaurant: {
        name: "McDonald's East London",
        rating: 3.4,
        reviewCount: 1360,
        deliveryTime: "20-25 minutes",
        minimumOrder: "£12.00"
    },
    
    categories: [
        { id: "offers", name: "Offers", icon: "fa-tags" },
        { id: "burgers", name: "Burgers", icon: "fa-hamburger" },
        { id: "fries", name: "Fries", icon: "fa-french-fries" },
        { id: "snacks", name: "Snacks", icon: "fa-cookie" },
        { id: "salads", name: "Salads", icon: "fa-salad" },
        { id: "cold-drinks", name: "Cold Drinks", icon: "fa-glass-water" },
        { id: "happy-meal", name: "Happy Meal®", icon: "fa-gift" },
        { id: "desserts", name: "Desserts", icon: "fa-ice-cream" },
        { id: "hot-drinks", name: "Hot Drinks", icon: "fa-mug-hot" },
        { id: "sauces", name: "Sauces", icon: "fa-bottle-droplet" },
        { id: "orbit", name: "Orbit®", icon: "fa-circle" }
    ],
    
    products: {
        burgers: [
            { id: 1, name: "Royal Cheese Burger with extra Fries", price: 23.10, image: "img/burger_card_1.png", description: "1 McChicken™ Burger + 1 Big Mac™ + 3 Medium Fries", category: "burgers" },
            { id: 2, name: "The classics for 3", price: 23.10, image: "img/burger_card_2.png", description: "1 McChicken™ Burger + 1 Big Mac™ + 3 Medium Fries", category: "burgers" },
            { id: 3, name: "Big Mac Meal", price: 18.50, image: "img/burger_card_3.png", description: "Big Mac + Medium Fries + Medium Drink", category: "burgers" },
            { id: 4, name: "Quarter Pounder Deluxe", price: 20.00, image: "img/burger_card_4.png", description: "Quarter Pounder + Large Fries + Large Drink", category: "burgers" },
            { id: 5, name: "McChicken Combo", price: 17.50, image: "img/burger_card_5.png", description: "McChicken + Medium Fries + Medium Drink", category: "burgers" },
            { id: 6, name: "Double Cheeseburger Meal", price: 19.00, image: "img/burger_card_6.png", description: "Double Cheeseburger + Medium Fries + Drink", category: "burgers" }
        ],
        fries: [
            { id: 7, name: "Large Fries", price: 4.50, image: "img/fries_card_1.png", description: "Crispy golden fries, large size", category: "fries" },
            { id: 8, name: "Medium Fries", price: 3.50, image: "img/fries_card_2.png", description: "Crispy golden fries, medium size", category: "fries" },
            { id: 9, name: "Loaded Cheese Fries", price: 5.99, image: "img/fries_card_3.png", description: "Fries topped with cheese sauce", category: "fries" },
            { id: 10, name: "Bacon Cheese Fries", price: 6.50, image: "img/fries_card_4.png", description: "Fries with bacon and cheese", category: "fries" },
            { id: 11, name: "Chili Cheese Fries", price: 6.00, image: "img/fries_card_5.png", description: "Fries with chili and cheese", category: "fries" },
            { id: 12, name: "Curly Fries", price: 4.99, image: "img/fries_card_6.png", description: "Seasoned curly fries", category: "fries" }
        ],
        coldDrinks: [
            { id: 13, name: "Coca-Cola Large", price: 3.50, image: "img/drink_card_1.png", description: "Ice cold Coca-Cola, large size", category: "cold-drinks" },
            { id: 14, name: "Sprite Medium", price: 2.80, image: "img/drink_card_2.png", description: "Refreshing Sprite, medium size", category: "cold-drinks" },
            { id: 15, name: "Fanta Orange", price: 2.80, image: "img/drink_card_3.png", description: "Orange Fanta, medium size", category: "cold-drinks" },
            { id: 16, name: "Iced Tea", price: 3.20, image: "img/drink_card_4.png", description: "Fresh brewed iced tea", category: "cold-drinks" },
            { id: 17, name: "Lemonade", price: 3.00, image: "img/drink_card_5.png", description: "Fresh squeezed lemonade", category: "cold-drinks" },
            { id: 18, name: "Milkshake Vanilla", price: 4.50, image: "img/drink_card_6.png", description: "Creamy vanilla milkshake", category: "cold-drinks" }
        ]
    },
    
    reviews: [
        { 
            id: 1, 
            name: "St Glx", 
            rating: 5, 
            date: "24th September, 2023", 
            comment: "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual McDonald's standard – hot and satisfying.",
            avatar: "img/customer.png"
        },
        { 
            id: 2, 
            name: "Maria Johnson", 
            rating: 5, 
            date: "18th September, 2023", 
            comment: "Great experience! The food arrived hot and fresh. Delivery was faster than expected. Will definitely order again!",
            avatar: "img/customer.png"
        },
        { 
            id: 3, 
            name: "Ahmed Khan", 
            rating: 4, 
            date: "15th September, 2023", 
            comment: "Good quality food and reasonable prices. The only issue was a slight delay in delivery, but overall satisfied with the service.",
            avatar: "img/customer.png"
        },
        { 
            id: 4, 
            name: "Sarah Williams", 
            rating: 5, 
            date: "10th September, 2023", 
            comment: "Best McDonald's in East London! Always fresh, always on time. The mobile app makes ordering so easy!",
            avatar: "img/customer.png"
        },
        { 
            id: 5, 
            name: "David Brown", 
            rating: 5, 
            date: "5th September, 2023", 
            comment: "Consistently excellent service. The staff are very professional and the restaurant is always clean.",
            avatar: "img/customer.png"
        }
    ],
    
    similarRestaurants: [
        { name: "McDonald's London", logo: "img/macdonalds.png", bgColor: "bg-red-600" },
        { name: "Papa Johns", logo: "img/papa-johns.png", bgColor: "bg-green-700" },
        { name: "KFC West London", logo: "img/kfc.png", bgColor: "bg-red-700" },
        { name: "Texas Chicken", logo: "img/Texas.png", bgColor: "bg-red-600" },
        { name: "Burger King", logo: "img/burger-king.png", bgColor: "bg-orange-600" },
        { name: "Shaurma 1", logo: "img/shaurma.png", bgColor: "bg-orange-500" }
    ]
};

//  UTILITY FUNCTIONS 
function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    notification.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg mb-2 transform translate-x-full transition-transform duration-300 flex items-center`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} mr-2"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => container.removeChild(notification), 300);
    }, 3000);
}

function formatPrice(price) {
    return `GBP ${price.toFixed(2)}`;
}

function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerOffset = 136; // Header + category nav height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

//  RENDER FUNCTIONS 
function renderProducts(category) {
    const products = restaurantData.products[category === 'cold-drinks' ? 'coldDrinks' : category];
    if (!products) return '';
    
    return products.map(product => `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 fade-in relative">
            <div class="flex items-center p-5">
                <!-- Left side: Product Info -->
                <div class="flex-1 pr-4">
                    <h3 class="font-bold text-lg mb-2 text-gray-900 leading-snug">${product.name}</h3>
                    <p class="text-xs text-gray-600 mb-4 leading-relaxed">${product.description}</p>
                    <span class="text-lg font-bold text-gray-900">${formatPrice(product.price)}</span>
                </div>
                
                <!-- Right side: Product Image with rounded yellow background -->
                <div class="relative flex-shrink-0">
                    <div class="w-32 h-32 bg-yellow-400 rounded-xl overflow-hidden relative">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                        <!-- White background box at bottom right -->
                        <div class="absolute bottom-0 right-0 bg-white bg-opacity-80 rounded-tl-3xl p-4">
                            <!-- Plus button -->
                            <button onclick="addToCart(${product.id}, '${product.category}')" 
                                    class="bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg">
                                <i class="fas fa-plus text-sm font-bold"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAllProductSections() {
    const container = document.getElementById('productSections');
    const sectionsHTML = restaurantData.categories
        .filter(cat => restaurantData.products[cat.id] || restaurantData.products[cat.id === 'cold-drinks' ? 'coldDrinks' : cat.id])
        .map(category => {
            const categoryKey = category.id === 'cold-drinks' ? 'coldDrinks' : category.id;
            const products = restaurantData.products[categoryKey];
            
            if (!products) return '';
            
            return `
                <section id="${category.id}" class="py-12 bg-${category.id === 'burgers' ? 'white' : category.id === 'fries' ? 'gray-50' : 'white'}">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex items-center mb-8">
                            ${category.id !== 'burgers' ? `<i class="fas ${category.icon} text-[#FC8A06] text-2xl mr-3"></i>` : ''}
                            <h2 class="text-3xl font-bold ${category.id === 'burgers' ? 'text-black' : 'text-[#FC8A06]'}">${category.name}</h2>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${renderProducts(category.id)}
                        </div>
                    </div>
                </section>
            `;
        }).join('');
    
    container.innerHTML = sectionsHTML;
}

function renderReviews() {
    const container = document.getElementById('reviewsContainer');
    if (!container) {
        return;
    }
    const startIndex = currentReviewIndex;
    const reviewsToShow = restaurantData.reviews.slice(startIndex, startIndex + 3);
    
    container.innerHTML = reviewsToShow.map(review => `
        <div class="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 fade-in">
            <div class="flex items-start mb-4">
                <img src="${review.avatar}" alt="${review.name}" class="w-12 h-12 rounded-full mr-3 object-cover">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">${review.name}</h4>
                    <div class="flex text-yellow-400 text-sm mb-1">
                        ${Array(review.rating).fill('<i class="fas fa-star"></i>').join('')}
                    </div>
                    <span class="text-xs text-gray-500">${review.date}</span>
                </div>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed">${review.comment}</p>
        </div>
    `).join('');
}

function renderSimilarRestaurants() {
    const container = document.getElementById('similarRestaurantsContainer');
    if (!container) {
        console.error("Similar restaurant container not found!");
        return;
    }

    if (!restaurantData.similarRestaurants || restaurantData.similarRestaurants.length === 0) {
        console.error("No similar restaurants data found!");
        return;
    }

    container.innerHTML = restaurantData.similarRestaurants.map(res => `
        <div class="bg-white rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg flex flex-col h-full">
            <div class="w-full h-32">
                <img src="${res.logo}" alt="${res.name}" class="w-full h-full object-cover">
            </div>
            <div class="bg-orange-500 text-white py-2 px-3">
                <p class="text-sm font-semibold text-center">${res.name}</p>
            </div>
        </div>
    `).join('');
}


// ==================== CART FUNCTIONALITY (NEW) ====================
let cartItems = [];

function addToCart(productId, category) {
    const categoryKey = category === 'cold-drinks' ? 'coldDrinks' : category;
    const product = restaurantData.products[categoryKey]?.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cartItems.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCartUI();
        showNotification(`${product.name} added to cart!`);
        
        // Add animation to button
        const button = event.target.closest('button');
        button.style.transform = 'scale(0.9)';
        setTimeout(() => button.style.transform = 'scale(1)', 150);
    }
}

function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const emptyMessage = document.getElementById('emptyCartMessage');
    
    if (!container || !emptyMessage) return;
    
    if (cartItems.length === 0) {
        container.innerHTML = '';
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
        container.innerHTML = '';
        
        cartItems.forEach((item, index) => {
            const isSelected = index === 2;
            const bgColor = isSelected ? 'bg-gray-900' : 'bg-gray-100';
            const textColor = isSelected ? 'text-white' : 'text-gray-900';
            const nameColor = isSelected ? 'text-orange-500' : 'text-gray-900';
            
            const itemHTML = `
                <div class="${bgColor} rounded-lg p-3 mb-3 transition-all duration-200">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3 flex-1">
                            <div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white">
                                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                            </div>
                            <span class="${nameColor} font-semibold text-sm">${item.name}</span>
                        </div>
                        
                        <div class="flex items-center gap-3">
                            <img onclick="decreaseQuantity(${item.id})" 
                                 src="./img/decremnt.png" 
                                 alt="Decrease" 
                                 class="w-6 h-6 cursor-pointer hover:scale-110 transition-transform">
                            
                            <span class="${textColor} font-semibold min-w-[20px] text-center">${item.quantity}</span>
                            
                            <img onclick="increaseQuantity(${item.id})" 
                                 src="./img/increment.png" 
                                 alt="Increase" 
                                 class="w-6 h-6 cursor-pointer hover:scale-110 transition-transform">
                        </div>
                    </div>
                </div>
            `;
            
            container.innerHTML += itemHTML;
        });
    }
    
    updateTotalPrice();
    updateCartCount();
}

function increaseQuantity(itemId) {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
        item.quantity++;
        updateCartUI();
    }
}

function decreaseQuantity(itemId) {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
            cartItems = cartItems.filter(i => i.id !== itemId);
        }
        updateCartUI();
    }
}

function updateTotalPrice() {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalElement = document.getElementById('totalPrice');
    if (totalElement) {
        totalElement.textContent = `£${total.toFixed(2)}`;
    }
}

function updateCartCount() {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const countElement = document.getElementById('cartCountBadge');
    if (countElement) {
        countElement.textContent = count;
    }
}

function openCart() {
    const overlay = document.getElementById('cartOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const overlay = document.getElementById('cartOverlay');
    if (overlay) {
        overlay.classList.remove('flex');
        overlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function initCartEvents() {
    const openBtn = document.getElementById('openCartBtn');
    const closeBtn = document.getElementById('closeCartBtn');
    const backBtn = document.getElementById('backToShopBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    const overlay = document.getElementById('cartOverlay');
    
    if (openBtn) {
        openBtn.addEventListener('click', openCart);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCart);
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', closeCart);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (cartItems.length > 0) {
                alert('Proceeding to checkout...');
            } else {
                alert('Your cart is empty!');
            }
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeCart();
            }
        });
    }
}
// ==================== END CART FUNCTIONALITY ====================


//  SEARCH FUNCTIONALITY 
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const searchTerm = this.value.toLowerCase().trim();
        
        searchTimeout = setTimeout(() => {
            if (searchTerm === '') {
                renderAllProductSections();
            } else {
                performSearch(searchTerm);
            }
        }, 300);
    });
}

function performSearch(searchTerm) {
    const allProducts = [
        ...restaurantData.products.burgers,
        ...restaurantData.products.fries,
        ...restaurantData.products.coldDrinks
    ];
    
    const results = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
    
    displaySearchResults(results, searchTerm);
}

function displaySearchResults(results, searchTerm) {
    const container = document.getElementById('productSections');
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="py-20 text-center">
                <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-2xl font-bold text-gray-700 mb-2">No results found</h3>
                <p class="text-gray-500">Try searching for something else</p>
            </div>
        `;
        return;
    }
    
    const resultsHTML = `
        <section class="py-12 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">Search Results</h2>
                <p class="text-gray-600 mb-8">Found ${results.length} items for "${searchTerm}"</p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${results.map(product => `
                        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 fade-in">
                            <div class="relative overflow-hidden group">
                                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300">
                            </div>
                            <div class="p-5">
                                <h3 class="font-semibold text-lg mb-2 text-gray-900">${product.name}</h3>
                                <p class="text-sm text-gray-600 mb-4">${product.description}</p>
                                <div class="flex justify-between items-center">
                                    <span class="text-xl font-bold text-gray-900">${formatPrice(product.price)}</span>
                                    <button onclick="addToCart(${product.id}, '${product.category}')" 
                                            class="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-xl border-2 border-black">
                                        <i class="fas fa-plus text-lg font-bold"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
    
    container.innerHTML = resultsHTML;
}

//  REVIEWS CAROUSEL 
let currentReviewIndex = 0;

function initReviewsCarousel() {
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    
    prevBtn.addEventListener('click', () => {
        currentReviewIndex = Math.max(0, currentReviewIndex - 1);
        renderReviews();
    });
    
    nextBtn.addEventListener('click', () => {
        const maxIndex = Math.max(0, restaurantData.reviews.length - 3);
        currentReviewIndex = Math.min(maxIndex, currentReviewIndex + 1);
        renderReviews();
    });
}

// CATEGORY NAVIGATION
function initCategoryNavigation() {
    const categoryLinks = document.querySelectorAll('.category-link');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('bg-gray-900'));
            categoryLinks.forEach(l => l.classList.add('hover:bg-orange-600'));
            link.classList.add('bg-gray-900');
            link.classList.remove('hover:bg-orange-600');
            
            // Smooth scroll to section
            smoothScroll(target);
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        
        categoryLinks.forEach(link => {
            link.classList.remove('bg-gray-900');
            link.classList.add('hover:bg-orange-600');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('bg-gray-900');
                link.classList.remove('hover:bg-orange-600');
            }
        });
    });
}

// NEWSLETTER 
function initNewsletter() {
    const subscribeBtn = document.getElementById('subscribeBtn');
    const emailInput = document.getElementById('newsletterEmail');
    
    subscribeBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailRegex.test(email)) {
            showNotification('Successfully subscribed to newsletter!', 'success');
            emailInput.value = '';
        } else {
            showNotification('Please enter a valid email address', 'error');
        }
    });
    
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            subscribeBtn.click();
        }
    });
}

//  ANIMATIONS 
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// INITIALIZATION 
document.addEventListener('DOMContentLoaded', function() {
    // Render all content
    renderAllProductSections();
    renderReviews();
    
    // Initialize features
    initSearch();
    initReviewsCarousel();
    initCategoryNavigation();
    initNewsletter();
    initScrollAnimations();
    renderSimilarRestaurants();
    initCartEvents(); // NEW: Initialize cart events
    updateCartUI(); // NEW: Initialize cart UI
    
    console.log('🍔 Restaurant website loaded successfully!');
});