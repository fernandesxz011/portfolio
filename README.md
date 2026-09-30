# Gustavo Fernandes — Portfólio

Currículo digital de **Gustavo Fernandes Santana**, estudante de Análise e Desenvolvimento de Sistemas em transição da área administrativa para tecnologia. O portfólio apresenta projetos verificáveis, conhecimentos em desenvolvimento e experiência profissional, sem atribuir senioridade ou resultados comerciais não comprovados.

**Site:** https://fernandesxz011.github.io/portfolio/

**Repositório:** https://github.com/fernandesxz011/portfolio

## Executar localmente

O site é estático. Abra `index.html` no navegador ou use o servidor de desenvolvimento, com Node.js 22 ou superior:

```sh
npm start
```

Acesse **http://127.0.0.1:4173**. No PowerShell com restrição de execução de scripts, use `npm.cmd start`.

Não é necessário instalar dependências para abrir o site, servir a prévia ou executar as verificações estáticas. Outra opção, com Python 3:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

## Tecnologias e arquitetura

- HTML semântico: todo o conteúdo principal é entregue no documento e funciona sem JavaScript.
- CSS: propriedades personalizadas, Grid, Flexbox e regras específicas para celular, tablet, desktop, impressão e movimento reduzido.
- JavaScript nativo: menu acessível, animações por IntersectionObserver, interação discreta do diagrama e atualização opcional de descrições pelo GitHub.
- SVG próprio: diagrama técnico e favicon tipográfico; sem bibliotecas de ícones ou animações.
- Fontes de sistema: sem requisições externas, arquivos de fontes ou mudanças de layout por carregamento de tipografia.
- Playwright e axe-core: dependências **somente de desenvolvimento**, utilizadas nos testes. Não são publicadas nem executadas pelo visitante.

Não há framework, backend, etapa obrigatória de build ou dependência de Node no site publicado. O servidor Node incluído serve apenas para desenvolvimento local e simula também um prefixo de repositório em `/portfolio-preview/`.

## Estrutura

```text
.
├── index.html
├── 404.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── images/
│       ├── favicon.svg
│       ├── social.png
│       ├── trs-preview.jpg
│       └── excel-preview.jpg
├── scripts/
│   ├── serve.mjs
│   ├── check.mjs
│   ├── configure-site.mjs
│   └── verify-browser.cjs
├── .github/workflows/pages.yml
├── robots.txt
├── sitemap.xml
└── package.json
```

`.work/`, `test-results/`, `node_modules/` e `dist/` são locais e ignorados pelo Git. O workflow publica apenas HTML, assets, robots, sitemap e `.nojekyll`.

## Conteúdo e fontes

Os dados profissionais e a lista de conhecimentos vieram do briefing. Os repositórios e READMEs públicos foram consultados em **30/09/2026**. Datas de contratação, conclusão de curso, instituição, certificações e resultados comerciais não foram acrescentados.

