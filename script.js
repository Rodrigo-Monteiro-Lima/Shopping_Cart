const cartList = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const priceKey = 'total-price';

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
  p.className = 'item_price';
  p.innerText = `$ ${price}`;
  section.appendChild(p);
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
};

const addLoading = () => {
  const section = document.querySelector('.items');
  const div = document.createElement('div');
  div.classList.add('loading');
  div.innerHTML = 'Carregando';
  section.appendChild(div);
};

const rmvLoading = () => document.querySelector('.loading').remove();

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

const cartItemClickListener = ({ target }) => {
  cartList.removeChild(target);
  const price = target.innerText.split('$')[1];
  let value = +totalPrice.innerText;
  value -= Number(price);
  const roundValue = Math.round(value * 100) / 100;
  totalPrice.innerHTML = roundValue;
  saveCartItems(cartList.innerHTML);
  localStorage.setItem(priceKey, totalPrice.innerText);
};

const createCartItemElement = ({ id, title, price, thumbnail }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  // const img = document.createElement('img');
  // img.setAttribute('src', thumbnail);
  // li.appendChild(img);
  // li.innerHTML = img;
  // li.appendChild(createProductImageElement(thumbnail));
  li.innerText = `ID: ${id} | TITLE: ${title} | PRICE: $${price}`;
  // li.innerText = `${title} \n\n PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
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
};

const addBtnEL = async () => {
  await generateItem('computador');
  const addBtn = document.querySelectorAll('.item__add');
  addBtn.forEach((btn) => btn.addEventListener('click', addCart));
};

const getPrice = () => {
  if (!localStorage.getItem(priceKey)) {
    localStorage.setItem(priceKey, 0);
  } return localStorage.getItem(priceKey);
};

const loadCart = () => {
  cartList.innerHTML = getSavedCartItems();
  const lis = cartList.childNodes;
  totalPrice.innerText = getPrice();
  lis.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
};

const clearCart = () => {
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
    cartList.innerHTML = '';
    localStorage.clear();
    totalPrice.innerText = getPrice();
  });
};

window.onload = () => {
  addBtnEL();
  loadCart();
  clearCart();
 };
