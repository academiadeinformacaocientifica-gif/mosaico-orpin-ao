# Regras de Desenvolvimento e Fluxo de Trabalho

Para todas as tarefas e pedidos no projeto Mosaico, seguir obrigatoriamente o seguinte protocolo em três etapas:

## 1. Fase de Diagnóstico e Proposta (Antes de Modificar Código)
- Apresentar um diagnóstico claro do que foi solicitado.
- Descrever detalhadamente as alterações que serão realizadas no código/base de dados.
- Explicar o impacto dessas alterações no projeto (funcional, visual, arquitetural ou de dados).
- Terminar a resposta perguntando explicitamente: **"Posso aplicar estas alterações?"**
- **Aguardar a aprovação expressa do utilizador antes de realizar qualquer edição de ficheiros ou implementação.**

## 2. Fase de Implementação e Verificação
- Após a aprovação do utilizador, implementar as alterações acordadas.
- Validar a integridade técnica com linter e compilação (`compile_applet`).
- Terminar a resposta apresentando o resumo do que foi implementado e perguntando explicitamente: **"Posso atualizar e enviar o commit para o GitHub?"**
- **Aguardar a confirmação do utilizador antes de fazer commit e push.**

## 3. Fase de Envio para o GitHub
- Após confirmação expressa do utilizador, realizar o commit com mensagem semântica e executar `git push origin main`.
- Confirmar o hash do commit e o estado sincronizado do repositório.
