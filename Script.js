
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartScrollPosition = 0;
let lastTapTime = 0;
let lastTapElement = null;

function handleProductImageTap(event, index, type) {
    let currentTime = new Date().getTime();
    let tapDelay = currentTime - lastTapTime;

    if (
        lastTapElement === event.currentTarget &&
        tapDelay < 500 &&
        tapDelay > 0
    ) {

        event.preventDefault();
        openProductDetail(index, type);
        lastTapTime = 0;
        lastTapElement = null;
        return;
    }

    lastTapTime = currentTime;
    lastTapElement = event.currentTarget;

}
fetch("product.json")
    .then(response => response.json())
    .then(data => {

        let productContainer =
            document.getElementById("productContainer");

        if (productContainer) {
            productContainer.innerHTML = "";
            data.products.forEach((product, index) => {
                productContainer.innerHTML += `
                    <div class="col-md-3 col-sm-6 col-12 mb-4">
                        <div class="product-card">
                            <div class="product-image">
                                ${
                                    product.discount
                                        ? `<span class="discount-badge">${product.discount}</span>`
                                        : ""
                                }

                                <img
                                    src="${product.image}"
                                    class="img-fluid product-main-image"
                                    alt="${product.name}"
                                    ondblclick="openProductDetail(${index}, 'products')"
                                    ontouchend="handleProductImageTap(event, ${index}, 'products')"
                                >


                                <button
                                    type="button"
                                    class="add-cart"
                                    onclick="addToCart(${index}, 'products')">

                                    <i class="fa-solid fa-bag-shopping"></i>
                                    <span>Add to cart</span>
                                </button>
                            </div>


                            <p class="category">
                                ${product.category || ""}
                            </p>


                            <h5 class="product-name">
                                ${product.name}
                            </h5>


                            <p class="price">
                                ₹${product.price}
                            </p>
                        </div>
                  </div>
                `;
            });
        }


        /* ========================================
           SHOP PRODUCTS
        ======================================== */

        let shopContainer =
            document.getElementById("shopContainer");


        if (shopContainer) {

            shopContainer.innerHTML = "";
            data.aboutImages.forEach((product, index) => {
                shopContainer.innerHTML += `
                    <div class="col-lg-4 col-md-6 col-12 mb-4">
                        <div class="product-card">
                            <div class="product-image">
                                ${
                                    product.discount
                                        ? `<span class="discount-badge">${product.discount}</span>`
                                        : ""
                                }
                                <img
                                    src="${product.image}"
                                    class="img-fluid product-main-image"
                                    alt="${product.name}"
                                    ondblclick="openProductDetail(${index}, 'aboutImages')"
                                    ontouchend="handleProductImageTap(event, ${index}, 'aboutImages')"
                                >
                                <button
                                    type="button"
                                    class="add-cart"
                                    onclick="addToCart(${index}, 'aboutImages')">

                                    <i class="fa-solid fa-bag-shopping"></i>
                                    <span>Add to cart</span>
                                </button>

                                <button
                                    type="button"
                                    class="quick-view-btn"
                                    onclick="openQuickView(${index}, 'aboutImages')">
                                    <i class="fa-solid fa-eye"></i>
                                    <span>Quick view</span>
                                </button>
                            </div>


                            <p class="category">
                                ${product.category || ""}
                            </p>


                            <h5 class="product-name">
                                ${product.name}
                            </h5>


                            <p class="price">
                                ₹${product.price}
                            </p>

                        </div>
                    </div>
                `;
            });
        }


        /* ========================================
           CART PAGE
        ======================================== */

        let cartContainer =
            document.getElementById("cartContainer");

        if (cartContainer) {
            displayCartPage();
        }

        updateCartCount();
        updateCartPrice();
    })
    .catch(error => {
        console.log("Error:", error);
    });


/* =====================================================
   PRODUCT DETAIL PAGE
===================================================== */

function openProductDetail(index, type = "products") {

    fetch("product.json")
        .then(response => response.json())
        .then(data => {
            let product = null;
            if (type === "products") {
                product =
                    data.products[index];
            }

            if (type === "aboutImages") {

                product =
                    data.aboutImages[index];

            }
            if (!product) {
                console.log("Product not found");
                return;

            }

            localStorage.setItem(
                "selectedProduct",
                JSON.stringify(product)
            );
            localStorage.setItem(
                "selectedProductIndex",
                index
            );


            localStorage.setItem(
                "selectedProductType",
                type
            );


            window.location.href =
                "product.html?index=" +
                index +
                "&type=" +
                encodeURIComponent(type);

        })
        .catch(error => {

            console.log(
                "Product Detail Error:",
                error
            );
        });
}

