import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const apiClient = {
  criarCliente: (data: any) => api.post('/clientes', data),
  listarClientes: (search?: string) => api.get('/clientes', { params: { search } }),
  buscarCliente: (id: number) => api.get(`/clientes/${id}`),
  atualizarCliente: (id: number, data: any) => api.put(`/clientes/${id}`, data),
  deletarCliente: (id: number) => api.delete(`/clientes/${id}`)
};