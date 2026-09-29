import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

// Transpile menuData.ts to a temporary mjs file
const result = await esbuild.build({
  entryPoints: ['src/data/menuData.ts'],
  bundle: true,
  format: 'esm',
  write: false,
  target: 'node18'
});

const code = result.outputFiles[0].text;
const tempFile = path.resolve('temp_menu_data.mjs');
fs.writeFileSync(tempFile, code, 'utf8');

const { DEFAULT_MENU_DATA, MENU_ENTRADAS } = await import(`file://${tempFile}`);

fs.unlinkSync(tempFile);

console.log('Categories count:', DEFAULT_MENU_DATA.length);
console.log('Entradas count:', MENU_ENTRADAS.length);

function escapeCsv(val) {
  if (val === undefined || val === null) return '';
  const str = String(val).trim();
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatCsvPrice(val) {
  if (val === undefined || val === null || val === '') return '';
  const cleanStr = String(val).replace('S/.', '').trim();
  const num = parseFloat(cleanStr);
  if (isNaN(num)) return cleanStr;
  return num % 1 === 0 ? String(Math.round(num)) : String(num);
}

// 1. categorias.csv
const realCategories = DEFAULT_MENU_DATA.filter(c => c.id !== 'entradas-menu');
const catLines = ['nombre,etiqueta,activo'];
realCategories.forEach(c => {
  catLines.push([escapeCsv(c.nombre), escapeCsv(c.etiqueta), 'SI'].join(','));
});
fs.writeFileSync('categorias.csv', catLines.join('\n') + '\n', 'utf8');
console.log('Generated categorias.csv with', realCategories.length, 'categories');

// 2. menu.csv
// Contains Entradas and Menu dishes (category 'menu-dia')
const menuCategory = DEFAULT_MENU_DATA.find(c => c.id === 'menu-dia');
const menuLines = ['tipo,nombre,precio,grupo,nota,activo'];

MENU_ENTRADAS.forEach(entrada => {
  menuLines.push(['Entrada', escapeCsv(entrada), '', '', '', 'SI'].join(','));
});

if (menuCategory) {
  menuCategory.items.forEach(dish => {
    menuLines.push(['Plato', escapeCsv(dish.nombre), formatCsvPrice(dish.precio), escapeCsv(dish.grupo || 'Segundos'), escapeCsv(dish.nota || ''), 'SI'].join(','));
  });
}
fs.writeFileSync('menu.csv', menuLines.join('\n') + '\n', 'utf8');
console.log('Generated menu.csv with', MENU_ENTRADAS.length, 'entradas and', menuCategory ? menuCategory.items.length : 0, 'menu dishes');

// 3. platos.csv
// Contains all dishes from all OTHER categories
const platosLines = ['categoria,nombre,precio,grupo,nota,activo'];
let dishCount = 0;
DEFAULT_MENU_DATA.filter(c => c.id !== 'entradas-menu' && c.id !== 'menu-dia').forEach(category => {
  category.items.forEach(dish => {
    dishCount++;
    platosLines.push([
      escapeCsv(category.nombre),
      escapeCsv(dish.nombre),
      formatCsvPrice(dish.precio),
      escapeCsv(dish.grupo || ''),
      escapeCsv(dish.nota || ''),
      'SI'
    ].join(','));
  });
});
fs.writeFileSync('platos.csv', platosLines.join('\n') + '\n', 'utf8');
console.log('Generated platos.csv with', dishCount, 'dishes across all categories');
