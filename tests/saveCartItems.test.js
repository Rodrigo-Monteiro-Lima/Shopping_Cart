const localStorageSimulator = require('../mocks/localStorageSimulator');
const saveCartItems = require('../helpers/saveCartItems');

localStorageSimulator('setItem');

describe('3 - Teste a função saveCartItems', () => {
  it('Teste se o método localStorage.setItem é chamado', () => {
    expect.assertions(1);
    const li = '<li>Item</li>';
    saveCartItems(li)
    expect(localStorage.setItem).toHaveBeenCalled()
  });
  it('Teste se  o método localStorage.setItem é chamado com dois parâmetros, sendo o primeiro a chave cartItems e o segundo sendo o valor passado como argumento para saveCartItems', () => {
    expect.assertions(1);
    const li = '<li>Item</li>';
    saveCartItems(li)
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', li)
  });
});
