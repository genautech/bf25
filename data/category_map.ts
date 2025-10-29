// data/category_map.ts
interface RawProduct {
  'Nome do Produto': string;
  'Categoria': string;
  'Subcategoria': string;
  [key: string]: any;
}

interface CleanedCategory {
  category: string;
  subcategory: string;
}

// Main Categories
const CATEGORIES = {
  ELECTRONICS: 'Eletrônicos',
  HOME_KITCHEN: 'Casa e Cozinha',
  GAMING: 'Games',
  HEALTH_WELLNESS: 'Saúde e Bem-estar',
  SPORTS_LEISURE: 'Esportes e Lazer',
  ACCESSORIES: 'Acessórios',
};

// Subcategories
const SUBCATEGORIES = {
  // Electronics
  AUDIO: 'Áudio',
  LAPTOPS: 'Laptops',
  WEARABLES: 'Wearables',
  SMART_HOME: 'Casa Inteligente',
  SMARTPHONES: 'Smartphones',
  TABLETS_EREADERS: 'Tablets e E-readers',
  CAMERAS_DRONES: 'Câmeras e Drones',
  PROJECTORS: 'Projetores',
  PERIPHERALS: 'Periféricos de TI',
  STORAGE: 'Armazenamento',
  POWER_INPUT_ACCESSORIES: 'Acessórios de Energia e Entrada',

  // Home & Kitchen
  APPLIANCES: 'Eletrodomésticos',
  FRYERS: 'Fritadeiras Elétricas',

  // Gaming
  GAMING_CONSOLE_ACCESSORIES: 'Consoles e Acessórios',

  // Other
  HEALTH_DEVICES: 'Dispositivos de Saúde',
  SPORT_ACCESSORIES: 'Acessórios Esportivos',
  BAGS: 'Bolsas e Mochilas',
  OFFICE_ACCESSORIES: 'Acessórios de Escritório',
  OTHER: 'Outros',
};


const normalizeString = (str: string) => str ? str.toLowerCase().trim() : '';

