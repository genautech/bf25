
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ShoppingCartIcon, HeartIcon, ShieldCheckIcon } from './icons';

const Header: React.FC = () => {
  const { cart, favorites } = useAppContext();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const favoritesCount = favorites.length;

  // FIX: Explicitly type NavItem as React.FC to handle children prop correctly.
  const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
    <NavLink 
        to={to} 
        className={({ isActive }) => 
            `relative flex items-center p-2 rounded-md transition-colors duration-200 ${
                isActive ? 'bg-gray-700 text-brand-primary' : 'hover:bg-gray-700'
            }`
        }
    >
        {children}
    </NavLink>
);

  return (
    <header className="bg-dark-card shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-brand-primary hover:text-brand-secondary transition-colors">
          OFERTAS BLACK FRIDAY
        </Link>
        <div className="flex items-center space-x-4">
          <NavItem to="/admin">
            <ShieldCheckIcon className="w-6 h-6 mr-1" />
            <span className="hidden sm:inline">Admin</span>
          </NavItem>
          <NavItem to="/favorites">
            <HeartIcon className="w-6 h-6" />
            {favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </NavItem>
          <NavItem to="/cart">
            <ShoppingCartIcon className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </NavItem>
        </div>
      </nav>
    </header>
  );
};

export default Header;