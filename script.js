const cartList = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const priceKey = 'total-price';
const spanCount = document.querySelector('.p1');
const data = 'data-count';
const list = document.querySelector('.cart');
const cart = document.querySelector('.container-cartTitle');
const section = document.querySelector('.items');
const header = document.querySelector('.container-title');
const title = document.querySelector('.title');

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

const newValue = (price) => {
  const str = String(price);
  const arr = str.split('.');
  if (str.includes('.')) {
    if (arr[0].length > 3) {
      const a = arr[0].slice(0, 1);
      const b = arr[0].slice(1);
      const number = `${a}.${b},${arr[1]}`;
      return number;
    } return `${arr[0]},${arr[1]}`;
  } if (arr[0].length > 3) {
      const a = arr[0].slice(0, 1);
      const b = arr[0].slice(1);
      const number = `${a}.${b}`;
      return number;
    } return arr[0];
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
  p.innerText = `${newValue(price)}`;
  span.appendChild(p);
  section.appendChild(span);
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
};

const createLoadElement = () => {
  const section = document.createElement('section');
  section.className = 'loading';
  section.innerHTML = `
  <div>
      <span>Loading...</span>
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
  const price = +target.previousSibling.lastChild.innerText.split('$')[1]
  .split('.').join('').split(',').join('.');
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
  span.innerText = `R$ ${newValue(price)}`;
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
  const item = document.querySelectorAll('.item');
  cart.addEventListener('click', () => {
  if (!list.className.includes('active')) {
    list.classList.add('active');
    title.classList.add('name');
    section.style.width = '100%';
    cart.style.width = '5%';
    header.style.width = '95%';
    // e.style.width = '21.8%';
  item.forEach((e) => { e.classList.add('move'); });
  } else {
    list.classList.remove('active');
    title.classList.remove('name');
    section.style.width = '73%';
    cart.style.width = '27%';
    header.style.width = '73%';
    // e.style.width = '30.1%';
    item.forEach((e) => { e.classList.remove('move'); });
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

const goHome = () => {
  const home = document.querySelector('.home');
  const start = document.querySelector('.header');
  home.addEventListener('click', () => {
    start.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
};

window.addEventListener('scroll', () => {
const element = document.querySelector('header');
const position = element.getBoundingClientRect();
const home = document.querySelector('.home');

if (position.top < window.innerHeight && position.bottom >= 0) {
  home.style.display = 'none';
} else {
  home.style.display = 'block';
}
});

window.onload = () => {
  addBtnEL();
  loadCart();
  clearCart();
  spanCount.setAttribute(data, getPrice(data));
  goHome();
 };
