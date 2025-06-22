'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLiveMode } from '@/contexts/LiveModeContext';

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'voice', label: 'Voice' },
  { id: 'llama', label: 'Recipe AI' },
  { id: 'sam2', label: 'Vision AI' },
  { id: 'vjepa', label: 'Prediction AI' },
  { id: 'demo', label: 'Demo' },
  { id: 'setup', label: 'Setup' },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLiveMode, setIsLiveMode } = useLiveMode();

  useEffect(() => {
    const handleScroll = () => {
      // Check if page is scrolled for navbar background
      setIsScrolled(window.scrollY > 20);

      // Find active section
      const sections = navItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(section => section.element);

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Height of navbar
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-2"
            >
              <img 
                src="/logo.svg" 
                alt="Llama-Cook Logo" 
                className={`h-12 w-auto transition-opacity duration-300 ${
                  isScrolled ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <span className={`text-xl font-bold text-gray-900 transition-opacity duration-300 ${
                isScrolled ? 'opacity-100' : 'opacity-0'
              }`}>Llama-Cook</span>
            </button>
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  activeSection === item.id
                    ? 'bg-basil/10 text-basil'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
            
            {/* Mode Toggle */}
            <motion.div 
              className="ml-4 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
            >
              <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setIsLiveMode(false)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    !isLiveMode 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Demo
                </button>
                <button
                  onClick={() => setIsLiveMode(true)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isLiveMode 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Live
                </button>
              </div>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Mobile menu implementation can be added later
            }}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}