/* =====================================================
   LOAD PRODUCT DETAIL
===================================================== */
function loadProductDetail() {

    let urlParams =
        new URLSearchParams(
            window.location.search
        );
    let urlIndex =
        urlParams.get("index");
    let urlType =
        urlParams.get("type");
    if (
        urlIndex === null ||
        !urlType
    ) {

        let storedProduct =
            JSON.parse(
                localStorage.getItem("selectedProduct")
            );
        if (!storedProduct) {
            return;
        }
        urlIndex =
            localStorage.getItem(
                "selectedProductIndex"
            );

        urlType =
            localStorage.getItem(
                "selectedProductType"
            ) || "products";

    }


    let currentIndex =
        Number(urlIndex);
    if (isNaN(currentIndex)) {
        return;
    }


    fetch("product.json")
        .then(response => response.json())
        .then(data => {

            let products =
                urlType === "aboutImages"
                    ? data.aboutImages
                    : data.products;


            if (
                !products ||
                products.length === 0
            ) {

                return;
            }


            if (!products[currentIndex]) {

                return;

            }


            let product =
                products[currentIndex];


            localStorage.setItem(
                "selectedProduct",
                JSON.stringify(product)
            );


            localStorage.setItem(
                "selectedProductIndex",
                currentIndex
            );


            localStorage.setItem(
                "selectedProductType",
                urlType
            );


            let image =
                document.getElementById(
                    "detailProductImage"
                );


            let category =
                document.getElementById(
                    "detailCategory"
                );


            let name =
                document.getElementById(
                    "detailProductName"
                );


            let price =
                document.getElementById(
                    "detailProductPrice"
                );


            let description =
                document.getElementById(
                    "detailDescription"
                );


            let bottomCategory =
                document.getElementById(
                    "detailCategoryBottom"
                );


            let tags =
                document.getElementById(
                    "detailTags"
                );


            let stickyImage =
                document.getElementById(
                    "stickyProductImage"
                );


            let stickyName =
                document.getElementById(
                    "stickyProductName"
                );


            let stickyPrice =
                document.getElementById(
                    "stickyProductPrice"
                );


            if (image) {

                image.src =
                    product.image;

                image.alt =
                    product.name;

            }


            if (category) {

                category.innerText =
                    product.category || "";

            }


            if (name) {

                name.innerText =
                    product.name;

            }


            if (price) {

                price.innerText =
                    "₹" +
                    Number(product.price).toFixed(2);

            }


            if (description) {

                description.innerText =
                    product.description ||
                    "Sagittis odio suscipit odio libero tellus fugit accusantium tincidunt scelerisque, officia mi augue, ullamcorper, pulvinar ex egestas venenatis proident, morbi, adipisci cumque ratione.";

            }


            if (bottomCategory) {

                bottomCategory.innerText =
                    product.category || "";

            }


            if (tags) {

                tags.innerText =
                    product.tags ||
                    product.category ||
                    "";

            }


            if (stickyImage) {

                stickyImage.src =
                    product.image;

                stickyImage.alt =
                    product.name;

            }


            if (stickyName) {

                stickyName.innerText =
                    product.name;

            }


            if (stickyPrice) {

                stickyPrice.innerText =
                    "₹" +
                    Number(product.price).toFixed(2);

            }

        })
        .catch(error => {

            console.log(
                "Product Detail Error:",
                error
            );

        });

}



/* =====================================================
   PRODUCT DETAIL PREVIOUS / NEXT
===================================================== */

function previousProduct() {

    let currentIndex =
        Number(
            localStorage.getItem(
                "selectedProductIndex"
            )
        );


    let type =
        localStorage.getItem(
            "selectedProductType"
        ) || "products";


    if (isNaN(currentIndex)) {

        return;

    }


    fetch("product.json")
        .then(response => response.json())
        .then(data => {

            let products =
                type === "aboutImages"
                    ? data.aboutImages
                    : data.products;


            if (
                !products ||
                products.length === 0
            ) {

                return;

            }


            if (currentIndex <= 0) {

                currentIndex =
                    products.length - 1;

            }

            else {

                currentIndex--;

            }
            let product =
                products[currentIndex];


            if (!product) {

                return;

            }


            localStorage.setItem(
                "selectedProduct",
                JSON.stringify(product)
            );


            localStorage.setItem(
                "selectedProductIndex",
                currentIndex
            );


            localStorage.setItem(
                "selectedProductType",
                type
            );


            window.location.href =
                "product.html?index=" +
                currentIndex +
                "&type=" +
                encodeURIComponent(type);

        })
        .catch(error => {

            console.log(
                "Previous Product Error:",
                error
            );

        });

}



function nextProduct() {

    let currentIndex =
        Number(
            localStorage.getItem(
                "selectedProductIndex"
            )
        );


    let type =
        localStorage.getItem(
            "selectedProductType"
        ) || "products";


    if (isNaN(currentIndex)) {

        return;

    }


    fetch("product.json")
        .then(response => response.json())
        .then(data => {

            let products =
                type === "aboutImages"
                    ? data.aboutImages
                    : data.products;


            if (
                !products ||
                products.length === 0
            ) {

                return;

            }


            if (
                currentIndex >=
                products.length - 1
            ) {

                currentIndex = 0;

            }

            else {

                currentIndex++;

            }


            let product =
                products[currentIndex];


            if (!product) {

                return;

            }


            localStorage.setItem(
                "selectedProduct",
                JSON.stringify(product)
            );


            localStorage.setItem(
                "selectedProductIndex",
                currentIndex
            );


            localStorage.setItem(
                "selectedProductType",
                type
            );


            window.location.href =
                "product.html?index=" +
                currentIndex +
                "&type=" +
                encodeURIComponent(type);

        })
        .catch(error => {

            console.log(
                "Next Product Error:",
                error
            );

        });

}



