
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { PlusIcon, MinusIcon, TrashIcon } from '../components/icons';

const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useAppContext();

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleExportCSV = () => {
    const headers = ['ID', 'Nome', 'Categoria', 'Preço', 'Quantidade', 'Preço Total'];
    const rows = cart.map(item => [
      item.id,
      `"${item.name.replace(/"/g, '""')}"`,
      item.category,
      item.price.toFixed(2),
      item.quantity,
      (item.price * item.quantity).toFixed(2)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'carrinho_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-300">Seu Carrinho está Vazio</h1>
        <p className="text-gray-400 mt-4">Parece que você ainda não adicionou nada ao seu carrinho.</p>
        <Link to="/">
            <Button className="mt-8">Começar a Comprar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-brand-primary">Carrinho de Compras</h1>
      <div className="bg-dark-card rounded-lg shadow-lg">
        {cart.map(item => (
          <div key={item.id} className="flex items-center p-4 border-b border-dark-border last:border-b-0 flex-wrap">
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-20 h-20 object-cover rounded-md mr-4"
              onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://picsum.photos/seed/${item.sku}/400/300`;
              }}
            />
            <div className="flex-grow">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-400">{item.category}</p>
              <p className="text-brand-primary font-bold mt-1">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
            <div className="flex items-center space-x-3 my-2 sm:my-0">
              <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-600 hover:bg-gray-500">
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-semibold">{item.quantity}</span>
              <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-600 hover:bg-gray-500">
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="w-24 text-right font-semibold text-lg ml-4">{(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <button onClick={() => removeFromCart(item.id)} className="ml-4 text-gray-400 hover:text-red-500">
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-dark-card rounded-lg flex justify-between items-center flex-wrap gap-4">
        <div>
          <p className="text-lg text-gray-300">Preço Total:</p>
          <p className="text-3xl font-extrabold text-brand-primary">{totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="danger" onClick={clearCart}>Limpar Carrinho</Button>
          <Button onClick={handleExportCSV}>Exportar como CSV</Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;