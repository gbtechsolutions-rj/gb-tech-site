# Mapa de midias - GB Tech Solutions

## Pastas

- `assets/img/` - imagens carregadas diretamente pelo site.
- `assets/video/` - pasta reservada para videos locais, caso sejam adicionados depois.
- `assets/media/` - copia de compatibilidade com os nomes antigos usados pelo projeto.

## Imagens usadas pelo site

### Logos
- `assets/img/logo-white.png`
- `assets/img/logo-color.png`

### Hero e fluxo
- `assets/img/fluxo-01-estrategia.jpg`
- `assets/img/fluxo-02-design-interface.jpg`
- `assets/img/fluxo-03-sistemas-automacoes.jpg`
- `assets/img/consultoria-gb-tech.jpg`

### Servicos e portfolio
- `assets/img/produto-cardapio-delivery.jpg`
- `assets/img/produto-agenda-online.jpg`
- `assets/img/produto-site-institucional.jpg`
- `assets/img/servico-apps-pwa.jpg`
- `assets/img/servico-automacao-atendimento.jpg`
- `assets/img/servico-sistema-desktop.jpg`

### Demonstracoes internas
- `assets/img/hamburguer-artesanal.jpg`
- `assets/img/batata-frita-premium.jpg`
- `assets/img/refrigerante-lata.jpg`

## Videos do topo

O bloco de video esta preservado no `index.html`, dentro de `.io-right-panel`.

Os videos usam `preload="metadata"`, `playsinline`, `muted` e posters locais validos.
Para evitar travamento no Firefox, os arquivos remotos so sao carregados quando o visitante clica em `Assistir midia`.

Fontes atuais:
- `https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4`
- `https://videos.pexels.com/video-files/5028622/5028622-uhd_2560_1440_25fps.mp4`
- `https://videos.pexels.com/video-files/28709421/28709421-uhd_2560_1440_30fps.mp4`

## Compatibilidade restaurada

Tambem foram recriados estes caminhos antigos em `assets/media/`, para evitar perdas caso algum trecho futuro volte a usar a estrutura anterior:

- `assets/media/brand/`
- `assets/media/flow/`
- `assets/media/demo/`
- `assets/media/hero/`
- `assets/media/backgrounds/`

Todos os caminhos usam barra normal `/` no HTML/CSS/JS e sao relativos ao projeto.
