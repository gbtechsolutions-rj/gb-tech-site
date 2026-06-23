const menu = document.getElementById("menu");
const mobile = document.getElementById("mobile");
const menuClose = document.querySelector(".menu-close");
const menuBg = document.querySelector(".menu-overlay-bg");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const menuPhotos = Array.from(document.querySelectorAll(".io-menu-photo"));
let menuPhotoTimer = null;
let menuPhotoIndex = Math.max(menuPhotos.findIndex((photo) => photo.classList.contains("active")), 0);

function showMenuPhoto(index){
  if(!menuPhotos.length) return;
  menuPhotos.forEach((photo, photoIndex) => {
    photo.classList.toggle("active", photoIndex === index);
  });
}

function startMenuPhotoSlider(){
  if(reduceMotion || menuPhotos.length < 2 || menuPhotoTimer) return;
  showMenuPhoto(menuPhotoIndex);
  menuPhotoTimer = window.setInterval(() => {
    menuPhotoIndex = (menuPhotoIndex + 1) % menuPhotos.length;
    showMenuPhoto(menuPhotoIndex);
  }, 2800);
}

function stopMenuPhotoSlider(){
  if(!menuPhotoTimer) return;
  window.clearInterval(menuPhotoTimer);
  menuPhotoTimer = null;
}

function setMenu(open){
  if(!menu || !mobile) return;
  menu.classList.toggle("open", open);
  mobile.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.classList.toggle("menu-is-open", open);
  if(open) {
    startMenuPhotoSlider();
  } else {
    stopMenuPhotoSlider();
  }
}

mobile?.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menuClose?.addEventListener("click", () => setMenu(false));
menuBg?.addEventListener("click", () => setMenu(false));
document.querySelectorAll(".menu-link[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId && document.querySelector(targetId);
    if(!target) {
      setMenu(false);
      return;
    }

    event.preventDefault();
    setMenu(false);

    window.setTimeout(() => {
      const headerHeight = document.querySelector(".io-header")?.offsetHeight || 0;
      const extraGap = targetId === "#inicio" ? 0 : 12;
      const top = targetId === "#inicio"
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - headerHeight - extraGap;

      window.scrollTo({
        top:Math.max(0, top),
        behavior:reduceMotion ? "auto" : "smooth"
      });

      history.pushState(null, "", targetId);
    }, 80);
  });
});
document.querySelectorAll(".menu a:not(.menu-link)").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if(event.key === "Escape") {
    setMenu(false);
    closeDemoModal();
    closeSystemModal();
    closeInstallModal();
    closeCookieModal();
  }
});
document.addEventListener("visibilitychange", () => {
  if(!menu?.classList.contains("open")) return;
  if(document.hidden) {
    stopMenuPhotoSlider();
  } else {
    startMenuPhotoSlider();
  }
});

