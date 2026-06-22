# FieldProof

Protótipo de aplicativo móvel desenvolvido com Expo/React Native como trabalho final da disciplina **Desenvolvimento e Aplicações para Dispositivos Móveis**, do curso de Tecnólogo em Análise e Desenvolvimento de Sistemas (IFMS).

---

## 📌 Contexto e Objetivo

O **FieldProof** é um aplicativo voltado para fiscais, auditores e inspetores de conformidade (como agentes de vigilância sanitária, segurança do trabalho ou controle de qualidade industrial).

Em cenários de fiscalização em campo, a conectividade de rede é frequentemente instável ou inexistente, e há necessidade de registrar evidências confiáveis de irregularidades. O aplicativo permite:

- Abertura e gerenciamento de inspeções por estabelecimento
- Registro detalhado de ocorrências com coleta automatizada de metadados de auditoria (geolocalização e timestamp)
- Registro fotográfico vinculado a cada ocorrência
- Autenticação biométrica para garantir a autoria dos registros

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia                | Finalidade                             |
| ------------------------- | -------------------------------------- |
| React Native + Expo       | Framework principal da aplicação       |
| TypeScript                | Tipagem estática e segurança de código |
| Expo SQLite               | Persistência relacional local          |
| React Navigation          | Navegação entre telas                  |
| Expo Local Authentication | Autenticação biométrica do dispositivo |
| Expo Image Picker         | Acesso à câmera nativa                 |
| Expo Location             | Geolocalização / GPS                   |
