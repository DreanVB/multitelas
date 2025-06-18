// src/utils/geocode.js
import axios from 'axios';

export const getCoordinatesFromCep = async (cep) => {
  try {
    // Consultar API ViaCEP
    const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (viaCepResponse.data.erro) {
      throw new Error('CEP inválido');
    } else {
      const { logradouro, bairro, localidade, uf } = viaCepResponse.data;

      const enderecoFormatado = `${logradouro}, ${bairro}, ${localidade} - ${uf}`;

      return {
        sucesso: true,
        endereco: enderecoFormatado,
        dados: viaCepResponse.data // caso queira acessar outros campos também
      };
    }
  } catch (error) {
    console.error(error.message);
    return {
      sucesso: false,
      mensagem: error.message
    };
  }
};
