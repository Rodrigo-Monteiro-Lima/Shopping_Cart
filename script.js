const cartList = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const priceKey = 'total-price';
const spanCount = document.querySelector('.p1');
const data = 'data-count';
const list = document.querySelector('.cart');
const cart = document.querySelector('.container-cartTitle');
const section = document.querySelector('.items');
const header = document.querySelector('.container-title');
const cartName = document.querySelector('.title');
const search = document.querySelector('.search');

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
  const sectionElement = document.createElement('section');
  sectionElement.className = 'item';
  sectionElement.appendChild(createCustomElement('span', 'item_id', id));
  sectionElement.appendChild(createProductImageElement(thumbnail));
  sectionElement.appendChild(createCustomElement('span', 'item__title', title));
  const p = document.createElement('p');
  const span = document.createElement('span');
  span.className = 'item_currency';
  span.innerText = 'R$';
  p.className = 'item_price';
  p.innerText = `${price.toLocaleString('pt-br')}`;
  span.appendChild(p);
  sectionElement.appendChild(span);
  const btn = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  btn.addEventListener('click', addCart);
  sectionElement.appendChild(btn);
  return sectionElement;
};

const createLoadElement = () => {
  const sectionElement = document.createElement('section');
  sectionElement.className = 'loading';
  sectionElement.innerHTML = `
  <div>
      <span>Loading...</span>
  </div>`;
  return sectionElement;
};

const addLoading = () => {
  for (let index = 0; index < 50; index += 1) {
    section.appendChild(createLoadElement());    
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
  const request = await fetchProducts(item);
  const { results } = request;
  results.forEach((product) => {
    section.appendChild(createProductItemElement(product));
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
  let value = +totalPrice.innerText.split('.').join('').split(',').join('.');
  value -= price;
  const roundValue = Math.round(value * 100) / 100;
  totalPrice.innerHTML = roundValue.toLocaleString('pt-br');
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
  span.innerText = `R$ ${price.toLocaleString('pt-br')}`;
  div.appendChild(p);
  div.appendChild(span);
  li.appendChild(img);
  li.appendChild(div);
  li.appendChild(del);
  del.addEventListener('click', cartItemClickListener);
  return li;
};

const finalPrice = async ({ price }) => {
  let value = +totalPrice.innerText.split('.').join('').split(',').join('.');
  console.log(value);
  console.log(price);
  value += price;
  const roundValue = Math.round(value * 100) / 100;
  totalPrice.innerHTML = roundValue.toLocaleString('pt-br');
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
    cartName.classList.add('name');
    section.style.width = '100%';
    search.style.width = '100%';
    cart.style.width = '5%';
    header.style.width = '95%';
  item.forEach((e) => { e.classList.add('move'); });
  } else {
    list.classList.remove('active');
    cartName.classList.remove('name');
    section.style.width = '73%';
    search.style.width = '73%';
    cart.style.width = '27%';
    header.style.width = '73%';
    item.forEach((e) => { e.classList.remove('move'); });
  }
});
};

const searchClick = () => {
  const btnSearch = document.querySelector('.button-search');
  const input = document.querySelector('.input');
  btnSearch.addEventListener('click', async () => {
    const inputValue = document.querySelector('.input').value.toLowerCase();
    if (inputValue.length !== 0) {
      section.innerHTML = '';
      await generateItem(inputValue);
      input.value = '';
    }
  });
};

const searchEnter = () => {
  const input = document.querySelector('.input');
  input.addEventListener('keypress', async (event) => {
    const inputValue = input.value.toLowerCase();
      if (event.key === 'Enter' && inputValue.length !== 0) {
        section.innerHTML = '';
        await generateItem(inputValue);
        input.value = '';
      }
  });
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

window.onload = async () => {
  await generateItem('computador');
  dropDown();
  searchEnter();
  searchClick();
  loadCart();
  clearCart();
  spanCount.setAttribute(data, getPrice(data));
  goHome();
 };
