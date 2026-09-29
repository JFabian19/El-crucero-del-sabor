import { useMemo, useState } from 'react';
import { Check, ChevronRight, Copy, MapPin, Minus, Phone, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DEFAULT_MENU_DATA, Dish, MENU_BEBIDAS, MENU_ENTRADAS } from './data/menuData';

const WHATSAPP_NUMBER = '987482888';
const WHATSAPP_LINK_NUMBER = `51${WHATSAPP_NUMBER}`;
const WHATSAPP_DISPLAY = '987 482 888';
const YAPE_NUMBER = '976219120';
type MenuSelection = { entrada: string; bebida: string };
type CartItem = Dish & MenuSelection & { id: string; cantidad: number };
const numericPrice = (value: string) => Number(value.match(/\d+(?:\.\d+)?/)?.[0] ?? 0);

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [copiedYape, setCopiedYape] = useState(false);
  const [activeCategory, setActiveCategory] = useState(DEFAULT_MENU_DATA[0].id);
  const [menuToCustomize, setMenuToCustomize] = useState<Dish | null>(null);
  const [selectedEntrada, setSelectedEntrada] = useState('');
  const [selectedBebida, setSelectedBebida] = useState('');
  const count = useMemo(() => cart.reduce((sum, item) => sum + item.cantidad, 0), [cart]);
  const total = useMemo(() => cart.reduce((sum, item) => sum + numericPrice(item.precio) * item.cantidad, 0), [cart]);

  const add = (dish: Dish, selection: Partial<MenuSelection> = {}) => setCart(items => {
    const entrada = selection.entrada ?? '';
    const bebida = selection.bebida ?? '';
    const id = `${dish.nombre}|${dish.precio}|${entrada}|${bebida}`;
    const found = items.find(item => item.id === id);
    return found
      ? items.map(item => item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item)
      : [...items, { ...dish, entrada, bebida, id, cantidad: 1 }];
  });
  const change = (id: string, delta: number) => setCart(items => items
    .map(item => item.id === id ? { ...item, cantidad: item.cantidad + delta } : item)
    .filter(item => item.cantidad > 0));
  const customizeMenu = (dish: Dish) => {
    setMenuToCustomize(dish);
    setSelectedEntrada('');
    setSelectedBebida('');
  };
  const confirmMenu = () => {
    if (!menuToCustomize || !selectedEntrada || !selectedBebida) return;
    add(menuToCustomize, { entrada: selectedEntrada, bebida: selectedBebida });
    setMenuToCustomize(null);
  };
  const goTo = (id: string) => {
    setActiveCategory(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const send = () => {
    const lines = cart.map(item => {
      const choices = item.entrada && item.bebida ? `\n  Entrada: ${item.entrada}\n  Bebida: ${item.bebida}` : '';
      return `• ${item.cantidad} x ${item.nombre} (${item.precio})${choices}`;
    }).join('\n');
    const message = `¡Hola El Crucero del Sabor! Deseo realizar este pedido:\n\n${lines}\n\n*TOTAL: S/. ${total.toFixed(2)}*`;
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

  return <div className="site-shell">
    <header className="topbar">
      <a href="#inicio" className="brand" aria-label="Ir al inicio">
        <img src="/images/crucero-logo.png" alt="" />
        <span><b>El Crucero</b><small>del Sabor</small></span>
      </a>
      <button className="cart-button" onClick={() => count && setShowCart(true)} aria-label="Ver pedido">
        <ShoppingBag size={21}/>{count > 0 && <b>{count}</b>}
      </button>
    </header>

    <main id="inicio">
      <section className="hero" aria-label="El Crucero del Sabor: pescados, mariscos, comida criolla y comida de la selva">
        <img src="/images/crucero-giro.png" alt="El Crucero del Sabor: pescados y mariscos, comida criolla y comida de la selva" />
      </section>
      <div className="trust-strip"><span>Pescados y mariscos</span><i>•</i><span>Comida criolla</span><i>•</i><span>Comida de la selva</span></div>

      <nav className="category-nav" aria-label="Categorías del menú">
        {DEFAULT_MENU_DATA.map(category => <button onClick={() => goTo(category.id)} className={`${activeCategory === category.id ? 'active ' : ''}${category.theme}`} key={category.id}>{category.nombre}</button>)}
      </nav>

      <div className="menu">
        {DEFAULT_MENU_DATA.map((category, categoryIndex) => <section id={category.id} className={`menu-section theme-${category.theme}`} key={category.id}>
          {categoryIndex === 9 && <div className="region-break"><span>Desde aquí</span><strong>Sabores de nuestra Amazonía</strong></div>}
          <div className={`category-banner focus-${category.enfoque}`}>
            <img src={category.imagen} alt="" loading="lazy" decoding="async" />
            <div><span>{category.etiqueta}</span><h2>{category.nombre}</h2><small>{category.items.length} opciones</small></div>
          </div>
          {category.id === 'menu-dia' && <div className="menu-order-note"><Check size={19}/><div><b>Tu menú se arma a tu gusto</b><span>Selecciona un plato y luego elige una entrada y una bebida.</span></div></div>}
          <div className="dish-list">
            {category.items.map((item, index) => {
              const previousGroup = index > 0 ? category.items[index - 1].grupo : undefined;
              const orderable = numericPrice(item.precio) > 0;
              return <div key={`${item.nombre}-${item.precio}-${index}`}>
                {item.grupo && item.grupo !== previousGroup && <h3 className="group-title">{item.grupo}</h3>}
                <article className="dish">
                  <div className="dish-copy"><h4>{item.nombre}</h4>{item.nota && <span>{item.nota}</span>}</div>
                  <div className="dish-action"><strong className={!orderable ? 'included' : ''}>{item.precio}</strong>{orderable && <button onClick={() => category.id === 'menu-dia' ? customizeMenu(item) : add(item)} aria-label={category.id === 'menu-dia' ? `Seleccionar ${item.nombre}` : `Agregar ${item.nombre}`}><Plus size={17}/></button>}</div>
                </article>
              </div>;
            })}
          </div>
        </section>)}
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
          <img src="/images/yape-qr.png" alt="Código QR de Yape para pagar al número 976 219 120" loading="lazy" decoding="async" />
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
      <img src="/images/crucero-logo.png" alt="El Crucero del Sabor" />
      <p>Pescados · Mariscos · Comida criolla · Comida de la selva</p>
      <small>Jr. Hipólito Unanue 1534, La Victoria · {WHATSAPP_DISPLAY}</small>
    </footer>

    <AnimatePresence>{count > 0 && !showCart && <motion.button initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} onClick={() => setShowCart(true)} className="floating-cart"><span><ShoppingBag size={19}/> {count} {count === 1 ? 'producto' : 'productos'}</span><b>S/. {total.toFixed(2)} <ChevronRight size={17}/></b></motion.button>}</AnimatePresence>
    <AnimatePresence>{menuToCustomize && <motion.div className="cart-overlay menu-customizer-overlay" role="dialog" aria-modal="true" aria-labelledby="customizer-title" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setMenuToCustomize(null)}>
      <motion.div className="menu-customizer" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} onClick={event => event.stopPropagation()}>
        <div className="panel-head"><div><span>Completa tu menú</span><h2 id="customizer-title">Elige tu entrada y bebida</h2></div><button onClick={() => setMenuToCustomize(null)} aria-label="Cerrar selección"><X/></button></div>
        <div className="selected-menu"><span>Plato seleccionado</span><b>{menuToCustomize.nombre}</b><strong>{menuToCustomize.precio}</strong></div>
        <fieldset className="choice-group"><legend>1. Elige una entrada</legend><div className="choice-grid">
          {MENU_ENTRADAS.map(entrada => <button type="button" className={selectedEntrada === entrada ? 'selected' : ''} aria-pressed={selectedEntrada === entrada} onClick={() => setSelectedEntrada(entrada)} key={entrada}>{selectedEntrada === entrada && <Check size={16}/>}<span>{entrada}</span></button>)}
        </div></fieldset>
        <fieldset className="choice-group"><legend>2. Elige una bebida</legend><div className="choice-grid">
          {MENU_BEBIDAS.map(bebida => <button type="button" className={selectedBebida === bebida ? 'selected' : ''} aria-pressed={selectedBebida === bebida} onClick={() => setSelectedBebida(bebida)} key={bebida}>{selectedBebida === bebida && <Check size={16}/>}<span>{bebida}</span></button>)}
        </div></fieldset>
        <button className="add-custom-menu" disabled={!selectedEntrada || !selectedBebida} onClick={confirmMenu}><ShoppingBag size={18}/> Agregar menú al pedido</button>
      </motion.div>
    </motion.div>}</AnimatePresence>
    <AnimatePresence>{showCart && <motion.div className="cart-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowCart(false)}>
      <motion.div className="cart-panel" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} onClick={e => e.stopPropagation()}>
        <div className="panel-head"><div><span>Tu selección</span><h2>Mi pedido</h2></div><button onClick={() => setShowCart(false)} aria-label="Cerrar pedido"><X/></button></div>
        <div className="cart-lines">{cart.map(item => <div className="cart-line" key={item.id}><div><b>{item.nombre}</b>{item.entrada && <small>Entrada: {item.entrada}</small>}{item.bebida && <small>Bebida: {item.bebida}</small>}<span>{item.precio}</span></div><div className="quantity"><button onClick={() => change(item.id,-1)} aria-label="Quitar uno"><Minus size={15}/></button><b>{item.cantidad}</b><button onClick={() => change(item.id,1)} aria-label="Agregar uno"><Plus size={15}/></button><button className="remove" onClick={() => change(item.id,-item.cantidad)} aria-label="Eliminar"><Trash2 size={16}/></button></div></div>)}</div>
        <div className="total"><span>Total</span><b>S/. {total.toFixed(2)}</b></div>
        <button className="whatsapp" onClick={send}>Enviar pedido por WhatsApp <ChevronRight/></button>
      </motion.div>
    </motion.div>}</AnimatePresence>
  </div>;
}
