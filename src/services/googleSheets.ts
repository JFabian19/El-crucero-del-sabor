import Papa from 'papaparse';
import { Category, DEFAULT_MENU_DATA, Dish, MENU_ENTRADAS, MenuTheme } from '../data/menuData';

// ID de la hoja de cálculo de Google Sheets
export const SHEET_ID = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_SHEET_ID) || '1Jqjv7COXhyDsrJf5kVHWl9dq7dTsXkYmLwiXfB6qy9Y';

export interface ParsedMenuResult {
  categories: Category[];
  entradas: string[];
  isLive: boolean;
}

// Configuración visual por defecto para las categorías conocidas
const CATEGORY_METADATA: Record<string, { id: string; etiqueta: string; imagen: string; enfoque: 'mar' | 'criollo' | 'selva'; theme: MenuTheme }> = {
  'platos marinos': { id: 'marinos', etiqueta: 'Pescados y mariscos', imagen: '/images/category-marinos.webp', enfoque: 'mar', theme: 'marine' },
  'pescados y sudados': { id: 'pescados', etiqueta: 'Del mar a la mesa', imagen: '/images/category-frituras.webp', enfoque: 'mar', theme: 'marine' },
  'duos marinos': { id: 'duos', etiqueta: 'Para compartir', imagen: '/images/category-frituras.webp', enfoque: 'mar', theme: 'marine' },
  'trios marinos': { id: 'trios', etiqueta: 'Combinaciones marinas', imagen: '/images/category-frituras.webp', enfoque: 'mar', theme: 'marine' },
  'clasicos marinos': { id: 'clasicos', etiqueta: 'Favoritos de la casa', imagen: '/images/category-marinos.webp', enfoque: 'mar', theme: 'marine' },
  'platos criollos': { id: 'criollos', etiqueta: 'Sazón peruana', imagen: '/images/category-criollos.webp', enfoque: 'criollo', theme: 'criollo' },
  'sopas y tradicionales': { id: 'tradicionales', etiqueta: 'Cocina criolla', imagen: '/images/category-criollos.webp', enfoque: 'criollo', theme: 'criollo' },
  'platos de la selva': { id: 'selva', etiqueta: 'Sabor amazónico', imagen: '/images/category-selva.webp', enfoque: 'selva', theme: 'amazon' },
  'especiales de la selva': { id: 'especiales-selva', etiqueta: 'Combinaciones amazónicas', imagen: '/images/category-selva.webp', enfoque: 'selva', theme: 'amazon' },
  'bebidas de la selva': { id: 'bebidas-selva', etiqueta: 'Frutas amazónicas', imagen: '/images/category-bebidas.webp', enfoque: 'selva', theme: 'amazon' },
  'desayunos': { id: 'desayunos', etiqueta: 'Desde temprano', imagen: '/images/category-desayunos.webp', enfoque: 'criollo', theme: 'daily' },
  'menus': { id: 'menu-dia', etiqueta: 'Incluyen una entrada', imagen: '/images/category-menu.webp', enfoque: 'criollo', theme: 'daily' },
  'menu': { id: 'menu-dia', etiqueta: 'Incluyen una entrada', imagen: '/images/category-menu.webp', enfoque: 'criollo', theme: 'daily' },
  'menu del dia': { id: 'menu-dia', etiqueta: 'Incluyen una entrada', imagen: '/images/category-menu.webp', enfoque: 'criollo', theme: 'daily' },
  'comida saludable': { id: 'dietas', etiqueta: 'Dietas', imagen: '/images/category-saludable.webp', enfoque: 'criollo', theme: 'daily' },
  'dietas': { id: 'dietas', etiqueta: 'Dietas', imagen: '/images/category-saludable.webp', enfoque: 'criollo', theme: 'daily' },
  'bebidas': { id: 'bebidas', etiqueta: 'Frías y calientes', imagen: '/images/category-bebidas.webp', enfoque: 'mar', theme: 'marine' },
};

/**
 * Normaliza un texto eliminando acentos, caracteres especiales y espacios innecesarios
 */