/* ========================================
   ADD TO CART
======================================== */

function addToCart(index, type) {

    fetch("product.json")
        .then(response => response.json())
        .then(data => {

            let product = null;


            if (type === "products") {

                product =
                    data.products[index];

            }


            if (type === "aboutImages") {

                product =
                    data.aboutImages[index];

            }


            if (!product) {

                console.log("Product not found");

                return;

            }


            let existingProduct =
                cart.find(
                    item =>
                        item.name === product.name
                );


            if (existingProduct) {

                existingProduct.quantity =
                    Number(
                        existingProduct.quantity || 1
                    ) + 1;

            }

            else {

                cart.push({

                    category:
                        product.category || "",

                    name:
                        product.name,

                    price:
                        Number(product.price),

                    image:
                        product.image,

                    quantity: 1

                });

            }


            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            updateCartCount();
            updateCartPrice();

        })
        .catch(error => {

            console.log(
                "Add to cart Error:",
                error
            );

        });

}



/* ========================================
   CART COUNT
======================================== */

function updateCartCount() {

    let cartCount =
        document.getElementById("cartCount");


    let totalItems = 0;


    cart.forEach(product => {

        totalItems +=
            Number(product.quantity || 1);

    });


    if (cartCount) {

        cartCount.innerText =
            totalItems;

    }

}



/* ========================================
   CART TOTAL
======================================== */

function updateCartPrice() {

    let totalPrice = 0;


    cart.forEach(product => {

        let quantity =
            Number(product.quantity || 1);

        let price =
            Number(product.price || 0);


        totalPrice +=
            price * quantity;

    });


    let cartPrice =
        document.getElementById("cartTotal");


    if (cartPrice) {

        cartPrice.innerText =
            "₹" + totalPrice.toFixed(2);

    }

}



/* ========================================
   OPEN CART SIDEBAR
======================================== */

function openCartSidebar() {

    let sidebar =
        document.getElementById("cartSidebar");


    let overlay =
        document.getElementById("cartOverlay");


    if (!sidebar) {

        return;

    }


    cartScrollPosition =
        window.scrollY;


    sidebar.classList.add("active");


    if (overlay) {

        overlay.classList.add("active");

    }


    document.documentElement.classList.add(
        "cart-open"
    );


    document.body.classList.add(
        "cart-open"
    );


    document.body.style.top =
        `-${cartScrollPosition}px`;


    showCart();

}



/* ========================================
   CLOSE CART SIDEBAR
======================================== */

function closeCartSidebar() {

    let sidebar =
        document.getElementById("cartSidebar");


    let overlay =
        document.getElementById("cartOverlay");


    if (sidebar) {

        sidebar.classList.remove("active");

    }


    if (overlay) {

        overlay.classList.remove("active");

    }


    document.documentElement.classList.remove(
        "cart-open"
    );


    document.body.classList.remove(
        "cart-open"
    );


    document.body.style.top = "";


    window.scrollTo(
        0,
        cartScrollPosition
    );

}



/* ========================================
   CLOSE CART
======================================== */

function closeCart() {

    closeCartSidebar();

}



/* ========================================
   SHOW CART
======================================== */

function showCart() {

    let cartItems =
        document.getElementById("cartItems");


    if (!cartItems) {

        return;

    }


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                Your cart is empty

            </div>

        `;


        updateSidebarTotal();

        return;

    }


    cart.forEach((product, index) => {

        let quantity =
            Number(product.quantity || 1);


        let productTotal =
            Number(product.price || 0) *
            quantity;


        cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="${product.image}"
                    class="cart-item-image"
                    alt="${product.name}">


                <div class="cart-item-details">

                    <h4>
                        ${product.name}
                    </h4>


                    <div class="quantity-box">

                        <button
                            type="button"
                            class="quantity-btn"
                            onclick="decreaseQuantity(${index})">

                            −

                        </button>


                        <span>
                            ${quantity}
                        </span>


                        <button
                            type="button"
                            class="quantity-btn"
                            onclick="increaseQuantity(${index})">

                            +

                        </button>

                    </div>

                </div>


                <div class="cart-item-right">

                    <button
                        type="button"
                        class="remove-item"
                        onclick="removeFromCart(${index})"
                        aria-label="Remove product">

                        <i class="fa-solid fa-xmark"></i>

                    </button>


                    <span class="item-price">

                        ₹${productTotal.toFixed(2)}

                    </span>

                </div>

            </div>

        `;

    });


    updateSidebarTotal();

}



