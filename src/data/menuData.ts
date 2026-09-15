export interface Dish {
  nombre: string;
  precio: string;
}

export interface Category {
  id: string;
  nombre: string;
  imagen: string;
  items: Dish[];
}

const price = (value: number) => `S/. ${value.toFixed(2)}`;

export const DEFAULT_MENU_DATA: Category[] = [
  { id: 'carta', nombre: 'Carta', imagen: '/images/trucha.jpg', items: [
    { nombre: 'Trucha frita', precio: price(15) }, { nombre: 'Sudado de trucha', precio: price(25) },
    { nombre: 'Parihuela de trucha', precio: price(30) }, { nombre: 'Chilcano de trucha', precio: price(10) },
  ]},
  { id: 'ceviche', nombre: 'Ceviche', imagen: '/images/ceviche.jpg', items: [
    { nombre: 'Ceviche de trucha', precio: price(20) }, { nombre: 'Ceviche de trucha clásico', precio: price(18) },
    { nombre: 'Ceviche mixto de trucha', precio: price(25) }, { nombre: 'Ceviche de trucha con cushuro', precio: price(18) }, { nombre: 'Leche de tigre', precio: price(15) },
  ]},
  { id: 'cevichocho', nombre: 'Cevichocho', imagen: '/images/cevichocho.jpg', items: [
    { nombre: 'Cevichocho de trucha', precio: price(15) }, { nombre: 'Cevichoclo de trucha', precio: price(15) },
    { nombre: 'Cevicushurito de trucha', precio: price(15) }, { nombre: 'Chocho clásico', precio: price(8) }, { nombre: 'Chocho acevichado', precio: price(8) },
  ]},
  { id: 'chicharron', nombre: 'Chicharrón', imagen: '/images/chicharron.jpg', items: [
    { nombre: 'Chicharrón de trucha', precio: price(18) }, { nombre: 'Jalea mixta de trucha', precio: price(25) },
    { nombre: 'Chicharrón de pota', precio: price(15) }, { nombre: 'Chicharrón de pota clásico', precio: price(12) },
  ]},
  { id: 'combos', nombre: 'Combos', imagen: '/images/combos.jpg', items: [
    { nombre: 'Dúo marino: ceviche de trucha + chicharrón de pota', precio: price(18) },
    { nombre: 'Dúo marino: ceviche de trucha + chicharrón de trucha', precio: price(22) },
    { nombre: 'Dúo marino: ceviche de trucha + jalea mixta', precio: price(25) },
    { nombre: 'Dúo marino: ceviche de trucha + arroz con mariscos', precio: price(25) },
    { nombre: 'Trío marino: ceviche + chicharrón de trucha + arroz con mariscos', precio: price(30) }, { nombre: 'Chaufa de mariscos', precio: price(15) },
  ]},
];
