import { supabase } from '../lib/supabase'

// Função para gerar chave de API segura
const generateApiKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'sk-'
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Buscar todas as chaves de API
export const fetchApiKeys = async () => {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar chaves de API:', error)
    throw error
  }
}

// Criar nova chave de API
export const createApiKey = async (apiKeyData) => {
  try {
    const newKey = {
      name: apiKeyData.name,
      key: generateApiKey(),
      description: apiKeyData.description,
      permissions: apiKeyData.permissions,
      status: 'active',
      usage: 0,
      created_at: new Date().toISOString(),
      last_used: null
    }

    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Erro ao criar chave de API:', error)
    throw error
  }
}

// Atualizar chave de API
export const updateApiKey = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .update({
        name: updates.name,
        description: updates.description,
        permissions: updates.permissions,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Erro ao atualizar chave de API:', error)
    throw error
  }
}

// Excluir chave de API
export const deleteApiKey = async (id) => {
  try {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Erro ao excluir chave de API:', error)
    throw error
  }
}

// Atualizar status da chave (ativo/inativo)
export const toggleApiKeyStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Erro ao alterar status da chave:', error)
    throw error
  }
}

// Atualizar uso da chave
export const updateApiKeyUsage = async (id, usage) => {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .update({
        usage: usage,
        last_used: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Erro ao atualizar uso da chave:', error)
    throw error
  }
} 