/* ========================================
   SIDEBAR TOTAL
======================================== */

function updateSidebarTotal() {

    let sidebarTotal =
        document.getElementById("sidebarTotal");


    if (!sidebarTotal) {

        return;

    }


    let total = 0;


    cart.forEach(product => {

        let quantity =
            Number(product.quantity || 1);

        let price =
            Number(product.price || 0);


        total +=
            price * quantity;

    });


    sidebarTotal.innerText =
        "₹" + total.toFixed(2);

}



/* ========================================
   INCREASE QUANTITY
======================================== */

function increaseQuantity(index) {

    if (!cart[index]) {

        return;

    }


    cart[index].quantity =
        Number(cart[index].quantity || 1) + 1;


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();
    updateCartPrice();


    showCart();
    displayCartPage();

}



/* ========================================
   DECREASE QUANTITY
======================================== */

function decreaseQuantity(index) {

    if (!cart[index]) {

        return;

    }


    let quantity =
        Number(cart[index].quantity || 1);


    if (quantity > 1) {

        cart[index].quantity =
            quantity - 1;

    }

    else {

        cart.splice(index, 1);

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();
    updateCartPrice();


    showCart();
    displayCartPage();

}



/* ========================================
   REMOVE PRODUCT
======================================== */

function removeFromCart(index) {

    if (!cart[index]) {

        return;

    }


    cart.splice(index, 1);


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();
    updateCartPrice();


    showCart();
    displayCartPage();

}



/* ========================================
   CART PAGE
======================================== */

function displayCartPage() {

    let cartContainer =
        document.getElementById("cartContainer");


    if (!cartContainer) {

        return;

    }


    cartContainer.innerHTML = "";


    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <h4 class="text-center">

                Your cart is empty

            </h4>

        `;


        updateCartSummary(0, 0);

        return;

    }


    let totalItems = 0;
    let grandTotal = 0;


    cart.forEach((product, index) => {

        let quantity =
            Number(product.quantity || 1);


        let productTotal =
            Number(product.price || 0) *
            quantity;


        totalItems += quantity;
        grandTotal += productTotal;


        cartContainer.innerHTML += `

            <div class="col-md-3 mb-4">

                <div class="cart-page-item">

                    <img
                        src="${product.image}"
                        class="img-fluid"
                        alt="${product.name}">


                    <h5>
                        ${product.name}
                    </h5>


                    <p>
                        Price: ₹${product.price}
                    </p>


                    <div class="quantity-box">

                        <button
                            type="button"
                            class="quantity-btn"
                            onclick="decreaseQuantity(${index})">

                            −

                        </button>


                        <span>
                            ${quantity}
                        </span>


                        <button
                            type="button"
                            class="quantity-btn"
                            onclick="increaseQuantity(${index})">

                            +

                        </button>

                    </div>


                    <p class="item-total">

                        Total:
                        ₹${productTotal.toFixed(2)}

                    </p>


                    <button
                        type="button"
                        class="btn btn-danger"
                        onclick="removeFromCart(${index})">

                        Remove

                    </button>

                </div>

            </div>

        `;

    });


    updateCartSummary(
        totalItems,
        grandTotal
    );

}



/* ========================================
   CART PAGE SUMMARY
======================================== */

function updateCartSummary(
    totalItems,
    grandTotal
) {

    let cartItemCount =
        document.getElementById("cartItemCount");


    let cartSubtotal =
        document.getElementById("cartSubtotal");


    let cartPageTotal =
        document.getElementById("cartPageTotal");


    if (cartItemCount) {

        cartItemCount.innerText =
            totalItems;

    }


    if (cartSubtotal) {

        cartSubtotal.innerText =
            grandTotal.toFixed(2);

    }


    if (cartPageTotal) {

        let shipment =
            grandTotal > 0 ? 8 : 0;


        cartPageTotal.innerText =
            (grandTotal + shipment).toFixed(2);

    }

}



/* ========================================
   NAVBAR CART
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        let openCart =
            document.getElementById("openCart");


        let closeCartButton =
            document.getElementById("closeCart");


        let overlay =
            document.getElementById("cartOverlay");


        if (openCart) {

            openCart.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    openCartSidebar();

                }
            );

        }


        if (closeCartButton) {

            closeCartButton.addEventListener(
                "click",
                function () {

                    closeCartSidebar();

                }
            );

        }


        if (overlay) {

            overlay.addEventListener(
                "click",
                function () {

                    closeCartSidebar();

                }
            );

        }


        updateCartCount();
        updateCartPrice();

    }
);



/* ========================================
   ESC KEY
======================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeCartSidebar();
            closeQuickView();

        }

    }
);



/* =====================================================
   VIEW CART PAGE
===================================================== */

function loadViewCart() {

    let container =
        document.getElementById(
            "viewCartContainer"
        );


    if (!container) {

        return;

    }


    let viewCart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    if (viewCart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">

                    <i class="fa-solid fa-bag-shopping"></i>

                </div>


                <h2>
                    Your cart is currently empty.
                </h2>


                <p>
                    Browse our products and add something
                    beautiful to your cart.
                </p>


                <a
                    href="Shop.html"
                    class="continue-shopping">

                    Return to shop

                </a>

            </div>

        `;


        updateViewCartNavbar();

        return;

    }


    let subtotal = 0;


    viewCart.forEach(function (item) {

        let price =
            Number(item.price) || 0;


        let quantity =
            Number(item.quantity) || 1;


        subtotal +=
            price * quantity;

    });


    let shipping = 8;


    let total =
        subtotal + shipping;


    let productsHTML = "";


    viewCart.forEach(function (item, index) {

        let price =
            Number(item.price) || 0;


        let quantity =
            Number(item.quantity) || 1;


        let itemTotal =
            price * quantity;


        productsHTML += `

            <div class="cart-product">

                <div class="cart-product-details">

                    <button
                        type="button"
                        class="remove-product"
                        onclick="removeViewCartProduct(${index})">

                        <i class="fa-solid fa-xmark"></i>

                    </button>


                    <img
                        src="${item.image}"
                        class="cart-product-image"
                        alt="${item.name}">


                    <div>

                        <h3>
                            ${item.name}
                        </h3>


                        <p>
                            ₹${price.toFixed(2)}
                        </p>

                    </div>

                </div>


                <div class="cart-quantity">

                    <button
                        type="button"
                        onclick="decreaseViewCartQuantity(${index})">

                        −

                    </button>


                    <span>
                        ${quantity}
                    </span>


                    <button
                        type="button"
                        onclick="increaseViewCartQuantity(${index})">

                        +

                    </button>

                </div>


                <div class="cart-product-total">

                    ₹${itemTotal.toFixed(2)}

                </div>

            </div>

        `;

    });


    container.innerHTML = `

        <div class="cart-layout">

            <div class="cart-left">

                <div class="cart-header-row">

                    <div>
                        Product
                    </div>

                    <div>
                        Quantity
                    </div>

                    <div>
                        Subtotal
                    </div>

                </div>


                <div class="cart-products">

                    ${productsHTML}

                </div>


                <div class="coupon-section">

                    <button
                        type="button"
                        class="coupon-toggle"
                        onclick="openViewCartCoupon()">

                        Have a coupon?

                    </button>


                    <div
                        class="coupon-box"
                        id="viewCartCouponBox">

                        <input
                            type="text"
                            id="viewCartCouponInput"
                            placeholder="Coupon code">


                        <button
                            type="button"
                            onclick="applyViewCartCoupon()">

                            Apply coupon

                        </button>

                    </div>


                    <p id="viewCartCouponMessage"></p>

                </div>


                <div class="continue-box">

                    <a href="Shop.html">

                        <i class="fa-solid fa-arrow-left"></i>

                        Continue shopping

                    </a>

                </div>

            </div>


            <div class="cart-right">

                <div class="cart-total-box">

                    <h2>
                        Cart totals
                    </h2>


                    <div class="total-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ₹${subtotal.toFixed(2)}
                        </strong>

                    </div>


                    <div class="shipping-row">

                        <span>
                            Shipping
                        </span>


                        <div>

                            <p>
                                Flat rate:
                                <strong>₹8.00</strong>
                            </p>


                            <p>
                                Shipping to
                                <strong>India</strong>.
                            </p>


                            <a href="#">
                                Change address
                            </a>

                        </div>

                    </div>


                    <div class="total-final">

                        <span>
                            Total
                        </span>


                        <strong>
                            ₹${total.toFixed(2)}
                        </strong>

                    </div>


                    <a
                        href="checkout.html"
                        class="checkout-button">

                        Proceed to checkout

                    </a>

                </div>

            </div>

        </div>

    `;


    updateViewCartNavbar();

}