// Floating WhatsApp quick options.
(function(){
  const quick = document.getElementById("whatsappQuick");
  const button = quick?.querySelector(".whatsapp");
  if(!quick || !button) return;

  const setOpen = (open) => {
    quick.classList.toggle("open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
  };

  button.addEventListener("click", () => setOpen(!quick.classList.contains("open")));
  quick.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
  document.addEventListener("click", (event) => {
    if(quick.contains(event.target)) return;
    setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if(event.key === "Escape") setOpen(false);
  });
})();

const year = document.getElementById("year");
const menuYear = document.getElementById("menuYear");
const currentYear = new Date().getFullYear();
if(year) year.textContent = currentYear;
if(menuYear) menuYear.textContent = currentYear;

// Theme switch. Keeps dark as the default and stores the visitor choice.
(function(){
  const buttons = document.querySelectorAll("[data-theme-switch]");
  if(!buttons.length) return;

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const getTheme = (theme) => theme === "light" ? "light" : "dark";

  function setTheme(theme){
    const current = getTheme(theme);
    document.documentElement.dataset.theme = current;
    buttons.forEach((button) => button.classList.toggle("active", button.dataset.themeSwitch === current));
    metaTheme?.setAttribute("content", current === "light" ? "#f8fbff" : "#050914");
    localStorage.setItem("gbTechTheme", current);
  }

  buttons.forEach((button) => button.addEventListener("click", () => setTheme(button.dataset.themeSwitch)));
  setTheme(localStorage.getItem("gbTechTheme") === "light" ? "light" : "dark");
})();

// Language switch. Keeps the original DOM text and translates only on click.
(function(){
  const buttons = document.querySelectorAll("[data-lang-switch]");
  if(!buttons.length) return;

  const textMap = {
    "Início":"Home",
    "Quem somos":"About us",
    "Nossas soluções":"Our solutions",
    "Projetos":"Projects",
    "Planos":"Plans",
    "Aplicativos":"Apps",
    "Aplicativos publicados":"Published apps",
    "Produtos digitais da GB Tech Solutions":"GB Tech Solutions digital products",
    "Aplicativo de wallpapers animados com experiência gratuita e recursos Premium.":"Live wallpaper app with a free experience and Premium features.",
    "Aplicativo de wallpapers animados com experiÃªncia gratuita e recursos Premium.":"Live wallpaper app with a free experience and Premium features.",
    "Ver app":"View app",
    "Em breve na Google Play":"Coming soon on Google Play",
    "Produtos prontos":"Ready products",
    "Escuro":"Dark",
    "Claro":"Light",
    "Instalar app":"Install app",
    "Instale o app":"Install the app",
    "Instalar":"Install",
    "Cancelar":"Cancel",
    "GB Tech Solutions":"GB Tech Solutions",
    "Baixar / instalar agora":"Download / install now",
    "Se o botão não abrir a instalação, siga as instruções acima conforme seu dispositivo.":"If the button does not open installation, follow the instructions above for your device.",
    "App GB Tech":"GB Tech app",
    "Instale a GB Tech no seu celular":"Install GB Tech on your phone",
    "GB Tech já está instalada":"GB Tech is already installed",
    "Você já está navegando pela versão instalada do app GB Tech.":"You are already browsing the installed version of the GB Tech app.",
    "Instale a GB Tech":"Install GB Tech",
    "Seu navegador permite instalar agora. Clique no botão":"Your browser can install it now. Click the",
    "e confirme a instalação.":"button and confirm the installation.",
    "Instale no iPhone ou iPad":"Install on iPhone or iPad",
    "Abra este site pelo":"Open this site in",
    "toque no botão de compartilhar e escolha":"tap the share button and choose",
    "Depois disso, o ícone da GB Tech aparece como app na tela inicial.":"After that, the GB Tech icon appears as an app on your home screen.",
    "Instale no Android":"Install on Android",
    "No Chrome, toque no menu de três pontos e escolha":"In Chrome, tap the three-dot menu and choose",
    "Depois confirme para criar o ícone da GB Tech no celular.":"Then confirm to create the GB Tech icon on your phone.",
    "Instale no computador":"Install on computer",
    "No Chrome ou Edge, procure o ícone de instalação na barra de endereço ou abra o menu do navegador e escolha":"In Chrome or Edge, look for the install icon in the address bar or open the browser menu and choose",
    "Instalar GB Tech":"Install GB Tech",
    "Se a opção não aparecer, acesse o site publicado com HTTPS pela Vercel.":"If the option does not appear, access the published HTTPS site through Vercel.",
    "Acesse o site como aplicativo, direto pela tela inicial, com a mesma experiência e atualizações do site oficial.":"Access the site as an app, directly from your home screen, with the same experience and updates from the official website.",
    "No Android, toque no menu do navegador e escolha":"On Android, tap the browser menu and choose",
    "ou":"or",
    "Adicionar à tela inicial":"Add to home screen",
    "No iPhone, toque em compartilhar ou no menu do navegador e escolha":"On iPhone, tap share or the browser menu and choose",
    "Adicionar à Tela de Início":"Add to Home Screen",
    "Antes e depois":"Before and after",
    "Depoimentos":"Testimonials",
    "Produtos":"Products",
    "Fale conosco":"Contact us",
    "Fale com a GB Tech":"Talk to GB Tech",
    "Abrir Facebook da GB Tech Solutions":"Open GB Tech Solutions on Facebook",
    "Onde estamos localizados":"Where we are located",
    "Encontre a GB Tech Solutions no Google Maps e veja nossa região de atendimento.":"Find GB Tech Solutions on Google Maps and see our service area.",
    "Atendimento para projetos digitais, sites, sistemas e automações.":"Service for digital projects, websites, systems, and automations.",
    "Solicitar orçamento":"Request a quote",
    "Solicitar projeto":"Request project",
    "Ver soluções":"See solutions",
    "Sites, sistemas":"Websites, systems",
    "e automações":"and automations",
    "para vender mais":"to sell more",
    "Criamos soluções digitais profissionais para empresas que querem vender mais, automatizar processos e crescer com tecnologia.":"We create professional digital solutions for companies that want to sell more, automate processes, and grow with technology.",
    "Sites e sistemas":"Websites and systems",
    "desenvolvidos com foco comercial":"developed with commercial focus",
    "Soluções personalizadas":"Custom digital solutions",
    "para rotinas reais de empresas":"for real company routines",
    "Negócios locais":"Local businesses",
    "atendidos com estratégia digital":"served with digital strategy",
    "Resultado e automação":"Results and automation",
    "como prioridade em cada projeto":"as a priority in every project",
    "Automatizar meu negócio":"Automate my business",
    "Ver demonstração":"View demo",
    "Quero um orçamento":"I want a quote",
    "Falar com especialista":"Talk to a specialist",
    "Solicitar demonstração":"Request a demo",
    "Pronto para transformar sua empresa com tecnologia?":"Ready to transform your company with technology?",
    "Falar no WhatsApp":"Talk on WhatsApp",
    "Role para explorar":"Scroll to explore",
    "produto digital":"digital product",
    "dados e IA":"data and AI",
    "Assistir mídia":"Watch media",
    "Vamos conversar":"Let's talk",
    "Nome":"Name",
    "Empresa":"Company",
    "E-mail":"Email",
    "Tipo de projeto":"Project type",
    "Prazo desejado":"Desired timeline",
    "Investimento estimado":"Estimated investment",
    "Mensagem":"Message",
    "Enviar pelo WhatsApp":"Send via WhatsApp",
    "Plano mensal":"Monthly plan",
    "Automação para Instagram + WhatsApp":"Instagram + WhatsApp automation",
    "Capte interessados pelo Instagram, direcione a conversa para o WhatsApp e organize o atendimento com fluxos comerciais sob medida.":"Capture interested leads through Instagram, direct the conversation to WhatsApp, and organize service with custom sales flows.",
    "Ver produtos prontos":"See ready products",
    "Consultar mensalidade":"Ask about monthly plan",
    "Automações por assinatura para vender e atender melhor":"Subscription automations to sell and serve better",
    "Soluções prontas para empresas que querem responder mais rápido, captar clientes e organizar o atendimento sem depender de processos manuais.":"Ready-made solutions for companies that want to respond faster, capture leads, and organize service without relying on manual processes.",
    "Automação para Instagram":"Instagram automation",
    "Prospecção inteligente por nicho e hashtags para atrair pessoas certas, gerar curiosidade e iniciar conversas comerciais.":"Smart prospecting by niche and hashtags to attract the right people, generate curiosity, and start sales conversations.",
    "Busca de perfis por nicho e hashtags":"Profile discovery by niche and hashtags",
    "Interações estratégicas para gerar visitas ao perfil":"Strategic interactions to drive profile visits",
    "Mensagens configuradas para iniciar conversas":"Configured messages to start conversations",
    "Atendimento humano para conduzir e fechar o cliente":"Human follow-up to guide and close the customer",
    "Ver painel do sistema":"View system dashboard",
    "Painel real do sistema com monitoramento, leads, atividades e controle da automação.":"Real system dashboard with monitoring, leads, activities, and automation control.",
    "WhatsApp Automation":"WhatsApp Automation",
    "Painel real do sistema para atendimento, fluxos, contatos e acompanhamento das conversas.":"Real system dashboard for service, flows, contacts, and conversation tracking.",
    "Visual do fluxo integrado para captação no Instagram e continuidade do atendimento pelo WhatsApp.":"Visual of the integrated flow for Instagram lead capture and continued service through WhatsApp.",
    "Consultar Instagram":"Ask about Instagram",
    "Automação para WhatsApp":"WhatsApp automation",
    "Atendimento automatizado para responder dúvidas, qualificar clientes, receber pedidos e reduzir mensagens repetitivas.":"Automated service to answer questions, qualify customers, receive orders, and reduce repetitive messages.",
    "Menu automático de atendimento":"Automatic service menu",
    "Respostas rápidas para perguntas comuns":"Quick replies for common questions",
    "Fluxo para orçamento, agenda ou pedido":"Flow for quotes, scheduling, or orders",
    "Encaminhamento para atendimento humano":"Handoff to human service",
    "Consultar WhatsApp":"Ask about WhatsApp",
    "Instagram + WhatsApp":"Instagram + WhatsApp",
    "Um funil simples: o Instagram atrai e qualifica, o WhatsApp continua a conversa e ajuda a fechar o atendimento.":"A simple funnel: Instagram attracts and qualifies, WhatsApp continues the conversation and helps close the service.",
    "Integração entre captação e atendimento":"Integration between lead capture and service",
    "Fluxos comerciais personalizados":"Custom sales flows",
    "Mensagens alinhadas com seu negócio":"Messages aligned with your business",
    "Acompanhamento e ajustes mensais":"Monthly monitoring and adjustments",
    "Ver combo mensal":"See monthly combo",
    "Atendimento seguro e profissional.":"Safe and professional service.",
    "Os fluxos são pensados para atendimento, captação autorizada e relacionamento com clientes, evitando práticas de spam ou abordagens invasivas.":"The flows are designed for service, authorized lead capture, and customer relationships, avoiding spam practices or invasive approaches.",
    "Produtos digitais":"Digital products",
    "Estratégia e crescimento":"Strategy and growth",
    "Dados e IA":"Data and AI",
    "Sites profissionais":"Professional websites",
    "Sistemas web":"Web systems",
    "Automações e IA":"Automation and AI",
    "Site + Cardápio Digital":"Website + Digital Menu",
    "Sistema de Agendamento":"Scheduling System",
    "Site Institucional Premium":"Premium Business Website",
    "Ver funcionando":"View demo",
    "Planos para começar com presença profissional":"Plans to start with a professional presence",
    "Tenho interesse":"I am interested",
    "Quero esse plano":"I want this plan",
    "Fazer orçamento":"Request quote",
    "Permitir cookies":"Allow cookies",
    "Preferências de Cookies":"Cookie preferences",
    "Usar apenas essenciais":"Use essentials only",
    "Salvar preferências":"Save preferences",
    "Diagnóstico e proposta":"Diagnosis and proposal",
    "Cardápio digital para delivery":"Digital menu for delivery",
    "Agenda online para serviços":"Online scheduling for services",
    "Automação, IA e performance":"Automation, AI and performance",
    "site premium":"premium website",
    "automação":"automation",
    "captação":"lead capture",
    "cardápio digital":"digital menu",
    "IA aplicada":"applied AI",
    "processos":"processes",
    "Criamos experiências digitais para empresas que querem vender mais, automatizar processos e parecer grandes desde o primeiro acesso.":"We create digital experiences for companies that want to sell more, automate processes, and look bigger from the first visit.",
    "Criamos sites, sistemas e automações para empresas que querem vender mais, organizar processos e atender melhor pelo WhatsApp.":"We create websites, systems, and automations for companies that want to sell more, organize processes, and serve customers better through WhatsApp.",
    "Atendimento direto":"Direct service",
    "Conversa clara pelo WhatsApp, sem enrolação e com orientação sobre o melhor caminho para o projeto.":"Clear conversation on WhatsApp, without confusion, with guidance on the best path for the project.",
    "Projeto sob medida":"Custom project",
    "Site, sistema, agenda, cardápio ou automação pensados para a rotina real da sua empresa.":"Website, system, scheduling, menu, or automation designed for your company's real routine.",
    "Entrega pronta para uso":"Ready-to-use delivery",
    "Layout responsivo, botões de contato, Google Maps e estrutura preparada para gerar oportunidades.":"Responsive layout, contact buttons, Google Maps, and structure prepared to generate opportunities.",
    "Quando o cliente rola, o site continua vendendo.":"When the client scrolls, the website keeps selling.",
    "Depois da abertura, cada etapa muda o visual conforme a decisão do cliente: entender, desenhar, desenvolver e transformar o projeto em contato real.":"After the opening, each step changes the visual according to the client journey: understand, design, develop, and turn the project into real leads.",
    "01 Diagnóstico":"01 Discovery",
    "02 Interface":"02 Interface",
    "03 Sistema":"03 System",
    "04 Conversão":"04 Conversion",
    "Diagnóstico":"Discovery",
    "Entendemos o negócio, o público e o objetivo antes de construir.":"We understand the business, audience, and goal before building.",
    "Interface":"Interface",
    "Visual moderno, claro e com cara de empresa grande.":"Modern, clear visuals with a larger-company feel.",
    "Construção":"Build",
    "Sites, sistemas, automações, dashboards e integrações.":"Websites, systems, automations, dashboards, and integrations.",
    "Conversão":"Conversion",
    "Projeto pronto para captar clientes e gerar resultado.":"A project ready to capture leads and generate results.",
    "Sites premium":"Premium websites",
    "Automação + IA":"Automation + AI",
    "Studios GB Tech":"GB Tech Studios",
    "Soluções digitais para empresas que precisam vender e operar melhor.":"Digital solutions for companies that need to sell and operate better.",
    "Planejamos, desenvolvemos e integramos tecnologia com foco no que realmente importa: atrair clientes, organizar processos e economizar tempo.":"We plan, develop, and integrate technology focused on what really matters: attracting clients, organizing processes, and saving time.",
    "Sites e produtos digitais":"Websites and digital products",
    "Sites institucionais, landing pages, cardápios digitais, agendas online e interfaces responsivas para o cliente encontrar sua empresa e chamar no WhatsApp.":"Business websites, landing pages, digital menus, online scheduling, and responsive interfaces so clients can find your company and contact you on WhatsApp.",
    "Ideal para presença online, vendas e divulgação.":"Ideal for online presence, sales, and promotion.",
    "Estratégia e captação":"Strategy and lead capture",
    "Organizamos a jornada do cliente, textos comerciais, chamadas para ação e páginas pensadas para transformar visitas em contatos qualificados.":"We organize the client journey, commercial copy, calls to action, and pages designed to turn visits into qualified contacts.",
    "Foco em confiança, clareza e conversão.":"Focused on trust, clarity, and conversion.",
    "Automações, dados e IA":"Automations, data, and AI",
    "Criamos automações de atendimento, integrações, dashboards e sistemas internos para reduzir tarefas repetitivas e melhorar a gestão.":"We create service automations, integrations, dashboards, and internal systems to reduce repetitive tasks and improve management.",
    "Mais controle para sua operação crescer.":"More control for your operation to grow.",
    "Soluções digitais":"Digital solutions",
    "Serviços para empresas que precisam crescer no digital":"Services for companies that need to grow digitally",
    "Estruturamos soluções práticas para negócios locais, delivery, prestadores de serviço, salões, clínicas, lojas e empresas que precisam de presença online e sistemas eficientes.":"We build practical solutions for local businesses, delivery operations, service providers, salons, clinics, stores, and companies that need online presence and efficient systems.",
    "Sites modernos com WhatsApp, apresentação da empresa, serviços, localização e estrutura para gerar contatos.":"Modern websites with WhatsApp, company presentation, services, location, and structure to generate leads.",
    "Sistemas sob medida para gestão, agendamento, pedidos, relatórios, clientes e controle interno.":"Custom systems for management, scheduling, orders, reports, clients, and internal control.",
    "Automatização de atendimento, processos, captação, mensagens, tarefas repetitivas e integrações inteligentes.":"Automation for support, processes, lead capture, messages, repetitive tasks, and smart integrations.",
    "Cardápio digital":"Digital menu",
    "Cardápio com QR Code, categorias, produtos, carrinho e envio automático do pedido para o WhatsApp.":"Menu with QR Code, categories, products, cart, and automatic order sending to WhatsApp.",
    "Aplicativos e PWA":"Apps and PWA",
    "Experiências mobile para clientes e equipes, com aparência moderna e funcionamento simples no celular.":"Mobile experiences for clients and teams, with a modern look and simple phone usage.",
    "Sistemas desktop":"Desktop systems",
    "Programas personalizados para rotinas internas, controle local, operação e automação empresarial.":"Custom programs for internal routines, local control, operations, and business automation.",
    "Entre em contato":"Get in touch",
    "Impulsionamos negócios, empresas e futuros":"We power businesses, companies, and futures",
    "Impulsionamos negócios,\nempresas e futuros":"We power businesses, companies, and futures",
    "Impulsionamos negócios,":"We power businesses,",
    "empresas e futuros":"companies and futures",
    "GB TECH • CO-CRIE • SOLUÇÕES •":"GB TECH • CO-CREATE • SOLUTIONS •",
    "Da ideia ao produto online":"From idea to online product",
    "Planejamento, design, sistemas e automações para negócios reais.":"Planning, design, systems, and automations for real businesses.",
    "Projetos sob medida":"Custom projects",
    "Sites, cardápios digitais, agendas, sistemas e IA com foco em resultado.":"Websites, digital menus, schedules, systems, and AI focused on results.",
    "Atendimento próximo":"Close support",
    "Planejamento, desenvolvimento e suporte para o projeto sair do papel.":"Planning, development, and support to get the project off the ground.",
    "Sobre a GB":"About GB",
    "Uma empresa criada para resolver problemas reais com tecnologia.":"A company created to solve real problems with technology.",
    "A GB Tech Solutions desenvolve soluções digitais para empresas que precisam profissionalizar sua presença online, automatizar tarefas e melhorar a experiência dos clientes.":"GB Tech Solutions develops digital solutions for companies that need to professionalize their online presence, automate tasks, and improve customer experience.",
    "Nosso foco é entregar projetos práticos, bonitos e funcionais — desde um site institucional até um sistema personalizado para operação do negócio.":"Our focus is to deliver practical, beautiful, and functional projects, from a business website to a custom system for company operations.",
    "Design profissional":"Professional design",
    "Desenvolvimento sob medida":"Custom development",
    "Foco em conversão":"Conversion focus",
    "Suporte e orientação":"Support and guidance",
    "Conversar com a GB":"Talk to GB",
    "Método de trabalho":"Work method",
    "Do primeiro contato até o projeto online.":"From first contact to the online project.",
    "Seguimos um processo direto para entender, planejar, desenvolver e entregar com clareza.":"We follow a direct process to understand, plan, develop, and deliver clearly.",
    "Entendemos seu negócio, serviço, público e objetivo principal.":"We understand your business, service, audience, and main goal.",
    "Estratégia":"Strategy",
    "Definimos a estrutura ideal: site, sistema, cardápio digital, app ou automação.":"We define the ideal structure: website, system, digital menu, app, or automation.",
    "Desenvolvimento":"Development",
    "Criamos o visual, funcionalidades, integração com WhatsApp e recursos necessários.":"We create the visual design, features, WhatsApp integration, and required resources.",
    "Entrega e suporte":"Delivery and support",
    "Publicamos o projeto, ajustamos os detalhes finais e orientamos o uso.":"We publish the project, adjust final details, and guide usage.",
    "Amostras para clientes":"Samples for clients",
    "Modelos de solução para apresentar e vender":"Solution models to present and sell",
    "Clique em qualquer card para abrir uma demonstração visual do produto funcionando.":"Click any card to open a visual demonstration of the product working.",
    "Abrir amostra":"Open sample",
    "Delivery":"Delivery",
    "Ideal para restaurantes, pizzarias, hamburguerias e delivery com pedidos pelo WhatsApp.":"Ideal for restaurants, pizzerias, burger shops, and delivery with WhatsApp orders.",
    "Serviços":"Services",
    "Para salões, clínicas e profissionais que precisam organizar horários e clientes.":"For salons, clinics, and professionals that need to organize schedules and clients.",
    "Empresas":"Companies",
    "Para empresas locais que precisam transmitir confiança e captar contatos qualificados.":"For local companies that need to build trust and capture qualified leads.",
    "Demonstração dos produtos":"Product demo",
    "Prévia realista das soluções funcionando":"Realistic preview of the solutions working",
    "Mostre para o cliente uma experiência visual parecida com o produto final antes mesmo de fechar o projeto.":"Show the client a visual experience close to the final product before closing the project.",
    "🍔 Cardápio Digital":"🍔 Digital Menu",
    "💇 Agenda Online":"💇 Online Scheduling",
    "🏢 Site Empresarial":"🏢 Business Website",
    "Demo para delivery":"Delivery demo",
    "Cardápio digital com visual de restaurante real":"Digital menu with a real restaurant look",
    "O cliente acessa pelo QR Code, vê a identidade do estabelecimento, escolhe produtos com foto, acompanha o total do carrinho e envia o pedido pelo WhatsApp.":"The client accesses via QR Code, sees the restaurant identity, chooses products with photos, follows the cart total, and sends the order through WhatsApp.",
    "Logo do restaurante":"Restaurant logo",
    "Produtos com foto":"Products with photos",
    "Carrinho automático":"Automatic cart",
    "Hambúrguer artesanal • Delivery":"Craft burger • Delivery",
    "Aberto":"Open",
    "Bebidas":"Drinks",
    "Pão brioche, carne 160g, queijo e molho especial":"Brioche bun, 160g beef, cheese, and special sauce",
    "Porção crocante com cheddar e bacon":"Crispy portion with cheddar and bacon",
    "350ml gelado":"Cold 350ml",
    "Total do pedido":"Order total",
    "Enviar pedido no WhatsApp":"Send order on WhatsApp",
    "Demo para salão e clínicas":"Salon and clinic demo",
    "Agendamento online com cara de sistema profissional":"Online scheduling with a professional system feel",
    "O cliente escolhe serviço, profissional e horário disponível. A empresa reduz atendimento manual e organiza a agenda.":"The client chooses service, professional, and available time. The company reduces manual support and organizes the schedule.",
    "Horários":"Schedules",
    "Clientes":"Clients",
    "Agenda de hoje":"Today's schedule",
    "Corte + Escova":"Cut + Blowout",
    "Profissional: Ana Clara":"Professional: Ana Clara",
    "Horário selecionado: 09:00":"Selected time: 09:00",
    "Agendamentos":"Appointments",
    "Profissionais":"Professionals",
    "Previsto":"Expected",
    "Confirmar agendamento":"Confirm appointment",
    "Demo para empresas locais":"Local company demo",
    "Site empresarial com layout premium e foco em contato":"Business website with premium layout and contact focus",
    "Uma estrutura clara com apresentação da empresa, serviços, diferenciais, localização e botões estratégicos para WhatsApp.":"A clear structure with company presentation, services, differentiators, location, and strategic WhatsApp buttons.",
    "SEO básico":"Basic SEO",
    "Contato rápido":"Quick contact",
    "Clínica Prime":"Prime Clinic",
    "Atendimento especializado com agendamento rápido e equipe profissional.":"Specialized service with fast scheduling and a professional team.",
    "Solicitar atendimento":"Request service",
    "Diferenciais":"Differentiators",
    "Localização":"Location",
    "Mostre a demo antes de falar preço.":"Show the demo before talking price.",
    "Quando o cliente visualiza o produto funcionando, fica mais fácil entender o valor e fechar o projeto.":"When the client sees the product working, it becomes easier to understand the value and close the project.",
    "Quero uma demonstração":"I want a demo",
    "Para quem atendemos":"Who we serve",
    "Soluções pensadas para negócios reais":"Solutions designed for real businesses",
    "Atendemos empresas e profissionais que precisam vender melhor, organizar atendimento e transmitir confiança no digital.":"We serve companies and professionals that need to sell better, organize service, and build trust online.",
    "Restaurantes e delivery":"Restaurants and delivery",
    "Cardápio digital, pedidos pelo WhatsApp, QR Code e apresentação profissional dos produtos.":"Digital menu, WhatsApp orders, QR Code, and professional product presentation.",
    "Salões, clínicas e serviços":"Salons, clinics, and services",
    "Agenda online, botões de contato, página com serviços e captação de clientes.":"Online scheduling, contact buttons, service page, and lead capture.",
    "Empresas locais":"Local businesses",
    "Site institucional, Google Maps, WhatsApp integrado e visual que passa mais confiança.":"Business website, Google Maps, integrated WhatsApp, and visuals that build trust.",
    "Operações internas":"Internal operations",
    "Sistemas sob medida, dashboards, automações e controle de processos repetitivos.":"Custom systems, dashboards, automations, and control of repetitive processes.",
    "Antes e depois":"Before and after",
    "O que muda quando sua empresa tem uma presença digital bem feita":"What changes when your company has a well-built digital presence",
    "O objetivo não é apenas deixar bonito. É organizar a informação, facilitar o contato e ajudar o cliente a confiar mais rápido na sua empresa.":"The goal is not just to make it look good. It is to organize information, make contact easier, and help clients trust your company faster.",
    "Antes":"Before",
    "Cliente pergunta tudo pelo WhatsApp.":"Clients ask everything through WhatsApp.",
    "Serviços e preços ficam espalhados.":"Services and prices are scattered.",
    "A empresa parece menor do que realmente é.":"The company looks smaller than it really is.",
    "Falta um lugar claro para apresentar o negócio.":"There is no clear place to present the business.",
    "Depois":"After",
    "Site profissional com informações organizadas.":"Professional website with organized information.",
    "WhatsApp, Google Maps e formulário no caminho certo.":"WhatsApp, Google Maps, and form in the right flow.",
    "Visual mais confiável para vender e divulgar.":"More trustworthy visuals to sell and promote.",
    "Estrutura pronta para captar contatos qualificados.":"Structure ready to capture qualified leads.",
    "Confiança na entrega":"Trust in delivery",
    "O que o cliente percebe quando o projeto fica pronto":"What clients notice when the project is ready",
    "Sem prometer milagre: um bom projeto digital precisa deixar a empresa mais clara, acessível e profissional.":"No miracle promises: a good digital project needs to make the company clearer, more accessible, and more professional.",
    "Agora fica mais fácil apresentar a empresa e mandar um link profissional para os clientes.":"Now it is easier to present the company and send clients a professional link.",
    "O atendimento fica mais organizado porque as informações principais já estão no site.":"Service becomes more organized because the main information is already on the website.",
    "O visual transmite mais confiança e ajuda o cliente a entender o serviço antes de chamar.":"The visual identity builds more trust and helps clients understand the service before reaching out.",
    "Presença digital":"Digital presence",
    "Atendimento":"Service",
    "Confiança":"Trust",
    "Ecossistema GB Tech Solutions":"GB Tech Solutions ecosystem",
    "Nossas Parcerias":"Our Partnerships",
    "Stack de trabalho":"Work stack",
    "Tecnologias e plataformas":"Technologies and platforms",
    "Ferramentas e ecossistemas que usamos como referência para criar soluções digitais mais completas, seguras e escaláveis.":"Tools and ecosystems we use as references to create more complete, secure, and scalable digital solutions.",
    "Mais escolhido":"Most chosen",
    "Para empresas que precisam passar confiança, aparecer no Google e vender melhor online.":"For companies that need to build trust, appear on Google, and sell better online.",
    "Investimento inicial":"Initial investment",
    "Valores de referência para projetos comuns. Sistemas maiores são avaliados conforme necessidade.":"Reference values for common projects. Larger systems are evaluated according to needs.",
    "Landing Page":"Landing Page",
    "Para divulgar um serviço, produto, campanha ou captação de clientes.":"To promote a service, product, campaign, or lead capture.",
    "Página única profissional":"Professional one-page website",
    "Design responsivo":"Responsive design",
    "Botão para WhatsApp":"WhatsApp button",
    "Texto comercial básico":"Basic commercial copy",
    "Site Profissional":"Professional Website",
    "Para empresas que precisam passar confiança e vender melhor online.":"For companies that need to build trust and sell better online.",
    "Até 5 seções":"Up to 5 sections",
    "WhatsApp integrado":"Integrated WhatsApp",
    "Formulário de contato":"Contact form",
    "Sistema Sob Medida":"Custom System",
    "Para empresas que precisam automatizar processos ou criar uma plataforma própria.":"For companies that need to automate processes or create their own platform.",
    "A partir de R$ 3.000":"Starting at R$ 3,000",
    "Painel administrativo":"Admin panel",
    "Login e banco de dados":"Login and database",
    "Funcionalidades personalizadas":"Custom features",
    "Integrações":"Integrations",
    "Suporte técnico":"Technical support",
    "Perguntas frequentes":"Frequently asked questions",
    "Dúvidas comuns antes de começar":"Common questions before starting",
    "Se a sua dúvida não estiver aqui, chame no WhatsApp e explicamos o melhor caminho para seu projeto.":"If your question is not here, message us on WhatsApp and we will explain the best path for your project.",
    "Quanto tempo leva para criar um site?":"How long does it take to create a website?",
    "Projetos simples normalmente levam de 7 a 15 dias, dependendo do conteúdo, aprovações e recursos necessários.":"Simple projects usually take 7 to 15 days, depending on content, approvals, and required features.",
    "O site funciona bem no celular?":"Does the website work well on mobile?",
    "Sim. Os projetos são pensados para funcionar em celular, tablet e desktop, com botões de contato bem visíveis.":"Yes. Projects are designed to work on phones, tablets, and desktops, with clearly visible contact buttons.",
    "Vocês integram com WhatsApp e Google Maps?":"Do you integrate with WhatsApp and Google Maps?",
    "Sim. Podemos incluir WhatsApp, Google Maps, formulário de contato e links estratégicos para facilitar o atendimento.":"Yes. We can include WhatsApp, Google Maps, contact forms, and strategic links to make service easier.",
    "Fazem sistemas e automações sob medida?":"Do you build custom systems and automations?",
    "Sim. Sistemas, dashboards e automações são avaliados conforme a rotina da empresa e o objetivo do projeto.":"Yes. Systems, dashboards, and automations are evaluated according to the company routine and project goal.",
    "Preciso ter todo o conteúdo pronto?":"Do I need to have all content ready?",
    "Não necessariamente. Podemos orientar a estrutura, organizar as informações e ajudar com textos comerciais básicos.":"Not necessarily. We can guide the structure, organize information, and help with basic commercial copy.",
    "Conte sua ideia e receba um direcionamento profissional.":"Tell us your idea and receive professional direction.",
    "Preencha o formulário com o tipo de projeto que você precisa. A mensagem será organizada automaticamente e enviada para o WhatsApp da GB Tech Solutions.":"Fill out the form with the type of project you need. The message will be organized automatically and sent to GB Tech Solutions on WhatsApp.",
    "Prefiro chamar direto no WhatsApp":"I prefer to message directly on WhatsApp",
    "Quero um site":"I want a website",
    "Automação":"Automation",
    "Orçamento":"Quote",
    "Resposta direta no WhatsApp":"Direct response on WhatsApp",
    "Diagnóstico inicial do projeto":"Initial project diagnosis",
    "Indicação da melhor solução":"Recommendation of the best solution",
    "WhatsApp":"WhatsApp",
    "Selecione uma opção":"Select an option",
    "Site profissional":"Professional website",
    "Site + cardápio digital":"Website + digital menu",
    "Sistema de agendamento":"Scheduling system",
    "Sistema sob medida":"Custom system",
    "Automação e IA":"Automation and AI",
    "Outro projeto digital":"Other digital project",
    "Quero começar agora":"I want to start now",
    "Em até 15 dias":"Within 15 days",
    "Em até 30 dias":"Within 30 days",
    "Ainda estou pesquisando":"I am still researching",
    "Ainda não sei":"I do not know yet",
    "Até R$ 1.000":"Up to R$ 1,000",
    "Acima de R$ 8.000":"Above R$ 8,000",
    "Ao enviar, uma conversa será aberta no WhatsApp com as informações preenchidas.":"When submitted, a WhatsApp conversation will open with the completed information.",
    "GB Tech Solutions. Todos os direitos reservados.":"GB Tech Solutions. All rights reserved.",
    "Cookies e privacidade":"Cookies and privacy",
    "Por padrão, utilizamos cookies em nosso site para melhorar seu desempenho, segurança e personalizar conteúdo e anúncios.":"By default, we use cookies on our website to improve performance, security, and personalize content and ads.",
    "Nossa política de privacidade":"Our privacy policy",
    "Preferências":"Preferences",
    "Escolha quais cookies podem ser usados para melhorar sua experiência no site.":"Choose which cookies can be used to improve your experience on the website.",
    "Essenciais":"Essential",
    "Necessários para segurança e funcionamento básico.":"Required for security and basic operation.",
    "Desempenho":"Performance",
    "Ajudam a entender visitas e melhorar a navegação.":"Help understand visits and improve navigation.",
    "Marketing":"Marketing",
    "Permitem personalizar conteúdo, anúncios e campanhas.":"Allow personalization of content, ads, and campaigns.",
    "Site + Cardapio Digital":"Website + Digital Menu",
    "Uma vitrine de delivery pronta para vender.":"A delivery storefront ready to sell.",
    "Cliente acessa por QR Code, escolhe produtos com fotos, acompanha o total e envia o pedido pelo WhatsApp.":"The client accesses by QR Code, chooses products with photos, follows the total, and sends the order through WhatsApp.",
    "Pao, carne e queijo":"Bun, beef and cheese",
    "Porcao media":"Medium portion",
    "Enviar pedido":"Send order",
    "Acesso rapido.":"Fast access.",
    "Carrinho":"Cart",
    "Total automatico.":"Automatic total.",
    "Pedido direto.":"Direct order.",
    "Agenda online para organizar horarios e clientes.":"Online scheduling to organize times and clients.",
    "O cliente escolhe servico, profissional e horario disponivel com uma experiencia simples e profissional.":"The client chooses service, professional, and available time with a simple and professional experience.",
    "Corte Feminino":"Women's haircut",
    "Profissional: Ana":"Professional: Ana",
    "Profissional: Carla":"Professional: Carla",
    "Horarios":"Schedules",
    "Agenda organizada.":"Organized schedule.",
    "Historico de atendimento.":"Service history.",
    "Menos mensagens":"Fewer messages",
    "Reduz atendimento manual.":"Reduces manual service.",
    "Presenca digital profissional para empresas locais.":"Professional digital presence for local companies.",
    "Pagina clara para apresentar servicos, diferenciais, localizacao e gerar contatos qualificados.":"A clear page to present services, differentiators, location, and generate qualified leads.",
    "Empresa Premium":"Premium Company",
    "Servicos":"Services",
    "Apresentacao clara":"Clear presentation",
    "Localizacao integrada":"Integrated location",
    "Botoes estrategicos":"Strategic buttons",
    "Solicitar orcamento":"Request a quote",
    "Confianca":"Trust",
    "Visual profissional.":"Professional visuals.",
    "Conversao":"Conversion",
    "Estrutura para contatos.":"Structure for leads.",
    "Mobile":"Mobile",
    "Layout responsivo.":"Responsive layout."
  };
  const attrMap = {
    "Seu nome":"Your name",
    "(00) 00000-0000":"+1 (000) 000-0000",
    "Nome da empresa ou negócio":"Company or business name",
    "seuemail@empresa.com":"you@company.com",
    "Conte rapidamente o que você precisa, qual seu negócio e o objetivo do projeto.":"Briefly describe what you need, your business, and the goal.",
    "Selecionar idioma":"Select language",
    "Traduzir site para português":"Translate website to Portuguese",
    "Translate website to English":"Translate website to English",
    "Abrir menu":"Open menu",
    "Menu principal":"Main menu",
    "Menu GB Tech Solutions":"GB Tech Solutions menu",
    "Fechar menu":"Close menu",
    "Slides de fotos realistas":"Realistic photo slides",
    "Vídeo tecnológico com cortes no topo":"Technology video at the top",
    "Rolar parcerias para a esquerda":"Scroll partnerships left",
    "Rolar parcerias para a direita":"Scroll partnerships right",
    "Logos de parceiros":"Partner logos",
    "Fechar demonstração":"Close demo",
    "Fechar preferências de cookies":"Close cookie preferences",
    "Cliente e consultor planejando um projeto digital":"Client and consultant planning a digital project",
    "Cliente usando cardápio digital em restaurante":"Client using a digital menu in a restaurant",
    "Cliente usando agenda online em um salão":"Client using online scheduling in a salon",
    "Atendente usando automação de atendimento":"Agent using service automation",
    "Cliente e consultor planejando um projeto digital premium":"Client and consultant planning a premium digital project",
    "Designer criando uma interface premium":"Designer creating a premium interface",
    "Equipe analisando sistema e dashboards":"Team analyzing systems and dashboards",
    "Empresário usando site profissional para gerar contatos":"Business owner using a professional website to generate leads",
    "Sistema web com dashboards e controle de dados":"Web system with dashboards and data control",
    "Atendimento com automação e painel inteligente":"Customer service with automation and smart dashboard",
    "Cliente usando aplicativo mobile em uma loja":"Client using a mobile app in a store",
    "Funcionário usando sistema desktop de gestão interna":"Employee using an internal management desktop system",
    "Consultor da GB Tech apresentando projeto digital para clientes":"GB Tech consultant presenting a digital project to clients",
    "Equipe planejando projeto digital com cliente":"Team planning a digital project with a client",
    "Atendimento e suporte com tecnologia":"Technology support and service",
    "Interface de projeto digital em desenvolvimento":"Digital project interface in development",
    "Cardápio digital para restaurante e delivery":"Digital menu for restaurant and delivery",
    "Agenda online para salão e serviços":"Online scheduling for salon and services",
    "Site institucional premium para empresa local":"Premium business website for a local company",
    "Hambúrguer artesanal":"Craft burger",
    "Batata frita":"French fries",
    "Refrigerante gelado":"Cold soda"
  };
  const originals = new WeakMap();
  const attrOriginals = new WeakMap();
  const originalTitle = document.title;
  let currentLanguage = "pt";

  const normalizeKey = (value) => String(value || "").trim().replace(/\s+/g, " ");
  const getTranslation = (value) => textMap[value] || textMap[normalizeKey(value)];
  const getAttrTranslation = (value) => attrMap[value] || attrMap[normalizeKey(value)];

  function translateTextNode(node, lang){
    const parent = node.parentElement;
    if(!parent || parent.closest("script,style,svg,.language-switcher")) return;
    const value = originals.get(node) || node.textContent;
    if(!originals.has(node)) originals.set(node, value);
    const trimmed = value.trim();
    if(!trimmed) return;
    const next = lang === "en" && getTranslation(trimmed) ? getTranslation(trimmed) : trimmed;
    node.textContent = value.replace(trimmed, next);
  }

  function translateAttrs(el, lang){
    ["placeholder","aria-label","title","alt"].forEach((attr) => {
      if(!el.hasAttribute(attr)) return;
      const store = attrOriginals.get(el) || {};
      if(!store[attr]) store[attr] = el.getAttribute(attr);
      attrOriginals.set(el, store);
      const original = store[attr];
      const translated = getAttrTranslation(original);
      el.setAttribute(attr, lang === "en" && translated ? translated : original);
    });
  }

  function translateRoot(root, lang){
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => translateTextNode(node, lang));

    if(root.nodeType === Node.ELEMENT_NODE) translateAttrs(root, lang);
    root.querySelectorAll?.("[placeholder],[aria-label],[title],[alt]").forEach((el) => translateAttrs(el, lang));
  }

  function setLanguage(lang){
    const current = lang === "en" ? "en" : "pt";
    currentLanguage = current;
    document.documentElement.lang = current === "en" ? "en" : "pt-BR";
    document.documentElement.dataset.lang = current;
    document.title = current === "en" ? "GB Tech Solutions | Websites, Systems and Automations" : originalTitle;
    buttons.forEach((button) => button.classList.toggle("active", button.dataset.langSwitch === current));
    translateRoot(document.body, current);
    localStorage.setItem("gbTechLanguage", current);
    document.dispatchEvent(new CustomEvent("gbTechLanguageChange", { detail:{ lang:current } }));
  }

  window.gbTechGetLanguage = () => currentLanguage;
  window.gbTechApplyLanguage = (root = document.body) => translateRoot(root, currentLanguage);
  buttons.forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.langSwitch)));
  setLanguage(localStorage.getItem("gbTechLanguage") === "en" ? "en" : "pt");
})();

