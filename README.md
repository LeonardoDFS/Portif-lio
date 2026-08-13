# CHRONOS_OS — Portfólio de Leonardo Freitas

Portfólio estático e interativo organizado como uma viagem por quatro eras da computação:

- Era 01: terminal e apresentação profissional;
- Era 02: desktop inspirado no Windows 95, projetos e DOOM no js-dos;
- Era 03: web pessoal/Y2K com experiência e projetos aplicados;
- Era 04: perfil atual, competências e contato.

## Executar localmente

O projeto não exige instalação ou build. Sirva a pasta por HTTP para que o iframe e os assets funcionem corretamente:

```powershell
python -m http.server 8000
```

Depois, abra `http://localhost:8000`.

## Publicação

O repositório está preparado para hospedagem estática na Vercel. O arquivo `vercel.json` adiciona o cabeçalho `X-Content-Type-Options`.

## Estrutura

- `index.html`: conteúdo e estrutura das quatro eras;
- `css/style.css`: identidade visual, animações e responsividade;
- `js/era-system.js`: navegação entre eras;
- `js/main.js`: animações da Era 01;
- `js/win95.js`: janelas e interações da Era 02;
- `js/projects.js`: conteúdo e navegação interna dos projetos da Era 03;
- `doom.html`: inicialização isolada do js-dos;
- `assets/docs`: currículo público;
- `assets/doom`: bundle utilizado pelo emulador.

## Controles

- Use a navegação lateral ou inferior para trocar de era;
- Em desktop, setas e Page Up/Page Down também navegam;
- Na Era 02, as janelas podem ser abertas, movidas, minimizadas e maximizadas;
- `Esc` fecha a janela ativa na Era 02.

## Licença

O código do portfólio está sob a licença MIT. Assets e softwares de terceiros mantêm seus próprios termos.
