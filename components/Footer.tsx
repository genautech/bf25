
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-card mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Ofertas Black Friday. Todos os direitos reservados.</p>
        <p className="text-sm mt-1">Um catálogo interativo de exemplo construído com React & Tailwind CSS.</p>
      </div>
    </footer>
  );
};

export default Footer;