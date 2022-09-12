require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchItem');
const item = require('../mocks/item');

describe('2 - Teste a função fetchItem', () => {
  it('Teste se fetchItem é uma função', () => {
    expect.assertions(1);
    expect(typeof fetchItem).toBe('function')
  });
  it('Teste se fetch foi chamada', () => {
    expect.assertions(2);
    fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('Teste se a função fetch foi chamada com o endpoint correto', async () => {
    expect.assertions(1);
    await fetchItem('MLB1615760527')
    expect(fetch).toHaveBeenCalledWith('https://api.mercadolibre.com/items/MLB1615760527');
  });
  it('Teste se o retorno da função fetchItem com o argumento computador é uma estrutura de dados igual ao objeto item', async () => {
    expect.assertions(1);
    const result = await fetchItem('MLB1615760527');
    expect(result).toEqual(item);
  });
  it('Teste se, ao chamar a função fetchItem sem argumento, retorna um erro', async () => {
    expect.assertions(2);
    await expect(fetchItem()).rejects.toEqual(new Error('You must provide an url'));
    try {
      await fetchItem();
    } catch (e) {
      expect(e).toEqual(new Error('You must provide an url'));
    }
  });
});