// Hero words, paused when the tab is not visible.
(function(){
  const word = document.getElementById("ioHeroWord");
  const sideOne = document.getElementById("ioSideOne");
  const sideTwo = document.getElementById("ioSideTwo");
  if(!word || reduceMotion) return;
  const compactHero = window.matchMedia("(max-width: 760px)");

  const items = [
    { pt:["e automações","site premium","automação"], en:["and automations","premium website","automation"] },
    { pt:["personalizados","landing pages","captação"], en:["custom-built","landing pages","lead capture"] },
    { pt:["com sistemas","sistema web","dashboards"], en:["with systems","web system","dashboards"] },
    { pt:["com aplicativos","cardápio digital","WhatsApp"], en:["with apps","digital menu","WhatsApp"] },
    { pt:["com IA","IA aplicada","processos"], en:["with AI","applied AI","processes"] }
  ];
  let index = 0;
  let timer;
  const getLang = () => window.gbTechGetLanguage?.() === "en" ? "en" : "pt";

  function render(){
    if(compactHero.matches){
      const mobile = getLang() === "en"
        ? ["and automation","premium website","automation"]
        : ["e automações","site premium","automação"];
      word.textContent = mobile[0];
      if(sideOne) sideOne.textContent = mobile[1];
      if(sideTwo) sideTwo.textContent = mobile[2];
      return;
    }
    const item = items[index][getLang()];
    word.textContent = item[0];
    if(sideOne) sideOne.textContent = item[1];
    if(sideTwo) sideTwo.textContent = item[2];
  }

  function tick(){
    if(document.hidden) return;
    index = (index + 1) % items.length;
    render();
  }
  function start(){ timer = window.setInterval(tick, 3800); }
  function stop(){ window.clearInterval(timer); }
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
  compactHero.addEventListener?.("change", render);
  document.addEventListener("gbTechLanguageChange", render);
  render();
  start();
})();

