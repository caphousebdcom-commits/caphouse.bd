// ==========================================
// Cap House BD - Products Data Catalog
// ==========================================
const productsData = [
    {
        id: 1,
        title: "Pro Red-Black Signature Trucker Cap",
        category: "cap", // "cap" ba "tshirt"
        price: 450,       // বর্তমান বিক্রয় মূল্য
        oldPrice: 900,    // মূল দাম (অটোমেটিক 50% OFF দেখাবে)
        description: "Official Cap House BD trucker cap with breathable mesh and adjustable snapback.",
        colors: [
            { name: "Black/Red", code: "#DC2626", img: "images/blue honey.jpeg" },
            { name: "Solid Black", code: "#000000", img: "images/red honey.jpeg" }
        ]
    },
    {
        id: 3,
        title: "Heavyweight Black Drop Shoulder Tee",
        category: "tshirt",
        price: 600,
        oldPrice: 1000,   // অটোমেটিক 40% OFF দেখাবে
        description: "220 GSM 100% combed cotton heavy drop shoulder oversize tee.",
        colors: [
            { 
                name: "Jet Black", 
                code: "#000000", 
                img: "images/red honey.jpeg", // সামনের ছবি
                backImg: "images/white honey.jpeg" // পিছনের ছবি (মাউস নিলে এটি দেখাবে)[cite: 2]
            }
        ]
    },

    {
        id: 2,
        title: "Heavyweight Black Drop Shoulder Tee",
        category: "tshirt",
        price: 600,
        oldPrice: 1000,   // অটোমেটিক 40% OFF দেখাবে
        description: "220 GSM 100% combed cotton heavy drop shoulder oversize tee.",
        colors: [
            { 
                name: "Jet Black", 
                code: "#000000", 
                img: "images/white honey.jpeg", // সামনের ছবি
                backImg: "images/blue honey.jpeg" // পিছনের ছবি (মাউস নিলে এটি দেখাবে)[cite: 2]
            }
        ]
    }
    // 👇 নতুন প্রোডাক্ট অ্যাড করতে চাইলে ওপরের মতো করে ঠিক নিচে কমা (,) দিয়ে যুক্ত করবেন।
];

// ==========================================
// App State
// ==========================================
let cart = [];
let currentFilter = 'all';
let searchQuery = '';
let selectedModalProduct = null;
let selectedColorIndex = 0;
let selectedSize = 'L';
let selectedModalQty = 1;

// DOM Elements
const productGrid = document.getElementById('productGrid');
const productCount = document.getElementById('productCount');
const searchInput = document.getElementById('searchInput');
const searchInputMobile = document.getElementById('searchInputMobile');
const filterBtns = document.querySelectorAll('.filter-btn');

// Cart Elements
const cartBtn = document.getElementById('cartBtn');
const cartBadge = document.getElementById('cartBadge');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');
const cartItemsList = document.getElementById('cartItemsList');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const deliveryChargeText = document.getElementById('deliveryChargeText');
const custAreaSelect = document.getElementById('custArea');

// Modal Elements
const productModal = document.getElementById('productModal');
const modalContainer = document.getElementById('modalContainer');
const closeModal = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalCategory = document.getElementById('modalCategory');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalOldPrice = document.getElementById('modalOldPrice');
const modalDesc = document.getElementById('modalDesc');
const modalColorSwatches = document.getElementById('modalColorSwatches');
const modalSizeContainer = document.getElementById('modalSizeContainer');
const modalQty = document.getElementById('modalQty');
const modalQtyMinus = document.getElementById('modalQtyMinus');
const modalQtyPlus = document.getElementById('modalQtyPlus');
const modalAddToCart = document.getElementById('modalAddToCart');

// Submit Elements
const submitOrderBtn = document.getElementById('submitOrderBtn');
const successModal = document.getElementById('successModal');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');

// Initialize App
function init() {
    renderProducts();
    setupEventListeners();
    updateCartUI();
}

