import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";

const NAV_LINKS = [
  { label: "Hero", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace("#", ""));

export default function Nav() {
  const { profile } = useApp();
  const siteTitle =
    profile?.fullName?.trim() || profile?.username?.trim() || "Portfolio";

  const [activeSection, setActiveSection] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: "-40% 0px -55% 0px",
      threshold: 0,
    });

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -88, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-portfolio-cream/90 backdrop-blur-sm border-b border-portfolio-border"
      style={{ WebkitBackdropFilter: "blur(8px)" }}
    >
      <div className="max-w-portfolio mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#hero");
          }}
          className="font-black text-xl text-portfolio-black tracking-tight relative"
          aria-label={`Home — ${siteTitle}`}
          whileHover={{ color: "#CC1A1A" }}
          transition={{ duration: 0.15 }}
        >
          {siteTitle}
        </motion.a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }, i) => {
            const isActive = activeSection === href.replace("#", "");
            return (
              <motion.a
                key={href}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(href);
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15 + i * 0.05,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative text-sm font-semibold uppercase tracking-widest py-1 group"
                style={{ color: isActive ? "#CC1A1A" : "#6B6B6B" }}
                whileHover={{ color: "#1A1A1A" }}
              >
                {label}
                {/* Animated underline on hover */}
                <motion.span
                  className="absolute bottom-0 left-0 h-[1.5px] bg-portfolio-black origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: "100%" }}
                />
                {/* Active section red dot indicator */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-portfolio-red"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.a>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="block w-6 h-[2px] bg-portfolio-black origin-center"
          />
          <motion.span
            animate={
              menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }
            }
            transition={{ duration: 0.2 }}
            className="block w-6 h-[2px] bg-portfolio-black origin-center"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="block w-6 h-[2px] bg-portfolio-black origin-center"
          />
        </button>
      </div>

      {/* Mobile menu — AnimatePresence for smooth enter/exit */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden border-t border-portfolio-border bg-portfolio-cream overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-5">
              {NAV_LINKS.map(({ label, href }, i) => {
                const isActive = activeSection === href.replace("#", "");
                return (
                  <motion.a
                    key={href}
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(href);
                    }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{
                      delay: i * 0.04,
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-sm font-semibold uppercase tracking-widest flex items-center gap-3"
                    style={{ color: isActive ? "#CC1A1A" : "#6B6B6B" }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="mobile-nav-dot"
                        className="w-1.5 h-1.5 rounded-full bg-portfolio-red shrink-0"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    {label}
                  </motion.a>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