/* =====================================================
   VIEW CART NAVBAR
===================================================== */

function updateViewCartNavbar() {

    let currentCart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    let total = 0;
    let count = 0;


    currentCart.forEach(function (item) {

        let price =
            Number(item.price) || 0;


        let quantity =
            Number(item.quantity) || 1;


        total +=
            price * quantity;


        count += quantity;

    });


    let navTotal =
        document.getElementById("navCartTotal");


    let navCount =
        document.getElementById("cartCount");


    if (navTotal) {

        navTotal.innerText =
            "₹" + total.toFixed(2);

    }


    if (navCount) {

        navCount.innerText =
            count;

    }

}



/* =====================================================
   VIEW CART QUANTITY
===================================================== */

function increaseViewCartQuantity(index) {

    let currentCart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    if (!currentCart[index]) {

        return;

    }


    currentCart[index].quantity =
        Number(
            currentCart[index].quantity || 1
        ) + 1;


    localStorage.setItem(
        "cart",
        JSON.stringify(currentCart)
    );


    cart = currentCart;


    loadViewCart();


    updateCartCount();
    updateCartPrice();

}



function decreaseViewCartQuantity(index) {

    let currentCart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    if (!currentCart[index]) {

        return;

    }


    let quantity =
        Number(
            currentCart[index].quantity || 1
        );


    if (quantity > 1) {

        currentCart[index].quantity =
            quantity - 1;

    }

    else {

        currentCart.splice(index, 1);

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(currentCart)
    );


    cart = currentCart;


    loadViewCart();


    updateCartCount();
    updateCartPrice();

}



