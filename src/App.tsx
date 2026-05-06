/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect, ReactNode } from "react";
import { getDriveUrl, DRIVE_MAPPING } from "./lib/drive";

const Section = ({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`min-h-screen relative py-24 px-6 md:px-12 lg:px-24 ${className}`}>
    {children}
  </section>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "book">("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollectionsSubMenuOpen, setIsCollectionsSubMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("toutes");

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

  const filteredProducts = selectedCategory === "toutes" 
    ? DRIVE_MAPPING.products 
    : DRIVE_MAPPING.products.filter(p => p.category === selectedCategory);

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

  if (currentPage === "book") {
    const bookImages = (DRIVE_MAPPING as any).bookGallery;
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-paper">
        <div className="grain" />
        
        {/* Navigation override for back button */}
        <nav className="fixed top-0 left-0 w-full z-40 flex justify-between items-center p-8 mix-blend-difference text-white">
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
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:opacity-50 transition-opacity"
          >
            {isMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
          </button>
        </nav>

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

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="grain" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-40 flex justify-between items-center p-8 mix-blend-difference text-white">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl tracking-[0.2em] font-light cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          BOUDOIR
        </motion.div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:opacity-50 transition-opacity"
        >
          {isMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
        </button>
      </nav>

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
        </div>
      </Section>

      {/* Product Showcase (The rest of the photos) */}
      <Section id="collections" className="bg-paper">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.5em] font-sans opacity-50">La Collection</span>
          <h2 className="text-4xl italic mt-4">Le Carnet de Vente</h2>
        </div>

        {/* Category Filters */}
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
          {filteredProducts.map((product, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="group cursor-pointer"
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
          <a href="#" className="hover:opacity-100 transition-opacity">Journal</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Newsletter</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Mentions</a>
        </div>
        <p className="text-xs italic opacity-40">© 2026 Boudoir. Fait avec amour à Paris.</p>
      </footer>
    </div>
  );
}
