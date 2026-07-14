# ⚡ Íon - Localizador de Estações de Recarga

<p align="center">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white" alt="Leaflet" />
  <img src="https://img.shields.io/badge/Status-V1_Concluída-00E59B?style=for-the-badge" alt="Status V1" />
</p>

O **Íon** é uma plataforma inovadora desenvolvida para facilitar a mobilidade de condutores de veículos elétricos (VEs). Através de uma interface moderna e intuitiva, o sistema permite localizar eletropostos, verificar detalhes técnicos e traçar rotas automáticas a partir da localização em tempo real do condutor.

O projeto foi construído com a abordagem *Mobile-First*, garantindo uma experiência de navegação idêntica à de um aplicativo nativo em telemóveis, mas perfeitamente adaptável para ecrãs de computador (Desktop).

---

## ✨ Funcionalidades Atuais (Versão 1.0)

A versão inicial (V1) foca-se na principal dor dos condutores de VEs: a ansiedade de autonomia e a localização de infraestrutura de carregamento.

- **🗺️ Mapa Interativo Avançado:** Integração com Leaflet para renderização fluida do mapa.
- **📍 Geolocalização em Tempo Real:** Deteção automática da posição do condutor (com fallback para o centro de Salvador).
- **🔋 Filtros Inteligentes:** Categorização de estações por marcadores visuais neon (Público/AC, Carga Rápida/DC e Shoppings/Privado).
- **ℹ️ Painel de Detalhes do Eletroposto:** Informações sobre potência máxima, tipo de conector e um carrossel interativo de imagens do local.
- **🛣️ Traçado de Rotas Dinâmico:** Integração com a API do OSRM para gerar o caminho exato e calcular o tempo estimado de viagem até à estação escolhida.
- **📱 UX/UI Responsiva:** Barra lateral expansível em Desktop e *Bottom Navigation* (menu inferior) em formato de app para telemóveis, com gavetas deslizantes (*Bottom Sheets*).

---

## 🚀 Roadmap: O que vem aí (Versão 2.0)

O sistema Íon vai evoluir de um simples localizador para um verdadeiro ecossistema de mobilidade elétrica. A V2 trará:

- [ ] **🚘 Minha Garagem:** Um espaço dedicado onde o condutor poderá registar os seus veículos elétricos. O sistema cruzará os dados do seu carro (ex: tipo de tomada e potência suportada) com os postos no mapa, mostrando apenas os compatíveis.
- [ ] **👥 Comunidade Íon:** Um fórum integrado para os utilizadores partilharem experiências, avaliarem postos de carregamento, reportarem pontos fora de serviço e organizarem encontros.

---

## 🛠️ Tecnologias e Ferramentas

- **Frontend:** Angular 17+ (Componentes Standalone)
- **Linguagem:** TypeScript
- **Estilização:** CSS Customizado (Design System Neon/Dark) + Bootstrap (Grid/Utilities)
- **Mapas & Rotas:** Leaflet.js e OSRM API (Open Source Routing Machine)
- **Ícones:** Bootstrap Icons

---

## 🔐 Como Acessar o Sistema (Login)

O projeto atual é focado no Frontend. Para facilitar a avaliação e os testes, você pode acessar a plataforma imediatamente utilizando as seguintes credenciais de administrador pré-configuradas:

* **E-mail:** `admin@ion.com`
* **Senha:** `admin123`

---

## ⚙️ Como executar o projeto localmente

Para correr este projeto na sua máquina, certifique-se de que tem o [Node.js](https://nodejs.org/) e o [Angular CLI](https://angular.io/cli) instalados.

**1. Clone o repositório:**
```bash
git clone [https://github.com/alex-tx88/ionproject.git](https://github.com/alex-tx88/ionproject.git)
2. Navegue até o diretório do projeto:

Bash
cd ionproject
3. Instale as dependências:

Bash
npm install
4. Inicie o servidor de desenvolvimento:

Bash
ng serve
Abra o seu navegador e acesse http://localhost:4200/. A aplicação irá recarregar automaticamente se fizer alterações no código.

👨‍💻 Autor
Desenvolvido por Alex Teixeira de Jesus


Estudante e entusiasta de Infraestrutura, Suporte de TI e Desenvolvimento Frontend.