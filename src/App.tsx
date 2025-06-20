import React, { useState, useEffect } from 'react';
import ClientList from './components/ClientList';
import { apiClient } from './services/api';

const App: React.FC = () => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClientes = async (search = '') => {
    try {
      setCarregando(true);
      const response = await apiClient.listarClientes(search);
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      alert('Erro ao carregar clientes');
    } finally {
      setCarregando(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchClientes(term);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <header className="bg-gray-800 py-6 shadow-xl border-b border-purple-500/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/dog-paw.svg" 
                alt="PetLovers Logo" 
                className="h-10 w-10 text-purple-400"
              />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                PetLovers
              </h1>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Backend online</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {carregando ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
            <p className="mt-4 text-lg text-gray-400">Carregando clientes...</p>
          </div>
        ) : (
          <ClientList 
            clientes={clientes} 
            onRefresh={() => fetchClientes(searchTerm)}
            onSearch={handleSearch}
          />
        )}
      </main>

      <footer className="bg-gray-800 py-6 border-t border-purple-500/30 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0 space-x-2">
              <img 
                src="/dog-paw.svg" 
                alt="PetLovers Logo" 
                className="h-5 w-5 text-purple-400"
              />
              <span className="text-gray-400">PetLovers</span>
            </div>
            <div className="text-center md:text-right text-gray-400">
              © 2025 Computer4Pet - Todos os direitos reservados
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;