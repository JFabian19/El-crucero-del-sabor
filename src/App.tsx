import { useMemo, useState } from 'react';
import { ChevronRight, MapPin, Minus, Phone, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DEFAULT_MENU_DATA, Dish } from './data/menuData';

const WHATSAPP_NUMBER = '51987482888';
type CartItem = Dish & { cantidad: number };
const numericPrice = (value: string) => Number(value.match(/\d+(?:\.\d+)?/)?.[0] ?? 0);

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState(DEFAULT_MENU_DATA[0].id);
  const count = useMemo(() => cart.reduce((sum, item) => sum + item.cantidad, 0), [cart]);
  const total = useMemo(() => cart.reduce((sum, item) => sum + numericPrice(item.precio) * item.cantidad, 0), [cart]);

  const add = (dish: Dish) => setCart(items => {
    const found = items.find(item => item.nombre === dish.nombre && item.precio === dish.precio);
    return found
      ? items.map(item => item.nombre === dish.nombre && item.precio === dish.precio ? { ...item, cantidad: item.cantidad + 1 } : item)
      : [...items, { ...dish, cantidad: 1 }];
  });
  const change = (name: string, itemPrice: string, delta: number) => setCart(items => items
    .map(item => item.nombre === name && item.precio === itemPrice ? { ...item, cantidad: item.cantidad + delta } : item)
    .filter(item => item.cantidad > 0));
  const goTo = (id: string) => {
    setActiveCategory(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const send = () => {
    const lines = cart.map(item => `• ${item.cantidad} x ${item.nombre} (${item.precio})`).join('\n');
    const message = `¡Hola El Crucero del Sabor! Deseo realizar este pedido:\n\n${lines}\n\n*TOTAL: S/. ${total.toFixed(2)}*`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
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
          {categoryIndex === 7 && <div className="region-break"><span>Desde aquí</span><strong>Sabores de nuestra Amazonía</strong></div>}
          <div className={`category-banner focus-${category.enfoque}`}>
            <img src={category.imagen} alt="" />
            <div><span>{category.etiqueta}</span><h2>{category.nombre}</h2><small>{category.items.length} opciones</small></div>
          </div>
          <div className="dish-list">
            {category.items.map((item, index) => {
              const previousGroup = index > 0 ? category.items[index - 1].grupo : undefined;
              const orderable = numericPrice(item.precio) > 0;
              return <div key={`${item.nombre}-${item.precio}-${index}`}>
                {item.grupo && item.grupo !== previousGroup && <h3 className="group-title">{item.grupo}</h3>}
                <article className="dish">
                  <div className="dish-copy"><h4>{item.nombre}</h4>{item.nota && <span>{item.nota}</span>}</div>
                  <div className="dish-action"><strong className={!orderable ? 'included' : ''}>{item.precio}</strong>{orderable && <button onClick={() => add(item)} aria-label={`Agregar ${item.nombre}`}><Plus size={17}/></button>}</div>
                </article>
              </div>;
            })}
          </div>
        </section>)}
      </div>

      <section className="delivery">
        <MapPin size={23}/><div><b>Visítanos o pide por WhatsApp</b><p>Jr. Hipólito Unanue 1534, La Victoria · Frente al parque Cánepa</p></div>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer"><Phone size={15}/> Pedir</a>
      </section>
    </main>

    <footer>
      <img src="/images/crucero-logo.png" alt="El Crucero del Sabor" />
      <p>Pescados · Mariscos · Comida criolla · Comida de la selva</p>
      <small>Jr. Hipólito Unanue 1534, La Victoria · 987 482 888</small>
    </footer>

    <AnimatePresence>{count > 0 && !showCart && <motion.button initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} onClick={() => setShowCart(true)} className="floating-cart"><span><ShoppingBag size={19}/> {count} {count === 1 ? 'producto' : 'productos'}</span><b>S/. {total.toFixed(2)} <ChevronRight size={17}/></b></motion.button>}</AnimatePresence>
    <AnimatePresence>{showCart && <motion.div className="cart-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowCart(false)}>
      <motion.div className="cart-panel" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} onClick={e => e.stopPropagation()}>
        <div className="panel-head"><div><span>Tu selección</span><h2>Mi pedido</h2></div><button onClick={() => setShowCart(false)} aria-label="Cerrar pedido"><X/></button></div>
        <div className="cart-lines">{cart.map(item => <div className="cart-line" key={`${item.nombre}-${item.precio}`}><div><b>{item.nombre}</b><span>{item.precio}</span></div><div className="quantity"><button onClick={() => change(item.nombre,item.precio,-1)} aria-label="Quitar uno"><Minus size={15}/></button><b>{item.cantidad}</b><button onClick={() => change(item.nombre,item.precio,1)} aria-label="Agregar uno"><Plus size={15}/></button><button className="remove" onClick={() => change(item.nombre,item.precio,-item.cantidad)} aria-label="Eliminar"><Trash2 size={16}/></button></div></div>)}</div>
        <div className="total"><span>Total</span><b>S/. {total.toFixed(2)}</b></div>
        <button className="whatsapp" onClick={send}>Enviar pedido por WhatsApp <ChevronRight/></button>
      </motion.div>
    </motion.div>}</AnimatePresence>
  </div>;
}
