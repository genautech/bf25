import React from 'react';
import { Product } from '../types';
import { calculateProfit } from '../utils/price';
import { DollarSignIcon, PercentIcon, ShoppingCartIcon } from './icons';

interface MarginDashboardProps {
  products: Product[];
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; description: string }> = ({ icon, title, value, description }) => (
    <div className="bg-gray-700 p-4 rounded-lg flex items-start">
        <div className="bg-brand-primary p-3 rounded-md mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    </div>
);


const MarginDashboard: React.FC<MarginDashboardProps> = ({ products }) => {
  const totalPotentialProfit = products.reduce((acc, product) => acc + calculateProfit(product), 0);
  const productsWithMargin = products.filter(p => p.margin && p.margin > 0);
  const totalMarginSum = products.reduce((acc, p) => acc + (p.margin || 0), 0);
  const averageMargin = products.length > 0 ? totalMarginSum / products.length : 0;
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-200 mb-4">Dashboard de Lucratividade</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
            icon={<DollarSignIcon className="w-6 h-6 text-gray-900" />}
            title="Lucro Potencial Total"
            value={totalPotentialProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            description="Soma do lucro de todos os produtos"
        />
        <StatCard 
            icon={<PercentIcon className="w-6 h-6 text-gray-900" />}
            title="Média de Margem"
            value={`${averageMargin.toFixed(2)}%`}
            description="Margem de lucro média do catálogo"
        />
        <StatCard 
            icon={<ShoppingCartIcon className="w-6 h-6 text-gray-900" />}
            title="Produtos com Margem"
            value={`${productsWithMargin.length} / ${products.length}`}
            description="Produtos com margem > 0%"
        />
      </div>
    </div>
  );
};

export default MarginDashboard;
