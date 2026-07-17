<div align="center">
  
  <!-- Substitua o link abaixo pela URL de uma imagem/logo real do seu projeto, se tiver -->
  <img src="https://via.placeholder.com/800x200/0b1114/00e59b?text=ION+-+Mobilidade+Eletrica" alt="Íon Banner" width="100%" />

  <br>

  # ⚡ Íon - Localizador de Estações de Recarga

  <p align="center">
    <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white" alt="Leaflet" />
    <img src="https://img.shields.io/badge/Status-V1_Conclu%C3%ADda-00E59B?style=for-the-badge" alt="Status V1" />
  </p>

  <p align="center">
    <strong>Plataforma moderna e intuitiva projetada para eliminar a ansiedade de autonomia dos condutores de veículos elétricos (VEs).</strong>
  </p>

</div>

<br>

## 📖 Sobre o Projeto

O **Íon** é uma plataforma inovadora desenvolvida para facilitar a mobilidade elétrica. Através de uma interface moderna e intuitiva, o sistema permite localizar eletropostos, verificar detalhes técnicos em tempo real e traçar rotas precisas a partir da localização do condutor.

Desenvolvido com a abordagem **Mobile-First**, garante uma experiência fluida idêntica à de um aplicativo nativo em telemóveis (*Bottom Navigation, Bottom Sheets, touch-friendly*), mantendo total adaptabilidade para ecrãs de computador (Desktop).

<br>

## ✨ Funcionalidades (Versão 1.0)

A versão inicial (V1) resolve a principal dor dos condutores de VEs: a localização de infraestrutura de carregamento.

- **🗺️ Mapa Interativo Avançado:** Integração com a biblioteca *Leaflet* para renderização rápida e fluida do mapa.
- **📍 Geolocalização em Tempo Real:** Deteção automática da posição do utilizador via GPS do browser (com *fallback* inteligente para o centro de Salvador).
- **🔋 Filtros Inteligentes:** Categorização visual de estações por marcadores neon:
  - 🟢 **Público (AC)**
  - 🔵 **Carga Rápida (DC)**
  - 🟣 **Shoppings / Privado**
- **ℹ️ Painel de Detalhes:** Informações críticas a um clique de distância, incluindo potência máxima, tipo de conector e um carrossel interativo de imagens do local.
- **🛣️ Traçado de Rotas Dinâmico:** Integração com a *API OSRM* para gerar trajetos precisos, informando distância exata e tempo estimado de viagem.
- **📱 UX/UI Premium:** Interface rica com barra lateral expansível em Desktop e gavetas deslizantes no Mobile.

<br>

## 🚀 Roadmap: O Futuro do Íon (Versão 2.0)

O sistema Íon vai evoluir de um localizador para um verdadeiro ecossistema de mobilidade. O que estamos a preparar:

- [ ] **🚘 Minha Garagem:** Um espaço dedicado onde o condutor poderá registar os seus veículos elétricos. O sistema cruzará os dados do seu carro (ex: tipo de tomada e potência suportada) com os postos no mapa, mostrando **apenas** os compatíveis.
- [ ] **👥 Comunidade Íon:** Um fórum integrado para os utilizadores partilharem experiências, avaliarem postos de carregamento, reportarem pontos fora de serviço e organizarem encontros locais.

<br>

## 🛠️ Tecnologias e Arquitetura

O projeto foi construído utilizando as seguintes tecnologias e boas práticas:

| Tecnologia | Descrição |
| --- | --- |
| **Angular 17+** | Framework principal (arquitetura *Standalone Components*). |
| **TypeScript** | Linguagem principal, garantindo tipagem forte e código seguro. |
| **Leaflet.js** | Motor de renderização do mapa interativo. |
| **OSRM API** | Open Source Routing Machine para cálculo de rotas em tempo real. |
| **CSS3 / UI** | Design System exclusivo (*Neon/Dark Mode*). |
| **Bootstrap** | Utilizado para utilitários de Grid e ícones (*Bootstrap Icons*). |

<br>

## 🔐 Acesso ao Sistema (Demo)

Como o foco atual é o Frontend e o fluxo de experiência do utilizador, a autenticação foi desenhada para facilitar a demonstração. Acesse utilizando as credenciais de administrador pré-configuradas:

> **E-mail:** `admin@ion.com` <br>
> **Senha:** `admin123`

<br>

## ⚙️ Instalação e Execução Local

Siga os passos abaixo para correr o projeto na sua máquina. Certifique-se de ter o **[Node.js](https://nodejs.org/)** e o **[Angular CLI](https://angular.io/cli)** instalados.

**1. Clone o repositório**
```bash
git clone [https://github.com/alex-tx88/ionproject.git](https://github.com/alex-tx88/ionproject.git)
2. Aceda ao diretório do projeto

Bash
cd ionproject
3. Instale as dependências

Bash
npm install
4. Inicie o servidor de desenvolvimento

Bash
ng serve
🌐 A aplicação estará disponível em http://localhost:4200/. Qualquer alteração no código será refletida automaticamente no browser.

👨‍💻 Autor
Alex Teixeira de Jesus

Estudante de Desenvolvimento Frontend.