var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");

var isMobile = { Android: function() { return navigator.userAgent.match(/Android/i); }, BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function() { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function() { return navigator.userAgent.match(/IEMobile/i); }, any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

function isIE() {
    ua = navigator.userAgent;
    var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
    return is_ie;
};
if (isIE()) {
    document.querySelector('html').classList.add('ie');
};

if (isMobile.any()) {
    document.querySelector('html').classList.add('_touch');
};
//
//RemoveClasses
function _removeClasses(el, class_name) {
    for (var i = 0; i < el.length; i++) {
        el[i].classList.remove(class_name);
    }
}


//


window.onload = function() {
    document.addEventListener("click", documentActions);
    //Actions (делегирование события click)
    function documentActions(e) {
        const targetElement = e.target;
        if (window.innerWidth > 768 && isMobile.any()) {
            if (targetElement.classList.contains('menu__arrow')) {
                targetElement.closest('.menu__item').classList.toggle('_hover');
            };
            if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
                _removeClasses(document.querySelectorAll('.menu__item._hover'), "_hover");
            }
        }
        if (targetElement.classList.contains('search-form__icon')) {
            document.querySelector('.search-form').classList.toggle('_active');
        } else if (!targetElement.closest('.search-form') && document.querySelector('.search-form._active')) {
            document.querySelector('.search-form').classList.remove('_active');
        }
        // класс "products__more" изменен на 'products__moreeee' 
        if (targetElement.classList.contains('products__more')) {
            getProducts(targetElement);
            e.preventDefault();
        }
        if (targetElement.classList.contains('actions-product__button')) {
            const productId = targetElement.closest('.item-product').dataset.pid;
            addToCart(targetElement, productId);
            e.preventDefault();
        }

        if (targetElement.classList.contains('cart-header__icon') || targetElement.closest('.cart-header__icon')) {
            if (document.querySelector('.cart-list').children.length > 0) {
                document.querySelector('.cart-header').classList.toggle('_active');
            }
            e.preventDefault();
        } else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
            document.querySelector('.cart-header').classList.remove('_active');
        }
        if (targetElement.classList.contains('cart-list__delete')) {
            const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
            updateCart(targetElement, productId, false);
            e.preventDefault();
        }


    }



    //Header
    const headerElement = document.querySelector('.header');

    const callback = function(entries, observer) {
        if (entries[0].isIntersecting) {
            headerElement.classList.remove('_scroll');
        } else {
            headerElement.classList.add('_scroll');
        }
    }

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(headerElement);

    //=====================================
    // Load More Products
    async function getProducts(button) {
        if (!button.classList.contains('_hold')) {
            button.classList.add('_hold');
            const url = "json/products.json";
            let response = await fetch(url, {
                method: "GET"
            });
            if (response.ok) {
                let result = await response.json();
                loadProducts(result);
                button.classList.remove('_hold');
                button.remove();
            } else {
                alert("Ошибка");
            }
        }
    }

    function loadProducts(data) {
        const productsItems = document.querySelector('.products__items');

        data.products.forEach(item => {
            const productId = item.id;
            const productUrl = item.url;
            const productImage = item.image;
            const productTitle = item.title;
            const productText = item.text;
            const productPrice = item.price;
            const productOldPrice = item.priceOld;
            const productShareUrl = item.shareUrl;
            const productLikeUrl = item.likeUrl;
            const productLabels = item.labels;

            let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
            let productTemplateEnd = `</article>`;

            let productTemplateLabels = '';
            if (productLabels) {
                let productTemplateLabelsStart = `<div class="item-product__labels">`;
                let productTemplateLabelsEnd = `</div>`;
                let productTemplateLabelsContent = '';

                productLabels.forEach(labelItem => {
                    productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
                });

                productTemplateLabels += productTemplateLabelsStart;
                productTemplateLabels += productTemplateLabelsContent;
                productTemplateLabels += productTemplateLabelsEnd;
            }

            let productTemplateImage = `
		<a href="${productUrl}" class="item-product__image _ibg">
			<img src="img/products/${productImage}" alt="${productTitle}">
		</a>
	`;

            let productTemplateBodyStart = `<div class="item-product__body">`;
            let productTemplateBodyEnd = `</div>`;

            let productTemplateContent = `
		<div class="item-product__content">
			<h3 class="item-product__title">${productTitle}</h3>
			<div class="item-product__text">${productText}</div>
		</div>
	`;

            let productTemplatePrices = '';
            let productTemplatePricesStart = `<div class="item-product__prices">`;
            let productTemplatePricesCurrent = `<div class="item-product__price">Rp ${productPrice}</div>`;
            let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">Rp ${productOldPrice}</div>`;
            let productTemplatePricesEnd = `</div>`;

            productTemplatePrices = productTemplatePricesStart;
            productTemplatePrices += productTemplatePricesCurrent;
            if (productOldPrice) {
                productTemplatePrices += productTemplatePricesOld;
            }
            productTemplatePrices += productTemplatePricesEnd;

            let productTemplateActions = `
		<div class="item-product__actions actions-product">
			<div class="actions-product__body">
				<a href="" class="actions-product__button btn btn_white">Add to cart</a>
				<a href="${productShareUrl}" class="actions-product__link _icon-share">Share</a>
				<a href="${productLikeUrl}" class="actions-product__link _icon-favorite">Like</a>
			</div>
		</div>
	`;

            let productTemplateBody = '';
            productTemplateBody += productTemplateBodyStart;
            productTemplateBody += productTemplateContent;
            productTemplateBody += productTemplatePrices;
            productTemplateBody += productTemplateActions;
            productTemplateBody += productTemplateBodyEnd;

            let productTemplate = '';
            productTemplate += productTemplateStart;
            productTemplate += productTemplateLabels;
            productTemplate += productTemplateImage;
            productTemplate += productTemplateBody;
            productTemplate += productTemplateEnd;

            productsItems.insertAdjacentHTML('beforeend', productTemplate);

        });

    }
    // AddToCart
    function addToCart(productButton, productId) {
        if (!productButton.classList.contains('_hold')) {
            productButton.classList.add('_hold');
            productButton.classList.add('_fly');

            const cart = document.querySelector('.cart-header__icon');
            const product = document.querySelector(`[data-pid="${productId}"]`);
            const productImage = product.querySelector('.item-product__image');

            const productImageFly = productImage.cloneNode(true);

            const productImageFlyWidth = productImage.offsetWidth;
            const productImageFlyHeight = productImage.offsetHeight;
            const productImageFlyTop = productImage.getBoundingClientRect().top;
            const productImageFlyLeft = productImage.getBoundingClientRect().left;

            productImageFly.setAttribute('class', '_flyImage _ibg');
            productImageFly.style.cssText =
                `
			left: ${productImageFlyLeft}px;
			top: ${productImageFlyTop}px;
			width: ${productImageFlyWidth}px;
			height: ${productImageFlyHeight}px;
		`;

            document.body.append(productImageFly);

            const cartFlyLeft = cart.getBoundingClientRect().left;
            const cartFlyTop = cart.getBoundingClientRect().top;

            productImageFly.style.cssText =
                `
            	left: ${cartFlyLeft}px;
            	top: ${cartFlyTop}px;
            	width: 0px;
            	height: 0px;
            	opacity:0;
            `;

            productImageFly.addEventListener('transitionend', function() {
                if (productButton.classList.contains('_fly')) {
                    productImageFly.remove();
                    updateCart(productButton, productId);
                    productButton.classList.remove('_fly');
                }
            });
        }
    }

    function updateCart(productButton, productId, productAdd = true) {
        const cart = document.querySelector('.cart-header');
        const cartIcon = cart.querySelector('.cart-header__icon');
        const cartQuantity = cartIcon.querySelector('span');
        const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
        const cartList = document.querySelector('.cart-list');

        //Добавляем
        if (productAdd) {
            if (cartQuantity) {
                cartQuantity.innerHTML = ++cartQuantity.innerHTML;
            } else {
                cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
            }
            if (!cartProduct) {
                const product = document.querySelector(`[data-pid="${productId}"]`);
                const cartProductImage = product.querySelector('.item-product__image').innerHTML;
                const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
                const cartProductContent = `
			<a href="" class="cart-list__image _ibg">${cartProductImage}</a>
			<div class="cart-list__body">
				<a href="" class="cart-list__title">${cartProductTitle}</a>
				<div class="cart-list__quantity">Quantity: <span>1</span></div>
				<a href="" class="cart-list__delete">Delete</a>
			</div>`;
                cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`);
            } else {
                const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
                cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
            }

            // После всех действий
            productButton.classList.remove('_hold');
        } else {
            const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
            cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
            if (!parseInt(cartProductQuantity.innerHTML)) {
                cartProduct.remove();
            }

            const cartQuantityValue = --cartQuantity.innerHTML;

            if (cartQuantityValue) {
                cartQuantity.innerHTML = cartQuantityValue;
            } else {
                cartQuantity.remove();
                cart.classList.remove('_active');
            }
        }
    }
    //========================================
    // Furniture Gallery
    const furniture = document.querySelector('.furniture__body');
    if (furniture && !isMobile.any()) {
        const furnitureItems = document.querySelector('.furniture__items');
        const furnitureColumn = document.querySelectorAll('.furniture__column');

        // Скорость анимации
        const speed = furniture.dataset.speed;

        // Объявление переменных
        let positionX = 0;
        let coordXprocent = 0;

        function setMouseGalleryStyle() {
            let furnitureItemsWidth = 0;
            furnitureColumn.forEach(element => {
                furnitureItemsWidth += element.offsetWidth;
            });

            const furnitureDifferent = furnitureItemsWidth - furniture.offsetWidth;
            const distX = Math.floor(coordXprocent - positionX);

            positionX = positionX + (distX * speed);
            let position = furnitureDifferent / 200 * positionX;

            furnitureItems.style.cssText = `transform: translate3d(${-position}px,0,0);`;

            if (Math.abs(distX) > 0) {
                requestAnimationFrame(setMouseGalleryStyle);
            } else {
                furniture.classList.remove('_init');
            }
        }
        furniture.addEventListener("mousemove", function(e) {
            // Получение ширины
            const furnitureWidth = furniture.offsetWidth;

            // Ноль по середине
            const coordX = e.pageX - furnitureWidth / 2;

            // Получаем проценты
            coordXprocent = coordX / furnitureWidth * 200;

            if (!furniture.classList.contains('_init')) {
                requestAnimationFrame(setMouseGalleryStyle);
                furniture.classList.add('_init');
            }
        });
    }



    //===============
    document.getElementById("popclose").addEventListener('click', closePopup);

}



function closePopup() {

    let myPop = document.querySelector('.popup_subscribe-message').classList;

    if (myPop.contains('_active')) {

        myPop.remove('_active');
        document.location.replace('https://petr791.github.io/OnlineScore/');
    }
}


//email_test======================
function email_test(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}
// form======================
//let btn = document.querySelectorAll('button[type="submit"],input[type="submit"]');
let forms = document.querySelectorAll('form');
if (forms.length > 0) {
    for (let index = 0; index < forms.length; index++) {
        const el = forms[index];
        el.addEventListener('submit', form_submit);
    }
}
async function form_submit(e) {
    let btn = e.target;
    let form = btn.closest('form');
    let error = form_validate(form);
    if (error == 0) {
        let formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
        let formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
        const message = form.getAttribute('data-message');
        const ajax = form.getAttribute('data-ajax');

        //SendForm
        if (ajax) {
            e.preventDefault();
            let formData = new FormData(form);
            form.classList.add('_sending');
            let response = await fetch(formAction, {
                method: formMethod,
                body: formData
            });
            if (response.ok) {
                let result = await response.json();
                form.classList.remove('_sending');
                if (message) {
                    popup_open(message + '-message');
                }
                form_clean(form);
            } else {
                alert("Ошибка");
                form.classList.remove('_sending');
            }
        }
        // If test
        if (form.hasAttribute('data-test')) {
            e.preventDefault();
            popup_open(message + '-message');
            form_clean(form);
        }
    } else {
        let form_error = form.querySelectorAll('._error');
        if (form_error && form.classList.contains('_goto-error')) {
            _goto(form_error[0], 1000, 50);
        }
        e.preventDefault();
    }
}

function form_validate(form) {
    let error = 0;
    let form_req = form.querySelectorAll('._req');
    if (form_req.length > 0) {
        for (let index = 0; index < form_req.length; index++) {
            const el = form_req[index];
            if (!_is_hidden(el)) {
                error += form_validate_input(el);
            }
        }
    }
    return error;
}

function form_validate_input(input) {
    let error = 0;
    let input_g_value = input.getAttribute('data-value');

    if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
        if (input.value != input_g_value) {
            let em = input.value.replace(" ", "");
            input.value = em;
        }
        if (email_test(input) || input.value == input_g_value) {
            form_add_error(input);
            error++;
        } else {
            form_remove_error(input);
        }
    } else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
        form_add_error(input);
        error++;
    } else {
        if (input.value == '' || input.value == input_g_value) {
            form_add_error(input);
            error++;
        } else {
            form_remove_error(input);
        }
    }
    return error;
}

function form_add_error(input) {
    input.classList.add('_error');
    input.parentElement.classList.add('_error');

    let input_error = input.parentElement.querySelector('.form__error');
    if (input_error) {
        input.parentElement.removeChild(input_error);
    }
    let input_error_text = input.getAttribute('data-error');
    if (input_error_text && input_error_text != '') {
        input.parentElement.insertAdjacentHTML('beforeend', '<div class="form__error">' + input_error_text + '</div>');
    }
}

function form_remove_error(input) {
    input.classList.remove('_error');
    input.parentElement.classList.remove('_error');

    let input_error = input.parentElement.querySelector('.form__error');
    if (input_error) {
        input.parentElement.removeChild(input_error);
    }
}

function form_clean(form) {
    let inputs = form.querySelectorAll('input,textarea');
    for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        el.parentElement.classList.remove('_focus');
        el.classList.remove('_focus');
        el.value = el.getAttribute('data-value');
    }
    let checkboxes = form.querySelectorAll('.checkbox__input');
    if (checkboxes.length > 0) {
        for (let index = 0; index < checkboxes.length; index++) {
            const checkbox = checkboxes[index];
            checkbox.checked = false;
        }
    }
    let selects = form.querySelectorAll('select');
    if (selects.length > 0) {
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            const select_default_value = select.getAttribute('data-default');
            select.value = select_default_value;
            select_item(select);
        }
    }
}

let viewPass = document.querySelectorAll('.form__viewpass');
for (let index = 0; index < viewPass.length; index++) {
    const element = viewPass[index];
    element.addEventListener("click", function(e) {
        if (element.classList.contains('_active')) {
            element.parentElement.querySelector('input').setAttribute("type", "password");
        } else {
            element.parentElement.querySelector('input').setAttribute("type", "text");
        }
        element.classList.toggle('_active');
    });
}

//Select
let selects = document.getElementsByTagName('select');
if (selects.length > 0) {
    selects_init();
}

function selects_init() {
    for (let index = 0; index < selects.length; index++) {
        const select = selects[index];
        select_init(select);
    }
    //select_callback();
    document.addEventListener('click', function(e) {
        selects_close(e);
    });
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Escape') {
            selects_close(e);
        }
    });
}

function selects_close(e) {
    const selects = document.querySelectorAll('.select');
    if (!e.target.closest('.select') && !e.target.classList.contains('_option')) {
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            const select_body_options = select.querySelector('.select__options');
            select.classList.remove('_active');
            _slideUp(select_body_options, 100);
        }
    }
}

function select_init(select) {
    const select_parent = select.parentElement;
    const select_modifikator = select.getAttribute('class');
    const select_selected_option = select.querySelector('option:checked');
    select.setAttribute('data-default', select_selected_option.value);
    select.style.display = 'none';

    select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modifikator + '"></div>');

    let new_select = select.parentElement.querySelector('.select');
    new_select.appendChild(select);
    select_item(select);
}

function select_item(select) {
    const select_parent = select.parentElement;
    const select_items = select_parent.querySelector('.select__item');
    const select_options = select.querySelectorAll('option');
    const select_selected_option = select.querySelector('option:checked');
    const select_selected_text = select_selected_option.text;
    const select_type = select.getAttribute('data-type');

    if (select_items) {
        select_items.remove();
    }

    let select_type_content = '';
    if (select_type == 'input') {
        select_type_content = '<div class="select__value icon-select-arrow"><input autocomplete="off" type="text" name="form[]" value="' + select_selected_text + '" data-error="Ошибка" data-value="' + select_selected_text + '" class="select__input"></div>';
    } else {
        select_type_content = '<div class="select__value icon-select-arrow"><span>' + select_selected_text + '</span></div>';
    }

    select_parent.insertAdjacentHTML('beforeend',
        '<div class="select__item">' +
        '<div class="select__title">' + select_type_content + '</div>' +
        '<div hidden class="select__options">' + select_get_options(select_options) + '</div>' +
        '</div></div>');

    select_actions(select, select_parent);
}

function select_actions(original, select) {
    const select_item = select.querySelector('.select__item');
    const selectTitle = select.querySelector('.select__title');
    const select_body_options = select.querySelector('.select__options');
    const select_options = select.querySelectorAll('.select__option');
    const select_type = original.getAttribute('data-type');
    const select_input = select.querySelector('.select__input');

    selectTitle.addEventListener('click', function(e) {
        selectItemActions();
    });

    function selectMultiItems() {
        let selectedOptions = select.querySelectorAll('.select__option');
        let originalOptions = original.querySelectorAll('option');
        let selectedOptionsText = [];
        for (let index = 0; index < selectedOptions.length; index++) {
            const selectedOption = selectedOptions[index];
            originalOptions[index].removeAttribute('selected');
            if (selectedOption.classList.contains('_selected')) {
                const selectOptionText = selectedOption.innerHTML;
                selectedOptionsText.push(selectOptionText);
                originalOptions[index].setAttribute('selected', 'selected');
            }
        }
        select.querySelector('.select__value').innerHTML = '<span>' + selectedOptionsText + '</span>';
    }

    function selectItemActions(type) {
        if (!type) {
            let selects = document.querySelectorAll('.select');
            for (let index = 0; index < selects.length; index++) {
                const select = selects[index];
                const select_body_options = select.querySelector('.select__options');
                if (select != select_item.closest('.select')) {
                    select.classList.remove('_active');
                    _slideUp(select_body_options, 100);
                }
            }
            _slideToggle(select_body_options, 100);
            select.classList.toggle('_active');
        }
    }
    for (let index = 0; index < select_options.length; index++) {
        const select_option = select_options[index];
        const select_option_value = select_option.getAttribute('data-value');
        const select_option_text = select_option.innerHTML;

        if (select_type == 'input') {
            select_input.addEventListener('keyup', select_search);
        } else {
            if (select_option.getAttribute('data-value') == original.value && !original.hasAttribute('multiple')) {
                select_option.style.display = 'none';
            }
        }
        select_option.addEventListener('click', function() {
            for (let index = 0; index < select_options.length; index++) {
                const el = select_options[index];
                el.style.display = 'block';
            }
            if (select_type == 'input') {
                select_input.value = select_option_text;
                original.value = select_option_value;
            } else {
                if (original.hasAttribute('multiple')) {
                    select_option.classList.toggle('_selected');
                    selectMultiItems();
                } else {
                    select.querySelector('.select__value').innerHTML = '<span>' + select_option_text + '</span>';
                    original.value = select_option_value;
                    select_option.style.display = 'none';
                }
            }
            let type;
            if (original.hasAttribute('multiple')) {
                type = 'multiple';
            }
            selectItemActions(type);
        });
    }
}

function select_get_options(select_options) {
    if (select_options) {
        let select_options_content = '';
        for (let index = 0; index < select_options.length; index++) {
            const select_option = select_options[index];
            const select_option_value = select_option.value;
            if (select_option_value != '') {
                const select_option_text = select_option.innerHTML;
                select_options_content = select_options_content + '<div data-value="' + select_option_value + '" class="select__option">' + select_option_text + '</div>';
            }
        }
        return select_options_content;
    }
}

function select_search(e) {
    let select_block = e.target.closest('.select ').querySelector('.select__options');
    let select_options = e.target.closest('.select ').querySelectorAll('.select__option');
    let select_search_text = e.target.value.toUpperCase();

    for (let i = 0; i < select_options.length; i++) {
        let select_option = select_options[i];
        let select_txt_value = select_option.textContent || select_option.innerText;
        if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) {
            select_option.style.display = "";
        } else {
            select_option.style.display = "none";
        }
    }
}

function selects_update_all() {
    let selects = document.querySelectorAll('select');
    if (selects) {
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            select_item(select);
        }
    }
}

//Placeholers
let inputs = document.querySelectorAll('input[data-value],textarea[data-value]');
inputs_init(inputs);

function inputs_init(inputs) {
    if (inputs.length > 0) {
        for (let index = 0; index < inputs.length; index++) {
            const input = inputs[index];
            const input_g_value = input.getAttribute('data-value');
            input_placeholder_add(input);
            if (input.value != '' && input.value != input_g_value) {
                input_focus_add(input);
            }
            input.addEventListener('focus', function(e) {
                if (input.value == input_g_value) {
                    input_focus_add(input);
                    input.value = '';
                }
                if (input.getAttribute('data-type') === "pass" && !input.parentElement.querySelector('.form__viewpass').classList.contains('_active')) {
                    input.setAttribute('type', 'password');
                }
                if (input.classList.contains('_date')) {
                    /*
                    input.classList.add('_mask');
                    Inputmask("99.99.9999", {
                    	//"placeholder": '',
                    	clearIncomplete: true,
                    	clearMaskOnLostFocus: true,
                    	onincomplete: function () {
                    		input_clear_mask(input, input_g_value);
                    	}
                    }).mask(input);
                    */
                }
                if (input.classList.contains('_phone')) {
                    //'+7(999) 999 9999'
                    //'+38(999) 999 9999'
                    //'+375(99)999-99-99'
                    input.classList.add('_mask');
                    Inputmask("+375 (99) 9999999", {
                        //"placeholder": '',
                        clearIncomplete: true,
                        clearMaskOnLostFocus: true,
                        onincomplete: function() {
                            input_clear_mask(input, input_g_value);
                        }
                    }).mask(input);
                }
                if (input.classList.contains('_digital')) {
                    input.classList.add('_mask');
                    Inputmask("9{1,}", {
                        "placeholder": '',
                        clearIncomplete: true,
                        clearMaskOnLostFocus: true,
                        onincomplete: function() {
                            input_clear_mask(input, input_g_value);
                        }
                    }).mask(input);
                }
                form_remove_error(input);
            });
            input.addEventListener('blur', function(e) {
                if (input.value == '') {
                    input.value = input_g_value;
                    input_focus_remove(input);
                    if (input.classList.contains('_mask')) {
                        input_clear_mask(input, input_g_value);
                    }
                    if (input.getAttribute('data-type') === "pass") {
                        input.setAttribute('type', 'text');
                    }
                }
            });
            if (input.classList.contains('_date')) {
                const calendarItem = datepicker(input, {
                    customDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
                    customMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
                    overlayButton: 'Применить',
                    overlayPlaceholder: 'Год (4 цифры)',
                    startDay: 1,
                    formatter: (input, date, instance) => {
                        const value = date.toLocaleDateString()
                        input.value = value
                    },
                    onSelect: function(input, instance, date) {
                        input_focus_add(input.el);
                    }
                });
                const dataFrom = input.getAttribute('data-from');
                const dataTo = input.getAttribute('data-to');
                if (dataFrom) {
                    calendarItem.setMin(new Date(dataFrom));
                }
                if (dataTo) {
                    calendarItem.setMax(new Date(dataTo));
                }
            }
        }
    }
}

function input_placeholder_add(input) {
    const input_g_value = input.getAttribute('data-value');
    if (input.value == '' && input_g_value != '') {
        input.value = input_g_value;
    }
}

function input_focus_add(input) {
    input.classList.add('_focus');
    input.parentElement.classList.add('_focus');
}

function input_focus_remove(input) {
    input.classList.remove('_focus');
    input.parentElement.classList.remove('_focus');
}

function input_clear_mask(input, input_g_value) {
    input.inputmask.remove();
    input.value = input_g_value;
    input_focus_remove(input);
}

//QUANTITY
let quantityButtons = document.querySelectorAll('.quantity__button');
if (quantityButtons.length > 0) {
    for (let index = 0; index < quantityButtons.length; index++) {
        const quantityButton = quantityButtons[index];
        quantityButton.addEventListener("click", function(e) {
            let value = parseInt(quantityButton.closest('.quantity').querySelector('input').value);
            if (quantityButton.classList.contains('quantity__button_plus')) {
                value++;
            } else {
                value = value - 1;
                if (value < 1) {
                    value = 1
                }
            }
            quantityButton.closest('.quantity').querySelector('input').value = value;
        });
    }
}

//RANGE
const priceSlider = document.querySelector('.price-filter__slider');
if (priceSlider) {

    let textFrom = priceSlider.getAttribute('data-from');
    let textTo = priceSlider.getAttribute('data-to');

    noUiSlider.create(priceSlider, {
        start: [0, 200000],
        connect: true,
        tooltips: [wNumb({ decimals: 0, prefix: textFrom + ' ' }), wNumb({ decimals: 0, prefix: textTo + ' ' })],
        range: {
            'min': [0],
            'max': [200000]
        }
    });

    /*
    const priceStart = document.getElementById('price-start');
    const priceEnd = document.getElementById('price-end');
    priceStart.addEventListener('change', setPriceValues);
    priceEnd.addEventListener('change', setPriceValues);
    */

    function setPriceValues() {
        let priceStartValue;
        let priceEndValue;
        if (priceStart.value != '') {
            priceStartValue = priceStart.value;
        }
        if (priceEnd.value != '') {
            priceEndValue = priceEnd.value;
        }
        priceSlider.noUiSlider.set([priceStartValue, priceEndValue]);
    }
}


//====================================