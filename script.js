const boysShirts = [
    { id: 1, name: "Casual Blue Shirt", price: 100, img: "https://www.bing.com/images/search?view=detailV2&ccid=35aGNw3v&id=B91742F83E28F4F78CBD4CC9C8E881E1C2A4D0DB&thid=OIP.35aGNw3v7vot8Eynjltg6wHaJr&mediaurl=https%3a%2f%2fm.media-amazon.com%2fimages%2fI%2f71Y722irfzL._AC_SL1500_.jpg&exph=1500&expw=1147&q=casual+blue+shirt&FORM=IRPRST&ck=9EF2E057DB4234566B81F19447E953CF&selectedIndex=2&itb=0" },
    { id: 2, name: "Striped Polo", price: 100, img: "https://picsum.photos/id/106/300/200" },
    { id: 3, name: "Graphic Tee", price: 150, img: "https://picsum.photos/id/201/300/200" },
    { id: 4, name: "Denim Shirt", price: 119, img: "https://picsum.photos/id/133/300/200" },
    { id: 5, name: "Formal White Shirt", price: 200, img: "https://picsum.photos/id/1060/300/200" }
];

const ladiesSkirts = [
    { id: 6, name: "Floral Maxi Skirt", price: 139, img: "https://picsum.photos/id/1016/300/200" },
    { id: 7, name: "Denim Mini Skirt", price: 140, img: "https://picsum.photos/id/133/300/200" },
    { id: 8, name: "Pleated Midi Skirt", price: 119, img: "https://picsum.photos/id/201/300/200" },
    { id: 9, name: "A-Line Black Skirt", price: 129, img: "https://picsum.photos/id/106/300/200" },
    { id: 10, name: "Summer Print Skirt", price: 100, img: "https://picsum.photos/id/1015/300/200" }
];

let currentProduct = null;

// Render products
function renderProducts() {
    const boysGrid = document.getElementById('boys-grid');
    boysShirts.forEach(product => {
        const card = createProductCard(product);
        boysGrid.appendChild(card);
    });

    const ladiesGrid = document.getElementById('ladies-grid');
    ladiesSkirts.forEach(product => {
        const card = createProductCard(product);
        ladiesGrid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <button onclick="openOrderModal(${product.id})">Order Now</button>
    `;
    return card;
}

function openOrderModal(id) {
    const allProducts = [...boysShirts, ...ladiesSkirts];
    currentProduct = allProducts.find(p => p.id === id);
    if (!currentProduct) return;

    document.getElementById('product-info').innerHTML = `
        <h3>${currentProduct.name}</h3>
        <p>Price: ₹${currentProduct.price}</p>
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

    // Get location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                saveOrder(name, mobile, location);
            },
            (error) => {
                console.error("Location error:", error);
                saveOrder(name, mobile, { latitude: null, longitude: null });
            }
        );
    } else {
        saveOrder(name, mobile, { latitude: null, longitude: null });
    }
});

function saveOrder(name, mobile, location) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push({
        product: currentProduct,
        customer: { name, mobile },
        location,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert("Order placed successfully! Location retrieved.");
    document.getElementById('order-modal').style.display = 'none';
    document.getElementById('order-form').reset();
}

// Initialize
renderProducts();
