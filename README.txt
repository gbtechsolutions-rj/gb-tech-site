GB Tech Solutions - site estatico

Estrutura principal para deploy na Vercel:
- index.html
- css/style.css
- js/script.js
- assets/img/      imagens carregadas pelo site
- assets/video/    pasta reservada para videos locais
- assets/media/    copia de compatibilidade com os nomes antigos de midia

Observacoes:
- O site usa caminhos relativos, sem caminhos locais do Windows.
- A primeira dobra usa imagem local imediatamente.
- Os videos do topo ficam no HTML como fontes remotas e so carregam quando o visitante clica em "Assistir midia".
- Para trocar imagens usadas pelo site, substitua os arquivos em assets/img mantendo o mesmo nome.
- Para compatibilidade com documentacao antiga, tambem existem copias em assets/media.
