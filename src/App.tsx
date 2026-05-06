/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight, Search, ShoppingBag, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { useState, useEffect, ReactNode, useMemo } from "react";
import { getDriveUrl, DRIVE_MAPPING } from "./lib/drive";

const Section = ({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`min-h-screen relative py-24 px-6 md:px-12 lg:px-24 ${className}`}>
    {children}
  </section>
);

interface CartItem {
  product: typeof DRIVE_MAPPING.products[0];
  quantity: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "book" | "atelier" | "journal" | "recommendations" | "product" | "cart">("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollectionsSubMenuOpen, setIsCollectionsSubMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("toutes");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<typeof DRIVE_MAPPING.products[0] | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const categories = [
    { label: "Toutes", id: "toutes" },
    { label: "Nuisette", id: "nuisette" },
    { label: "Top", id: "top" },
    { label: "Jupe", id: "jupe" },
    { label: "Accessoire", id: "accessoire" },
    { label: "Robe", id: "robe" },
    { label: "Soutien-gorge", id: "soutien-gorge" },
    { label: "Ensemble", id: "ensemble" }
  ];

  const filteredProducts = useMemo(() => {
    let prods = selectedCategory === "toutes" 
      ? DRIVE_MAPPING.products 
      : DRIVE_MAPPING.products.filter(p => p.category === selectedCategory);
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      prods = prods.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }
    return prods;
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
      setIsCollectionsSubMenuOpen(false);
    }
  };

  const [currentBookImageIndex, setCurrentBookImageIndex] = useState(0);

  const nextBookImage = () => {
    setCurrentBookImageIndex((prev) => (prev + 1) % (DRIVE_MAPPING as any).bookGallery.length);
  };

  const prevBookImage = () => {
    setCurrentBookImageIndex((prev) => (prev - 1 + (DRIVE_MAPPING as any).bookGallery.length) % (DRIVE_MAPPING as any).bookGallery.length);
  };

  const addToCart = (product: typeof DRIVE_MAPPING.products[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((acc, item) => {
    const price = parseInt(item.product.price.replace("€", ""));
    return acc + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const Nav = ({ dark = false }: { dark?: boolean }) => (
    <nav className={`fixed top-0 left-0 w-full z-40 flex justify-between items-center p-8 ${dark ? "text-ink" : "mix-blend-difference text-white"}`}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl tracking-[0.2em] font-light cursor-pointer"
        onClick={() => {
          setCurrentPage("home");
          window.scrollTo(0, 0);
        }}
      >
        BOUDOIR
      </motion.div>
      <div className="flex items-center gap-6">
        <div className="relative flex items-center">
          <AnimatePresence>
            {isSearchOpen && (
              <motion.input
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 150, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent border-b ${dark ? "border-ink/30 text-ink focus:border-ink" : "border-white/30 text-white focus:border-white"} text-xs font-sans tracking-widest focus:outline-none py-1 px-2 mr-2 placeholder:opacity-30`}
                autoFocus
              />
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-1 hover:opacity-50 transition-opacity"
          >
            <Search size={18} strokeWidth={1} />
          </button>
        </div>
        
        <button 
          onClick={() => {
            setCurrentPage("cart");
            window.scrollTo(0, 0);
          }}
          className="relative p-1 hover:opacity-50 transition-opacity"
        >
          <ShoppingBag size={20} strokeWidth={1} />
          {cartCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-rose-faded text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
            >
              {cartCount}
            </motion.span>
          )}
        </button>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 hover:opacity-50 transition-opacity"
        >
          {isMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
        </button>
      </div>
    </nav>
  );

  const openProduct = (product: typeof DRIVE_MAPPING.products[0]) => {
    setSelectedProduct(product);
    setCurrentPage("product");
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const ProductDetail = ({ product }: { product: typeof DRIVE_MAPPING.products[0] }) => (
    <div className="relative min-h-screen bg-paper pb-24">
      <div className="grain" />
      <Nav dark />
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 lg:pt-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[3/4] bg-rose-faded/5 overflow-hidden"
          >
            <img 
              src={getDriveUrl(product.id) || undefined} 
              alt={product.title}
              className="w-full h-full object-cover image-grain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="flex flex-col justify-center space-y-12">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.4em] font-sans opacity-40 block mb-2">{product.category}</span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl italic font-light leading-tight">{product.title}</h1>
                </div>
                <p className="text-2xl font-light">{product.price}</p>
              </div>
              <p className="text-lg font-light leading-relaxed opacity-70 max-w-md">
                {(product as any).description || "Une pièce d'exception, alliant confort et raffinement, pour sublimer vos instants les plus précieux."}
              </p>
            </div>

            <div className="space-y-8 pt-8 border-t border-ink/10">
              <button 
                onClick={() => addToCart(product)}
                className="w-full py-5 bg-ink text-paper text-xs uppercase tracking-[0.3em] font-sans hover:bg-rose-faded transition-all duration-500"
              >
                Ajouter au panier
              </button>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => setCurrentPage("home")}
                  className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-sans opacity-40 hover:opacity-100 transition-opacity"
                >
                  <ArrowLeft size={14} strokeWidth={1} /> Retour à la collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CartPage = () => (
    <div className="relative min-h-screen bg-paper pb-24">
      <div className="grain" />
      <Nav dark />
      <div className="max-w-4xl mx-auto px-6 pt-32 lg:pt-48">
        <h1 className="text-4xl italic mb-16">Votre Panier</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-24 space-y-8">
            <p className="text-xl italic opacity-40">Votre panier est encore vide.</p>
            <button 
              onClick={() => setCurrentPage("home")}
              className="text-xs uppercase tracking-[0.4em] font-sans border-b border-ink pb-2"
            >
              Découvrir la collection
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="space-y-8">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-8 items-center border-b border-ink/5 pb-8">
                  <div className="w-24 h-32 bg-rose-faded/5 overflow-hidden flex-shrink-0">
                    <img 
                      src={getDriveUrl(item.product.id) || undefined} 
                      className="w-full h-full object-cover grayscale" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl italic">{item.product.title}</h3>
                    <p className="text-sm font-light opacity-60">{item.product.price}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-ink/10">
                      <button onClick={() => updateQuantity(item.product.id, -1)} className="p-2 hover:bg-ink/5 transition-colors"><Minus size={12} /></button>
                      <span className="w-8 text-center text-xs font-sans">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, 1)} className="p-2 hover:bg-ink/5 transition-colors"><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="opacity-30 hover:opacity-100 hover:text-red-500 transition-all">
                      <Trash2 size={18} strokeWidth={1} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-12 border-t-2 border-ink space-y-8">
              <div className="flex justify-between items-end">
                <span className="text-[10px] uppercase tracking-[0.4em] font-sans opacity-40">Total Estimé</span>
                <p className="text-4xl font-light">€{cartTotal}</p>
              </div>
              <button 
                className="w-full py-5 bg-ink text-paper text-xs uppercase tracking-[0.3em] font-sans hover:bg-rose-faded transition-all duration-500"
              >
                Passer la commande
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (currentPage === "product" && selectedProduct) {
    return <ProductDetail product={selectedProduct} />;
  }

  if (currentPage === "cart") {
    return <CartPage />;
  }

  if (currentPage === "book") {
    const bookImages = (DRIVE_MAPPING as any).bookGallery;
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-paper">
        <div className="grain" />
        <Nav />

        {/* Menu (same as home) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-paper z-30 flex flex-col justify-center items-center text-center"
            >
              <div className="space-y-12 text-4xl md:text-6xl font-light italic overflow-y-auto max-h-screen py-24">
                {[
                  { name: "Le Carnet de Vente", id: "collections" },
                  { name: "Livre Partenaire", id: "livre" },
                  { name: "Journal", id: "journal" },
                  { name: "L'Atelier", id: "atelier" },
                  { name: "Contact", id: "contact" }
                ].map((item, i) => (
                  <div key={item.id} className="flex flex-col items-center">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => {
                        if (item.id === "collections") {
                          setIsCollectionsSubMenuOpen(!isCollectionsSubMenuOpen);
                        } else if (item.id === "livre") {
                          setCurrentPage("book");
                          setIsMenuOpen(false);
                          window.scrollTo(0, 0);
                        } else if (item.id === "atelier") {
                          setCurrentPage("atelier");
                          setIsMenuOpen(false);
                          window.scrollTo(0, 0);
                        } else if (item.id === "journal") {
                          setCurrentPage("journal");
                          setIsMenuOpen(false);
                          window.scrollTo(0, 0);
                        } else {
                          setCurrentPage("home");
                          setIsMenuOpen(false);
                          setTimeout(() => {
                            const el = document.getElementById(item.id);
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }
                      }}
                      className="cursor-pointer hover:text-rose-faded transition-colors flex items-center gap-4"
                    >
                      {item.name}
                      {item.id === "collections" && (
                        <motion.span 
                          animate={{ rotate: isCollectionsSubMenuOpen ? 180 : 0 }}
                          className="text-xs"
                        >
                          ↓
                        </motion.span>
                      )}
                    </motion.div>
                    
                    {item.id === "collections" && (
                      <AnimatePresence>
                        {isCollectionsSubMenuOpen && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6 max-w-sm px-4 overflow-hidden"
                          >
                            <button
                              onClick={() => {
                                setSelectedCategory("toutes");
                                setCurrentPage("home");
                                setIsMenuOpen(false);
                                setTimeout(() => {
                                  const el = document.getElementById("collections");
                                  if (el) el.scrollIntoView({ behavior: "smooth" });
                                }, 100);
                              }}
                              className="text-[10px] uppercase tracking-[0.2em] font-sans opacity-60 hover:opacity-100 italic"
                            >
                              Voir tout
                            </button>
                            {categories.filter(c => c.id !== "toutes").map((cat, catIdx) => (
                              <motion.button
                                key={cat.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 0.5, y: 0 }}
                                whileHover={{ opacity: 1, scale: 1.05 }}
                                transition={{ delay: catIdx * 0.05 }}
                                onClick={() => {
                                  setSelectedCategory(cat.id);
                                  setCurrentPage("home");
                                  setIsMenuOpen(false);
                                  setTimeout(() => {
                                    const el = document.getElementById("collections");
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                  }, 100);
                                }}
                                className="text-[10px] uppercase tracking-[0.2em] font-sans hover:text-rose-faded transition-all"
                              >
                                {cat.label}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Section className="flex flex-col items-center pt-48">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl text-center mb-24"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] font-sans opacity-50 mb-8 block">L'Inspiration Partagée</span>
            <h1 className="text-5xl md:text-8xl italic mb-12">Livre Partenaire</h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm uppercase tracking-widest font-sans opacity-60">
              <span>Thomas Lelu</span>
              <span className="hidden md:block opacity-30">&</span>
              <span>Marine Neuilly</span>
            </div>
          </motion.div>

          <div className="max-w-3xl prose prose-invert text-center mb-16">
            <p className="text-xl md:text-2xl italic leading-relaxed opacity-80">
              « Ce livre est une pièce maîtresse pour Boudoir. Il incarne l'essence même qui a inspiré la création de notre marque : une célébration de l'intime à travers un regard artistique et complice. »
            </p>
          </div>

          {/* Carousel Viewer */}
          <div className="w-full max-w-5xl relative group">
            <div className="aspect-[3/4] md:aspect-[16/10] overflow-hidden relative bg-rose-faded/5 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentBookImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  src={getDriveUrl(bookImages[currentBookImageIndex]) || undefined} 
                  alt={`Livre Page ${currentBookImageIndex + 1}`}
                  className="w-full h-full object-contain image-grain"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button 
                onClick={prevBookImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-paper/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-paper/40"
              >
                <ArrowRight size={24} className="rotate-180" />
              </button>
              <button 
                onClick={nextBookImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-paper/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-paper/40"
              >
                <ArrowRight size={24} />
              </button>
            </div>

            {/* Pagination / Counter */}
            <div className="flex justify-between items-center mt-8 px-4">
              <div className="text-[10px] uppercase tracking-widest font-sans opacity-30">
                {currentBookImageIndex + 1} / {bookImages.length}
              </div>
              <div className="flex gap-2">
                {bookImages.map((_: any, i: number) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentBookImageIndex(i)}
                    className={`w-1 h-1 rounded-full transition-all duration-500 ${i === currentBookImageIndex ? "w-8 bg-ink" : "bg-ink/20"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-32 text-center"
          >
            <button 
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo(0, 0);
              }}
              className="text-xs uppercase tracking-[0.4em] font-sans border-b border-ink pb-2 hover:opacity-50 transition-opacity"
            >
              Retour à l'accueil
            </button>
          </motion.div>
        </Section>

        {/* Footer */}
        <footer className="py-24 px-12 border-t border-ink/5 text-center space-y-12">
          <div className="text-6xl md:text-9xl font-light tracking-tighter opacity-10">BOUDOIR</div>
          <p className="text-xs italic opacity-40">© 2026 Boudoir. Édition Collection Partenaire.</p>
        </footer>
      </div>
    );
  }

  if (currentPage === "atelier") {
    const atelierImages = (DRIVE_MAPPING as any).atelierGallery;
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-paper">
        <div className="grain" />
        <Nav />

        {/* Menu (Shared) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-paper z-30 flex flex-col justify-center items-center text-center"
            >
              <div className="space-y-12 text-4xl md:text-6xl font-light italic overflow-y-auto max-h-screen py-24">
                {[
                  { name: "Le Carnet de Vente", id: "collections" },
                  { name: "Livre Partenaire", id: "livre" },
                  { name: "Journal", id: "journal" },
                  { name: "L'Atelier", id: "atelier" },
                  { name: "Contact", id: "contact" }
                ].map((item, i) => (
                  <div key={item.id} className="flex flex-col items-center">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={isMenuOpen ? { y: 0, opacity: 1 } : {}}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => {
                        if (item.id === "collections") {
                          setIsCollectionsSubMenuOpen(!isCollectionsSubMenuOpen);
                        } else if (item.id === "livre") {
                          setCurrentPage("book");
                          setIsMenuOpen(false);
                          window.scrollTo(0, 0);
                        } else if (item.id === "atelier") {
                          setCurrentPage("atelier");
                          setIsMenuOpen(false);
                          window.scrollTo(0, 0);
                        } else if (item.id === "journal") {
                          setCurrentPage("journal");
                          setIsMenuOpen(false);
                          window.scrollTo(0, 0);
                        } else {
                          setCurrentPage("home");
                          setIsMenuOpen(false);
                          setTimeout(() => {
                            const el = document.getElementById(item.id);
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }
                      }}
                      className="cursor-pointer hover:text-rose-faded transition-colors flex items-center gap-4"
                    >
                      {item.name}
                      {item.id === "collections" && (
                        <motion.span 
                          animate={{ rotate: isCollectionsSubMenuOpen ? 180 : 0 }}
                          className="text-xs"
                        >
                          ↓
                        </motion.span>
                      )}
                    </motion.div>
                    
                    {item.id === "collections" && (
                      <AnimatePresence>
                        {isCollectionsSubMenuOpen && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6 max-w-sm px-4 overflow-hidden"
                          >
                            <button
                              onClick={() => {
                                setSelectedCategory("toutes");
                                setCurrentPage("home");
                                setIsMenuOpen(false);
                                setTimeout(() => {
                                  const el = document.getElementById("collections");
                                  if (el) el.scrollIntoView({ behavior: "smooth" });
                                }, 100);
                              }}
                              className="text-[10px] uppercase tracking-[0.2em] font-sans opacity-60 hover:opacity-100 italic"
                            >
                              Voir tout
                            </button>
                            {categories.filter(c => c.id !== "toutes").map((cat, catIdx) => (
                              <motion.button
                                key={cat.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 0.5, y: 0 }}
                                whileHover={{ opacity: 1, scale: 1.05 }}
                                transition={{ delay: catIdx * 0.05 }}
                                onClick={() => {
                                  setSelectedCategory(cat.id);
                                  setCurrentPage("home");
                                  setIsMenuOpen(false);
                                  setTimeout(() => {
                                    const el = document.getElementById("collections");
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                  }, 100);
                                }}
                                className="text-[10px] uppercase tracking-[0.2em] font-sans hover:text-rose-faded transition-all"
                              >
                                {cat.label}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Section className="flex flex-col items-center pt-48">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl text-center mb-24"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] font-sans opacity-50 mb-8 block">Le Marais, Paris</span>
            <h1 className="text-5xl md:text-8xl italic mb-12">L'Atelier</h1>
            <p className="text-sm uppercase tracking-widest font-sans opacity-60">Savoir-faire artisanal & Local</p>
          </motion.div>

          {/* Featured Image */}
          {atelierImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="w-full max-w-6xl px-8 mb-32"
            >
              <div className="aspect-video md:aspect-[21/9] overflow-hidden bg-rose-faded/5 relative shadow-2xl">
                <img 
                  src={getDriveUrl(atelierImages[0]) || undefined} 
                  alt="L'Atelier de création"
                  className="w-full h-full object-cover image-grain hover:scale-105 transition-all duration-[3000ms]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-ink/5" />
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                   <h3 className="text-white text-3xl md:text-5xl italic font-light">L'Âme de Boudoir</h3>
                </div>
              </div>
            </motion.div>
          )}

          {/* Intro Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mb-32 px-8">
            <div className="space-y-6">
              <h2 className="text-3xl italic">Fait Main avec Amour</h2>
              <p className="text-lg opacity-80 leading-relaxed font-light">
                Au cœur du Marais, notre atelier est un sanctuaire de création. C'est ici que chaque dentelle est sélectionnée, chaque coupe est ajustée, et chaque pièce prend vie sous les mains expertes de nos couturières.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl italic">Une Production Locale</h2>
              <p className="text-lg opacity-80 leading-relaxed font-light">
                Nous croyons en une mode lente et consciente. En produisant localement à Paris, nous garantissons non seulement une qualité irréprochable, mais aussi un respect profond pour l'artisanat traditionnel.
              </p>
            </div>
          </div>

          {/* Atelier Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl px-8">
            {atelierImages.slice(1).map((img: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${i % 3 === 0 ? "md:col-span-2 aspect-video" : "aspect-square"} overflow-hidden bg-rose-faded/5`}
              >
                <img 
                  src={getDriveUrl(img) || undefined} 
                  alt={`Atelier Photo ${i + 2}`}
                  className="w-full h-full object-cover image-grain grayscale hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-32 text-center"
          >
            <button 
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo(0, 0);
              }}
              className="text-xs uppercase tracking-[0.4em] font-sans border-b border-ink pb-2 hover:opacity-50 transition-opacity"
            >
              Retour à l'accueil
            </button>
          </motion.div>
        </Section>

        {/* Footer */}
        <footer className="py-24 px-12 border-t border-ink/5 text-center space-y-12">
          <div className="text-6xl md:text-9xl font-light tracking-tighter opacity-10">BOUDOIR</div>
          <p className="text-xs italic opacity-40">© 2026 Boudoir. Atelier Marais, Paris.</p>
        </footer>
      </div>
    );
  }

  if (currentPage === "journal") {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-paper">
        <div className="grain" />
        <Nav />

        {/* Menu (Shared) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-paper z-30 flex flex-col justify-center items-center text-center"
            >
              <div className="space-y-12 text-4xl md:text-6xl font-light italic overflow-y-auto max-h-screen py-24">
                {[
                  { name: "Le Carnet de Vente", id: "collections" },
                  { name: "Livre Partenaire", id: "livre" },
                  { name: "Journal", id: "journal" },
                  { name: "L'Atelier", id: "atelier" },
                  { name: "Contact", id: "contact" }
                ].map((item, i) => (
                  <div key={item.id} className="flex flex-col items-center">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={isMenuOpen ? { y: 0, opacity: 1 } : {}}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => {
                        if (item.id === "collections") {
                          setIsCollectionsSubMenuOpen(!isCollectionsSubMenuOpen);
                        } else if (item.id === "livre") {
                          setCurrentPage("book");
                          setIsMenuOpen(false);
                          window.scrollTo(0, 0);
                        } else if (item.id === "atelier") {
                          setCurrentPage("atelier");
                          setIsMenuOpen(false);
                          window.scrollTo(0, 0);
                        } else if (item.id === "journal") {
                          setCurrentPage("journal");
                          setIsMenuOpen(false);
                          window.scrollTo(0, 0);
                        } else {
                          setCurrentPage("home");
                          setIsMenuOpen(false);
                          setTimeout(() => {
                            const el = document.getElementById(item.id);
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }
                      }}
                      className="cursor-pointer hover:text-rose-faded transition-colors flex items-center gap-4"
                    >
                      {item.name}
                      {item.id === "collections" && (
                        <motion.span 
                          animate={{ rotate: isCollectionsSubMenuOpen ? 180 : 0 }}
                          className="text-xs"
                        >
                          ↓
                        </motion.span>
                      )}
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Section className="flex flex-col items-center pt-48">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl text-center mb-24"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] font-sans opacity-50 mb-8 block">Editions & Confidences</span>
            <h1 className="text-5xl md:text-8xl italic mb-12">Le Journal</h1>
          </motion.div>

          {/* Journal Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl px-8 mb-32">
            {(DRIVE_MAPPING as any).journalGallery.map((img: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="aspect-[3/4] overflow-hidden bg-rose-faded/5 shadow-xl"
              >
                <img 
                  src={getDriveUrl(img) || undefined} 
                  alt={`Journal Entry ${i + 1}`}
                  className="w-full h-full object-cover image-grain hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>

          <div className="max-w-2xl text-center mb-32 px-8">
             <p className="text-2xl font-light italic opacity-80 leading-relaxed">
               Bientôt, un espace dédié à nos récits, nos rencontres et nos inspirations. Un carnet de bord de l'intime.
             </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-32 text-center"
          >
            <button 
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo(0, 0);
              }}
              className="text-xs uppercase tracking-[0.4em] font-sans border-b border-ink pb-2 hover:opacity-50 transition-opacity"
            >
              Retour à l'accueil
            </button>
          </motion.div>
        </Section>

        {/* Footer */}
        <footer className="py-24 px-12 border-t border-ink/5 text-center space-y-12">
          <div className="text-6xl md:text-9xl font-light tracking-tighter opacity-10">BOUDOIR</div>
          <p className="text-xs italic opacity-40">© 2026 Boudoir. Journal Intime.</p>
        </footer>
      </div>
    );
  }

  if (currentPage === "recommendations") {
    const recs = (DRIVE_MAPPING as any).recommendations;
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-paper">
        <div className="grain" />
        <Nav />

        {/* Menu (Shared logic) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-paper z-30 flex flex-col justify-center items-center text-center"
            >
              <div className="space-y-10 text-3xl md:text-5xl font-light italic overflow-y-auto max-h-screen py-24">
                {[
                  { name: "Le Carnet de Vente", id: "collections" },
                  { name: "Livre Partenaire", id: "livre" },
                  { name: "Nos Recommandations", id: "recs" },
                  { name: "Journal", id: "journal" },
                  { name: "L'Atelier", id: "atelier" },
                  { name: "Contact", id: "contact" }
                ].map((item, i) => (
                  <div key={item.id} className="flex flex-col items-center">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => {
                        if (item.id === "recs") {
                          setCurrentPage("recommendations");
                          setIsMenuOpen(false);
                          window.scrollTo(0, 0);
                        } else if (item.id === "livre") {
                          setCurrentPage("book");
                          setIsMenuOpen(false);
                          window.scrollTo(0, 0);
                        } else if (item.id === "atelier") {
                          setCurrentPage("atelier");
                          setIsMenuOpen(false);
                          window.scrollTo(0, 0);
                        } else if (item.id === "journal") {
                          setCurrentPage("journal");
                          setIsMenuOpen(false);
                          window.scrollTo(0, 0);
                        } else {
                          setCurrentPage("home");
                          setIsMenuOpen(false);
                          setTimeout(() => {
                            const el = document.getElementById(item.id);
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }
                      }}
                      className="cursor-pointer hover:text-rose-faded transition-colors"
                    >
                      {item.name}
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Section className="flex flex-col items-center pt-48">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl text-center mb-32"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] font-sans opacity-50 mb-8 block">Dialogue Artistique</span>
            <h1 className="text-5xl md:text-8xl italic mb-12">Nos Recommandations</h1>
            <p className="text-lg font-light opacity-60 max-w-2xl mx-auto leading-relaxed">
              Quand nos créations rencontrent les œuvres qui les habitent. Une sélection de films, de livres et d'arts qui partagent l'âme de Boudoir.
            </p>
          </motion.div>

          <div className="max-w-6xl w-full grid grid-cols-1 gap-48 px-8 mb-48">
            {recs.map((rec: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: "-100px" }}
                className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-16 md:gap-24`}
              >
                <div className="flex-1 w-full flex flex-row gap-4 items-end">
                  {/* Artwork Image */}
                  <div className="flex-1 relative aspect-[3/4] overflow-hidden bg-rose-faded/5 perspective-1000 shadow-2xl">
                    <img 
                      src={getDriveUrl(rec.imageId) || undefined} 
                      alt={rec.recommendationTitle}
                      className="w-full h-full object-cover image-grain grayscale hover:grayscale-0 transition-all duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-paper/80 backdrop-blur-sm px-2 py-1 text-[8px] uppercase tracking-widest font-sans">
                      L'Œuvre
                    </div>
                  </div>
                  
                  {/* Product Image */}
                  <div 
                    className="w-1/3 aspect-[3/4] overflow-hidden bg-rose-faded/5 perspective-1000 shadow-xl relative mt-12 cursor-pointer group"
                    onClick={() => {
                      const p = DRIVE_MAPPING.products.find(prod => prod.title === rec.productTitle);
                      if (p) openProduct(p);
                    }}
                  >
                    <img 
                      src={getDriveUrl(rec.productImageId) || undefined} 
                      alt={rec.productTitle}
                      className="w-full h-full object-cover image-grain group-hover:scale-105 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-paper/80 backdrop-blur-sm px-2 py-1 text-[8px] uppercase tracking-widest font-sans">
                      Le Produit
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-8">
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-sans text-rose-faded">{rec.recommendationType}</span>
                    <h2 className="text-5xl md:text-7xl italic font-light">{rec.recommendationTitle}</h2>
                    <p className="text-xl opacity-40">{rec.author}</p>
                  </div>
                  
                  <p className="text-xl md:text-2xl leading-relaxed font-light opacity-80 italic">
                    « {rec.description} »
                  </p>

                  <div className="md:hidden pt-8 border-t border-ink/5">
                    <span className="text-[9px] uppercase tracking-widest opacity-40 block mb-2">Lié au produit</span>
                    <p className="text-sm italic">{rec.productTitle}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center"
          >
            <button 
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo(0, 0);
              }}
              className="text-xs uppercase tracking-[0.4em] font-sans border-b border-ink pb-2 hover:opacity-50 transition-opacity"
            >
              Retour à l'accueil
            </button>
          </motion.div>
        </Section>

        {/* Footer */}
        <footer className="py-24 px-12 border-t border-ink/5 text-center space-y-12">
          <div className="text-6xl md:text-9xl font-light tracking-tighter opacity-10">BOUDOIR</div>
          <p className="text-xs italic opacity-40">© 2026 Boudoir. Recommandations Artistiques.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="grain" />

      {/* Navigation */}
      <Nav />

      {/* Fullscreen Menu */}
      <motion.div
        initial={false}
        animate={{ opacity: isMenuOpen ? 1 : 0, pointerEvents: isMenuOpen ? "auto" : "none" }}
        className="fixed inset-0 bg-paper z-30 flex flex-col justify-center items-center text-center"
      >
        <div className="space-y-12 text-4xl md:text-6xl font-light italic overflow-y-auto max-h-screen py-24">
          {[
            { name: "Le Carnet de Vente", id: "collections" },
            { name: "Livre Partenaire", id: "livre" },
            { name: "Nos Recommandations", id: "recs" },
            { name: "Journal", id: "journal" },
            { name: "L'Atelier", id: "atelier" },
            { name: "Contact", id: "contact" }
          ].map((item, i) => (
            <div key={item.id} className="flex flex-col items-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={isMenuOpen ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                  if (item.id === "collections") {
                    setIsCollectionsSubMenuOpen(!isCollectionsSubMenuOpen);
                  } else if (item.id === "recs") {
                    setCurrentPage("recommendations");
                    setIsMenuOpen(false);
                    window.scrollTo(0, 0);
                  } else if (item.id === "livre") {
                    setCurrentPage("book");
                    setIsMenuOpen(false);
                    window.scrollTo(0, 0);
                  } else if (item.id === "atelier") {
                    setCurrentPage("atelier");
                    setIsMenuOpen(false);
                    window.scrollTo(0, 0);
                  } else if (item.id === "journal") {
                    setCurrentPage("journal");
                    setIsMenuOpen(false);
                    window.scrollTo(0, 0);
                  } else {
                    setCurrentPage("home");
                    setTimeout(() => scrollToSection(item.id), 100);
                  }
                }}
                className="cursor-pointer hover:text-rose-faded transition-colors flex items-center gap-4"
              >
                {item.name}
                {item.id === "collections" && (
                  <motion.span 
                    animate={{ rotate: isCollectionsSubMenuOpen ? 180 : 0 }}
                    className="text-xs"
                  >
                    ↓
                  </motion.span>
                )}
              </motion.div>
              
              {item.id === "collections" && (
                <AnimatePresence>
                  {isCollectionsSubMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-6 max-w-sm px-4 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setSelectedCategory("toutes");
                          scrollToSection("collections");
                        }}
                        className="text-[10px] uppercase tracking-[0.2em] font-sans opacity-60 hover:opacity-100 italic"
                      >
                        Voir tout
                      </button>
                      {categories.filter(c => c.id !== "toutes").map((cat, catIdx) => (
                        <motion.button
                          key={cat.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 0.5, y: 0 }}
                          whileHover={{ opacity: 1, scale: 1.05 }}
                          transition={{ delay: catIdx * 0.05 }}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            scrollToSection("collections");
                          }}
                          className="text-[10px] uppercase tracking-[0.2em] font-sans hover:text-rose-faded transition-all"
                        >
                          {cat.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hero Section */}
      <Section className="flex flex-col justify-center items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-full max-w-4xl aspect-[4/5] md:aspect-[16/9] overflow-hidden"
        >
          <img 
            src={getDriveUrl(DRIVE_MAPPING.hero) || undefined} 
            alt="BOUDOIR Hero"
            className="w-full h-full object-cover image-grain"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-ink/10" />
        </motion.div>
        
        <div className="absolute bottom-12 left-12 md:left-24 max-w-xs">
          <p className="text-xs uppercase tracking-[0.3em] font-sans mb-4 opacity-60">Volume I — Printemps</p>
          <h1 className="text-4xl md:text-6xl italic leading-tight">
            La poésie du <br /> quotidien.
          </h1>
        </div>
      </Section>

      {/* Livre Partenaire Section */}
      <Section id="livre" className="flex flex-col justify-center items-center bg-rose-faded/5">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] uppercase tracking-[0.5em] font-sans opacity-50 mb-4 block">Collaboration</span>
            <h2 className="text-4xl md:text-6xl font-light italic mb-6">Livre Partenaire</h2>
            <p className="text-lg opacity-80 leading-relaxed mb-8">
              Une exploration visuelle de l'intimité, capturée à travers l'objectif de nos partenaires créatifs. Des moments volés, des textures oubliées, une ode à la féminité brute.
            </p>
            <button 
              onClick={() => {
                setCurrentPage("book");
                window.scrollTo(0, 0);
              }}
              className="flex items-center gap-4 group text-sm uppercase tracking-widest font-sans"
            >
              Explorer le livre <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="aspect-[3/4] overflow-hidden"
          >
            <img 
              src={getDriveUrl(DRIVE_MAPPING.livre) || undefined} 
              alt="Livre Partenaire"
              className="w-full h-full object-cover image-grain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </Section>

      {/* Story 1: L'Origine */}
      <Section className="asymmetric-grid">
        <motion.div 
          style={{ y: scrolled * -0.1 }}
          className="col-start-1 col-end-13 md:col-start-2 md:col-end-7 mb-12 md:mb-0"
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <img 
              src={getDriveUrl(DRIVE_MAPPING.story1) || undefined} 
              alt="Story 1"
              className="w-full h-full object-cover image-grain"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        <div className="col-start-1 col-end-13 md:col-start-8 md:col-end-12 self-center space-y-8">
          <span className="text-[10px] uppercase tracking-[0.5em] font-sans opacity-50">Histoire / 01</span>
          <h2 className="text-3xl md:text-5xl font-light leading-snug italic">
            L'Origine du Geste.
          </h2>
          <p className="text-lg opacity-80 max-w-sm leading-relaxed">
            Tout a commencé dans un petit atelier du Marais. Une volonté de revenir à l'essentiel, à la pureté d'une ligne et à la noblesse d'une dentelle qui respire.
          </p>
        </div>
      </Section>

      {/* Story 2: Le Regard */}
      <Section className="bg-ink text-paper overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-1/2 hidden lg:block">
          <motion.div 
            style={{ y: (scrolled - 1500) * 0.1 }}
            className="h-[120%] w-full"
          >
            <img 
              src={getDriveUrl(DRIVE_MAPPING.story2) || undefined} 
              alt="Story 2"
              className="w-full h-full object-cover image-bw opacity-80"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.5em] font-sans opacity-40 mb-8">Histoire / 02</span>
          <h2 className="text-5xl md:text-8xl font-light italic mb-12 leading-[0.9]">
            Le Regard <br /> Intime.
          </h2>
          <p className="text-xl italic opacity-80 max-w-md mb-12">
            "La lingerie n'est pas une parure, c'est une confidence." — Un hommage aux portraits de Kate Moss, capturant la vulnérabilité et la force.
          </p>
        </div>

        <div className="absolute bottom-12 right-12 vertical-text opacity-20 text-[10px] tracking-[1em] uppercase">
          Boudoir Archives — No. 042
        </div>
      </Section>

      {/* Story 3: L'Atelier */}
      <Section id="atelier" className="asymmetric-grid">
        <motion.div 
          style={{ y: scrolled * -0.05 }}
          className="col-start-1 col-end-13 md:col-start-2 md:col-end-7 mb-12 md:mb-0"
        >
          <div className="relative aspect-[16/9] overflow-hidden">
            <img 
              src={getDriveUrl(DRIVE_MAPPING.story3) || undefined} 
              alt="Story 3"
              className="w-full h-full object-cover image-grain"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        <div className="col-start-1 col-end-13 md:col-start-8 md:col-end-12 self-center space-y-8">
          <span className="text-[10px] uppercase tracking-[0.5em] font-sans opacity-50">Histoire / 03</span>
          <h2 className="text-3xl md:text-5xl font-light leading-snug italic">
            L'Âme de l'Atelier.
          </h2>
          <p className="text-lg opacity-80 max-w-sm leading-relaxed">
            Chaque pièce passe entre les mains expertes de nos couturières. Un temps long, nécessaire pour que chaque couture soit une promesse de confort et de durabilité.
          </p>
          <button 
            onClick={() => {
              setCurrentPage("atelier");
              window.scrollTo(0, 0);
            }}
            className="flex items-center gap-4 group text-sm uppercase tracking-widest font-sans"
          >
            Explorer l'Atelier <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </Section>

      {/* Product Showcase (The rest of the photos) */}
      <Section id="collections" className="bg-paper">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.5em] font-sans opacity-50">
            {searchQuery ? `Résultats pour "${searchQuery}"` : "La Collection"}
          </span>
          <h2 className="text-4xl italic mt-4">
            {searchQuery ? "Pièces trouvées" : "Le Carnet de Vente"}
          </h2>
        </div>

        {/* Category Filters */}
        {!searchQuery && (
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-20">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[10px] uppercase tracking-[0.3em] font-sans transition-all duration-500 pb-2 border-b ${
                  selectedCategory === cat.id 
                    ? "border-ink opacity-100" 
                    : "border-transparent opacity-30 hover:opacity-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {filteredProducts.map((product, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                className="group cursor-pointer"
                onClick={() => openProduct(product)}
              >
                <div className="aspect-[3/4] overflow-hidden mb-6 bg-rose-faded/10">
                  <img 
                    src={getDriveUrl(product.id) || undefined} 
                    alt={product.title}
                    className="w-full h-full object-cover image-grain group-hover:scale-105 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex justify-between items-end border-b border-ink/10 pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Modèle</p>
                    <h3 className="text-xl italic">{product.title}</h3>
                  </div>
                  <p className="text-lg font-light">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <p className="text-xl italic opacity-40">Aucune pièce ne correspond à votre recherche.</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setIsSearchOpen(false);
              }}
              className="mt-8 text-xs uppercase tracking-widest font-sans border-b border-ink/20 pb-1 hover:border-ink transition-all"
            >
              Effacer la recherche
            </button>
          </motion.div>
        )}
      </Section>

      {/* Newsletter / Journal Section */}
      <Section id="journal" className="bg-[#f4ebe6] flex flex-col justify-center items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl space-y-12"
        >
          <span className="text-[10px] uppercase tracking-[0.6em] font-sans opacity-40">L'Inspiration Continue</span>
          <h2 className="text-5xl md:text-8xl font-light italic leading-[0.9] tracking-tighter">
            Rejoindre la confidence.
          </h2>
          <div className="space-y-6">
            <p className="text-xl md:text-2xl opacity-70 leading-relaxed italic max-w-xl mx-auto">
              Inscrivez-vous pour recevoir nos prochaines éditions, nos inspirations et les coulisses de l'atelier.
            </p>
          </div>

          <form 
            className="flex flex-col md:flex-row gap-6 items-center justify-center pt-8"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Merci de votre inscription. Vos confidences sont en sécurité.");
            }}
          >
            <input 
              type="email" 
              required
              placeholder="votre@email.com"
              className="bg-transparent border-b border-ink/20 py-5 px-2 w-full md:w-96 focus:outline-none focus:border-ink transition-all italic text-xl placeholder:opacity-20"
            />
            <button 
              type="submit"
              className="w-full md:w-auto border border-ink py-5 px-16 text-xs uppercase tracking-[0.3em] font-sans hover:bg-ink hover:text-paper transition-all duration-700 active:scale-95"
            >
              S'abonner
            </button>
          </form>

          <div className="pt-12 flex flex-col items-center space-y-4">
            <div className="w-12 h-[1px] bg-ink/20" />
            <p className="text-[9px] uppercase tracking-[0.4em] opacity-30 leading-relaxed">
              Uniquement l'essentiel — Pas de superflu.
            </p>
          </div>
        </motion.div>
      </Section>

      {/* Footer */}
      <footer id="contact" className="py-24 px-12 border-t border-ink/5 text-center space-y-12">
        <div className="text-6xl md:text-9xl font-light tracking-tighter opacity-10">BOUDOIR</div>
        <div className="flex flex-wrap justify-center gap-12 text-sm uppercase tracking-[0.3em] font-sans opacity-60">
          <a href="#" className="hover:opacity-100 transition-opacity">Instagram</a>
          <button 
            onClick={() => {
              setCurrentPage("journal");
              window.scrollTo(0, 0);
            }}
            className="hover:opacity-100 transition-opacity"
          >
            Journal
          </button>
          <button 
            onClick={() => {
              setCurrentPage("recommendations");
              window.scrollTo(0, 0);
            }}
            className="hover:opacity-100 transition-opacity"
          >
            Recommandations
          </button>
          <a href="#" className="hover:opacity-100 transition-opacity">Newsletter</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Mentions</a>
        </div>
        <p className="text-xs italic opacity-40">© 2026 Boudoir. Fait avec amour à Paris.</p>
      </footer>
    </div>
  );
}