function removeViewCartProduct(index) {

    let currentCart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    if (!currentCart[index]) {

        return;

    }


    currentCart.splice(index, 1);


    localStorage.setItem(
        "cart",
        JSON.stringify(currentCart)
    );


    cart = currentCart;


    loadViewCart();


    updateCartCount();
    updateCartPrice();

}



/* =====================================================
   COUPON
===================================================== */

function openViewCartCoupon() {

    let box =
        document.getElementById(
            "viewCartCouponBox"
        );


    if (box) {

        box.classList.toggle("show");

    }

}



function applyViewCartCoupon() {

    let input =
        document.getElementById(
            "viewCartCouponInput"
        );


    let message =
        document.getElementById(
            "viewCartCouponMessage"
        );


    if (!input || !message) {

        return;

    }


    let coupon =
        input.value.trim().toUpperCase();


    if (coupon === "AYUR10") {

        message.innerText =
            "Coupon applied successfully.";


        message.className =
            "success-message";

    }

    else {

        message.innerText =
            "Invalid coupon code.";


        message.className =
            "error-message";

    }

}



/* =====================================================
   ACCOUNT PASSWORD TOGGLE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const togglePassword =
            document.getElementById(
                "togglePassword"
            );


        const password =
            document.getElementById(
                "password"
            );


        if (togglePassword && password) {

            togglePassword.addEventListener(
                "click",
                function () {

                    if (
                        password.type ===
                        "password"
                    ) {

                        password.type =
                            "text";


                        this.classList.remove(
                            "fa-eye"
                        );


                        this.classList.add(
                            "fa-eye-slash"
                        );

                    }

                    else {

                        password.type =
                            "password";


                        this.classList.remove(
                            "fa-eye-slash"
                        );


                        this.classList.add(
                            "fa-eye"
                        );

                    }

                }
            );

        }

    }
);



/* =====================================================
   QUICK VIEW
===================================================== */

let quickViewProduct = null;

let quickViewQuantity = 1;



function openQuickView(index, type) {

    fetch("product.json")
        .then(response => response.json())
        .then(data => {

            let product = null;


            if (type === "products") {

                product =
                    data.products[index];

            }


            if (type === "aboutImages") {

                product =
                    data.aboutImages[index];

            }


            if (!product) {

                return;

            }


            quickViewProduct =
                product;


            quickViewQuantity =
                1;


            let overlay =
                document.getElementById(
                    "quickViewOverlay"
                );


            let image =
                document.getElementById(
                    "quickViewImage"
                );


            let category =
                document.getElementById(
                    "quickViewCategory"
                );


            let name =
                document.getElementById(
                    "quickViewName"
                );


            let price =
                document.getElementById(
                    "quickViewPrice"
                );


            let description =
                document.getElementById(
                    "quickViewDescription"
                );


            let bottomCategory =
                document.getElementById(
                    "quickViewCategoryBottom"
                );


            let tags =
                document.getElementById(
                    "quickViewTags"
                );


            let quantityElement =
                document.getElementById(
                    "quickViewQuantity"
                );


            let quickViewAdd =
                document.getElementById(
                    "quickViewAdd"
                );


            if (!overlay) {

                return;

            }


            if (image) {

                image.src =
                    product.image;

                image.alt =
                    product.name;

            }


            if (category) {

                category.innerText =
                    product.category || "";

            }


            if (name) {

                name.innerText =
                    product.name;

            }


            if (price) {

                price.innerText =
                    "₹" +
                    Number(product.price).toFixed(2);

            }


            if (description) {

                description.innerText =
                    product.description ||
                    "Sagittis odio suscipit odio libero tellus fugit accusantium tincidunt scelerisque, officia mi augue, ullamcorper, pulvinar ex egestas venenatis proident, morbi, adipisci cumque ratione.";

            }


            if (bottomCategory) {

                bottomCategory.innerText =
                    product.category || "";

            }


            if (tags) {

                tags.innerText =
                    product.tags ||
                    product.category ||
                    "";

            }


            if (quantityElement) {

                quantityElement.innerText =
                    "1";

            }


            if (quickViewAdd) {

                quickViewAdd.innerHTML =
                    "Add to cart";

            }


            overlay.classList.add(
                "active"
            );


            document.body.classList.add(
                "quick-view-open"
            );

        })
        .catch(error => {

            console.log(
                "Quick View Error:",
                error
            );

        });

}



