import { useMemo, useState } from 'react';
import { ChevronRight, Fish, MapPin, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DEFAULT_MENU_DATA, Dish } from './data/menuData';

const WHATSAPP_NUMBER = '51988121463';
type CartItem = Dish & { cantidad: number };

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState(DEFAULT_MENU_DATA[0].id);
  const count = useMemo(() => cart.reduce((sum, item) => sum + item.cantidad, 0), [cart]);
  const total = useMemo(() => cart.reduce((sum, item) => sum + Number(item.precio.replace(/[^0-9.]/g, '')) * item.cantidad, 0), [cart]);
  const add = (dish: Dish) => setCart(items => {
    const found = items.find(item => item.nombre === dish.nombre);
    return found ? items.map(item => item.nombre === dish.nombre ? { ...item, cantidad: item.cantidad + 1 } : item) : [...items, { ...dish, cantidad: 1 }];
  });
  const change = (name: string, delta: number) => setCart(items => items.map(item => item.nombre === name ? { ...item, cantidad: item.cantidad + delta } : item).filter(item => item.cantidad > 0));
  const goTo = (id: string) => { setActiveCategory(id); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const send = () => {
    const lines = cart.map(item => `• ${item.cantidad} x ${item.nombre} (${item.precio})`).join('\n');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`¡Hola Cevichazo 102! Deseo realizar este pedido:\n\n${lines}\n\n*TOTAL: S/. ${total.toFixed(2)}*`)}`, '_blank');
  };
  return <div className="site-shell">
    <header className="topbar"><a href="#inicio" className="logo-link"><img src="/images/cevichazo-logo.png" alt="Cevichazo 102, restaurant peruano" /></a><button className="cart-button" onClick={() => count && setShowCart(true)} aria-label="Ver pedido"><ShoppingBag size={21}/>{count > 0 && <b>{count}</b>}</button></header>
    <main id="inicio">
      <section className="hero"><div className="hero-glow"/><div className="hero-copy"><span className="eyebrow">Cocina peruana con identidad</span><h1>El sabor fresco<br/>de la <em>trucha.</em></h1><p>Ceviches, chicharrones y combinaciones preparadas al momento.</p><a href="#carta" className="hero-cta">Ver la carta <ChevronRight size={17}/></a></div><div className="hero-art"><img src="/images/ceviche.jpg" alt="Ceviche de trucha" /></div></section>
      <div className="trust-strip"><span><Fish size={17}/> 100% trucha fresca</span><span>•</span><span>Ingredientes naturales</span></div>
      <nav className="category-nav" aria-label="Categorías">{DEFAULT_MENU_DATA.map(category => <button onClick={() => goTo(category.id)} className={activeCategory === category.id ? 'active' : ''} key={category.id}>{category.nombre}</button>)}</nav>
      <div className="menu">{DEFAULT_MENU_DATA.map(category => <section id={category.id} className="menu-section" key={category.id}><div className="category-banner"><img src={category.imagen} alt=""/><div><span>Especialidades</span><h2>{category.nombre}</h2></div></div><div className="dish-list">{category.items.map(dish => <article className="dish" key={dish.nombre}><div><h3>{dish.nombre}</h3><span>Preparado al momento</span></div><div className="dish-action"><strong>{dish.precio}</strong><button onClick={() => add(dish)} aria-label={`Agregar ${dish.nombre}`}><Plus size={17}/></button></div></article>)}</div></section>)}</div>
      <section className="delivery"><MapPin size={22}/><div><b>¿Listo para disfrutar?</b><p>Haz tu pedido directo por WhatsApp.</p></div><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">Escríbenos <ChevronRight size={16}/></a></section>
    </main>
    <footer><img src="/images/cevichazo-logo.png" alt="Cevichazo 102"/><p>Restaurant Peruano · Sabor que se recuerda</p><small>© 2026 Cevichazo 102</small></footer>
    <AnimatePresence>{count > 0 && !showCart && <motion.button initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} onClick={() => setShowCart(true)} className="floating-cart"><span><ShoppingBag size={19}/> {count} {count === 1 ? 'pedido' : 'pedidos'}</span><b>Ver pedido <ChevronRight size={17}/></b></motion.button>}</AnimatePresence>
    <AnimatePresence>{showCart && <motion.div className="cart-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowCart(false)}><motion.div className="cart-panel" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} onClick={e => e.stopPropagation()}><div className="panel-head"><div><span>Tu selección</span><h2>Mi pedido</h2></div><button onClick={() => setShowCart(false)}><X/></button></div><div className="cart-lines">{cart.map(item => <div className="cart-line" key={item.nombre}><div><b>{item.nombre}</b><span>{item.precio}</span></div><div className="quantity"><button onClick={() => change(item.nombre,-1)}><Minus size={15}/></button><b>{item.cantidad}</b><button onClick={() => change(item.nombre,1)}><Plus size={15}/></button><button className="remove" onClick={() => change(item.nombre,-item.cantidad)}><Trash2 size={16}/></button></div></div>)}</div><div className="total"><span>Total</span><b>S/. {total.toFixed(2)}</b></div><button className="whatsapp" onClick={send}>Enviar pedido por WhatsApp <ChevronRight/></button></motion.div></motion.div>}</AnimatePresence>
  </div>;
}
