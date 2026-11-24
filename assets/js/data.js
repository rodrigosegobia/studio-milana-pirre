/* Fotografias reais por URL; cópias da mesma foto preservam a prévia sem rede. */
window.STUDIO_IMAGE_FALLBACKS = {
  "https://images.pexels.com/photos/8166788/pexels-photo-8166788.jpeg?auto=compress&cs=tinysrgb&w=1400": "assets/images/perfume-hero.jpg",
  "https://images.pexels.com/photos/8166570/pexels-photo-8166570.jpeg?auto=compress&cs=tinysrgb&w=800": "assets/images/reference-amber.jpg",
  "https://images.pexels.com/photos/8166430/pexels-photo-8166430.jpeg?auto=compress&cs=tinysrgb&w=900": "assets/images/reference-woody.jpg",
  "https://images.pexels.com/photos/8166788/pexels-photo-8166788.jpeg?auto=compress&cs=tinysrgb&w=800": "assets/images/perfume-hero.jpg",
  "https://images.pexels.com/photos/34941684/pexels-photo-34941684.jpeg?auto=compress&cs=tinysrgb&w=1200": "assets/images/nails-hero.jpg",
  "https://images.pexels.com/photos/13038494/pexels-photo-13038494.jpeg?auto=compress&cs=tinysrgb&w=1200": "assets/images/nails-detail.jpg"
};
/* Todos os produtos, preços, notas e tempos abaixo são fictícios e demonstrativos. */
window.STUDIO_DATA = {
  categories: ['Masculinos', 'Femininos', 'Árabes', 'Importados', 'Nicho'],
  brands: ['Carolina Herrera', 'Rabanne', 'Emporio Armani', 'Dior'],
  products: [
    { id:'ambre', name:'Ambre Lumière', collection:'Coleção de demonstração', family:'Ambarado floral', categories:['Femininos','Importados'], price:389, compareAt:459, volume:75, image:'assets/images/perfume-ambre.jpg', imageFit:'contain', gallery:['assets/images/perfume-ambre.jpg'], notes:['Bergamota','Jasmim','Âmbar'], description:'A luminosidade da bergamota encontra um coração floral e a presença acolhedora do âmbar. Uma composição imaginada para acompanhar momentos especiais.', intensity:'Envolvente', concentration:'Eau de parfum' },
    { id:'bois', name:'Bois de Minuit', collection:'Coleção de demonstração', family:'Amadeirado aromático', categories:['Masculinos','Nicho'], price:459, volume:100, image:'assets/images/perfume-bois.jpg', imageFit:'contain', gallery:['assets/images/perfume-bois.jpg'], notes:['Cardamomo','Cedro','Vetiver'], description:'Madeiras profundas, especiarias sutis e um fundo de vetiver. Uma interpretação imaginária de elegância que permanece na memória.', intensity:'Intenso', concentration:'Eau de parfum' },
    { id:'fleur', name:'Fleur de Soie', collection:'Coleção de demonstração', family:'Floral delicado', categories:['Femininos','Nicho'], price:349, volume:50, image:'assets/images/perfume-fleur.jpg', imageFit:'contain', gallery:['assets/images/perfume-fleur.jpg'], notes:['Pera','Peônia','Almíscar'], description:'Um floral macio como seda, com saída frutada e um fundo delicado. Um perfume fictício para explorar o lado mais leve da perfumaria.', intensity:'Suave', concentration:'Eau de parfum' },
    { id:'oud', name:'Oud Velours', collection:'Coleção de demonstração', family:'Oriental amadeirado', categories:['Árabes','Nicho'], price:529, volume:100, image:'https://images.pexels.com/photos/8166430/pexels-photo-8166430.jpeg?auto=compress&cs=tinysrgb&w=900', gallery:['https://images.pexels.com/photos/8166430/pexels-photo-8166430.jpeg?auto=compress&cs=tinysrgb&w=900','https://images.pexels.com/photos/8166788/pexels-photo-8166788.jpeg?auto=compress&cs=tinysrgb&w=1400'], notes:['Açafrão','Rosa','Oud'], description:'Rosa e açafrão encontram a profundidade do oud nesta composição demonstrativa de personalidade intensa.', intensity:'Intenso', concentration:'Eau de parfum' },
    { id:'soleil', name:'Soleil Doré', collection:'Coleção de demonstração', family:'Cítrico floral', categories:['Femininos','Importados'], price:299, compareAt:349, volume:50, image:'https://images.pexels.com/photos/8166570/pexels-photo-8166570.jpeg?auto=compress&cs=tinysrgb&w=800', gallery:['https://images.pexels.com/photos/8166570/pexels-photo-8166570.jpeg?auto=compress&cs=tinysrgb&w=800','https://images.pexels.com/photos/8166788/pexels-photo-8166788.jpeg?auto=compress&cs=tinysrgb&w=1400'], notes:['Mandarina','Néroli','Sândalo'], description:'A energia dos cítricos e a delicadeza das flores em uma fragrância fictícia inspirada na luz do fim da tarde.', intensity:'Suave', concentration:'Eau de parfum' },
    { id:'nuit', name:'Nuit d’Orient', collection:'Coleção de demonstração', family:'Ambarado especiado', categories:['Masculinos','Árabes'], price:419, volume:75, image:'https://images.pexels.com/photos/8166788/pexels-photo-8166788.jpeg?auto=compress&cs=tinysrgb&w=800', gallery:['https://images.pexels.com/photos/8166788/pexels-photo-8166788.jpeg?auto=compress&cs=tinysrgb&w=800','https://images.pexels.com/photos/8166788/pexels-photo-8166788.jpeg?auto=compress&cs=tinysrgb&w=1400'], notes:['Pimenta rosa','Incenso','Baunilha'], description:'O contraste entre especiarias e notas quentes dá forma a esta criação ilustrativa de perfumaria.', intensity:'Envolvente', concentration:'Eau de parfum' }
  ],
  nail: {
    // Preencha apenas com nome, biografia e retrato autorizados da profissional.
    profile: { name: '', bio: '', photo: '' },
    portfolio: [
      { title: 'Nude luminoso', description: 'Tons suaves, brilho delicado e um acabamento que valoriza a forma.', image: 'https://images.pexels.com/photos/34941684/pexels-photo-34941684.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Manicure nude com pérolas, fotografia de referência' },
      { title: 'Francesinha delicada', description: 'O contraste sutil de um clássico, visto de perto.', image: 'https://images.pexels.com/photos/13038494/pexels-photo-13038494.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Francesinha em unhas quadradas, fotografia de referência' }
    ]
  },
  services: [
    { id:'alongamento', name:'Alongamento', description:'Comprimento e formato construídos para valorizar suas mãos, com acabamento personalizado.', detail:'A técnica e o comprimento são definidos após avaliação profissional.' },
    { id:'blindagem', name:'Blindagem', description:'Uma camada de proteção sobre as unhas naturais, com aparência leve e acabamento delicado.', detail:'A indicação depende das condições das unhas naturais.' },
    { id:'manutencao', name:'Manutenção', description:'Renovação do alongamento para cuidar do formato, do equilíbrio e do acabamento.', detail:'Periodicidade e procedimento são definidos em avaliação.' },
    { id:'esmaltacao', name:'Esmaltação em gel', description:'Cor, brilho e acabamento uniforme para expressar seu estilo nos pequenos detalhes.', detail:'Cores e opções reais serão apresentadas pela profissional.' }
  ]
};
