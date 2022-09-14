const cartList = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const priceKey = 'total-price';
const spanCount = document.querySelector('.p1');
const data = 'data-count';

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ id, title, thumbnail, price }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item_id', id));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('span', 'item__title', title));
  const p = document.createElement('p');
  const span = document.createElement('span');
  span.className = 'item_currency';
  span.innerText = 'R$';
  p.className = 'item_price';
  p.innerText = `${price}`;
  span.appendChild(p);
  section.appendChild(span);
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
};

const createLoadElement = () => {
  const section = document.createElement('section');
  section.className = 'loading';
  section.innerHTML = `
  <div class="bootstrap-iso">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`;
  return section;
};

const addLoading = () => {
  const list = document.querySelector('.items');
  for (let index = 0; index < 50; index += 1) {
    list.appendChild(createLoadElement());    
  }
};

const rmvLoading = () => {
  const load = document.querySelectorAll('.loading');
  load.forEach((item) => {
    item.remove();
  });
};

const generateItem = async (item) => {
  addLoading();
  const list = document.querySelector('.items');
  const request = await fetchProducts(item);
  const { results } = request;
  results.forEach((product) => {
    list.appendChild(createProductItemElement(product));
  });
  rmvLoading();
};

const cartCount = (signal) => {
  const count = spanCount.getAttribute(data);
  if (signal === '+') {
    spanCount.setAttribute(data, (+count + 1));
    localStorage.setItem(data, (+count + 1));
  } else if (signal === '-') {
    spanCount.setAttribute(data, (+count - 1));
    localStorage.setItem(data, (+count - 1));
  }
};

const cartItemClickListener = ({ target }) => {
  cartList.removeChild(target.parentNode);
  cartCount('-');
  const price = +target.previousSibling.lastChild.innerText.split('$')[1];
  console.log(price);
  let value = +totalPrice.innerText;
  value -= price;
  const roundValue = Math.round(value * 100) / 100;
  totalPrice.innerHTML = roundValue;
  saveCartItems(cartList.innerHTML);
  localStorage.setItem(priceKey, totalPrice.innerText);
};

const createCartItemElement = ({ title, price, thumbnail }) => {
  const li = document.createElement('li');
  const img = document.createElement('img');
  const div = document.createElement('div');
  const span = document.createElement('span');
  const p = document.createElement('p');
  const del = document.createElement('div');
  del.innerText = '✖';
  li.className = 'cart__item';
  img.src = thumbnail;
  p.innerText = `${title}`;
  span.innerText = `R$ ${price}`;
  div.appendChild(p);
  div.appendChild(span);
  li.appendChild(img);
  li.appendChild(div);
  li.appendChild(del);
  del.addEventListener('click', cartItemClickListener);
  return li;
};

const finalPrice = async ({ price }) => {
  let value = +totalPrice.innerText;
  value += price;
  const roundValue = Math.round(value * 100) / 100;
  totalPrice.innerHTML = roundValue;
  localStorage.setItem(priceKey, totalPrice.innerText);
};

const addCart = async ({ target }) => {
  const product = target.parentNode.firstChild;
  const id = product.innerText;
  const request = await fetchItem(id);
  cartList.appendChild(createCartItemElement(request));
  saveCartItems(cartList.innerHTML);
  finalPrice(request);
  cartCount('+');
};

const dropDown = () => {
  const list = document.querySelector('.cart');
  const cart = document.querySelector('.cart__title');
  const section = document.querySelector('.items');
  const item = document.querySelectorAll('.item');
  list.style.display = 'flex';
  cart.addEventListener('click', () => {
  if (list.style.display === 'flex') {
    list.style.display = 'none';
    section.style.width = '100%';
    item.forEach((e) => { e.style.marginRight = '39px'; });
  } else {
    list.style.display = 'flex';
    section.style.width = '73%';
    item.forEach((e) => { e.style.marginRight = '25px'; });
  }
});
};

const addBtnEL = async () => {
  await generateItem('computador');
  const addBtn = document.querySelectorAll('.item__add');
  addBtn.forEach((btn) => btn.addEventListener('click', addCart));
  dropDown();
};

const getPrice = (key) => {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, 0);
  } return localStorage.getItem(key);
};

const loadCart = () => {
  cartList.innerHTML = getSavedCartItems();
  const lis = cartList.childNodes;
  totalPrice.innerText = getPrice(priceKey);
  lis.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
};

const clearCart = () => {
  const clearBtn = document.querySelector('.empty_cart');
  clearBtn.addEventListener('click', () => {
    cartList.innerHTML = '';
    localStorage.clear();
    totalPrice.innerText = getPrice(priceKey);
    spanCount.setAttribute(data, getPrice(data));
  });
};

window.onload = () => {
  addBtnEL();
  loadCart();
  clearCart();
  spanCount.setAttribute(data, getPrice(data));
  // dropDown();
 };