// Hero media loads without flashing the local poster before the video is ready.
(function(){
  const videos = Array.from(document.querySelectorAll(".io-video-cut video"));
  if(!videos.length) return;

  const loadVideo = (video) => {
    const source = video.querySelector("source");
    if(!source) return;
    const mediaQuery = source.getAttribute("media");
    const cut = video.closest(".io-video-cut");
    if(mediaQuery && !window.matchMedia(mediaQuery).matches) {
      cut?.classList.add("is-fallback-visible");
      return;
    }

    let ready = false;
    const markReady = () => {
      if(ready) return;
      ready = true;
      window.clearTimeout(fallbackTimer);
      cut?.classList.add("is-video-ready");
      cut?.classList.remove("is-fallback-visible");
      video.play().catch(() => {});
    };

    const fallbackTimer = window.setTimeout(() => {
      if(!cut?.classList.contains("is-video-ready")) {
        cut?.classList.add("is-fallback-visible");
      }
    }, 2600);

    video.addEventListener("loadeddata", markReady, { once:true });
    video.addEventListener("canplay", markReady, { once:true });
    video.addEventListener("error", () => {
      window.clearTimeout(fallbackTimer);
      cut?.classList.add("is-fallback-visible");
    }, { once:true });

    if(source.dataset.src && !source.src) source.src = source.dataset.src;
    video.load();
    if(video.readyState >= 3) markReady();
  };

  const loadHeroMedia = () => {
    const firstVideo = videos[0];
    if(firstVideo) loadVideo(firstVideo);
  };

  loadHeroMedia();
  window.addEventListener("load", () => {
    videos.slice(1).forEach(loadVideo);
  }, { once:true });
})();

