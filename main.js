const productContainer = document.querySelector(".product-container");
const cartaMenuContainer = document.querySelector(".carta-menu");
const optionsList = document.querySelectorAll(".menu");
const cartIcon = document.querySelector(".cart-label");
const cartBuy = document.querySelector(".cart");
const menuHam = document.querySelector(".menu-label");
const menuList = document.querySelector(".navbar-list");
const overlay = document.querySelector(".overlay");
const cartProducts = document.querySelector(".cart-container");
const cartTotal = document.querySelector(".total");
const addModal = document.querySelector(".add-modal");
const buyBtn = document.querySelector(".btn-buy");
const deleteBtn = document.querySelector(".btn-delete");
const cartCounter = document.querySelector(".cart-counter");


let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartLocalStorage = () => {
    localStorage.setItem("cart", JSON.stringify(cart))
}


const createProductTemplate = (product) => {
    const {id, name, price, cardImg, description} = product;
    return `
    <div class="product">
        <img src=${cardImg} alt=${name}>
        <div class="product-info">
            <div class="product-top">
                <h3>${name}</h3>
            </div>
            <div class="product-mid">
                <p>${description}</p>
            </div>
            <div class="product-bot">
                <span>$${price}</span>
                <button 
                    class="btn-add"
                    data-id="${id}"
                    data-name="${name}"
                    data-price="${price}"
                    data-img="${cardImg}"
                    >
                    Comprar
                </button>
            </div>
     
        </div>
    </div>
    `
}


const renderProducts = (productsList) => {
    productContainer.innerHTML = productsList.map(createProductTemplate).join("");
};



const isInactiveFilterBtn = (element) => {
    return (
        element.classList.contains("menu") &&
        !element.classList.contains("active")
    );
};


const changeBtnActiveState = (selectedMenu) => {
    const optionsMenu = [...optionsList];
    optionsMenu.forEach((menuBtn) => {
        if(menuBtn.dataset.menu !== selectedMenu) {
            menuBtn.classList.remove("active");
            return;
        }
        menuBtn.classList.add("active");    
    });
};


const changeFilterState = (btn) => {
    appState.activeFilter = btn.dataset.menu;
    changeBtnActiveState(appState.activeFilter);
};

const renderProductsDisplayed = () => {
    const filteredProducts = productData.filter((product) => {
        return product.menu === appState.activeFilter;
    });
    renderProducts(filteredProducts);
};


const applyFilter = ({ target }) => {
    if(!isInactiveFilterBtn(target)) {
        return;
    };

    changeFilterState(target);

    productContainer.innerHTML = "";
    if(appState.activeFilter) {
        renderProductsDisplayed();
        appState.currentProductsIndex = 0;
        return;
    }
};

const displayCart = () => {
    cartBuy.classList.toggle("open-cart");
    if(menuList.classList.contains("open-menu")) {
        menuList.classList.remove("open-menu")
        return;
    }
    overlay.classList.toggle("show-overlay");
};

const displayMenu = () => {
    menuList.classList.toggle("open-menu");
    if(cartBuy.classList.contains("open-cart")) {
        cartBuy.classList.remove("open-cart")
        return;
    }
    overlay.classList.toggle("show-overlay");
};

const closeOnScroll = () => {
    if(cartBuy.classList.contains("open-cart")) {
        return;
    }
    cartBuy.classList.remove("open-cart");
    menuList.classList.remove("open-menu");
    overlay.classList.remove("show-overlay");
};

const closeOnClick = (e) => {
    if(e.target.classList.contains("navbar-link")) {
        return;
    };
    menuList.classList.remove("open-menu");
    cartBuy.classList.remove("open-cart");
    overlay.classList.remove("show-overlay");
};


const closeOnScreenClick = () => {
	menuList.classList.remove("open-menu");
	cartBuy.classList.remove("open-cart");
	overlay.classList.remove("show-overlay");
}




//Logica del carrito

const createCartTemplate = (cartProduct) => {
    const {img, name, price, id, quantity} = cartProduct
    return `
    <div class="cart-item">
        <img src=${img} alt="">
        <div class="item-info">
            <h3 class="item-product">${name}</h3>
            <span class="item-price">$${price}</span>
        </div>
        <item class="item-handler">
            <span class="quantity-handler down" data-id=${id}>-</span>
            <span class="item-quantity">${quantity}</span>
            <span class="quantity-handler up" data-id=${id}>+</span>
        </item>
    </div>
`;
}

const renderCart = () => {
    if(!cart.length) {
        cartProducts.innerHTML = `<p class="empty-msg">No hay productos selecionados.</p>`;
        return;
    }
    cartProducts.innerHTML = cart.map(createCartTemplate).join("");
};

const getCartTotal = () => {
    return cart.reduce((accum, valor) => {
        return accum + valor.price * valor.quantity;
    }, 0);
};

const showCartTotal = () => {
    cartTotal.innerHTML = `$ ${getCartTotal()}`;
};

