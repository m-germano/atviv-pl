// src/types.ts
export type CPF = string;
export type RG = string;
export type Telefone = string;

export interface Pet {
  id: number;
  nome: string;
  tipo: string;
  raca: string;
  genero: string;
  clienteId: number;
  clienteNome: string; 
}

export interface Cliente {
  id: number;
  nome: string;
  nomeSocial?: string;
  cpf: CPF;
  rg: RG;
  dataCadastro: Date;
  telefones: Telefone[];
  pets: Pet[];
}

export interface Produto {
  id: number;
  nome: string;
  preco: number;
}

export interface Servico {
  id: number;
  nome: string;
  preco: number;
}

export interface Consumo {
  id: number;
  clienteId: number;
  produtoId?: number;
  servicoId?: number;
  quantidade: number;
  data: Date;
}

export type ClienteParaCadastro = Omit<Cliente, 'id' | 'dataCadastro' | 'pets'>;
export type PetParaCadastro = Omit<Pet, 'id'>;
export type ProdutoParaCadastro = Omit<Produto, 'id'>;
export type ServicoParaCadastro = Omit<Servico, 'id'>;
export type ConsumoParaCadastro = Omit<Consumo, 'id'>;