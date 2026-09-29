export type MenuTheme = 'marine' | 'criollo' | 'amazon' | 'daily';

export interface Dish {
  nombre: string;
  precio: string;
  grupo?: string;
  nota?: string;
}

export interface Category {
  id: string;
  nombre: string;
  etiqueta: string;
  imagen: string;
  enfoque: 'mar' | 'criollo' | 'selva';
  theme: MenuTheme;
  items: Dish[];
}

const price = (value: number) => `S/. ${value.toFixed(2)}`;
const dish = (grupo: string, nombre: string, value: number, nota?: string): Dish => ({ grupo, nombre, precio: price(value), nota });
const CATEGORY_IMAGES = {
  marinos: '/images/category-marinos.png',
  frituras: '/images/category-frituras.png',
  criollos: '/images/category-criollos.png',
  selva: '/images/category-selva.png',
  desayunos: '/images/category-desayunos.png',
  menu: '/images/category-menu.png',
  saludable: '/images/category-saludable.png',
  bebidas: '/images/category-bebidas.png',
};

export const MENU_ENTRADAS = ['Sopa de casa con carne', 'Tequeños', 'Ensalada mixta'] as const;

const CATALOG_CATEGORIES: Category[] = [
  {
    id: 'marinos', nombre: 'Platos marinos', etiqueta: 'Pescados y mariscos', imagen: CATEGORY_IMAGES.marinos, enfoque: 'mar', theme: 'marine', items: [
      dish('Ceviches', 'Ceviche de pescado', 35), dish('Ceviches', 'Ceviche mixto', 45),
      dish('Ceviches', 'Ceviche al Crucero de pescado', 43), dish('Ceviches', 'Ceviche al Crucero mixto', 48),
      dish('Ceviches', 'Leche de tigre', 25), dish('Ceviches', 'Chilcano', 15), dish('Ceviches', 'Chilcano acevichado', 20),
      dish('Tiraditos', 'Tiradito de pescado', 40), dish('Tiraditos', 'Tiradito mixto', 45),
      dish('Chicharrones', 'Chicharrón de pescado', 45), dish('Chicharrones', 'Chicharrón mixto', 55), dish('Chicharrones', 'Chicharrón de calamar', 45),
      dish('Chaufas', 'Chaufa de pescado', 45), dish('Chaufas', 'Chaufa de mariscos', 45), dish('Chaufas', 'Chaufa de langostino', 50), dish('Chaufas', 'Chaufa de camarón', 50),
      dish('Arroces', 'Arroz con mariscos', 45), dish('Arroces', 'Arroz con langostinos', 50), dish('Arroces', 'Arroz con camarón', 50),
    ],
  },
  {
    id: 'pescados', nombre: 'Pescados y sudados', etiqueta: 'Del mar a la mesa', imagen: CATEGORY_IMAGES.frituras, enfoque: 'mar', theme: 'marine', items: [
      dish('Jaleas', 'Jalea de pescado', 45), dish('Jaleas', 'Jalea mixta', 50), dish('Jaleas', 'Jalea de cecina', 40), dish('Jaleas', 'Jalea mixta de cecina y chorizo', 45),
      dish('Pescado frito', 'Cabrilla frita con yuca sancochada', 45), dish('Pescado frito', 'Cabrilla frita con yuca frita', 45),
      dish('Pescado frito', 'Corvina frita con yuca sancochada', 55), dish('Pescado frito', 'Corvina frita con yuca frita', 55),
      dish('Pescado frito', 'Chita al ajo con yuca sancochada', 55), dish('Pescado frito', 'Chita al ajo con yuca frita', 55),
      dish('Pescado frito', 'Trucha frita con frejol', 30), dish('Pescado frito', 'Trucha frita con yuca', 30),
      dish('Pescado frito', 'Filete de pescado frito', 25), dish('Pescado frito', 'Filete de pescado a la plancha', 25),
      dish('Sudados', 'Sudado de pescado (filete)', 45), dish('Sudados', 'Sudado mixto', 60), dish('Sudados', 'Sudado de cabrilla', 55),
      dish('Sudados', 'Sudado de cabrilla con mariscos', 60), dish('Sudados', 'Sudado de chita', 55), dish('Sudados', 'Sudado de chita con mariscos', 60),
      dish('Sudados', 'Sudado de tramboyo', 55), dish('Sudados', 'Sudado de tramboyo con mariscos', 60), dish('Sudados', 'Sudado de trucha', 30),
      dish('Tacu tacu de mariscos', 'Tacu tacu con mariscos', 45), dish('Tacu tacu de mariscos', 'Tacu tacu con camarones', 50),
      dish('Tacu tacu de mariscos', 'Tacu tacu con langostinos', 50), dish('Tacu tacu de mariscos', 'Tacu tacu con pescado a la plancha (filete)', 40),
    ],
  },
  {
    id: 'duos', nombre: 'Dúos marinos', etiqueta: 'Para compartir', imagen: CATEGORY_IMAGES.frituras, enfoque: 'mar', theme: 'marine', items: [
      dish('Dúos marinos', 'Ceviche con chicharrón de pescado', 50), dish('Dúos marinos', 'Ceviche con chicharrón de calamar', 50),
      dish('Dúos marinos', 'Ceviche con arroz con mariscos', 50), dish('Dúos marinos', 'Ceviche con chaufa de pescado', 50),
      dish('Dúos marinos', 'Ceviche con chaufa de mariscos', 50), dish('Dúos marinos', 'Arroz con mariscos y chicharrón de pescado', 55),
      dish('Dúos marinos', 'Arroz con mariscos y chicharrón de calamar', 60), dish('Dúos marinos', 'Ceviche mixto con chicharrón de pescado', 60),
      dish('Dúos marinos', 'Ceviche mixto con chicharrón de calamar', 60), dish('Dúos marinos', 'Arroz con mariscos y chicharrón mixto', 60),
      dish('Dúos marinos', 'Ceviche mixto con chicharrón mixto', 60), dish('Dúos marinos', 'Ceviche mixto con arroz con mariscos', 60),
    ],
  },
  {
    id: 'trios', nombre: 'Tríos marinos', etiqueta: 'Combinaciones marinas', imagen: CATEGORY_IMAGES.frituras, enfoque: 'mar', theme: 'marine', items: [
      dish('Tríos marinos', 'Ceviche + chicharrón de pescado + arroz con mariscos', 70),
      dish('Tríos marinos', 'Ceviche + chicharrón de calamar + arroz con mariscos', 70),
      dish('Tríos marinos', 'Ceviche + chicharrón de pescado + chaufa de pescado', 70),
      dish('Tríos marinos', 'Ceviche + chicharrón de pescado + chicharrón de calamar', 70),
      dish('Tríos marinos', 'Ceviche + chicharrón mixto + chaufa de mariscos', 80),
      dish('Tríos marinos', 'Ceviche + chicharrón mixto + arroz con mariscos', 80),
      dish('Tríos marinos', 'Ceviche mixto + chicharrón mixto + arroz con mariscos', 80),
      dish('Tríos marinos', 'Ceviche mixto + chicharrón de calamar + chaufa de mariscos', 80),
      dish('Tríos marinos', 'Ceviche mixto + chicharrón mixto + chaufa de mariscos', 80),
      dish('Tríos marinos', 'Ceviche mixto + chicharrón mixto + chicharrón de calamar', 80),
      dish('Tríos marinos', 'Ceviche + arroz con mariscos + causa + chicharrón de pescado', 80),
    ],
  },
  {
    id: 'clasicos', nombre: 'Clásicos marinos', etiqueta: 'Favoritos de la casa', imagen: CATEGORY_IMAGES.marinos, enfoque: 'mar', theme: 'marine', items: [
      dish('Clásicos', 'Leche de pantera', 25), dish('Clásicos', 'Leche de tigre', 25), dish('Clásicos', 'Ceviche de conchas negras', 45),
      dish('Clásicos', 'Choritos a la chalaca · 6 unidades', 25), dish('Clásicos', 'Choritos a la chalaca · 10 unidades', 50),
      dish('Clásicos', 'Ceviche clásico', 55), dish('Clásicos', 'Pulpo a la parrilla', 55), dish('Clásicos', 'Causa al olivo', 35), dish('Clásicos', 'Arroz con conchas negras', 45),
      dish('Picantes', 'Picante de mariscos', 45), dish('Picantes', 'Picante de langostinos', 50), dish('Picantes', 'Picante de camarón', 50),
      dish('Parihuelas', 'Parihuela de filete y mariscos', 40), dish('Parihuelas', 'Parihuela de chita con mariscos', 60),
      dish('Parihuelas', 'Parihuela de cabrilla con mariscos', 60), dish('Parihuelas', 'Parihuela de tramboyo con mariscos', 60),
      dish('Chupes', 'Chupe de pescado', 40), dish('Chupes', 'Chupe de langostino', 45), dish('Chupes', 'Chupe mixto de mariscos', 50), dish('Chupes', 'Chupe de camarón', 50),
    ],
  },
  {
    id: 'criollos', nombre: 'Platos criollos', etiqueta: 'Sazón peruana', imagen: CATEGORY_IMAGES.criollos, enfoque: 'criollo', theme: 'criollo', items: [
      dish('Platos a la carta', 'Costillar a la norteña con yuca y frejol', 45), dish('Platos a la carta', 'Tacu tacu con cabrito a la norteña', 60),
      dish('Platos a la carta', 'Arroz con pato', 45), dish('Platos a la carta', 'Seco de ternera con yuca y frejol', 55), dish('Platos a la carta', 'Tacu tacu con seco de pato', 55),
      dish('Carnes', 'Churrasco a la plancha', 30), dish('Carnes', 'Bisteck a lo pobre', 35), dish('Carnes', 'Bisteck a la plancha', 30),
      dish('Carnes', 'Bisteck a la chorrillana', 30), dish('Carnes', 'Tacu tacu a lo pobre', 40),
      dish('Saltados', 'Lomo saltado', 38), dish('Saltados', 'Lomo a la parrilla', 45), dish('Saltados', 'Lomo a lo pobre', 40),
      dish('Saltados', 'Tallarín saltado de carne', 30), dish('Saltados', 'Tacu tacu con lomo saltado', 40), dish('Saltados', 'Lomo al jugo', 40), dish('Saltados', 'Lomo saltado de cecina', 40),
      dish('Pastas', 'Tallarín verde con pollo a la plancha', 40), dish('Pastas', 'Tallarín verde con milanesa', 40), dish('Pastas', 'Tallarín verde con bisteck', 40),
      dish('Pastas', 'Tallarín verde con churrasco', 45), dish('Pastas', 'Tallarín a la huancaína con lomo de carne', 40),
      dish('Pastas', 'Tallarín a la huancaína con bisteck', 40), dish('Pastas', 'Tallarín a la huancaína con churrasco', 45),
      dish('Pastas', 'Tallarín a la huancaína con pollo a la plancha', 40), dish('Pastas', 'Tallarín a la huancaína con pechuga a la plancha', 40),
      dish('Arroz chaufa criollo', 'Chaufa de pollo', 35), dish('Arroz chaufa criollo', 'Chaufa de carne', 35), dish('Arroz chaufa criollo', 'Chaufa mixto de pollo y carne', 40),
    ],
  },
  {
    id: 'tradicionales', nombre: 'Sopas y tradicionales', etiqueta: 'Cocina criolla', imagen: CATEGORY_IMAGES.criollos, enfoque: 'criollo', theme: 'criollo', items: [
      dish('Pollo', 'Milanesa de pollo', 30), dish('Pollo', 'Pollo broaster', 30), dish('Pollo', 'Chicharrón de pollo', 30),
      dish('Pollo', 'Pechuga a la plancha', 30), dish('Pollo', 'Pechuga a la plancha a lo pobre', 35), dish('Pollo', 'Tacu tacu con pechuga a lo pobre', 35),
      dish('Sopas', 'Caldo de pollo', 20), dish('Sopas', 'Sustancia de carne', 20), dish('Sopas', 'Sustancia de pollo', 20),
      dish('Sopas', 'Sopa a la minuta de carne', 20), dish('Sopas', 'Sopa a la minuta de pollo', 20), dish('Sopas', 'Sopa de dieta de pollo', 20),
      dish('Platos tradicionales', '1 cuy frito con papa sancochada, choclo y zarza criolla', 100),
      dish('Platos tradicionales', '1 cuy picante con papa sancochada, choclo y zarza criolla', 100),
      dish('Platos tradicionales', '1/2 cuy frito con papa sancochada, choclo y zarza criolla', 50),
      dish('Platos tradicionales', '1/2 cuy picante con papa sancochada, choclo y zarza criolla', 50),
      dish('Platos tradicionales', 'Chicharrón de chancho con papa sancochada, choclo y zarza criolla', 35),
      dish('Platos a lo pobre', 'Bisteck a lo pobre', 35), dish('Platos a lo pobre', 'Milanesa a lo pobre', 35), dish('Platos a lo pobre', 'Chuleta a lo pobre', 35),
      dish('Platos a lo pobre', 'Pechuga a lo pobre', 35), dish('Platos a lo pobre', 'Churrasco a lo pobre', 35), dish('Platos a lo pobre', 'Lomo saltado a lo pobre', 40),
    ],
  },
  {
    id: 'selva', nombre: 'Platos de la selva', etiqueta: 'Sabor amazónico', imagen: CATEGORY_IMAGES.selva, enfoque: 'selva', theme: 'amazon', items: [
      dish('Tacacho', 'Tacacho con cecina', 25), dish('Tacacho', 'Tacacho con chorizo', 20), dish('Tacacho', 'Tacacho con pescado', 25),
      dish('Tacacho', 'Tacacho con pechuga a la plancha', 35), dish('Tacacho', 'Tacacho con doncella', 35), dish('Tacacho', 'Tacacho con boquichico', 35),
      dish('Tacacho', 'Tacacho con palometa', 35), dish('Tacacho', 'Tacacho a lo macho', 40), dish('Tacacho', 'Tacacho mixto', 40),
      dish('Tacacho', 'Cecina con maduro frito', 25), dish('Tacacho', 'Cecina con patacones', 30), dish('Tacacho', 'Cecina montada', 30),
      dish('Juanes', 'Juane de pollo con frejol', 25), dish('Juanes', 'Juane de pollo con tacacho', 25), dish('Juanes', 'Juane de pollo con plátano sancochado', 25),
      dish('Juanes', 'Juane de pollo con patacones', 25), dish('Juanes', 'Juane de pollo con maduro frito', 25),
      dish('Juanes', 'Juane de pollo con cecina', 35), dish('Juanes', 'Juane de pollo con chorizo', 35),
      dish('Juanes', 'Juane de gallina con tacacho', 28), dish('Juanes', 'Juane de gallina con patacones', 28), dish('Juanes', 'Juane de gallina con maduro frito', 28),
      dish('Juanes', 'Juane de gallina con frejol', 28), dish('Juanes', 'Juane de gallina con cecina', 38), dish('Juanes', 'Juane de gallina con chorizo', 38),
      dish('Sudados', 'Sudado de doncella', 35), dish('Sudados', 'Sudado de palometa', 35), dish('Sudados', 'Sudado de boquichico', 35),
      dish('Chilcanos', 'Chilcano de carachama', 35), dish('Chilcanos', 'Chilcano de boquichico', 35), dish('Chilcanos', 'Chilcano de palometa', 35), dish('Chilcanos', 'Chilcano de doncella', 35),
    ],
  },
  {
    id: 'especiales-selva', nombre: 'Especiales de la selva', etiqueta: 'Combinaciones amazónicas', imagen: CATEGORY_IMAGES.selva, enfoque: 'selva', theme: 'amazon', items: [
      dish('Frituras', 'Doncella frita', 35), dish('Frituras', 'Palometa frita', 35), dish('Frituras', 'Boquichico frito', 35),
      dish('Platos especiales', 'Cecina a lo pobre', 35), dish('Platos especiales', 'Jalea de cecina', 40), dish('Platos especiales', 'Saltado de cecina', 40),
      dish('Platos especiales', 'Jalea mixta de cecina y chorizo', 40), dish('Platos especiales', 'Tacu tacu con saltado de cecina', 45), dish('Platos especiales', 'Tacu tacu con cecina a lo pobre', 45),
      dish('Combinaciones', 'Combinado: tacacho, cecina y chorizo', 35),
      dish('Combinaciones', 'Especial: juane, tacacho y cecina', 45), dish('Combinaciones', 'Especial: juane, tacacho y chorizo', 45),
      dish('Combinaciones', 'Súper especial: juane, tacacho, cecina y chorizo', 55),
      dish('Combinaciones', 'Piqueo familiar: juane, doncella, tacacho, cecina, chorizo, patacones y maduro frito', 120),
      dish('Piqueo selvático', 'Chaufa de cecina + tacacho con cecina', 55), dish('Piqueo selvático', 'Chaufa de cecina + juane de pollo', 55),
      dish('Piqueo selvático', 'Chaufa mixto + tacacho con cecina', 60), dish('Piqueo selvático', 'Chaufa de cecina + tacacho con cecina y chorizo', 65),
      dish('Piqueo selvático', 'Chaufa mixto + tacacho con cecina y chorizo', 70),
      dish('Arroces', 'Chaufa con cecina', 35), dish('Arroces', 'Chaufa con chorizo', 35), dish('Arroces', 'Chaufa con cecina y chorizo', 40),
    ],
  },
  {
    id: 'bebidas-selva', nombre: 'Bebidas de la selva', etiqueta: 'Frutas amazónicas', imagen: CATEGORY_IMAGES.bebidas, enfoque: 'selva', theme: 'amazon', items: [
      dish('Refrescos · jarra', 'Aguajina', 20), dish('Refrescos · jarra', 'Cocona', 20), dish('Refrescos · jarra', 'Camu camu', 20),
      dish('Refrescos · jarra', 'Chicha morada', 15), dish('Refrescos · jarra', 'Piña', 20), dish('Refrescos · jarra', 'Maracuyá', 15),
      dish('Refrescos · 1/2 litro', 'Aguajina', 10), dish('Refrescos · 1/2 litro', 'Cocona', 10), dish('Refrescos · 1/2 litro', 'Camu camu', 10),
      dish('Refrescos · 1/2 litro', 'Chicha morada', 8), dish('Refrescos · 1/2 litro', 'Piña', 10), dish('Refrescos · 1/2 litro', 'Maracuyá', 8),
      dish('Frozen · jarra', 'Aguajina frozen', 25), dish('Frozen · jarra', 'Cocona frozen', 25), dish('Frozen · jarra', 'Camu camu frozen', 25),
      dish('Frozen · jarra', 'Chicha morada frozen', 20), dish('Frozen · jarra', 'Limonada frozen', 20), dish('Frozen · jarra', 'Piña frozen', 20), dish('Frozen · jarra', 'Maracuyá frozen', 20),
      dish('Frozen · 1/2 litro', 'Aguajina frozen', 13), dish('Frozen · 1/2 litro', 'Cocona frozen', 13), dish('Frozen · 1/2 litro', 'Camu camu frozen', 13),
      dish('Frozen · 1/2 litro', 'Chicha morada frozen', 10), dish('Frozen · 1/2 litro', 'Limonada frozen', 10), dish('Frozen · 1/2 litro', 'Piña frozen', 10), dish('Frozen · 1/2 litro', 'Maracuyá frozen', 10),
      dish('Gustitos', 'Rosquitas de yuca salada', 2.5), dish('Gustitos', 'Ñuto de yuca dulce', 2.5),
      dish('Licores aperitivos', 'Pisco sour', 15), dish('Licores aperitivos', 'Chilcano', 15),
      dish('Licores exóticos · botella', 'RC', 30), dish('Licores exóticos · botella', 'Uvachado', 30), dish('Licores exóticos · botella', '7 raíces', 30),
      dish('Licores exóticos · 1/2 litro', 'RC', 15), dish('Licores exóticos · 1/2 litro', 'Uvachado', 15), dish('Licores exóticos · 1/2 litro', '7 raíces', 15),
    ],
  },
  {
    id: 'desayunos', nombre: 'Desayunos', etiqueta: 'Desde temprano', imagen: CATEGORY_IMAGES.desayunos, enfoque: 'criollo', theme: 'daily', items: [
      dish('Jugos solos', 'Jugo de papaya', 8), dish('Jugos solos', 'Jugo de fresa', 8), dish('Jugos solos', 'Jugo de piña', 8),
      dish('Jugos solos', 'Jugo de melón', 8), dish('Jugos solos', 'Jugo de mango', 8), dish('Jugos solos', 'Jugo de plátano', 8), dish('Jugos solos', 'Jugo surtido', 10),
      dish('Batidos con leche', 'Batido de fresa', 10), dish('Batidos con leche', 'Batido de papaya', 10), dish('Batidos con leche', 'Batido de plátano', 10),
      dish('Batidos con leche', 'Batido de mango', 10), dish('Batidos con leche', 'Batido de melón', 10),
      dish('Sándwiches', 'Pan con chicharrón', 10), dish('Sándwiches', 'Pan con tamal', 8), dish('Sándwiches', 'Pan con huevo revuelto', 8),
      dish('Sándwiches', 'Pollo a la plancha', 8), dish('Sándwiches', 'Pollo deshilachado', 8), dish('Sándwiches', 'Huevo frito', 4),
      dish('Sándwiches', 'Jamón y queso', 5), dish('Sándwiches', 'Pan con mermelada', 5), dish('Sándwiches', 'Pan con mantequilla', 4), dish('Sándwiches', 'Pan con palta', 4),
      dish('Bebidas calientes', 'Café con leche', 5), dish('Bebidas calientes', 'Café', 4),
      dish('Bebidas calientes', 'Infusión de manzanilla', 2.5), dish('Bebidas calientes', 'Té', 2.5), dish('Bebidas calientes', 'Anís', 2.5),
    ],
  },
  {
    id: 'menu-dia', nombre: 'Menús', etiqueta: 'Incluyen una entrada', imagen: CATEGORY_IMAGES.menu, enfoque: 'criollo', theme: 'daily', items: [
      dish('Segundos', 'Pollo al horno con puré', 15), dish('Segundos', 'Seco de ternera con frejol', 16), dish('Segundos', 'Seco de ternera con yuca', 16), dish('Segundos', 'Pollo a la plancha con frejol', 14),
      dish('Segundos', 'Pollo a la plancha con puré', 15), dish('Segundos', 'Asado de res con puré', 20), dish('Segundos', 'Asado de res con frejol', 20),
      dish('Segundos', 'Arroz chaufa de cecina', 25), dish('Segundos', 'Arroz chaufa de chorizo', 25),
      dish('Segundos', 'Arroz chaufa de pollo', 20), dish('Segundos', 'Arroz chaufa de carne', 20), dish('Segundos', 'Costillar dorado con papa sancochada', 25),
      dish('Segundos', 'Pollo a la plancha con papa frita y ensalada', 17), dish('Segundos', 'Milanesa de pollo con papa frita y ensalada', 17),
      dish('Segundos', 'Chuleta de chancho con papas fritas y ensalada', 17), dish('Segundos', 'Churrasco a la parrilla con papa frita y ensalada', 18),
      dish('Segundos', 'Bonito frito con frejol', 12), dish('Segundos', 'Bonito frito con yuca', 12), dish('Segundos', 'Bisteck a la parrilla con papa frita y ensalada', 20),
      dish('Segundos', 'Bisteck a lo pobre', 25), dish('Segundos', 'Pechuga a lo pobre', 25), dish('Segundos', 'Arroz con pato', 35),
      dish('Segundos', 'Trucha frita con yuca', 20), dish('Segundos', 'Trucha frita con frejol', 20),
      dish('Segundos', 'Picante de cuy con papa sancochada', 25), dish('Segundos', 'Cuy frito con papa sancochada', 25), dish('Segundos', 'Arroz tapado a lo pobre', 20),
      dish('Segundos', 'Macarrón de carne', 17), dish('Segundos', 'Cecina a lo pobre', 28), dish('Segundos', 'Pollo broaster con papa frita y ensalada', 22),
      dish('Segundos', 'Chicharrón de pollo con papas fritas y ensalada', 22), dish('Segundos', 'Saltado de pollo', 22), dish('Segundos', 'Lomo saltado de carne', 25),
      dish('Segundos', 'Tallarín saltado de carne', 25), dish('Segundos', 'Tallarín saltado de pollo', 25),
      dish('Segundos', 'Tallarín verde con pechuga', 30), dish('Segundos', 'Tallarín verde con bisteck', 30),
      dish('Segundos', 'Tallarín a la huancaína con pechuga', 30), dish('Segundos', 'Tallarín a la huancaína con bisteck', 30), dish('Segundos', 'Tallarín a lo Alfredo con pechuga', 25),
      dish('Platos a lo pobre', 'Arroz chaufa de pollo a lo pobre', 25), dish('Platos a lo pobre', 'Milanesa de pollo a lo pobre', 25),
      dish('Platos a lo pobre', 'Chuleta de chancho a lo pobre', 25), dish('Platos a lo pobre', 'Churrasco a la parrilla a lo pobre', 25),
      dish('Platos a lo pobre', 'Pechuga a lo pobre', 25), dish('Platos a lo pobre', 'Bisteck a lo pobre', 25), dish('Platos a lo pobre', 'Cecina a lo pobre', 28),
      dish('Platos a lo pobre', 'Arroz chaufa de chorizo a lo pobre', 28), dish('Platos a lo pobre', 'Arroz chaufa de cecina a lo pobre', 28),
      dish('Platos a lo pobre', 'Arroz chaufa de carne a lo pobre', 28), dish('Platos a lo pobre', 'Arroz chaufa mixto de carne a lo pobre', 28),
    ],
  },
  {
    id: 'dietas', nombre: 'Comida saludable', etiqueta: 'Dietas', imagen: CATEGORY_IMAGES.saludable, enfoque: 'criollo', theme: 'daily', items: [
      dish('Dietas', 'Sopa dieta con trozos de pollo, cabello de ángel y papa amarilla', 20),
      dish('Dietas', 'Pechuga a la plancha con ensalada fresca y papa sancochada', 25),
      dish('Dietas', 'Pechuga a la plancha con ensalada fresca y arroz', 25),
      dish('Dietas', 'Pechuga a la plancha con ensalada cocida y papa sancochada', 25),
      dish('Dietas', 'Pechuga a la plancha con ensalada cocida y arroz', 25),
      dish('Dietas', 'Ensalada Crucero con pollo a la plancha en trozos y palta', 25), dish('Dietas', 'Ensalada fresca con atún', 25),
      dish('Dietas', 'Filete de pescado al vapor con ensalada cocida y arroz', 25),
      dish('Dietas', 'Filete de pescado al vapor con ensalada cocida y papa sancochada', 25),
      dish('Dietas', 'Filete de pescado al vapor con ensalada fresca y arroz', 25),
      dish('Dietas', 'Filete de pescado al vapor con ensalada fresca y papa sancochada', 25),
      dish('Dietas', 'Filete de pescado a la plancha con ensalada cocida y arroz', 25),
      dish('Dietas', 'Filete de pescado a la plancha con ensalada cocida y papa sancochada', 25),
      dish('Dietas', 'Filete de pescado a la plancha con ensalada fresca y arroz', 25),
      dish('Dietas', 'Filete de pescado a la plancha con ensalada fresca y papa sancochada', 25),
      dish('Dietas', 'Churrasco a la parrilla con ensalada cocida y arroz', 25),
      dish('Dietas', 'Churrasco a la parrilla con ensalada cocida y papa sancochada', 25),
      dish('Dietas', 'Churrasco a la parrilla con ensalada fresca y arroz', 25),
      dish('Dietas', 'Churrasco a la parrilla con ensalada fresca y papa sancochada', 25),
    ],
  },
  {
    id: 'bebidas', nombre: 'Bebidas', etiqueta: 'Frías y calientes', imagen: CATEGORY_IMAGES.bebidas, enfoque: 'mar', theme: 'marine', items: [
      dish('Refrescos · 1 litro', 'Chicha morada', 15), dish('Refrescos · 1 litro', 'Maracuyá', 16), dish('Refrescos · 1 litro', 'Aguaje', 20),
      dish('Refrescos · 1 litro', 'Cocona', 20), dish('Refrescos · 1 litro', 'Camu camu', 20), dish('Refrescos · 1 litro', 'Piña', 16),
      dish('Refrescos · 1/2 litro', 'Chicha morada', 8), dish('Refrescos · 1/2 litro', 'Maracuyá', 8), dish('Refrescos · 1/2 litro', 'Aguaje', 10),
      dish('Refrescos · 1/2 litro', 'Cocona', 10), dish('Refrescos · 1/2 litro', 'Camu camu', 10), dish('Refrescos · 1/2 litro', 'Piña', 8),
      dish('Frozen · 1 litro', 'Chicha frozen', 20), dish('Frozen · 1 litro', 'Maracuyá frozen', 25), dish('Frozen · 1 litro', 'Aguaje frozen', 25),
      dish('Frozen · 1 litro', 'Cocona frozen', 25), dish('Frozen · 1 litro', 'Camu camu frozen', 25), dish('Frozen · 1 litro', 'Piña frozen', 20),
      dish('Infusiones', 'Té', 2.5), dish('Infusiones', 'Anís', 2.5), dish('Infusiones', 'Manzanilla', 2.5), dish('Infusiones', 'Mate', 4), dish('Infusiones', 'Café', 5), dish('Infusiones', 'Café con leche', 5),
      dish('Bebidas frías', 'Gaseosa descartable de 1.5 litros', 12), dish('Bebidas frías', 'Gaseosa descartable de 1 litro', 10),
      dish('Bebidas frías', 'Gaseosa descartable de 1/2 litro', 4), dish('Bebidas frías', 'Gaseosa retornable de 1/2 litro', 4), dish('Bebidas frías', 'Agua mineral', 4),
      dish('Cervezas', 'Cerveza negra · 310 ml', 10), dish('Cervezas', 'Cerveza de trigo · 310 ml', 10), dish('Cervezas', 'Pilsen', 12), dish('Cervezas', 'Corona', 10), dish('Cervezas', 'Heineken', 10), dish('Cervezas', 'Pilsener lata', 7),
      dish('Vinos y cocteles', 'Vino Borgoña seco', 30), dish('Vinos y cocteles', 'Vino Borgoña semiseco', 30), dish('Vinos y cocteles', 'Vino Borgoña Magdalena', 30),
      dish('Vinos y cocteles', 'Pisco sour', 15), dish('Vinos y cocteles', 'Chilcano', 15),
    ],
  },
];

const MENU_ENTRADAS_CATEGORY: Category = {
  id: 'entradas-menu',
  nombre: 'Elige una entrada',
  etiqueta: 'Incluidas en tu menú',
  imagen: CATEGORY_IMAGES.menu,
  enfoque: 'criollo',
  theme: 'daily',
  items: [
    ...MENU_ENTRADAS.map(nombre => ({ grupo: 'Elige una entrada', nombre, precio: 'Incluida con tu menú' })),
  ],
};

const MENU_CATEGORY = CATALOG_CATEGORIES.find(category => category.id === 'menu-dia')!;

export const DEFAULT_MENU_DATA: Category[] = [
  MENU_ENTRADAS_CATEGORY,
  MENU_CATEGORY,
  ...CATALOG_CATEGORIES.filter(category => category.id !== 'menu-dia'),
];