const createProductData = (product) => {
    const {id, name, price, img} = product;
    return {id, name, price, img}
};

const IsProductAlreadyAdded =  (productId) => {
    return cart.find((item) => {
        return item.id === productId;
    })
};

const addCartUnit = (product) => {
    cart = cart.map((cartProduct) => {
        return cartProduct.id === product.id 
                ? {...cartProduct, quantity: cartProduct.quantity + 1}
                : cartProduct
    });
};

const showAddModal = (msg) => {
    addModal.classList.add("active-modal");
    addModal.textContent = msg;
    setTimeout(() => {
        addModal.classList.remove("active-modal")
    }, 1500);
};

const createCartProduct = (product) => {
    cart = [
        ...cart,
        {
            ...product,
            quantity: 1,
        },
    ];
};

const disableBtn = (btn) => {
    if(!cart.length) {
        btn.classList.add("disabled");
    } else {
        btn.classList.remove("disabled");
    }
};

const renderCartCounter = () => {
	cartCounter.textContent = cart.reduce((acc, val) => {
		return acc + val.quantity;
	}, 0);
}
const updateCartChanges = () => {
    //Guardar carrito en Local Storage
    cartLocalStorage();
    //Renderizar carrito
    renderCart();
    //Mostrar el total del carrito
    showCartTotal();
    //Chequear disable de botones
    disableBtn(buyBtn);
    disableBtn(deleteBtn);
    //Render burbuja del cart
    renderCartCounter();
}

const addProduct = (e) => {
    if(!e.target.classList.contains("btn-add")) {
        return;
    }
    const product = createProductData(e.target.dataset);
    //si el producto ya estaba agregado:
    if(IsProductAlreadyAdded(product.id)) {
        //agregamos unidad al producto
        addCartUnit(product);
        //damos feedback
        showAddModal("Se añadió una unidad del producto al carrito");
    } else {
        //Si el producto no estaba agregado:
        //Creamos el nuevo producto en el array
        createCartProduct(product);
        //Damos feedback
        showAddModal("EL producto se añadió al carrito");

    }
    
    //actualizamos data del carrito
    updateCartChanges()
};


//Botones dentro del carrito

const removeCartProudct = (existingProduct) => {
    cart = cart.filter((product) => {
        return product.id !== existingProduct.id
    });
    updateCartChanges();
};

const substractUnit = (existingProduct) => {
    cart = cart.map((product) => {
        return product.id === existingProduct.id 
                ? {...product, quantity: product.quantity - 1}
                : product;
    });
};


const minusBtnCart = (id) => {
    const existingCartProduct = cart.find((item) => item.id === id);

    if(existingCartProduct.quantity === 1) {
        //Eliminar producto
        if(window.confirm("¿Desea eliminar el producto del carrito?")) {
            removeCartProudct(existingCartProduct);
            alert("El producto se eliminó del carrito");
        }
        return;
    }

    //Sacarle unidad al producto
    substractUnit(existingCartProduct);
};


const plusBtnCart = (id) => {
    const existingCartProduct = cart.find((item) => item.id === id);
    addCartUnit(existingCartProduct);
};

const handleQuantity = (e) => {
    if(e.target.classList.contains("down")) {
        //Manejamos evento de boton -
        minusBtnCart(e.target.dataset.id);
    } else if (e.target.classList.contains("up")) {
        //Manejamos evento de boton +
        plusBtnCart(e.target.dataset.id);
    }
    //Aactualizamos estado de carrito
    updateCartChanges();
};
  
const resetCartItem = () => {
    cart = [];
    updateCartChanges();
};

const completeCartAction = (confirmMsg, successMsg) => {
    if(!cart.length) return;

    if(window.confirm(confirmMsg)) {
        resetCartItem();
        alert(successMsg);
    };
};

const confirmBuy = () => {
    completeCartAction("¿Desea confirmar su compra?", "¡Gracias por su compra!");
};

const deleteCart = () => {
    completeCartAction("¿Desea vaciar el carrito?", "No hay productos en el carrito");
};

const init = () => {
    renderProducts(appState.products[appState.currentProductsIndex]);
    cartaMenuContainer.addEventListener("click", applyFilter);
    cartIcon.addEventListener("click", displayCart);
    menuHam.addEventListener("click", displayMenu);
    window.addEventListener("scroll", closeOnScroll);
    menuList.addEventListener("click", closeOnClick);
    document.addEventListener("DOMContentLoaded", renderCart);
    document.addEventListener("DOMContentLoaded", showCartTotal);
    productContainer.addEventListener("click", addProduct);
    disableBtn(buyBtn);
    disableBtn(deleteBtn);
    renderCartCounter();
    cartProducts.addEventListener("click", handleQuantity);
    buyBtn.addEventListener("click", confirmBuy);
    deleteBtn.addEventListener("click", deleteCart);
    overlay.addEventListener("click", closeOnScreenClick);
    
};

init();