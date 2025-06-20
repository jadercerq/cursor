-- Script para criar a tabela de chaves de API no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar tabela api_keys
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  key VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  permissions TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  usage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(status);
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON api_keys(created_at);
CREATE INDEX IF NOT EXISTS idx_api_keys_name ON api_keys(name);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_api_keys_updated_at 
  BEFORE UPDATE ON api_keys 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo (opcional)
INSERT INTO api_keys (name, key, description, permissions, status, usage) VALUES
  ('Chave Principal', 'sk-1234567890abcdef1234567890abcdef', 'Chave principal para acesso à API', ARRAY['read', 'write'], 'active', 1250),
  ('Chave de Teste', 'sk-test1234567890test1234567890test', 'Chave para ambiente de desenvolvimento', ARRAY['read'], 'active', 450),
  ('Chave de Backup', 'sk-backup987654321backup987654321', 'Chave de backup para emergências', ARRAY['read', 'write', 'admin'], 'inactive', 0)
ON CONFLICT (key) DO NOTHING;

-- Configurar RLS (Row Level Security) se necessário
-- ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Criar política de acesso (exemplo - ajuste conforme suas necessidades)
-- CREATE POLICY "Allow full access to api_keys" ON api_keys
--   FOR ALL USING (true); 