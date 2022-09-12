const localStorageSimulator = require('../mocks/localStorageSimulator');
const getSavedCartItems = require('../helpers/getSavedCartItems');

localStorageSimulator('getItem');

describe('4 - Teste a função getSavedCartItems', () => {
  it('Teste se o método localStorage.getItem é chamado', () => {
    expect.assertions(1);
    getSavedCartItems()
    expect(localStorage.getItem).toHaveBeenCalled()
  });
  it('Teste se  o método localStorage.getItem é chamado com a chave cartItems como parâmero', () => {
    expect.assertions(1);
    getSavedCartItems()
    expect(localStorage.getItem).toHaveBeenCalledWith('cartItems')
  });
});