// Partners carousel arrows.
(function(){
  const carousel = document.querySelector("[data-partners-carousel]");
  if(!carousel) return;

  const track = carousel.querySelector("[data-partners-track]");
  const prev = carousel.querySelector("[data-partners-prev]");
  const next = carousel.querySelector("[data-partners-next]");
  if(!track || !prev || !next) return;

  const getStep = () => Math.min(track.clientWidth * 0.8, 460);
  const updateArrows = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maxScroll - 2;
  };

  let ticking = false;
  const requestUpdate = () => {
    if(ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateArrows();
      ticking = false;
    });
  };

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -getStep(), behavior: reduceMotion ? "auto" : "smooth" });
  });
  next.addEventListener("click", () => {
    track.scrollBy({ left: getStep(), behavior: reduceMotion ? "auto" : "smooth" });
  });
  track.addEventListener("scroll", requestUpdate, { passive:true });
  window.addEventListener("resize", requestUpdate);
  updateArrows();
})();

// Lightweight reveal.
(function(){
  document.querySelectorAll("main section:not(#inicio):not([hidden]) > .container > :not(.reveal)").forEach((item) => {
    if(item.closest(".demo-modal,.system-modal,.install-modal,.cookie-modal")) return;
    item.classList.add("reveal");
  });

  const items = Array.from(document.querySelectorAll(".reveal"));
  if(!items.length) return;
  if(reduceMotion){
    items.forEach((item) => item.classList.add("active"));
    return;
  }

  const groupedByParent = new Map();
  items.forEach((item) => {
    const parent = item.parentElement;
    if(!parent) return;
    const group = groupedByParent.get(parent) || [];
    group.push(item);
    groupedByParent.set(parent, group);

    if(item.matches(".photo-stack,.process-photo,.ioasys-about-showcase,.location-map,.gb-scroll-visual")) {
      item.classList.add("reveal-right");
    } else if(item.matches(".contact-form,.before-after-panel,.demo-stage,.system-preview")) {
      item.classList.add("reveal-zoom");
    } else if(item.matches(".section-title,.studios-title,.gb-scroll-copy,.contact-copy,.faq-copy,.transformation-copy,.about-content")) {
      item.classList.add("reveal-left");
    }
  });

  groupedByParent.forEach((group) => {
    group.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index * 80, 360)}ms`);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting){
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin:"0px 0px -10% 0px", threshold:.1 });
  items.forEach((item) => observer.observe(item));
})();

// Animated numeric counters for authority and process sections.
(function(){
  const numbers = Array.from(document.querySelectorAll(".steps .num, .stat-number[data-count-to]"));
  if(!numbers.length || reduceMotion) return;

  const animateNumber = (element) => {
    const target = Number.parseInt(element.dataset.countTo || element.textContent, 10);
    if(!Number.isFinite(target) || element.dataset.counted === "true") return;
    element.dataset.counted = "true";

    const startsAtOne = element.classList.contains("num");
    const duration = startsAtOne ? 520 : 900;
    const baseValue = startsAtOne ? 1 : Math.max(1, Math.floor(target * .72));
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = startsAtOne
        ? Math.max(1, Math.round(target * eased))
        : Math.round(baseValue + ((target - baseValue) * eased));
      if(progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent = target;
      }
    };

    element.textContent = String(baseValue);
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(!entry.isIntersecting) return;
      animateNumber(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold:.55 });

  numbers.forEach((number) => observer.observe(number));
})();

// Scroll experience tabs without scroll listeners.
(function(){
  const photos = Array.from(document.querySelectorAll(".gb-scroll-photo"));
  const tabs = Array.from(document.querySelectorAll("[data-gb-scroll-tab]"));
  const bar = document.getElementById("gbScrollBar");
  if(!photos.length || !tabs.length) return;

  function setActive(index){
    photos.forEach((photo, i) => photo.classList.toggle("active", i === index));
    tabs.forEach((tab, i) => tab.classList.toggle("active", i === index));
    if(bar) bar.style.width = `${((index + 1) / photos.length) * 100}%`;
  }
  tabs.forEach((tab) => tab.addEventListener("click", () => setActive(Number(tab.dataset.gbScrollTab || 0))));
})();

// Product demo tabs, cart and schedule.
(function(){
  const tabs = document.querySelectorAll(".demo-tab");
  const panels = {
    cardapio:document.getElementById("demo-cardapio"),
    agenda:document.getElementById("demo-agenda"),
    site:document.getElementById("demo-site")
  };
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      Object.values(panels).forEach((panel) => panel?.classList.remove("active"));
      tab.classList.add("active");
      panels[tab.dataset.demo]?.classList.add("active");
    });
  });

  let total = 0;
  const totalEl = document.getElementById("cartTotal");
  document.querySelectorAll(".add-item").forEach((button) => {
    button.addEventListener("click", () => {
      total += Number(button.dataset.price || 0);
      if(totalEl) totalEl.textContent = total.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });
      button.textContent = "OK";
      window.setTimeout(() => { button.textContent = "+"; }, 700);
    });
  });

  document.querySelectorAll(".time-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".time-btn").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const selected = document.getElementById("selectedTime");
      if(selected) {
        const english = window.gbTechGetLanguage?.() === "en";
        selected.textContent = `${english ? "Selected time" : "Horário selecionado"}: ${button.textContent}`;
      }
    });
  });
})();

// Modal demos.
const modal = document.getElementById("demoModal");
const modalContent = document.getElementById("modalDemoContent");
const modalTemplates = {
  cardapio:`
    <div class="modal-demo">
      <div class="modal-hero">
        <div>
          <span class="kicker">Site + Cardapio Digital</span>
          <h2>Uma vitrine de delivery pronta para vender.</h2>
          <p>Cliente acessa por QR Code, escolhe produtos com fotos, acompanha o total e envia o pedido pelo WhatsApp.</p>
        </div>
        <div class="modal-panel">
          <strong>Burger House</strong>
          <div class="food-item"><img src="assets/img/hamburguer-artesanal.jpg" alt="" loading="lazy" decoding="async"><div><strong>X-Burger</strong><small>Pao, carne e queijo</small><b>R$ 24,90</b></div><button class="add-item">+</button></div>
          <div class="food-item"><img src="assets/img/batata-frita-premium.jpg" alt="" loading="lazy" decoding="async"><div><strong>Batata Frita</strong><small>Porcao media</small><b>R$ 18,90</b></div><button class="add-item">+</button></div>
          <button class="phone-action">Enviar pedido</button>
        </div>
      </div>
      <div class="modal-feature-grid"><div><strong>QR Code</strong><p>Acesso rapido.</p></div><div><strong>Carrinho</strong><p>Total automatico.</p></div><div><strong>WhatsApp</strong><p>Pedido direto.</p></div></div>
    </div>`,
  agenda:`
    <div class="modal-demo">
      <div class="modal-hero">
        <div>
          <span class="kicker">Sistema de Agendamento</span>
          <h2>Agenda online para organizar horarios e clientes.</h2>
          <p>O cliente escolhe servico, profissional e horario disponivel com uma experiencia simples e profissional.</p>
        </div>
        <div class="modal-panel">
          <strong>Studio Bella</strong>
          <div class="booking-card"><strong>Corte Feminino</strong><span>Profissional: Ana</span><b>09:00</b></div>
          <div class="booking-card"><strong>Escova</strong><span>Profissional: Carla</span><b>11:30</b></div>
          <button class="phone-action">Confirmar agendamento</button>
        </div>
      </div>
      <div class="modal-feature-grid"><div><strong>Horarios</strong><p>Agenda organizada.</p></div><div><strong>Clientes</strong><p>Historico de atendimento.</p></div><div><strong>Menos mensagens</strong><p>Reduz atendimento manual.</p></div></div>
    </div>`,
  site:`
    <div class="modal-demo">
      <div class="modal-hero">
        <div>
          <span class="kicker">Site Institucional Premium</span>
          <h2>Presenca digital profissional para empresas locais.</h2>
          <p>Pagina clara para apresentar servicos, diferenciais, localizacao e gerar contatos qualificados.</p>
        </div>
        <div class="modal-panel">
          <strong>Empresa Premium</strong>
          <div class="booking-card"><strong>Servicos</strong><span>Apresentacao clara</span></div>
          <div class="booking-card"><strong>Google Maps</strong><span>Localizacao integrada</span></div>
          <div class="booking-card"><strong>WhatsApp</strong><span>Botoes estrategicos</span></div>
          <button class="phone-action">Solicitar orcamento</button>
        </div>
      </div>
      <div class="modal-feature-grid"><div><strong>Confianca</strong><p>Visual profissional.</p></div><div><strong>Conversao</strong><p>Estrutura para contatos.</p></div><div><strong>Mobile</strong><p>Layout responsivo.</p></div></div>
    </div>`
};

function openDemoModal(type){
  if(!modal || !modalContent || !modalTemplates[type]) return;
  modalContent.innerHTML = modalTemplates[type];
  window.gbTechApplyLanguage?.(modalContent);
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-is-open");
}
function closeDemoModal(){
  if(!modal) return;
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-is-open");
}
document.querySelectorAll("[data-demo-open]").forEach((card) => {
  card.addEventListener("click", () => openDemoModal(card.dataset.demoOpen));
  card.addEventListener("keydown", (event) => {
    if(event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDemoModal(card.dataset.demoOpen);
    }
  });
});
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeDemoModal));

// System image preview modal.
const systemModal = document.getElementById("systemModal");
const systemModalImage = document.getElementById("systemModalImage");
const systemModalTitle = document.getElementById("systemModalTitle");
const systemModalDescription = document.getElementById("systemModalDescription");
const systemPreviewData = {
  instagram:{
    src:"assets/img/ist/ist_001.jpg",
    fallbackSrc:"",
    alt:"Painel do sistema Instagram Automation Pro",
    title:"Instagram Automation Pro",
    description:"Painel real do sistema com monitoramento, leads, atividades e controle da automação."
  },
  whatsapp:{
    src:"assets/img/WhatsApp/whtat_001.jpg",
    fallbackSrc:"",
    alt:"Painel do sistema de automação para WhatsApp",
    title:"WhatsApp Automation",
    description:"Painel real do sistema para atendimento, fluxos, contatos e acompanhamento das conversas."
  },
  combo:{
    src:"assets/img/ist_what.png",
    fallbackSrc:"",
    alt:"Painel do sistema integrado Instagram e WhatsApp",
    title:"Instagram + WhatsApp",
    description:"Visual do fluxo integrado para captação no Instagram e continuidade do atendimento pelo WhatsApp."
  }
};

function openSystemModal(type){
  const item = systemPreviewData[type];
  if(!systemModal || !systemModalImage || !item) return;
  systemModal.querySelector(".system-modal-card")?.classList.remove("is-missing");
  systemModalImage.dataset.fallbackSrc = item.fallbackSrc || "";
  systemModalImage.src = item.src;
  systemModalImage.alt = item.alt;
  if(systemModalTitle) systemModalTitle.textContent = item.title;
  if(systemModalDescription) systemModalDescription.textContent = item.description;
  systemModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-is-open");
}

function closeSystemModal(){
  if(!systemModal) return;
  systemModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-is-open");
}

document.querySelectorAll("[data-system-preview]").forEach((button) => {
  button.addEventListener("click", () => openSystemModal(button.dataset.systemPreview));
});
document.querySelectorAll("[data-close-system-modal]").forEach((button) => button.addEventListener("click", closeSystemModal));
document.querySelectorAll("[data-system-image]").forEach((image) => {
  image.addEventListener("error", () => {
    const fallback = image.dataset.fallbackSrc;
    if(fallback && image.src.indexOf(fallback) === -1) {
      image.src = fallback;
      image.dataset.fallbackSrc = "";
      return;
    }
    image.closest(".system-preview")?.classList.add("is-missing");
    image.closest(".system-modal-card")?.classList.add("is-missing");
  });
});

// Services carousel buttons on mobile/tablet.
(function(){
  const carousel = document.querySelector("[data-solutions-carousel]");
  if(!carousel) return;
  document.querySelector("[data-solutions-prev]")?.addEventListener("click", () => carousel.scrollBy({ left:-320, behavior:"smooth" }));
  document.querySelector("[data-solutions-next]")?.addEventListener("click", () => carousel.scrollBy({ left:320, behavior:"smooth" }));
})();

// Contact form opens WhatsApp with organized content.
(function(){
  const form = document.getElementById("contactForm");
  if(!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const getValue = (name) => String(data.get(name) || "").trim();
    const english = document.documentElement.lang === "en";
    const message = english ? [
      "Hello! I came from the GB Tech Solutions website and would like to talk about a project.",
      "",
      `Name: ${getValue("name")}`,
      `WhatsApp: ${getValue("phone")}`,
      `Company: ${getValue("company") || "Not informed"}`,
      `Email: ${getValue("email") || "Not informed"}`,
      `Project type: ${getValue("project")}`,
      `Timeline: ${getValue("deadline")}`,
      `Budget: ${getValue("budget")}`,
      "",
      `Message: ${getValue("message")}`
    ] : [
      "Ola! Vim pelo site da GB Tech Solutions e quero falar sobre um projeto.",
      "",
      `Nome: ${getValue("name")}`,
      `WhatsApp: ${getValue("phone")}`,
      `Empresa: ${getValue("company") || "Nao informado"}`,
      `E-mail: ${getValue("email") || "Nao informado"}`,
      `Tipo de projeto: ${getValue("project")}`,
      `Prazo desejado: ${getValue("deadline")}`,
      `Investimento estimado: ${getValue("budget")}`,
      "",
      `Mensagem: ${getValue("message")}`
    ];
    window.open(`https://wa.me/5521965829441?text=${encodeURIComponent(message.join("\n"))}`, "_blank", "noopener");
  });
})();