// Render Products Card with Mouse Hover Back Image Effect & Auto % OFF
function renderProducts() {
    if (!productGrid) return;

    const filtered = productsData.filter(p => {
        const matchesCategory = currentFilter === 'all' || p.category === currentFilter;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (productCount) productCount.textContent = filtered.length;

    productGrid.innerHTML = filtered.map(product => {
        // Auto Discount Percentage Calculation
        let discountBadge = '';
        if (product.oldPrice && product.oldPrice > product.price) {
            const discountPercent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
            discountBadge = `<span class="absolute top-2 right-2 z-10 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-brand-red text-white shadow-lg">${discountPercent}% OFF</span>`;
        }

        const frontImg = product.colors[0].img;
        const backImg = product.colors[0].backImg ? product.colors[0].backImg : frontImg; // ব্যাক ইমেজ না থাকলে ফ্রন্ট ইমেজই থাকবে[cite: 2]

        return `
            <div class="bg-brand-card border border-brand-border hover:border-brand-red rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 group">
                <div>
                    <div class="relative w-full h-52 bg-zinc-950 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2">
                        <!-- Auto Discount Percentage Badge -->
                        ${discountBadge}

                        <!-- Mouse Hover Front & Back Image Swap Effect -->
                        <img src="${frontImg}" alt="${product.title}" class="absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                        <img src="${backImg}" alt="${product.title} Back" class="absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    </div>
                    <h3 class="text-xs font-bold text-white line-clamp-1 cursor-pointer" onclick="openModal(${product.id})">${product.title}</h3>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="text-sm font-black text-brand-red">৳${product.price}</span>
                        ${product.oldPrice ? `<span class="text-[10px] text-gray-500 line-through">৳${product.oldPrice}</span>` : ''}
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2 mt-3">
                    <button onclick="openModal(${product.id})" class="py-2 bg-zinc-900 border border-brand-border text-[11px] font-bold text-gray-200 rounded-lg hover:bg-zinc-800 transition">Details</button>
                    <button onclick="quickAddToCart(${product.id})" class="py-2 bg-brand-red text-[11px] font-bold text-white rounded-lg hover:bg-red-700 transition">Add</button>
                </div>
            </div>
        `;
    }).join('');
}

// Open Details Modal
window.openModal = function(id) {
    selectedModalProduct = productsData.find(p => p.id === id);
    if (!selectedModalProduct) return;

    selectedColorIndex = 0;
    selectedModalQty = 1;
    selectedSize = 'L';

    modalCategory.textContent = selectedModalProduct.category === 'cap' ? 'Trucker Cap' : 'Drop Shoulder';
    modalTitle.textContent = selectedModalProduct.title;
    modalPrice.textContent = `৳${selectedModalProduct.price}`;
    modalOldPrice.textContent = selectedModalProduct.oldPrice ? `৳${selectedModalProduct.oldPrice}` : '';
    modalDesc.textContent = selectedModalProduct.description;
    modalImage.src = selectedModalProduct.colors[0].img;
    modalQty.textContent = selectedModalQty;

    if (selectedModalProduct.category === 'tshirt') {
        modalSizeContainer.classList.remove('hidden');
    } else {
        modalSizeContainer.classList.add('hidden');
    }

    modalColorSwatches.innerHTML = selectedModalProduct.colors.map((c, idx) => `
        <button onclick="selectModalColor(${idx})" class="w-6 h-6 rounded-full border-2 ${idx === 0 ? 'border-brand-red scale-110' : 'border-gray-600'}" style="background-color: ${c.code}" title="${c.name}"></button>
    `).join('');

    productModal.classList.remove('opacity-0', 'pointer-events-none');
    modalContainer.classList.remove('scale-95');
    modalContainer.classList.add('scale-100');
};

// Select Color Swatch in Modal
window.selectModalColor = function(idx) {
    selectedColorIndex = idx;
    modalImage.src = selectedModalProduct.colors[idx].img;
    const buttons = modalColorSwatches.querySelectorAll('button');
    buttons.forEach((btn, i) => {
        btn.className = (i === idx) ? "w-6 h-6 rounded-full border-2 border-brand-red scale-110" : "w-6 h-6 rounded-full border-2 border-gray-600";
    });
};

// Quick Add to Cart
window.quickAddToCart = function(id) {
    const p = productsData.find(item => item.id === id);
    if (p) addToCart(p, p.colors[0].name, p.category === 'tshirt' ? 'L' : 'Free Size', 1);
};

// Cart Logic
function addToCart(product, color, size, qty) {
    const existing = cart.find(item => item.id === product.id && item.color === color && item.size === size);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            img: product.colors[selectedColorIndex] ? product.colors[selectedColorIndex].img : product.colors[0].img,
            color: color,
            size: size,
            qty: qty
        });
    }
    updateCartUI();
    openCartDrawer();
}

