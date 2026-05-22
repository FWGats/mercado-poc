# Ambiente de Simulação Econômica

Uma plataforma completa de mercado de previsões (*prediction market*) desenvolvida com React e TypeScript. O sistema permite aos usuários negociarem contratos baseados na probabilidade de eventos futuros nas categorias de Economia, Finanças, Criptomoedas e Câmbio.

## 🚀 Funcionalidades

* **Dashboard de Mercados:** Navegue por eventos filtrados por categoria ou visualize os mercados em alta (destaques).
* **Trading de Previsões:** Invista no fechamento de mercados adquirindo cotas de 'SIM' ou 'NÃO'. O custo e o retorno são baseados nas probabilidades atuais que simulam vida real.
* **Portfólio Interativo:** Acompanhe suas posições abertas e visualize a evolução do seu patrimônio com gráficos interativos.
* **Gestão de Perfil:** Verifique o status da conta e atualize seus dados cadastrais (Nome, CPF, E-mail e Chave Pix).
* **Painel Administrativo:** Área interativa para criar novos mercados customizados, forçar a resolução de eventos existentes (liquidando prêmios aos acertadores) e conferir estatísticas globais (volume negociado, liquidez estimada e taxas projetadas).
* **Simulador de Depósito (Pix):** Um fluxo de modal interativo para recarga de saldo do usuário na plataforma.
* **Simulação de Elementos Visivos:** O sistema imita oscilações do mercado ao vivo (aleatoriedade nos volumes e percentuais de forma regular), dando impressão de movimento constante de traders reais operando.
* **Design Responsivo (Mobile-first):** Totalmente adaptada para telas menores, focando no paradigma de abas móveis na parte inferior (app-like) e sidebars nos desktops.

## 💻 Tecnologias Utilizadas

* **Framework:** React 18 (Vite)
* **Tipagem:** TypeScript
* **Estilos:** Tailwind CSS
* **Ícones:** Lucide React
* **Visuais e Gráficos:** Recharts
* **Gerenciamento de Dados:** Estado local nativo persistido através de `localStorage`.

## 📖 Fluxo Básico de Uso

1. **Adicionar Saldo:** Ao abrir a aplicação, clique no seu saldo ou no atalho superior para simular um depósito fictício (via Pix).
2. **Explorar e Comprar:** Vá na tela inicial (Mercados), selecione um dos cards como "Taxa Selic" ou "Bitcoin acima de X". Digite o número de cotas e efetue sua compra de posição escolhendo "SIM" ou "NÃO".
3. **Monitoramento:** Vá para a tela **Portfólio** para analisar suas apostas em aberto, seu custo real, prêmio potencial e evolução de patrimônio no gráfico de 30 dias.
4. **Resolução Dinâmica:** Quer ver o crédito sendo realizado? Acesse o **Painel Administrativo** e clique em "Resolver: SIM" ou "Resolver: NÃO" numa pauta onde você tenha participação. Volte ao Portfólio ou olhe seu Saldo: se a pauta favoreceu sua escolha, o prêmio será depositado integralmente na sua conta na mesma hora!
5. **Configurações:** Teste a aba de "Perfil" para customizar o nome do titular e acompanhar seu uso.

## ⚙️ Executando o Projeto Localmente

1. Primeiro, clone o código e acesse a raiz.
2. Certifique-se de ter o Node.js v18+.
3. Realize a instalação das dependências configuradas pelo projeto:
```bash
npm install
```
4. Suba o ambiente Web:
```bash
npm run dev
```
5. Aproveite para customizar tudo o que precisar!