| Projeto | O que está apresentado | Fonte |
| --- | --- | --- |
| TRS Serralheria | Landing page conceitual, navegação por seções e animações; canal de contato pendente | [Repositório](https://github.com/fernandesxz011/trs-serralheria) |
| Luia Veículos | Protótipo frontend com busca, filtros, favoritos temporários e preparação de mensagens; imagens e dados comerciais pendentes | [Repositório](https://github.com/fernandesxz011/luia-veiculos) |
| Análise de Vendas | Estudo em Excel com fórmulas, tabelas e visualização por produto | [Repositório](https://github.com/fernandesxz011/ANALISE-DE-VENDAS-EXCEL) |

As seções de aprendizados descrevem as práticas técnicas presentes nos projetos. Não representam certificações, domínio avançado ou resultados de clientes. A experiência administrativa permanece separada da trajetória em tecnologia.

Clínica Ágape, Patriota Barbearia e WCS Higienização não receberam cases: seus repositórios públicos estavam vazios na consulta. Outros projetos continuam acessíveis pelo link para todos os repositórios.

### Imagens

- `trs-preview.jpg`: captura real do `index.html` público da TRS, renderizado em Chrome a 1280 × 800. O código e a fotografia originais foram preservados; fontes externas não foram carregadas na captura. A legenda identifica o conteúdo como protótipo, sem afirmar publicação oficial ou aprovação comercial.
- `excel-preview.jpg`: arquivo original [`7cd3f2e6-9f64-40c4-8169-c257a5ab0da5.jpg`](https://github.com/fernandesxz011/ANALISE-DE-VENDAS-EXCEL/blob/main/7cd3f2e6-9f64-40c4-8169-c257a5ab0da5.jpg). A imagem contém somente dados agregados por produto. Abas e capturas com nomes e salários não foram reproduzidas.
- Luia: diagrama em HTML/CSS do fluxo descrito no repositório, explicitamente identificado como diagrama funcional. Não simula uma screenshot nem substitui imagens ausentes de veículos.
- `social.png`: composição tipográfica própria para compartilhamento, com 1200 × 630 px.

### Contato

O único canal confirmado é [github.com/fernandesxz011](https://github.com/fernandesxz011). A seção de contato leva ao perfil público e informa a ausência de outros canais. Não existe formulário de envio nem e-mail ou LinkedIn inventado. Para incluir contato direto, substitua o CTA da seção `#contato` por um `mailto:` ou pelo endereço profissional confirmado.

## Publicar no GitHub Pages

O projeto funciona tanto em um domínio próprio quanto em `https://fernandesxz011.github.io/NOME-DO-REPOSITORIO/`. CSS, JavaScript e imagens usam caminhos relativos; a navegação usa âncoras na mesma página.

### GitHub Actions — recomendado

1. Crie o repositório desejado no GitHub e envie estes arquivos, incluindo `.github/workflows/pages.yml`.
2. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**.
3. Em **Actions → Publicar portfólio no GitHub Pages**, execute **Run workflow** na branch desejada.
4. Abra a URL informada ao concluir a execução.

O workflow é **manual**. Ele lê a URL real do Pages, configura canonical, Open Graph, Twitter Card, JSON-LD, robots, sitemap e o retorno da página 404, executa as verificações e publica somente os arquivos públicos. Novas versões são publicadas ao executar novamente o workflow.

A configuração segue a [documentação de workflows do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

### Publicação pela branch

Antes de publicar pela raiz de uma branch, execute com o endereço **real** do repositório:

```sh
npm run configure -- https://fernandesxz011.github.io/NOME-DO-REPOSITORIO/
npm run check
```

Substitua `NOME-DO-REPOSITORIO`, envie os arquivos configurados e selecione a branch e a pasta `/ (root)` em Pages. Não publique `.work/`, `test-results/` ou dependências.

Os arquivos estão configurados para `https://fernandesxz011.github.io/portfolio/`. Ao publicar em outro endereço, execute novamente `configure` com a nova URL. O workflow obtém esse endereço automaticamente. A página 404 é independente dos assets relativos, para funcionar também em endereços inexistentes com múltiplos segmentos.

## Design e acessibilidade

O visual usa fundo grafite, superfícies discretas, um único acento verde, grandes títulos editoriais e divisórias. Os projetos alternam composição visual e conteúdo técnico, com os detalhes em elementos nativos `details/summary`.

- Link para pular ao conteúdo, landmarks, hierarquia de títulos e idioma `pt-BR`.
- Navegação por teclado e foco visível. Menu mobile com estado anunciado, fechamento por Escape e transferência de foco ao navegar.
- Conteúdo, navegação e cases acessíveis mesmo com JavaScript desabilitado.
- Texto alternativo, dimensões explícitas nas imagens e indicações acessíveis de nova aba.
- Movimento reduzido respeitado, inclusive quando a preferência muda durante a sessão.
- Diagrama interativo desativado no celular e sem substituir o cursor padrão.

## Performance

Sem frameworks, fontes externas, vídeo ou bibliotecas de animação no navegador. O SVG da abertura é inline. As capturas usam carregamento tardio e dimensões reservadas. O script usa `defer`; as animações usam `opacity` e `transform`, e a interação do diagrama utiliza `requestAnimationFrame` apenas quando o ponteiro se move.

A consulta ao GitHub só ocorre quando a seção se aproxima da tela. Tem timeout de cinco segundos e preserva o conteúdo estático em caso de falha. O site não depende da API para apresentar os projetos.

## Segurança

Não há credenciais, tokens, senhas, analytics, cookies próprios ou formulário. As descrições da API são inseridas com `textContent`; os links são estáticos e não são extraídos da resposta externa. A requisição é pública, sem credenciais, e valida o nome e o proprietário de cada repositório.

A política CSP limita scripts, estilos, imagens e conexões. O JSON-LD é autorizado por hash; alterações nesse bloco exigem recalcular o hash, o que o comando `configure` faz automaticamente. `.gitattributes` mantém finais de linha consistentes. Links externos usam `noopener noreferrer`.

GitHub Pages não permite definir livremente headers HTTP. A CSP é entregue em meta; políticas que exigem headers, como `frame-ancestors`, não são simuladas nessa configuração. Segredos usados eventualmente em automações futuras devem permanecer no ambiente de CI, nunca no JavaScript publicado.

## Verificações

```sh
npm run check
```

Confere sintaxe JavaScript, assets, IDs, âncoras, links externos, atributos das imagens, JSON-LD, hash da CSP e padrões comuns de credenciais.

Para os testes no navegador:

```sh
npm ci
npx playwright install chromium
npm start
```

Em outro terminal:

```sh
npm test
```

Para usar o Chrome já instalado, no PowerShell:

```powershell
$env:BROWSER_CHANNEL = 'chrome'
npm.cmd test
```

O teste utiliza `/portfolio-preview/` para verificar caminhos de um project site. As respostas do GitHub são controladas no teste, incluindo sucesso, conteúdo malicioso e limite de requisições. Nenhuma mensagem é enviada. Relatórios e capturas ficam em `test-results/`.

Verificação realizada em Chrome em 30/09/2026:

- 320, 375, 390, 768, 1024, 1440 e 1920 px: sem overflow horizontal, falhas de imagens ou erros de JavaScript.
- Menu, Escape, foco, skip link, cases, ausência de JavaScript e movimento reduzido verificados.
- API com conteúdo semelhante a XSS tratada como texto; links preservados. Falha 403 mantém os repositórios estáticos.
- axe-core nas larguras 390, 768 e 1440 px: nenhuma violação nos conjuntos WCAG A/AA e boas práticas executados.

A análise automatizada não substitui uma sessão com leitor de tela ou testes em dispositivos físicos. A publicação remota deve ser conferida depois de escolher o repositório e executar o workflow.