/* =====================================================
   QUICK VIEW EVENTS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        let quickViewClose =
            document.getElementById(
                "quickViewClose"
            );


        let quickViewOverlay =
            document.getElementById(
                "quickViewOverlay"
            );


        let quickViewMinus =
            document.getElementById(
                "quickViewMinus"
            );


        let quickViewPlus =
            document.getElementById(
                "quickViewPlus"
            );


        let quickViewQuantityElement =
            document.getElementById(
                "quickViewQuantity"
            );


        let quickViewAdd =
            document.getElementById(
                "quickViewAdd"
            );


        if (quickViewClose) {

            quickViewClose.addEventListener(
                "click",
                function () {

                    closeQuickView();

                }
            );

        }


        if (quickViewOverlay) {

            quickViewOverlay.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        quickViewOverlay
                    ) {

                        closeQuickView();

                    }

                }
            );

        }


        if (
            quickViewMinus &&
            quickViewQuantityElement
        ) {

            quickViewMinus.addEventListener(
                "click",
                function () {

                    if (
                        quickViewQuantity > 1
                    ) {

                        quickViewQuantity--;

                        quickViewQuantityElement.innerText =
                            quickViewQuantity;

                    }

                }
            );

        }


        if (
            quickViewPlus &&
            quickViewQuantityElement
        ) {

            quickViewPlus.addEventListener(
                "click",
                function () {

                    quickViewQuantity++;

                    quickViewQuantityElement.innerText =
                        quickViewQuantity;

                }
            );

        }


        if (quickViewAdd) {

            quickViewAdd.addEventListener(
                "click",
                function () {

                    if (!quickViewProduct) {

                        return;

                    }


                    let existingProduct =
                        cart.find(
                            item =>
                                item.name ===
                                quickViewProduct.name
                        );


                    if (existingProduct) {

                        existingProduct.quantity =
                            Number(
                                existingProduct.quantity || 1
                            ) +
                            quickViewQuantity;

                    }

                    else {

                        cart.push({

                            category:
                                quickViewProduct.category || "",

                            name:
                                quickViewProduct.name,

                            price:
                                Number(
                                    quickViewProduct.price
                                ),

                            image:
                                quickViewProduct.image,

                            quantity:
                                quickViewQuantity

                        });

                    }


                    localStorage.setItem(
                        "cart",
                        JSON.stringify(cart)
                    );


                    updateCartCount();
                    updateCartPrice();


                    quickViewAdd.innerHTML =
                        'Added to cart <i class="fa-solid fa-check"></i>';

                }
            );

        }

    }
);



/* =====================================================
   CLOSE QUICK VIEW
===================================================== */

function closeQuickView() {

    let overlay =
        document.getElementById(
            "quickViewOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    document.body.classList.remove(
        "quick-view-open"
    );


    quickViewProduct = null;

    quickViewQuantity = 1;

}



/* =====================================================
   PRODUCT DETAIL ADD TO CART
===================================================== */

