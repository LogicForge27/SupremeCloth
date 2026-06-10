const boysShirts = [];
const ladiesSkirts = [];

// Generate 50 Boys Shirts
const shirtNames = ["Casual Blue", "Striped Polo", "Graphic Print", "Denim Button", "Formal White", "Slim Fit Check", "Oxford Shirt", "Henley Tee", "Flannel Shirt", "Plaid Shirt"];
for (let i = 1; i <= 50; i++) {
    const nameBase = shirtNames[(i-1) % shirtNames.length];
    boysShirts.push({
        id: i,
        name: `${nameBase} Shirt ${i}`,
        actualPrice: 499 + Math.floor(Math.random() * 400),
        salePrice: 100,
        discount: "75-85%",
        img: `https://picsum.photos/id/${(100 + (i % 30))}/300/300`
    });
}

// Generate 50 Ladies Skirts
const skirtNames = ["Floral Maxi", "Denim Mini", "Pleated Midi", "A-Line", "Summer Print", "Tulle Skirt", "Pencil Skirt", "Wrap Skirt", "High Waisted", "Boho"];
for (let i = 1; i <= 50; i++) {
    const nameBase = skirtNames[(i-1) % skirtNames.length];
    ladiesSkirts.push({
        id: 50 + i,
        name: `${nameBase} Skirt ${i}`,
        actualPrice: 599 + Math.floor(Math.random() * 500),
        salePrice: 100,
        discount: "80-90%",
        img: `https://picsum.photos/id/${(200 + (i % 30))}/300/300`
    });
}

let currentProduct = null;
let selectedSize = 'M'; // default

// Render products
function renderProducts() {
    const boysGrid = document.getElementById('boys-grid');
    boysGrid.innerHTML = '';
    boysShirts.forEach(product => {
        const card = createProductCard(product, 'boys');
        boysGrid.appendChild(card);
    });

    const ladiesGrid = document.getElementById('ladies-grid');
    ladiesGrid.innerHTML = '';
    ladiesSkirts.forEach(product => {
        const card = createProductCard(product, 'ladies');
        ladiesGrid.appendChild(card);
    });
}

function createProductCard(product, category) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.img}" alt="${product.name}" loading="lazy">
        <h3>${product.name}</h3>
        <p class="price">
            <span class="actual-price">₹${product.actualPrice}</span>
            <span class="sale-price">₹${product.salePrice}</span>
            <span class="discount">(${product.discount} OFF)</span>
        </p>
        <div class="size-select">
            <label>Size: </label>
            <select onchange="selectSize(this.value)">
                <option value="S">S</option>
                <option value="M" selected>M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
            </select>
        </div>
        <button onclick="openOrderModal(${product.id}, '${category}')">Order Now - COD Available</button>
    `;
    return card;
}

function selectSize(size) {
    selectedSize = size;
}

function openOrderModal(id, category) {
    const allProducts = [...boysShirts, ...ladiesSkirts];
    currentProduct = allProducts.find(p => p.id === id);
    if (!currentProduct) return;

    document.getElementById('product-info').innerHTML = `
        <h3>${currentProduct.name}</h3>
        <p class="price">
            <span class="actual-price">₹${currentProduct.actualPrice}</span>
            <span class="sale-price">₹${currentProduct.salePrice}</span>
            <span class="discount">(${currentProduct.discount} OFF)</span>
        </p>
        <p><strong>Selected Size:</strong> ${selectedSize}</p>
        <p style="color: green; font-weight: bold;">✅ COD (Cash on Delivery) Available</p>
    `;
    document.getElementById('order-modal').style.display = 'block';
}

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('order-modal').style.display = 'none';
});

document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('customer-name').value;
    const mobile = document.getElementById('customer-mobile').value;

    if (!name || !mobile) {
        alert("Please fill all fields");
        return;
    }

    // Get location with higher accuracy
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy  // in meters
                };
                saveOrder(name, mobile, location);
            },
            (error) => {
                console.error("Location error:", error);
                saveOrder(name, mobile, { latitude: null, longitude: null, accuracy: null });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        saveOrder(name, mobile, { latitude: null, longitude: null, accuracy: null });
    }
});

function saveOrder(name, mobile, location) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push({
        product: { ...currentProduct, selectedSize },
        customer: { name, mobile },
        location,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert("Order placed successfully! Location retrieved. Size: " + selectedSize);
    document.getElementById('order-modal').style.display = 'none';
    document.getElementById('order-form').reset();
}

// Initialize
renderProducts();