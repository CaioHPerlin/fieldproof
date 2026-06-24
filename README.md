# FieldProof

> Trabalho desenvolvido individualmente.
> Nome Completo: Caio Hygino Perlin de Lima, TADS 5

Protótipo de aplicativo móvel desenvolvido com Expo/React Native como trabalho final da disciplina **Desenvolvimento e Aplicações para Dispositivos Móveis**, do curso de Tecnólogo em Análise e Desenvolvimento de Sistemas (IFMS).

---

## 📌 Contexto e Objetivo

O **FieldProof** é um aplicativo voltado para fiscais, auditores e inspetores de conformidade (como agentes de vigilância sanitária, segurança do trabalho ou controle de qualidade industrial).

Em cenários de fiscalização em campo, a conectividade de rede é frequentemente instável ou inexistente, e há necessidade de registrar evidências confiáveis de irregularidades. O aplicativo permite:

- Abertura e gerenciamento de inspeções.
- Registro detalhado de ocorrências com coleta automatizada de metadados de auditoria (geolocalização e timestamp).
- Registro fotográfico em formato **Base64** embutido diretamente no banco local.
- Autenticação biométrica integrada ao hardware para garantir a autoria dos registros.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia                | Finalidade                             |
| ------------------------- | -------------------------------------- |
| React Native + Expo       | Framework principal da aplicação       |
| TypeScript                | Tipagem estática e segurança de código |
| Expo SQLite               | Persistência relacional local          |
| React Navigation          | Navegação baseada em estado global     |
| Expo Local Authentication | Autenticação biométrica do dispositivo |
| Expo Image Picker         | Captura de fotos via câmera nativa     |
| Expo Location             | Geolocalização / GPS                   |

---

## Arquitetura de Dados (SQLite)

O aplicativo utiliza o modelo relacional clássico de **1 para N** com integridade referencial. As entidades foram nomeadas da seguinte forma:

- **Tabela `inspections` (Parent):** Cabeçalho da auditoria (ID, título, local e data).
- **Tabela `attachments` (Child):** As evidências registradas. Possui uma chave estrangeira apontando para a inspeção correspondente. Caso uma inspeção seja removida, o banco limpa em cascata todos os seus anexos.