// Cookie consent.
const cookieConsent = document.getElementById("cookieConsent");
const cookieModal = document.getElementById("cookieModal");
const cookieKey = "gbTechCookieConsent";

function closeCookieModal(){
  cookieModal?.setAttribute("aria-hidden", "true");
}
function saveCookies(settings){
  localStorage.setItem(cookieKey, JSON.stringify({ necessary:true, ...settings, savedAt:new Date().toISOString() }));
  cookieConsent?.classList.add("is-hidden");
  closeCookieModal();
}
if(cookieConsent){
  const saved = localStorage.getItem(cookieKey);
  if(saved) cookieConsent.classList.add("is-hidden");
  document.getElementById("cookieAllow")?.addEventListener("click", () => saveCookies({ analytics:true, marketing:true }));
  document.getElementById("cookiePreferences")?.addEventListener("click", () => cookieModal?.setAttribute("aria-hidden", "false"));
  document.getElementById("cookieReject")?.addEventListener("click", () => saveCookies({ analytics:false, marketing:false }));
  document.getElementById("cookieSave")?.addEventListener("click", () => saveCookies({
    analytics:!!document.getElementById("cookieAnalytics")?.checked,
    marketing:!!document.getElementById("cookieMarketing")?.checked
  }));
  document.querySelectorAll("[data-cookie-close]").forEach((button) => button.addEventListener("click", closeCookieModal));
}

