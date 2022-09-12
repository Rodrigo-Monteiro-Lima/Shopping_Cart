const fetchItem = async (item) => {
  if (item) {
    const url = `https://api.mercadolibre.com/items/${item}`;
    const requirement = await fetch(url);
    const data = await requirement.json();
    return data;
  } throw new Error('You must provide an url');
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