export const getCleanedCategory = (item: RawProduct): CleanedCategory => {
  const name = normalizeString(item['Nome do Produto']);
  const rawCategory = normalizeString(item['Categoria']);
  const rawSubcategory = normalizeString(item['Subcategoria']);
  
  if (name.includes('fone de ouvido') || name.includes('airpods') || name.includes('earbuds') || name.includes('headset') || name.includes('soundcore') || name.includes('beats') || name.includes('galaxy buds') || name.includes('linkbuds') || name.includes('1more evo')) {
    return { category: CATEGORIES.ELECTRONICS, subcategory: SUBCATEGORIES.AUDIO };
  }
  if (name.includes('caixa de som') || name.includes('jbl flip') || name.includes('jbl xtreme')) {
    return { category: CATEGORIES.ELECTRONICS, subcategory: SUBCATEGORIES.AUDIO };
  }
  if (name.includes('watch') || name.includes('band') || name.includes('amazfit') || name.includes('fitbit') || name.includes('garmin') || name.includes('galaxy ring') || name.includes('suunto') || name.includes('polar')) {
    return { category: CATEGORIES.ELECTRONICS, subcategory: SUBCATEGORIES.WEARABLES };
  }
  if (name.includes('notebook') || name.includes('macbook') || name.includes('laptop') || name.includes('xps') || name.includes('thinkpad') || name.includes('spectre')) {
    return { category: CATEGORIES.ELECTRONICS, subcategory: SUBCATEGORIES.LAPTOPS };
  }
  if (name.includes('tablet') || name.includes('ipad') || name.includes('galaxy tab') || name.includes('fire max') || name.includes('matepad')) {
    return { category: CATEGORIES.ELECTRONICS, subcategory: SUBCATEGORIES.TABLETS_EREADERS };
  }
  if (name.includes('kindle')) {
    return { category: CATEGORIES.ELECTRONICS, subcategory: SUBCATEGORIES.TABLETS_EREADERS };
  }
  if (name.includes('smartphone') || name.includes('iphone') || name.includes('galaxy s24') || name.includes('galaxy z') || name.includes('pixel 8') || name.includes('motorola edge') || name.includes('xiaomi 14') || name.includes('rog phone')) {
    return { category: CATEGORIES.ELECTRONICS, subcategory: SUBCATEGORIES.SMARTPHONES };
  }
  if (name.includes('câmera') || name.includes('gopro') || name.includes('insta360') || name.includes('powershot') || name.includes('zv-e10') || name.includes('dji action')) {
    return { category: CATEGORIES.ELECTRONICS, subcategory: SUBCATEGORIES.CAMERAS_DRONES };
  }
  if (name.includes('drone') || name.includes('dji air') || name.includes('dji mini') || name.includes('dji avata')) {
    return { category: CATEGORIES.ELECTRONICS, subcategory: SUBCATEGORIES.CAMERAS_DRONES };
  }
  if (name.includes('projetor')) {
    return { category: CATEGORIES.ELECTRONICS, subcategory: SUBCATEGORIES.PROJECTORS };
  }
  if (name.includes('alexa') || name.includes('echo dot') || name.includes('google nest') || name.includes('smart plug') || name.includes('sensor movimento') || name.includes('lâmpada wi-fi') || name.includes('smart home') || name.includes('ring video')) {
    return { category: CATEGORIES.ELECTRONICS, subcategory: SUBCATEGORIES.SMART_HOME };
  }
  if (name.includes('console') || name.includes('nintendo switch') || name.includes('playstation 5') || name.includes('xbox') || name.includes('steam deck') || name.includes('controle') || name.includes('dualsense') || name.includes('rog ally')) {
    return { category: CATEGORIES.GAMING, subcategory: SUBCATEGORIES.GAMING_CONSOLE_ACCESSORIES };
  }
  if (name.includes('teclado') || name.includes('mouse') || name.includes('webcam') || name.includes('apresentador sem fio') || name.includes('monitor')) {
    return { category: CATEGORIES.ELECTRONICS, subcategory: SUBCATEGORIES.PERIPHERALS };
  }
  if (name.includes('ssd') || name.includes('cartão de memória')) {
      return { category: CATEGORIES.ELECTRONICS, subcategory: SUBCATEGORIES.STORAGE };
  }
  if (name.includes('carregador') || name.includes('power bank') || name.includes('magic keyboard') || name.includes('apple pencil')) {
      return { category: CATEGORIES.ELECTRONICS, subcategory: SUBCATEGORIES.POWER_INPUT_ACCESSORIES };
  }
  if (name.includes('air fryer') || name.includes('fritadeira')) {
    return { category: CATEGORIES.HOME_KITCHEN, subcategory: SUBCATEGORIES.FRYERS };
  }
  if (name.includes('pipoqueira') || name.includes('chaleira') || name.includes('nespresso')) {
    return { category: CATEGORIES.HOME_KITCHEN, subcategory: SUBCATEGORIES.APPLIANCES };
  }
  if (name.includes('robô aspirador')) {
    return { category: CATEGORIES.HOME_KITCHEN, subcategory: SUBCATEGORIES.APPLIANCES };
  }
  if (name.includes('monitor de pressão') || name.includes('balança digital') || name.includes('almofada massageadora')) {
      return { category: CATEGORIES.HEALTH_WELLNESS, subcategory: SUBCATEGORIES.HEALTH_DEVICES };
  }
  if (name.includes('mochila de hidratação')) {
      return { category: CATEGORIES.SPORTS_LEISURE, subcategory: SUBCATEGORIES.SPORT_ACCESSORIES };
  }
  if (name.includes('mochila') && !name.includes('hidratação')) {
    return { category: CATEGORIES.ACCESSORIES, subcategory: SUBCATEGORIES.BAGS };
  }
  if (name.includes('suporte para monitor')) {
    return { category: CATEGORIES.ACCESSORIES, subcategory: SUBCATEGORIES.OFFICE_ACCESSORIES };
  }

  // Fallback for original categories if they are clean
  if (rawCategory.includes('eletrônicos') || rawCategory.includes('eletronicos')) {
    return { category: CATEGORIES.ELECTRONICS, subcategory: item['Subcategoria'] || SUBCATEGORIES.OTHER };
  }
  if (rawCategory.includes('casa e cozinha')) {
    return { category: CATEGORIES.HOME_KITCHEN, subcategory: item['Subcategoria'] || SUBCATEGORIES.OTHER };
  }
   if (rawCategory.includes('esporte')) {
    return { category: CATEGORIES.SPORTS_LEISURE, subcategory: item['Subcategoria'] || SUBCATEGORIES.OTHER };
  }
  
  return { category: 'Outros', subcategory: SUBCATEGORIES.OTHER };
};