function addDetailProductToCart(clickedButton) {

    let product =
        JSON.parse(
            localStorage.getItem("selectedProduct")
        );


    if (!product) {

        console.log("Product not found");

        return;

    }


    let quantityElement =
        document.getElementById(
            "detailQuantity"
        );


    let quantity =
        Number(
            quantityElement?.innerText || 1
        );


    if (quantity < 1) {

        quantity = 1;

    }


    let existingProduct =
        cart.find(
            item =>
                item.name ===
                product.name
        );


    if (existingProduct) {

        existingProduct.quantity =
            Number(
                existingProduct.quantity || 1
            ) + quantity;

    }

    else {

        cart.push({

            category:
                product.category || "",

            name:
                product.name,

            price:
                Number(product.price),

            image:
                product.image,

            quantity:
                quantity

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();
    updateCartPrice();


    if (clickedButton) {

        clickedButton.innerHTML =
            'Added to cart <i class="fa-solid fa-check"></i>';

    }

}



/* =====================================================
   RELATED PRODUCTS
===================================================== */

function loadRelatedProducts() {

    let relatedContainer =
        document.getElementById(
            "relatedProducts"
        );


    if (!relatedContainer) {

        return;

    }


    let selectedProduct =
        JSON.parse(
            localStorage.getItem(
                "selectedProduct"
            )
        );


    if (!selectedProduct) {

        return;

    }


    fetch("product.json")
        .then(response => response.json())
        .then(data => {

            let allProducts = [

                ...data.products.map(product => ({
                    product: product,
                    type: "products",
                    index: data.products.indexOf(product)
                })),

                ...data.aboutImages.map(product => ({
                    product: product,
                    type: "aboutImages",
                    index: data.aboutImages.indexOf(product)
                }))

            ];


            let relatedProducts =
                allProducts
                    .filter(item =>
                        item.product.name !==
                        selectedProduct.name
                    )
                    .filter(item =>
                        item.product.category ===
                        selectedProduct.category
                    )
                    .slice(0, 3);


            if (relatedProducts.length < 3) {

                let remainingProducts =
                    allProducts
                        .filter(item =>
                            item.product.name !==
                            selectedProduct.name
                        )
                        .filter(item =>
                            !relatedProducts.some(
                                related =>
                                    related.product.name ===
                                    item.product.name
                            )
                        );


                relatedProducts = [

                    ...relatedProducts,

                    ...remainingProducts

                ].slice(0, 3);

            }


            relatedContainer.innerHTML = "";


            relatedProducts.forEach(item => {

                let product =
                    item.product;


                relatedContainer.innerHTML += `

                    <div class="product-detail-related-card">

                        <div class="product-detail-related-image">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                                ondblclick="openProductDetail(${item.index}, '${item.type}')"
                                ontouchend="handleProductImageTap(event, ${item.index}, '${item.type}')"
                            >


                            <button
                                type="button"
                                class="product-detail-related-cart"
                                onclick="addRelatedProductToCart(${item.index}, '${item.type}', this)">

                                <i class="fa-solid fa-bag-shopping"></i>

                            </button>


                            <button
                                type="button"
                                class="product-detail-related-view"
                                onclick="openProductDetail(${item.index}, '${item.type}')">

                                <i class="fa-solid fa-eye"></i>

                            </button>

                        </div>


                        <p class="product-detail-related-category">

                            ${product.category || ""}

                        </p>


                        <h3>

                            ${product.name}

                        </h3>


                        <p class="product-detail-related-price">

                            ₹${Number(product.price).toFixed(2)}

                        </p>

                    </div>

                `;

            });

        })
        .catch(error => {

            console.log(
                "Related Products Error:",
                error
            );

        });

}



/* =====================================================
   RELATED PRODUCT ADD TO CART
===================================================== */

function addRelatedProductToCart(
    index,
    type,
    clickedButton
) {

    fetch("product.json")
        .then(response => response.json())
        .then(data => {

            let product = null;


            if (type === "products") {

                product =
                    data.products[index];

            }


            if (type === "aboutImages") {

                product =
                    data.aboutImages[index];

            }


            if (!product) {

                return;

            }


            let existingProduct =
                cart.find(
                    item =>
                        item.name ===
                        product.name
                );


            if (existingProduct) {

                existingProduct.quantity =
                    Number(
                        existingProduct.quantity || 1
                    ) + 1;

            }

            else {

                cart.push({

                    category:
                        product.category || "",

                    name:
                        product.name,

                    price:
                        Number(product.price),

                    image:
                        product.image,

                    quantity: 1

                });

            }


            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            updateCartCount();
            updateCartPrice();


            if (clickedButton) {

                clickedButton.innerHTML =
                    '<i class="fa-solid fa-check"></i>';

            }

        })
        .catch(error => {

            console.log(
                "Related Add To Cart Error:",
                error
            );

        });

}



/* =====================================================
   PRODUCT DESCRIPTION / REVIEW TABS
===================================================== */

function showProductTab(tab) {

    let descriptionTab =
        document.getElementById("descriptionTab");


    let reviewsTab =
        document.getElementById("reviewsTab");


    let descriptionContent =
        document.getElementById("descriptionContent");


    let reviewsContent =
        document.getElementById("reviewsContent");


    if (!descriptionContent) {

        descriptionContent =
            document.getElementById("description");

    }


    if (!reviewsContent) {

        reviewsContent =
            document.getElementById("reviews");

    }


    if (!reviewsContent) {

        reviewsContent =
            document.getElementById("reviewContent");

    }


    if (!reviewsContent) {

        reviewsContent =
            document.getElementById("reviewForm");

    }


    if (tab === "description") {

        if (descriptionTab) {

            descriptionTab.classList.add("active");

        }


        if (reviewsTab) {

            reviewsTab.classList.remove("active");

        }


        if (descriptionContent) {

            descriptionContent.style.display =
                "block";

        }


        if (reviewsContent) {

            reviewsContent.style.display =
                "none";

        }

    }


    else if (tab === "reviews") {

        if (descriptionTab) {

            descriptionTab.classList.remove("active");

        }


        if (reviewsTab) {

            reviewsTab.classList.add("active");

        }


        if (descriptionContent) {

            descriptionContent.style.display =
                "none";

        }


        if (reviewsContent) {

            reviewsContent.style.display =
                "block";

        }

    }

}



/* =====================================================
   REVIEW TAB EVENTS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        let descriptionTab =
            document.getElementById(
                "descriptionTab"
            );


        let reviewsTab =
            document.getElementById(
                "reviewsTab"
            );


        if (descriptionTab) {

            descriptionTab.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    showProductTab(
                        "description"
                    );

                }
            );

        }


        if (reviewsTab) {

            reviewsTab.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    showProductTab(
                        "reviews"
                    );

                }
            );

        }


        showProductTab("description");

    }
);



/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProductDetail();

        loadRelatedProducts();

        loadViewCart();

    }
);
















