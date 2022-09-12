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

const createProductItemElement = ({ id, title, thumbnail }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item_id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const createCartItemElement = ({ id, title, price }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `ID: ${id} | TITLE: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const generateItem = async (item) => {
  const list = document.querySelector('.items');
  const request = await fetchProducts(item);
  const { results } = request;
  results.forEach((product) => {
    list.appendChild(createProductItemElement(product));
  });
};

const addCart = async ({ target }) => {
  const product = target.parentNode.firstChild;
  const id = product.innerText;
  const request = await fetchItem(id);
  cartList.appendChild(createCartItemElement(request));
};

const addBtnEL = async () => {
  await generateItem('computador');
  const addBtn = document.querySelectorAll('.item__add');
  addBtn.forEach((btn) => btn.addEventListener('click', addCart));
};

window.onload = () => { 
  addBtnEL();
};
