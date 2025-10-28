import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import { PlusIcon, MinusIcon, TrashIcon } from '../components/icons';
import { calculateFinalPrice } from '../utils/price';

const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useAppContext();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + calculateFinalPrice(item) * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    if (!window.confirm("Isso irá gerar um arquivo CSV do seu pedido e limpar o carrinho. Deseja continuar?")) {
        return;
    }

    // 1. Generate CSV content
    const headers = ['SKU', 'Nome do Produto', 'Quantidade', 'Preço Unitário (BRL)', 'Subtotal (BRL)'];
    const rows = cart.map(item => {
      const finalPrice = calculateFinalPrice(item);
      const itemSubtotal = finalPrice * item.quantity;
      // Garante que nomes com vírgula fiquem entre aspas
      const safeName = `"${item.name.replace(/"/g, '""')}"`;
      
      return [
        item.id,
        safeName,
        item.quantity,
        finalPrice.toFixed(2).replace('.',','), // Formato de moeda brasileiro
        itemSubtotal.toFixed(2).replace('.',',')
      ].join(';'); // Usa ponto e vírgula como separador para evitar conflitos com a vírgula decimal
    });

    const csvContent = [headers.join(';'), ...rows].join('\n');
    
    // 2. Trigger download
    // Adiciona BOM para garantir compatibilidade com Excel
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); 
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const timestamp = new Date().toISOString().slice(0, 10); // Formato AAAA-MM-DD
    link.setAttribute("download", `pedido_blackfriday_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // 3. Clear cart and navigate
    alert("Pedido exportado com sucesso! O seu carrinho foi limpo.");
    clearCart();
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-300">Seu Carrinho está Vazio</h1>
        <p className="text-gray-400 mt-4">Adicione produtos para vê-los aqui.</p>
        <Link to="/">
          <Button className="mt-8">Continuar Comprando</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-primary">Seu Carrinho</h1>
        <Button variant="danger" onClick={clearCart}>Limpar Carrinho</Button>
      </div>

      <div className="bg-dark-card rounded-lg shadow-md">
        {cart.map(item => (
          <div key={item.id} className="flex items-center p-4 border-b border-dark-border last:border-b-0 flex-wrap">
            <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
            <div className="flex-grow">
              <h2 className="font-bold text-lg">{item.name}</h2>
              <p className="text-sm text-gray-400">{calculateFinalPrice(item).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
            <div className="flex items-center my-2 sm:my-0">
              <Button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} size="sm" variant="secondary" className="p-2">
                <MinusIcon className="w-4 h-4" />
              </Button>
              <span className="px-4 font-bold w-12 text-center">{item.quantity}</span>
              <Button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} size="sm" variant="secondary" className="p-2">
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
            <div className="font-bold text-lg mx-4 w-32 text-right">
              {(calculateFinalPrice(item) * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <Button onClick={() => removeFromCart(item.id)} variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10 p-2">
              <TrashIcon className="w-5 h-5" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-end">
        <div className="w-full max-w-sm bg-dark-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span className="font-bold">{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">Taxas e frete serão calculados na finalização.</p>
          <Button onClick={handleCheckout} className="w-full mt-6">Finalizar Compra</Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;