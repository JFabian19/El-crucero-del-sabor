import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronRight, Copy, MapPin, Minus, Phone, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Category, DEFAULT_MENU_DATA, Dish, MENU_ENTRADAS } from './data/menuData';
import { loadMenuFromGoogleSheets } from './services/googleSheets';

const WHATSAPP_NUMBER = '987482888';
const WHATSAPP_LINK_NUMBER = `51${WHATSAPP_NUMBER}`;
const WHATSAPP_DISPLAY = '987 482 888';
const YAPE_NUMBER = '976219120';
type OrderDetails = { entrada: string; notaPedido: string };
type CartItem = Dish & OrderDetails & { id: string; cantidad: number };
const numericPrice = (value: string) => Number(value.replace(',', '.').match(/\d+(?:\.\d+)?/)?.[0] ?? 0);
const formatMoney = (value: number) => value % 1 === 0 ? `S/. ${value}` : `S/. ${value.toFixed(2)}`;

export default function App() {
  const [menuData, setMenuData] = useState<Category[]>(DEFAULT_MENU_DATA);
  const [menuEntradas, setMenuEntradas] = useState<string[]>([...MENU_ENTRADAS]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [copiedYape, setCopiedYape] = useState(false);
  const [activeCategory, setActiveCategory] = useState(DEFAULT_MENU_DATA[0].id);
  const [dishToCustomize, setDishToCustomize] = useState<{ dish: Dish; isMenu: boolean } | null>(null);
  const [selectedEntrada, setSelectedEntrada] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const count = useMemo(() => cart.reduce((sum, item) => sum + item.cantidad, 0), [cart]);
  const total = useMemo(() => cart.reduce((sum, item) => sum + numericPrice(item.precio) * item.cantidad, 0), [cart]);

  // Carga automática desde Google Sheets al iniciar
  useEffect(() => {
    let isMounted = true;
    loadMenuFromGoogleSheets()
      .then(result => {
        if (!isMounted || !result) return;
        if (result.categories.length > 0) {
          setMenuData(result.categories);
          setActiveCategory(prev => result.categories.some(c => c.id === prev) ? prev : result.categories[0].id);
        }
        if (result.entradas.length > 0) {
          setMenuEntradas(result.entradas);
        }
      })
      .catch(err => {
        console.warn('No se pudo sincronizar con Google Sheets, usando carta local:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const add = (dish: Dish, details: Partial<OrderDetails> = {}) => setCart(items => {
    const entrada = details.entrada ?? '';
    const notaPedido = details.notaPedido?.trim() ?? '';
    const id = `${dish.nombre}|${dish.precio}|${entrada}|${notaPedido}`;
    const found = items.find(item => item.id === id);
    return found
      ? items.map(item => item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item)
      : [...items, { ...dish, entrada, notaPedido, id, cantidad: 1 }];
  });
  const change = (id: string, delta: number) => setCart(items => items
    .map(item => item.id === id ? { ...item, cantidad: item.cantidad + delta } : item)
    .filter(item => item.cantidad > 0));
  const customizeDish = (dish: Dish, isMenu: boolean) => {
    setDishToCustomize({ dish, isMenu });
    setSelectedEntrada('');
    setOrderNote('');
  };
  const confirmDish = () => {
    if (!dishToCustomize || (dishToCustomize.isMenu && !selectedEntrada)) return;
    add(dishToCustomize.dish, { entrada: selectedEntrada, notaPedido: orderNote });
    setDishToCustomize(null);
  };
  const goTo = (id: string) => {
    setActiveCategory(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const send = () => {
    const lines = cart.map(item => {
      const entrada = item.entrada ? `\n  Entrada: ${item.entrada}` : '';
      const note = item.notaPedido ? `\n  Nota: ${item.notaPedido}` : '';
      return `• ${item.cantidad} x ${item.nombre} (${item.precio})${entrada}${note}`;
    }).join('\n');
    const message = `¡Hola El Crucero del Sabor! Deseo realizar este pedido:\n\n${lines}\n\n*TOTAL: ${formatMoney(total)}*`;
    window.open(`https://wa.me/${WHATSAPP_LINK_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };
  const copyYapeNumber = () => {
    setCopiedYape(true);
    window.setTimeout(() => setCopiedYape(false), 5000);
    const fallbackCopy = () => {
      const field = document.createElement('textarea');
      field.value = YAPE_NUMBER;
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    };
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(YAPE_NUMBER).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  };

  const isMenuCategory = (categoryId: string) => categoryId === 'menu-dia';

  return <div className="site-shell">
    <header className="topbar">
      <a href="#inicio" className="brand" aria-label="Ir al inicio">
        <img src="/images/crucero-logo.webp" alt="" />
        <span><b>El Crucero</b><small>del Sabor</small></span>
      </a>
      <button className="cart-button" onClick={() => count && setShowCart(true)} aria-label="Ver pedido">
        <ShoppingBag size={21}/>{count > 0 && <b>{count}</b>}
      </button>
    </header>

    <main id="inicio">
      <section className="hero" aria-label="El Crucero del Sabor: pescados, mariscos, comida criolla y comida de la selva">
        <img src="/images/crucero-giro.webp" alt="El Crucero del Sabor: pescados y mariscos, comida criolla y comida de la selva" />
      </section>
      <div className="trust-strip"><span>Pescados y mariscos</span><i>•</i><span>Comida criolla</span><i>•</i><span>Comida de la selva</span></div>

      <nav className="category-nav" aria-label="Categorías del menú">
        {menuData.map(category => <button onClick={() => goTo(category.id)} className={`${activeCategory === category.id ? 'active ' : ''}${category.theme}`} key={category.id}>{category.nombre}</button>)}
      </nav>

      <div className="menu">
        {menuData.map((category, categoryIndex) => {
          const isFirstAmazon = category.theme === 'amazon' && (categoryIndex === 0 || menuData[categoryIndex - 1].theme !== 'amazon');
          const isMenu = isMenuCategory(category.id);

          return <section id={category.id} className={`menu-section theme-${category.theme}`} key={category.id}>
            {isFirstAmazon && <div className="region-break"><span>Desde aquí</span><strong>Sabores de nuestra Amazonía</strong></div>}
            <div className={`category-banner focus-${category.enfoque}`}>
              <img src={category.imagen} alt="" loading="lazy" decoding="async" />
              <div><span>{category.etiqueta}</span><h2>{category.nombre}</h2><small>{category.items.length} opciones</small></div>
            </div>
            {isMenu && <div className="menu-order-note"><Check size={19}/><div><b>Tu menú se arma a tu gusto</b><span>Selecciona un plato, elige una entrada y agrega una nota si la necesitas.</span></div></div>}
            <div className="dish-list">
              {category.items.map((item, index) => {
                const previousGroup = index > 0 ? category.items[index - 1].grupo : undefined;
                const orderable = numericPrice(item.precio) > 0;
                return <div key={`${item.nombre}-${item.precio}-${index}`}>
                  {item.grupo && item.grupo !== previousGroup && <h3 className="group-title">{item.grupo}</h3>}
                  <article className="dish">
                    <div className="dish-copy"><h4>{item.nombre}</h4>{item.nota && <span>{item.nota}</span>}</div>
                    <div className="dish-action"><strong className={!orderable ? 'included' : ''}>{item.precio}</strong>{orderable && <button onClick={() => customizeDish(item, isMenu)} aria-label={`Agregar ${item.nombre} y escribir una nota`}><Plus size={17}/></button>}</div>
                  </article>
                </div>;
              })}
            </div>
          </section>;
        })}
      </div>

      <section className="delivery">
        <MapPin size={23}/><div><b>Visítanos o pide por WhatsApp</b><p>Jr. Hipólito Unanue 1534, La Victoria · Frente al parque Cánepa</p></div>
        <a href={`https://wa.me/${WHATSAPP_LINK_NUMBER}`} target="_blank" rel="noreferrer"><Phone size={15}/> Pedir</a>
      </section>

      <section className="yape-payment" aria-labelledby="yape-title">
        <div className="yape-heading">
          <span>Pago rápido y seguro</span>
          <h2 id="yape-title">Paga aquí con Yape</h2>
          <p>Escanea el QR o copia el número para completar tu pago.</p>
        </div>
        <div className="yape-visual">
          <img src="/images/yape-qr.webp" alt="Código QR de Yape para pagar al número 976 219 120" loading="lazy" decoding="async" />
          <div className="yape-number-card">
            <div><small>Número Yape</small><strong>976 219 120</strong></div>
            <button type="button" onClick={copyYapeNumber} className={copiedYape ? 'copied' : ''} aria-live="polite">
              {copiedYape ? <Check size={18}/> : <Copy size={18}/>}
              {copiedYape ? 'Copiado' : 'Copiar número'}
            </button>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <img src="/images/crucero-logo.webp" alt="El Crucero del Sabor" />
      <p>Pescados · Mariscos · Comida criolla · Comida de la selva</p>
      <small>Jr. Hipólito Unanue 1534, La Victoria · {WHATSAPP_DISPLAY}</small>
    </footer>

    <AnimatePresence>{count > 0 && !showCart && <motion.button initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} onClick={() => setShowCart(true)} className="floating-cart"><span><ShoppingBag size={19}/> {count} {count === 1 ? 'producto' : 'productos'}</span><b>{formatMoney(total)} <ChevronRight size={17}/></b></motion.button>}</AnimatePresence>
    <AnimatePresence>{dishToCustomize && <motion.div className="cart-overlay menu-customizer-overlay" role="dialog" aria-modal="true" aria-labelledby="customizer-title" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setDishToCustomize(null)}>
      <motion.div className="menu-customizer" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} onClick={event => event.stopPropagation()}>
        <div className="panel-head"><div><span>{dishToCustomize.isMenu ? 'Completa tu menú' : 'Personaliza tu pedido'}</span><h2 id="customizer-title">{dishToCustomize.isMenu ? 'Elige una entrada y agrega una nota' : 'Agrega una nota'}</h2></div><button onClick={() => setDishToCustomize(null)} aria-label="Cerrar selección"><X/></button></div>
        <div className="customizer-fields">
          <div className="selected-menu"><span>Plato seleccionado</span><b>{dishToCustomize.dish.nombre}</b><strong>{dishToCustomize.dish.precio}</strong></div>
          {dishToCustomize.isMenu && <fieldset className="choice-group"><legend>Elige una entrada</legend><div className="choice-grid">
            {menuEntradas.map(entrada => <button type="button" className={selectedEntrada === entrada ? 'selected' : ''} aria-pressed={selectedEntrada === entrada} onClick={() => setSelectedEntrada(entrada)} key={entrada}>{selectedEntrada === entrada && <Check size={16}/>}<span>{entrada}</span></button>)}
          </div></fieldset>}
          <label className="order-note"><span>Nota para este plato (opcional)</span><textarea value={orderNote} onChange={event => setOrderNote(event.target.value)} maxLength={180} placeholder="Ej.: sin arroz, sin cebolla, salsa aparte…" autoFocus={!dishToCustomize.isMenu}/><small>{orderNote.length}/180</small></label>
        </div>
        <button className="add-custom-menu" disabled={dishToCustomize.isMenu && !selectedEntrada} onClick={confirmDish}><ShoppingBag size={18}/> Agregar al pedido</button>
      </motion.div>
    </motion.div>}</AnimatePresence>
    <AnimatePresence>{showCart && <motion.div className="cart-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowCart(false)}>
      <motion.div className="cart-panel" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} onClick={e => e.stopPropagation()}>
        <div className="panel-head"><div><span>Tu selección</span><h2>Mi pedido</h2></div><button onClick={() => setShowCart(false)} aria-label="Cerrar pedido"><X/></button></div>
        <div className="cart-lines">{cart.map(item => <div className="cart-line" key={item.id}><div><b>{item.nombre}</b>{item.entrada && <small>Entrada: {item.entrada}</small>}{item.notaPedido && <small>Nota: {item.notaPedido}</small>}<span>{item.precio}</span></div><div className="quantity"><button onClick={() => change(item.id,-1)} aria-label="Quitar uno"><Minus size={15}/></button><b>{item.cantidad}</b><button onClick={() => change(item.id,1)} aria-label="Agregar uno"><Plus size={15}/></button><button className="remove" onClick={() => change(item.id,-item.cantidad)} aria-label="Eliminar"><Trash2 size={16}/></button></div></div>)}</div>
        <div className="total"><span>Total</span><b>{formatMoney(total)}</b></div>
        <button className="whatsapp" onClick={send}>Enviar pedido por WhatsApp <ChevronRight/></button>
      </motion.div>
    </motion.div>}</AnimatePresence>
  </div>;
}
