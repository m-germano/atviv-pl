import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiUser, FiMail, FiCreditCard, FiPlus, FiMinus } from 'react-icons/fi';
import { apiClient } from '../services/api';

interface Telefone {
  id?: number;
  ddd: string;
  numero: string;
}

interface Endereco {
  id?: number;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  codigoPostal: string;
  informacoesAdicionais?: string;
}

interface Cliente {
  id?: number;
  nome: string;
  nomeSocial?: string;
  email?: string;
  cpf: string;
  endereco: Endereco;
  telefones: Telefone[];
  createdAt?: string;
  updatedAt?: string;
}

interface ClientFormProps {
  clienteParaEditar?: Cliente | null;
  onSuccess: () => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

interface FormErrors {
  nome?: string;
  email?: string;
  cpf?: string;
  endereco?: {
    estado?: string;
    cidade?: string;
    bairro?: string;
    rua?: string;
    numero?: string;
    codigoPostal?: string;
  };
  telefones?: (string | undefined)[];
}

const ClientForm: React.FC<ClientFormProps> = ({ 
  clienteParaEditar, 
  onSuccess, 
  onCancel,
  isSubmitting,
  setIsSubmitting
}) => {
  const initialEndereco: Endereco = {
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    codigoPostal: '',
    informacoesAdicionais: ''
  };

  const initialTelefone: Telefone = {
    ddd: '',
    numero: ''
  };

  const [formData, setFormData] = useState<Cliente>({
    nome: '',
    cpf: '',
    email: '',
    nomeSocial: '',
    endereco: initialEndereco,
    telefones: [initialTelefone]
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (clienteParaEditar) {
      setFormData({
        nome: clienteParaEditar.nome,
        cpf: clienteParaEditar.cpf,
        email: clienteParaEditar.email || '',
        nomeSocial: clienteParaEditar.nomeSocial || '',
        endereco: clienteParaEditar.endereco,
        telefones: clienteParaEditar.telefones.length > 0 
          ? clienteParaEditar.telefones 
          : [initialTelefone],
        id: clienteParaEditar.id
      });
    } else {
      setFormData({
        nome: '',
        cpf: '',
        email: '',
        nomeSocial: '',
        endereco: initialEndereco,
        telefones: [initialTelefone]
      });
    }
    setErrors({});
  }, [clienteParaEditar]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
      isValid = false;
    }

    const cpfDigits = formData.cpf.replace(/\D/g, '');
    if (!cpfDigits) {
      newErrors.cpf = 'CPF é obrigatório';
      isValid = false;
    } else if (cpfDigits.length !== 11) {
      newErrors.cpf = 'CPF deve conter 11 dígitos';
      isValid = false;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    const enderecoErrors: Record<string, string> = {};
    const requiredEnderecoFields = ['estado', 'cidade', 'bairro', 'rua', 'numero', 'codigoPostal'];
    
    requiredEnderecoFields.forEach(field => {
      if (!formData.endereco[field as keyof Endereco]?.trim()) {
        const fieldName = field === 'codigoPostal' ? 'CEP' : field;
        enderecoErrors[field] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} é obrigatório`;
        isValid = false;
      }
    });

    if (Object.keys(enderecoErrors).length > 0) {
      newErrors.endereco = enderecoErrors;
    }

    const telefoneErrors: (string | undefined)[] = [];
    formData.telefones.forEach((tel, index) => {
      if (!tel.ddd.trim() || !tel.numero.trim()) {
        telefoneErrors[index] = 'DDD e número são obrigatórios';
        isValid = false;
      }
    });

    if (telefoneErrors.length > 0) {
      newErrors.telefones = telefoneErrors;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('endereco.')) {
      const field = name.split('.')[1] as keyof Omit<Endereco, 'id' | 'informacoesAdicionais'>;
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [field]: value
        }
      }));
      
      if (errors.endereco?.[field]) {
        setErrors(prev => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            [field]: undefined
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (errors[name as keyof Omit<FormErrors, 'endereco' | 'telefones'>]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleTelefoneChange = (index: number, field: keyof Telefone, value: string) => {
    setFormData(prev => {
      const newTelefones = [...prev.telefones];
      newTelefones[index] = { ...newTelefones[index], [field]: value };
      return { ...prev, telefones: newTelefones };
    });
    
    if (errors.telefones?.[index]) {
      setErrors(prev => {
        const newTelefoneErrors = [...(prev.telefones || [])];
        newTelefoneErrors[index] = undefined;
        return { ...prev, telefones: newTelefoneErrors };
      });
    }
  };

  const addTelefone = () => {
    setFormData(prev => ({
      ...prev,
      telefones: [...prev.telefones, { ddd: '', numero: '' }]
    }));
  };

  const removeTelefone = (index: number) => {
    if (formData.telefones.length > 1) {
      setFormData(prev => ({
        ...prev,
        telefones: prev.telefones.filter((_, i) => i !== index)
      }));
      
      if (errors.telefones?.[index]) {
        setErrors(prev => {
          const newTelefoneErrors = [...(prev.telefones || [])];
          newTelefoneErrors.splice(index, 1);
          return { ...prev, telefones: newTelefoneErrors };
        });
      }
    }
  };

  const formatCPF = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
    
    if (!match) return value;
    
    return [
      match[1] ? match[1] : '',
      match[2] ? `.${match[2]}` : '',
      match[3] ? `.${match[3]}` : '',
      match[4] ? `-${match[4]}` : ''
    ].join('');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formattedValue = formatCPF(value);
    setFormData(prev => ({ ...prev, cpf: formattedValue }));
    
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Iniciando submit...');
    
    if (!validateForm()) {
      console.log('Validação falhou', errors);
      return;
    }
    
    setIsSubmitting(true);
    console.log('Enviando dados:', formData);
    
    try {
      const dataToSend = {
        nome: formData.nome,
        nomeSocial: formData.nomeSocial || undefined,
        email: formData.email || undefined,
        cpf: formData.cpf.replace(/\D/g, ''),
        endereco: {
          estado: formData.endereco.estado,
          cidade: formData.endereco.cidade,
          bairro: formData.endereco.bairro,
          rua: formData.endereco.rua,
          numero: formData.endereco.numero,
          codigoPostal: formData.endereco.codigoPostal,
          informacoesAdicionais: formData.endereco.informacoesAdicionais || undefined
        },
        telefones: formData.telefones.filter(tel => tel.ddd && tel.numero)
      };

      console.log('Dados preparados para envio:', dataToSend);

      if (formData.id) {
        await apiClient.atualizarCliente(formData.id, dataToSend);
      } else {
        await apiClient.criarCliente(dataToSend);
      }
      
      console.log('Cliente salvo com sucesso');
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      console.log('Stack trace:', error.stack);
      alert('Erro inesperado: veja o console');
      
      if (error.response?.data?.error) {
        console.log('Erro do servidor:', error.response.data.error);
        if (error.response.data.error.includes('Email')) {
          setErrors(prev => ({ ...prev, email: error.response.data.error }));
        } else if (error.response.data.error.includes('CPF')) {
          setErrors(prev => ({ ...prev, cpf: error.response.data.error }));
        } else {
          alert(error.response.data.error);
        }
      } else {
        alert('Erro ao salvar cliente');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const enderecoFields = ['estado', 'cidade', 'bairro', 'rua', 'numero', 'codigoPostal'] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">
        {formData.id ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-300">Nome Completo *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <FiUser className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2.5 bg-gray-750 border ${
                errors.nome ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
              placeholder="Nome completo"
            />
          </div>
          {errors.nome && <p className="mt-1 text-sm text-red-500">{errors.nome}</p>}
        </div>
        
        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-300">Nome Social</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <FiUser className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="nomeSocial"
              value={formData.nomeSocial || ''}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 bg-gray-750 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Nome social (opcional)"
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-300">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <FiMail className="h-5 w-5" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2.5 bg-gray-750 border ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
              placeholder="email@exemplo.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-300">CPF *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <FiCreditCard className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleCPFChange}
              maxLength={14}
              placeholder="000.000.000-00"
              className={`w-full pl-10 pr-3 py-2.5 bg-gray-750 border ${
                errors.cpf ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
            />
          </div>
          {errors.cpf && <p className="mt-1 text-sm text-red-500">{errors.cpf}</p>}
        </div>
      </div>
      
      <div className="bg-gray-750 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enderecoFields.map((field) => (
            <div key={field} className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                {field === 'estado' ? 'Estado *' : 
                 field === 'cidade' ? 'Cidade *' : 
                 field === 'bairro' ? 'Bairro *' : 
                 field === 'rua' ? 'Rua *' : 
                 field === 'numero' ? 'Número *' : 'CEP *'}
              </label>
              <input
                type="text"
                name={`endereco.${field}`}
                value={formData.endereco[field]}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 bg-gray-800 border ${
                  errors.endereco?.[field] ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                placeholder={
                  field === 'estado' ? 'Estado' : 
                  field === 'cidade' ? 'Cidade' : 
                  field === 'bairro' ? 'Bairro' : 
                  field === 'rua' ? 'Rua' : 
                  field === 'numero' ? 'Número' : 'CEP'
                }
              />
              {errors.endereco?.[field] && (
                <p className="mt-1 text-sm text-red-500">{errors.endereco[field]}</p>
              )}
            </div>
          ))}
          <div className="md:col-span-2 relative">
            <label className="block mb-2 text-sm font-medium text-gray-300">Informações Adicionais</label>
            <input
              type="text"
              name="endereco.informacoesAdicionais"
              value={formData.endereco.informacoesAdicionais || ''}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Complemento, referência, etc."
            />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-750 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-purple-400">Telefones *</h3>
          <button
            type="button"
            onClick={addTelefone}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg"
          >
            <FiPlus className="h-4 w-4" /> Adicionar
          </button>
        </div>
        
        {formData.telefones.map((telefone, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-3 items-end">
            <div className="md:col-span-3 relative">
              <label className="block mb-2 text-sm font-medium text-gray-300">DDD</label>
              <input
                type="text"
                value={telefone.ddd}
                onChange={(e) => handleTelefoneChange(index, 'ddd', e.target.value)}
                maxLength={2}
                className={`w-full px-3 py-2.5 bg-gray-800 border ${
                  errors.telefones?.[index] ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                placeholder="DDD"
              />
            </div>
            
            <div className="md:col-span-7 relative">
              <label className="block mb-2 text-sm font-medium text-gray-300">Número</label>
              <input
                type="text"
                value={telefone.numero}
                onChange={(e) => handleTelefoneChange(index, 'numero', e.target.value)}
                className={`w-full px-3 py-2.5 bg-gray-800 border ${
                  errors.telefones?.[index] ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                placeholder="Número do telefone"
              />
            </div>
            
            <div className="md:col-span-2 flex justify-end">
              {formData.telefones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTelefone(index)}
                  className="flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  <FiMinus className="h-5 w-5" />
                </button>
              )}
            </div>
            
            {errors.telefones?.[index] && (
              <div className="md:col-span-12 mt-1">
                <p className="text-sm text-red-500">{errors.telefones[index]}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3 pt-3">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-300 bg-gray-750 border border-gray-600 rounded-lg hover:bg-gray-700 transition duration-300 disabled:opacity-50"
          >
            <FiX className="h-5 w-5" />
            Cancelar
          </button>
        )}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 disabled:opacity-50"
        >
          {isSubmitting ? (
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <FiSave className="h-5 w-5" />
          )}
          {formData.id ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;