// Install app buttons. Android/Chrome can show a native install prompt; iOS gets instructions.
let deferredInstallPrompt = null;
const installModal = document.getElementById("installModal");
const installModalTitle = document.getElementById("installModalTitle");
const installInstructions = document.getElementById("installInstructions");
const installAppDomain = document.getElementById("installAppDomain");

function getInstallContext(){
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isDesktop = !isIOS && !isAndroid;
  return { isStandalone, isIOS, isAndroid, isDesktop };
}

function getInstallInstructions(){
  const context = getInstallContext();
  if(context.isStandalone){
    return {
      title:"GB Tech já está instalada",
      html:"<p>Você já está navegando pela versão instalada do app GB Tech.</p>"
    };
  }
  if(deferredInstallPrompt){
    return {
      title:"Instale a GB Tech",
      html:"<p>Seu navegador permite instalar agora. Clique no botão <strong>Instalar app</strong> e confirme a instalação.</p>"
    };
  }
  if(context.isIOS){
    return {
      title:"Instale no iPhone ou iPad",
      html:"<p>No iPhone, toque em compartilhar ou no menu do navegador e escolha <strong>Adicionar à Tela de Início</strong> ou <strong>Instalar app</strong>.</p><p>Depois disso, o ícone da GB Tech aparece como app na tela inicial quando o navegador permitir.</p>"
    };
  }
  if(context.isAndroid){
    return {
      title:"Instale no Android",
      html:"<p>No Chrome, toque no menu de três pontos e escolha <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.</p><p>Depois confirme para criar o ícone da GB Tech no celular.</p>"
    };
  }
  return {
    title:"Instale no computador",
    html:"<p>No Chrome ou Edge, procure o ícone de instalação na barra de endereço ou abra o menu do navegador e escolha <strong>Instalar GB Tech</strong>.</p><p>Se a opção não aparecer, acesse o site publicado com HTTPS pela Vercel.</p>"
  };
}

