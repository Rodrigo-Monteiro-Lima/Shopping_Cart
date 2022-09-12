const fetchProducts = async (product) => {  
  if (product) {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
    const requirement = await fetch(url);
    const data = await requirement.json();
    return data;
  } throw new Error('You must provide an url');
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
