const y2kProjects = {
  automation: {
    file: 'AUTOMACAO_FLUXOS.HTM',
    category: 'SISTEMA CORPORATIVO // 2026',
    title: 'Automação de Fluxos Corporativos',
    summary: 'Suporte e organização de processos automatizados para manter fluxos operacionais confiáveis e rastreáveis.',
    context: 'O projeto envolveu soluções corporativas construídas com Power Platform, integrações externas e regras de negócio que precisavam funcionar sem interrupções para os usuários finais.',
    solution: 'Foram validadas regras de negócio, investigadas inconsistências e padronizados processos. A documentação reuniu integrações, rotinas operacionais e decisões técnicas para facilitar suporte e manutenção.',
    role: 'Atuei no suporte técnico, diagnóstico de inconsistências, validação dos fluxos e documentação das integrações e dos processos.',
    tech: ['Power Platform', 'Automação', 'Regras de negócio', 'Documentação', 'Suporte'],
    facts: [['ANO', '2026'], ['TIPO', 'Projeto corporativo'], ['FOCO', 'Processos e suporte']],
    gallery: ['MAPA DO FLUXO', 'REGRAS DE NEGÓCIO', 'PAINEL OPERACIONAL'],
  },
  iot: {
    file: 'MONITORAMENTO_IOT.HTM',
    category: 'HARDWARE + SOFTWARE // 2026',
    title: 'Monitoramento Térmico IoT',
    summary: 'Telemetria térmica com sensores e microcontroladores aplicada a racks e equipamentos de missão crítica.',
    context: 'Racks e data centers exigem acompanhamento de temperatura e conectividade para reduzir risco operacional e identificar falhas antes que afetem os equipamentos.',
    solution: 'O trabalho reuniu montagem e configuração de hardware, instalação de sensores, comunicação em rede e validação da telemetria durante a implementação.',
    role: 'Participei da montagem, configuração e manutenção dos dispositivos, além do diagnóstico de falhas físicas, lógicas e de conectividade.',
    tech: ['IoT', 'Microcontroladores', 'Sensores', 'Redes', 'Telemetria'],
    facts: [['ANO', '2026'], ['TIPO', 'Projeto aplicado'], ['AMBIENTE', 'Racks / Data Centers']],
    gallery: ['HARDWARE INSTALADO', 'LEITURA DOS SENSORES', 'TELEMETRIA'],
  },
  'unity-horror': {
    file: 'UNITY_HORROR_GAME.HTM',
    category: 'GAME DEVELOPMENT // CASE FILE',
    title: 'Game de Terror em Unity',
    summary: 'Projeto autoral de terror desenvolvido em Unity e C#, pronto para ganhar um estudo de caso completo no portfólio.',
    context: 'Jogos autorais mostram programação, design de sistemas, composição de ambientes e capacidade de transformar uma ideia em experiência interativa.',
    solution: 'A página já está estruturada para apresentar ambientação, mecânicas, sistemas implementados, desafios técnicos, trailer, imagens e link para jogar.',
    role: 'Desenvolvimento autoral. Os detalhes exatos da sua participação serão adicionados junto com os materiais do projeto.',
    tech: ['Unity', 'C#', 'Game Design', 'Level Design'],
    facts: [['STATUS', 'Em documentação'], ['ENGINE', 'Unity'], ['GÊNERO', 'Terror']],
    gallery: ['CAPTURA DO JOGO #01', 'CAPTURA DO JOGO #02', 'GAMEPLAY / TRAILER'],
    note: 'ARQUIVO INCOMPLETO: adicione nome do jogo, ano, sua função, mecânicas, 3 a 6 prints e um link para build, vídeo ou repositório.',
  },
};

function openY2KProject(projectId) {
  const project = y2kProjects[projectId];
  const home = document.getElementById('y2k-home');
  const view = document.getElementById('y2k-project-view');
  if (!project || !home || !view) return;

  document.getElementById('project-file-name').textContent = project.file;
  document.getElementById('project-category').textContent = project.category;
  document.getElementById('project-title').textContent = project.title;
  document.getElementById('project-summary').textContent = project.summary;
  document.getElementById('project-context').textContent = project.context;
  document.getElementById('project-solution').textContent = project.solution;
  document.getElementById('project-role').textContent = project.role;

  document.getElementById('project-tech').innerHTML = project.tech
    .map(item => `<span>${item}</span>`)
    .join('');

  document.getElementById('project-facts').innerHTML = project.facts
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join('');

  document.getElementById('project-gallery').innerHTML = project.gallery
    .map((label, index) => `
      <figure class="project-gallery-placeholder">
        <span>IMG_0${index + 1}.JPG</span>
        <div class="material-symbols-outlined" aria-hidden="true">image</div>
        <figcaption>${label}</figcaption>
      </figure>
    `).join('');

  const note = document.getElementById('project-note');
  note.hidden = !project.note;
  note.textContent = project.note || '';

  const address = document.querySelector('.browser-address');
  if (address) address.textContent = `Endereço: https://chronos.local/projects/${project.file.toLowerCase()}`;

  home.hidden = true;
  view.hidden = false;
  view.focus();
  document.querySelector('#era-03 .era-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeY2KProject() {
  const home = document.getElementById('y2k-home');
  const view = document.getElementById('y2k-project-view');
  if (!home || !view) return;

  view.hidden = true;
  home.hidden = false;

  const address = document.querySelector('.browser-address');
  if (address) address.textContent = 'Endereço: https://chronos.local/leonardo_online.htm';

  document.getElementById('projetos-03')?.scrollIntoView({ block: 'start' });
  document.querySelector('.y2k-project-card')?.focus();
}
