import React, { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "../contexts/LangContext";

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
    { code: 'ar', name: 'العربية', flag: '🇹🇳', nativeName: 'العربية' }
  ];

  const currentLang = languages.find(lang => lang.code === language);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animation de fermeture
  const handleLanguageChange = (langCode) => {
    setIsOpen(false);
    changeLanguage(langCode);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton principal avec glassmorphism */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-3 
          px-4 py-3 
          bg-white/80 backdrop-blur-lg
          border border-white/20 
          rounded-2xl
          hover:bg-white/90 
          hover:shadow-lg
          hover:scale-105
          active:scale-95
          transition-all duration-300
          shadow-sm
          group
        "
      >
        {/* Icône Globe avec animation */}
        <div className="relative">
          <Globe 
            size={20} 
            className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300" 
          />
          {/* Point indicateur */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        
        {/* Texte de la langue actuelle */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
            {currentLang?.nativeName}
          </span>
          <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
            {language === 'fr' ? 'Langue' : 'اللغة'}
          </span>
        </div>

        {/* Flèche animée */}
        <div className={`
          transform transition-transform duration-300
          ${isOpen ? 'rotate-180' : 'rotate-0'}
        `}>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="text-gray-400 group-hover:text-gray-600"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown avec animations */}
      {isOpen && (
        <div className="
          absolute top-full right-0 mt-3
          bg-white/95 backdrop-blur-xl
          border border-white/30
          rounded-2xl
          shadow-2xl
          shadow-black/10
          overflow-hidden
          z-50
          min-w-[200px]
          animate-in fade-in-0 zoom-in-95
          duration-300
        ">
          {/* Header du dropdown */}
          <div className="p-4 border-b border-gray-100/50">
            <h3 className="text-sm font-semibold text-gray-700">
              {language === 'fr' ? 'Choisir la langue' : 'اختر اللغة'}
            </h3>
          </div>

          {/* Liste des langues */}
          <div className="p-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`
                  w-full flex items-center gap-3 
                  px-3 py-3 
                  rounded-xl
                  transition-all duration-200
                  group
                  ${language === lang.code 
                    ? 'bg-blue-50/80 border border-blue-100' 
                    : 'hover:bg-gray-50/80 border border-transparent'
                  }
                `}
              >
                {/* Drapeau */}
                <span className="text-2xl transition-transform group-hover:scale-110">
                  {lang.flag}
                </span>

                {/* Informations langue */}
                <div className="flex flex-col items-start flex-1">
                  <span className={`
                    text-sm font-medium transition-colors
                    ${language === lang.code ? 'text-blue-600' : 'text-gray-700'}
                  `}>
                    {lang.nativeName}
                  </span>
                  <span className={`
                    text-xs transition-colors
                    ${language === lang.code ? 'text-blue-500' : 'text-gray-500'}
                  `}>
                    {lang.name}
                  </span>
                </div>

                {/* Checkmark pour la langue sélectionnée */}
                {language === lang.code && (
                  <div className="
                    flex items-center justify-center
                    w-5 h-5 
                    bg-blue-500 
                    rounded-full
                    animate-in zoom-in-50 duration-300
                  ">
                    <Check size={12} className="text-white" />
                  </div>
                )}

                {/* Effet hover pour les autres langues */}
                {language !== lang.code && (
                  <div className="
                    w-5 h-5 
                    border-2 border-gray-300 
                    rounded-full
                    group-hover:border-blue-300
                    transition-colors duration-200
                  "></div>
                )}
              </button>
            ))}
          </div>

          {/* Footer avec effet de brillance */}
          <div className="
            h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
            animate-pulse
          "></div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;