function updateCartUI() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) {
        cartBadge.textContent = totalQty;
        cartBadge.classList.toggle('scale-0', totalQty === 0);
    }

    if (!cartItemsList) return;

    if (cart.length === 0) {
        cartItemsList.innerHTML = `<p class="text-center text-xs text-gray-500 py-6">Cart is empty.</p>`;
        if (cartSubtotal) cartSubtotal.textContent = '৳0';
        if (cartTotal) cartTotal.textContent = '৳0';
        return;
    }

    let subtotal = 0;
    cartItemsList.innerHTML = cart.map((item, index) => {
        subtotal += item.price * item.qty;
        return `
            <div class="flex items-center gap-3 bg-zinc-950 p-2.5 rounded-xl border border-brand-border">
                <img src="${item.img}" class="w-12 h-12 object-contain rounded bg-black">
                <div class="flex-1">
                    <h4 class="text-xs font-bold text-white line-clamp-1">${item.title}</h4>
                    <p class="text-[10px] text-gray-400">Color: ${item.color} | Size: ${item.size}</p>
                    <span class="text-xs font-bold text-brand-red">৳${item.price} x ${item.qty}</span>
                </div>
                <button onclick="removeCartItem(${index})" class="text-gray-500 hover:text-brand-red text-xs p-1"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    }).join('');

    const deliveryCharge = custAreaSelect && custAreaSelect.value === 'outside' ? 130 : 70;
    if (deliveryChargeText) deliveryChargeText.textContent = `৳${deliveryCharge}`;
    if (cartSubtotal) cartSubtotal.textContent = `৳${subtotal}`;
    if (cartTotal) cartTotal.textContent = `৳${subtotal + deliveryCharge}`;
}

window.removeCartItem = function(i) {
    cart.splice(i, 1);
    updateCartUI();
};

function openCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('pointer-events-none');
    if (cartOverlay) cartOverlay.classList.replace('opacity-0', 'opacity-100');
    if (cartPanel) cartPanel.classList.remove('translate-x-full');
}

function closeCartDrawer() {
    if (!cartDrawer) return;
    if (cartOverlay) cartOverlay.classList.replace('opacity-100', 'opacity-0');
    if (cartPanel) cartPanel.classList.add('translate-x-full');
    setTimeout(() => cartDrawer.classList.add('pointer-events-none'), 300);
}

// Setup Event Listeners
function setupEventListeners() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.replace('bg-brand-red', 'bg-zinc-900'));
            btn.classList.replace('bg-zinc-900', 'bg-brand-red');
            currentFilter = btn.dataset.category;
            renderProducts();
        });
    });

    const handleSearch = (e) => { searchQuery = e.target.value; renderProducts(); };
    if (searchInput) searchInput.addEventListener('input', handleSearch);
    if (searchInputMobile) searchInputMobile.addEventListener('input', handleSearch);

    if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
    if (closeCart) closeCart.addEventListener('click', closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);
    if (custAreaSelect) custAreaSelect.addEventListener('change', updateCartUI);

    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('bg-brand-red', 'text-white'));
            btn.classList.add('bg-brand-red', 'text-white');
            selectedSize = btn.dataset.size;
        });
    });

    if (modalQtyMinus) modalQtyMinus.addEventListener('click', () => { if (selectedModalQty > 1) modalQty.textContent = --selectedModalQty; });
    if (modalQtyPlus) modalQtyPlus.addEventListener('click', () => { modalQty.textContent = ++selectedModalQty; });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            productModal.classList.add('opacity-0', 'pointer-events-none');
        });
    }

    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', () => {
            if (!selectedModalProduct) return;
            addToCart(selectedModalProduct, selectedModalProduct.colors[selectedColorIndex].name, selectedModalProduct.category === 'tshirt' ? selectedSize : 'Free Size', selectedModalQty);
            productModal.classList.add('opacity-0', 'pointer-events-none');
        });
    }

    // Google Sheets Order Submission
    if (submitOrderBtn) {
        submitOrderBtn.addEventListener('click', () => {
            const name = document.getElementById('custName').value.trim();
            const phone = document.getElementById('custPhone').value.trim();
            const address = document.getElementById('custAddress').value.trim();
            const areaSelect = document.getElementById('custArea');
            const area = areaSelect ? areaSelect.value : 'inside';

            if (cart.length === 0) {
                alert("Your shopping cart is empty!");
                return;
            }

            if (!name || !phone || !address) {
                alert("Please fill up Name, Phone, and Address fields.");
                return;
            }

            const orderId = '#CH-' + Math.floor(1000 + Math.random() * 9000);
            let itemsSummary = cart.map(item => `${item.title} (${item.color}, Size: ${item.size}) x ${item.qty}`).join(' | ');
            const totalAmount = cartTotal ? cartTotal.textContent : '';
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzlCqm-EfGTt-g14xrWf_vEgLFJfa2S4PZBS4dL-SzxJS6Yf8Y3lSaIHZxRktNFh95A8g/exec';

            const orderData = {
                orderId: orderId,
                name: name,
                phone: phone,
                address: address,
                area: area === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka',
                items: itemsSummary,
                total: totalAmount
            };

            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            }).then(() => {
                document.getElementById('successOrderId').textContent = orderId;
                document.getElementById('successCustName').textContent = name;
                document.getElementById('successTotal').textContent = totalAmount;

                closeCartDrawer();
                if (successModal) successModal.classList.remove('opacity-0', 'pointer-events-none');

                cart = [];
                const form = document.getElementById('orderCheckoutForm');
                if (form) form.reset();
                updateCartUI();
            }).catch(error => {
                console.error('Error!', error.message);
                alert("Something went wrong while submitting the order. Please try again.");
            });
        });
    }

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            if (successModal) successModal.classList.add('opacity-0', 'pointer-events-none');
        });
    }
}

document.addEventListener('DOMContentLoaded', init);