function openInstallModal(){
  const instructions = getInstallInstructions();
  if(installModalTitle) installModalTitle.textContent = instructions.title === "Instale a GB Tech" ? "Instale o app" : instructions.title;
  if(installAppDomain) installAppDomain.textContent = location.hostname || "gbtechsolutions.com.br";
  if(installInstructions) installInstructions.innerHTML = instructions.html;
  installInstructions?.classList.toggle("is-visible", !deferredInstallPrompt || getInstallContext().isStandalone);
  window.gbTechApplyLanguage?.(installModal);
  installModal?.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-is-open");
}

function closeInstallModal(){
  installModal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-is-open");
}

async function requestNativeInstall(){
  if(!deferredInstallPrompt) return false;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice.catch(() => {});
  deferredInstallPrompt = null;
  return true;
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
});

document.querySelectorAll("[data-install-app]").forEach((button) => {
  button.addEventListener("click", async () => {
    button.classList.remove("is-clicking");
    void button.offsetWidth;
    button.classList.add("is-clicking");
    if(getInstallContext().isStandalone){
      openInstallModal();
      return;
    }
    if(await requestNativeInstall()) return;
    openInstallModal();
  });
});
document.querySelectorAll("[data-install-direct]").forEach((button) => {
  button.addEventListener("click", async () => {
    button.classList.remove("is-clicking");
    void button.offsetWidth;
    button.classList.add("is-clicking");
    if(await requestNativeInstall()){
      closeInstallModal();
      return;
    }
    openInstallModal();
  });
});
document.querySelectorAll("[data-close-install-modal]").forEach((button) => button.addEventListener("click", closeInstallModal));

// PWA registration. Works on HTTPS/Vercel and keeps the installed app updated.
if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  });
}