export const normalizeText = (text: any): string => {
  if (text === null || text === undefined) return '';
  return String(text)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Formatea un valor numérico o string como precio en Soles (ej. S/. 15 para enteros, S/. 2.50 para decimales)
 */
export const formatPrice = (val: any): string => {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (!str) return '';

  // Normalizar comas a puntos para detectar decimales
  const normalized = str.replace(',', '.');
  const match = normalized.match(/-?\d+(?:\.\d+)?/);
  if (!match) return str;

  const num = parseFloat(match[0]);
  if (isNaN(num)) return str;

  // Si es entero (ej. 15, 15.0, 15.00), mostrar sin decimales
  if (num % 1 === 0) {
    return `S/. ${Math.round(num)}`;
  }

  // Si tiene decimales (ej. 2.5, 2.50, 12.80), mostrar los decimales
  return `S/. ${num.toFixed(2)}`;
};

/**
 * Comprueba si una fila está marcada como activa
 */
const isRowActive = (row: Record<string, any>): boolean => {
  for (const key of Object.keys(row)) {
    const normKey = normalizeText(key);
    if (['activo', 'disponible', 'estado', 'habilitado'].includes(normKey)) {
      const val = normalizeText(row[key]);
      if (['no', 'false', '0', 'agotado', 'inactivo', 'oculto'].includes(val)) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Busca el valor de una fila comparando contra varios nombres posibles de columna
 */
const getFieldValue = (row: Record<string, any>, possibleKeys: string[]): string => {
  const normalizedKeys = possibleKeys.map(k => normalizeText(k));
  for (const [key, val] of Object.entries(row)) {
    if (normalizedKeys.includes(normalizeText(key))) {
      return val !== null && val !== undefined ? String(val).trim() : '';
    }
  }
  return '';
};

/**
 * Descarga una pestaña de Google Sheets en formato CSV intentando varios nombres posibles
 */
export const fetchSheetCsv = async (sheetNameVariants: string[]): Promise<string | null> => {
  for (const name of sheetNameVariants) {
    try {
      const timestamp = Date.now();
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}&_cb=${timestamp}`;
      const response = await fetch(url);
      if (!response.ok) continue;

      const text = await response.text();
      // Si Google responde con una página de inicio de sesión o permiso denegado:
      if (text.includes('<!DOCTYPE html>') || text.includes('<html') || text.includes('google-signin')) {
        continue;
      }

      if (text.trim().length > 5) {
        return text;
      }
    } catch (err) {
      console.warn(`Error al obtener pestaña "${name}" de Google Sheets:`, err);
    }
  }
  return null;
};

/**
 * Parsea el CSV de la hoja 'Categorias'
 */
interface ParsedCategoryRow {
  nombre: string;
  etiqueta?: string;
  imagen?: string;
  enfoque?: 'mar' | 'criollo' | 'selva';
  theme?: MenuTheme;
}

const parseCategoriasCsv = (csvText: string): ParsedCategoryRow[] => {
  const parsed = Papa.parse<Record<string, any>>(csvText, { header: true, skipEmptyLines: 'greedy' });
  const categories: ParsedCategoryRow[] = [];

  for (const row of parsed.data) {
    if (!isRowActive(row)) continue;
    const nombre = getFieldValue(row, ['nombre', 'categoria', 'categorias', 'nombre categoria']);
    if (!nombre) continue;

    const etiqueta = getFieldValue(row, ['etiqueta', 'subtitulo', 'descripcion', 'tag']) || undefined;
    const imagen = getFieldValue(row, ['imagen', 'url imagen', 'foto']) || undefined;
    const enfoqueVal = normalizeText(getFieldValue(row, ['enfoque', 'region']));
    const enfoque = (['mar', 'criollo', 'selva'].includes(enfoqueVal) ? enfoqueVal : undefined) as 'mar' | 'criollo' | 'selva' | undefined;
    const themeVal = normalizeText(getFieldValue(row, ['theme', 'tema']));
    const theme = (['marine', 'criollo', 'amazon', 'daily'].includes(themeVal) ? themeVal : undefined) as MenuTheme | undefined;

    categories.push({ nombre, etiqueta, imagen, enfoque, theme });
  }

  return categories;
};

/**
 * Parsea el CSV de la hoja 'Menu' (entradas y platos del menú del día)
 * Soporta formato por filas (tipo: Entrada | Plato) y formato por columnas paralelas (Entradas en col A, Platos en col B)
 */
interface ParsedMenuResultPartial {
  entradas: string[];
  dishes: Dish[];
}

const parseMenuCsv = (csvText: string): ParsedMenuResultPartial => {
  const parsed = Papa.parse<Record<string, any>>(csvText, { header: true, skipEmptyLines: 'greedy' });
  const entradas: string[] = [];
  const dishes: Dish[] = [];

  for (const row of parsed.data) {
    if (!isRowActive(row)) continue;

    const tipo = normalizeText(getFieldValue(row, ['tipo', 'tipo de item', 'categoria']));
    const nombre = getFieldValue(row, ['nombre', 'item', 'plato', 'descripcion']);
    const precioRaw = getFieldValue(row, ['precio', 'costo', 'valor']);
    const grupo = getFieldValue(row, ['grupo', 'seccion', 'subgrupo']) || 'Segundos';
    const nota = getFieldValue(row, ['nota', 'detalle', 'observacion']) || undefined;

    // Formato paralelo: columnas "Entrada" / "Entradas"
    const entradaCol = getFieldValue(row, ['entrada', 'entradas']);
    if (entradaCol && !entradas.includes(entradaCol)) {
      entradas.push(entradaCol);
    }

    const platoCol = getFieldValue(row, ['platos', 'platos del menu', 'segundo', 'segundos']);
    if (platoCol) {
      dishes.push({
        nombre: platoCol,
        precio: formatPrice(precioRaw) || 'S/. 15',
        grupo,
        nota,
      });
      continue;
    }

    // Formato estándar por Tipo
    if (tipo.includes('entrada')) {
      if (nombre && !entradas.includes(nombre)) {
        entradas.push(nombre);
      }
    } else if (tipo.includes('plato') || tipo.includes('segundo') || (!tipo && nombre && precioRaw)) {
      if (nombre) {
        dishes.push({
          nombre,
          precio: formatPrice(precioRaw),
          grupo,
          nota,
        });
      }
    } else if (nombre && !precioRaw && !entradas.includes(nombre)) {
      // Si no tiene precio ni tipo, se considera una entrada
      entradas.push(nombre);
    }
  }

  return { entradas, dishes };
};

/**
 * Parsea el CSV de la hoja 'Platos' (todos los demás platos de la carta)
 */
const parsePlatosCsv = (csvText: string): Map<string, Dish[]> => {
  const parsed = Papa.parse<Record<string, any>>(csvText, { header: true, skipEmptyLines: 'greedy' });
  const categoryMap = new Map<string, Dish[]>();

  for (const row of parsed.data) {
    if (!isRowActive(row)) continue;

    const categoria = getFieldValue(row, ['categoria', 'categoría', 'seccion', 'nombre categoria']);
    const nombre = getFieldValue(row, ['nombre', 'plato', 'nombre del plato', 'item']);
    const precioRaw = getFieldValue(row, ['precio', 'costo', 'valor']);
    const grupo = getFieldValue(row, ['grupo', 'subgrupo', 'tipo']) || undefined;
    const nota = getFieldValue(row, ['nota', 'detalle', 'descripcion']) || undefined;

    if (!nombre) continue;

    const normCat = normalizeText(categoria);
    const dish: Dish = {
      nombre,
      precio: formatPrice(precioRaw),
      grupo,
      nota,
    };

    if (!categoryMap.has(normCat)) {
      categoryMap.set(normCat, []);
    }
    categoryMap.get(normCat)!.push(dish);
  }

  return categoryMap;
};

/**
 * Carga completa de la carta desde Google Sheets
 * Si no se puede conectar o no hay datos, retorna null para usar la carta por defecto
 */
export const loadMenuFromGoogleSheets = async (): Promise<ParsedMenuResult | null> => {
  try {
    const [categoriasCsv, menuCsv, platosCsv] = await Promise.all([
      fetchSheetCsv(['Categorias', 'Categorías', 'categorias', 'categorías']),
      fetchSheetCsv(['Menu', 'Menú', 'menu', 'menú', 'Menus', 'Menús']),
      fetchSheetCsv(['Platos', 'platos', 'Carta', 'carta']),
    ]);

    // Si ninguna hoja devolvió datos, no podemos cargar desde Google Sheets
    if (!categoriasCsv && !menuCsv && !platosCsv) {
      console.info('Google Sheets no disponible o sin acceso público. Usando carta local.');
      return null;
    }

    console.info('Conexión con Google Sheets exitosa. Procesando datos...');

    // 1. Procesar Menú del día (Entradas y Platos del menú)
    const menuResult = menuCsv ? parseMenuCsv(menuCsv) : { entradas: [], dishes: [] };
    const finalEntradas = menuResult.entradas.length > 0 ? menuResult.entradas : [...MENU_ENTRADAS];

    // 2. Procesar Categorías
    let categoryRows = categoriasCsv ? parseCategoriasCsv(categoriasCsv) : [];
    if (categoryRows.length === 0) {
      // Usar categorías por defecto si la hoja de categorías no se pudo leer
      categoryRows = DEFAULT_MENU_DATA
        .filter(c => c.id !== 'entradas-menu')
        .map(c => ({
          nombre: c.nombre,
          etiqueta: c.etiqueta,
          imagen: c.imagen,
          enfoque: c.enfoque,
          theme: c.theme,
        }));
    }

    // 3. Procesar Platos de las otras categorías
    const dishesByCat = platosCsv ? parsePlatosCsv(platosCsv) : new Map<string, Dish[]>();

    // 4. Construir la lista final de categorías
    const builtCategories: Category[] = [];

    for (const catRow of categoryRows) {
      const normCatName = normalizeText(catRow.nombre);
      const isMenuCategory = normCatName.includes('menu') || normCatName === 'menus' || normCatName === 'menu del dia';
      const meta = CATEGORY_METADATA[normCatName] || {
        id: normCatName.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        etiqueta: 'Nuestra carta',
        imagen: '/images/category-criollos.webp',
        enfoque: 'criollo',
        theme: 'criollo',
      };

      const catId = isMenuCategory ? 'menu-dia' : (meta.id || normCatName);
      const nombre = catRow.nombre;
      const etiqueta = catRow.etiqueta || meta.etiqueta;
      const imagen = catRow.imagen || meta.imagen;
      const enfoque = catRow.enfoque || meta.enfoque;
      const theme = catRow.theme || meta.theme;

      let items: Dish[] = [];

      if (isMenuCategory) {
        // En la categoría menú van los platos de la hoja 'Menu'
        if (menuResult.dishes.length > 0) {
          items = menuResult.dishes;
        } else {
          // Fallback a los platos del menú por defecto
          const defaultMenuCat = DEFAULT_MENU_DATA.find(c => c.id === 'menu-dia');
          items = defaultMenuCat ? defaultMenuCat.items : [];
        }
      } else {
        // Platos de la hoja 'Platos'
        const sheetDishes = dishesByCat.get(normCatName) || [];
        if (sheetDishes.length > 0) {
          items = sheetDishes;
        } else {
          // Si no hay platos en la hoja para esta categoría, buscar en los datos por defecto
          const defaultCat = DEFAULT_MENU_DATA.find(c => normalizeText(c.nombre) === normCatName || c.id === catId);
          items = defaultCat ? defaultCat.items : [];
        }
      }

      // Solo agregamos la categoría si tiene platos
      if (items.length > 0) {
        builtCategories.push({
          id: catId,
          nombre,
          etiqueta,
          imagen,
          enfoque,
          theme,
          items,
        });
      }
    }

    // 5. Agregar la sección informativa "Elige una entrada" al inicio si hay entradas
    const finalCategories: Category[] = [];

    if (finalEntradas.length > 0) {
      finalCategories.push({
        id: 'entradas-menu',
        nombre: 'Elige una entrada',
        etiqueta: 'Incluidas en tu menú',
        imagen: '/images/category-menu.webp',
        enfoque: 'criollo',
        theme: 'daily',
        items: finalEntradas.map(nombre => ({
          grupo: 'Elige una entrada',
          nombre,
          precio: 'Incluida con tu menú',
        })),
      });
    }

    finalCategories.push(...builtCategories);

    return {
      categories: finalCategories,
      entradas: finalEntradas,
      isLive: true,
    };
  } catch (error) {
    console.error('Error al procesar la carta de Google Sheets:', error);
    return null;
  }
};
