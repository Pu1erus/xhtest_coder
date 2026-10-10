import React, { useState, createContext, useContext, useCallback } from 'react';

// ==================== Types ====================
interface Product {
  id: number;
  name: string;
  nameEn: string;
  category: string;
  price: number;
  origin: string;
  roast: string;
  description: string;
  flavor: string[];
  image: string;
  weight: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// ==================== Data ====================
const products: Product[] = [
  {
    id: 1,
    name: '埃塞俄比亚 耶加雪菲',
    nameEn: 'Ethiopia Yirgacheffe',
    category: '单品',
    price: 128,
    origin: '埃塞俄比亚',
    roast: '浅度烘焙',
    description: '来自埃塞俄比亚耶加雪菲产区的精品咖啡豆，具有明亮的柑橘酸质和茉莉花香，口感如丝般顺滑。每一口都能感受到热带水果的甜美与花香的优雅交织。',
    flavor: ['柑橘', '茉莉花', '蜂蜜', '热带水果'],
    image: '☕',
    weight: '227g',
  },
  {
    id: 2,
    name: '哥伦比亚 慧兰',
    nameEn: 'Colombia Huila',
    category: '单品',
    price: 108,
    origin: '哥伦比亚',
    roast: '中度烘焙',
    description: '产自哥伦比亚慧兰地区海拔1700米以上的高山咖啡，具有均衡的酸度和醇厚度，带有焦糖和坚果的香甜风味，余韵悠长。',
    flavor: ['焦糖', '坚果', '巧克力', '红苹果'],
    image: '🫘',
    weight: '227g',
  },
  {
    id: 3,
    name: '经典意式拼配',
    nameEn: 'Classic Espresso Blend',
    category: '拼配',
    price: 88,
    origin: '多产区拼配',
    roast: '中深度烘焙',
    description: '由巴西、哥伦比亚和印尼三款优质咖啡豆精心拼配而成，专为意式浓缩设计。浓郁的巧克力风味搭配醇厚的口感，是制作拿铁和卡布奇诺的完美选择。',
    flavor: ['黑巧克力', '烤榛果', '焦糖', '烟熏'],
    image: '🏺',
    weight: '454g',
  },
  {
    id: 4,
    name: '肯尼亚 AA',
    nameEn: 'Kenya AA',
    category: '单品',
    price: 148,
    origin: '肯尼亚',
    roast: '浅度烘焙',
    description: '肯尼亚最高等级AA咖啡豆，产自海拔2000米的高原。具有独特的黑醋栗酸质和番茄般的浓郁风味，口感层次丰富，是精品咖啡爱好者的首选。',
    flavor: ['黑醋栗', '番茄', '葡萄柚', '红糖'],
    image: '🌿',
    weight: '227g',
  },
  {
    id: 5,
    name: '日落暖阳拼配',
    nameEn: 'Sunset Warmth Blend',
    category: '拼配',
    price: 98,
    origin: '多产区拼配',
    roast: '中度烘焙',
    description: '灵感来自温暖日落时分的金色光芒，由危地马拉和巴西咖啡豆拼配。口感温暖柔和，带有太妃糖和奶油的甜蜜，适合任何时刻享用。',
    flavor: ['太妃糖', '奶油', '杏仁', '香草'],
    image: '🌅',
    weight: '227g',
  },
  {
    id: 6,
    name: '低因瑞士水处理',
    nameEn: 'Swiss Water Decaf',
    category: '低因',
    price: 118,
    origin: '哥伦比亚',
    roast: '中度烘焙',
    description: '采用瑞士水处理法去除咖啡因，完整保留咖啡原始风味。来自哥伦比亚的优质阿拉比卡豆，即使晚间饮用也无负担，享受纯粹的咖啡时光。',
    flavor: ['可可', '榛果', '太妃糖', '橙皮'],
    image: '🍃',
    weight: '227g',
  },
];

const categories = ['全部', '单品', '拼配', '低因'];

// ==================== Context ====================
const CartContext = createContext<CartContextType | null>(null);

function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

// ==================== Components ====================

// Header Component
function Header({ 
  searchQuery, 
  setSearchQuery, 
  onCartClick 
}: { 
  searchQuery: string; 
  setSearchQuery: (q: string) => void; 
  onCartClick: () => void;
}) {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-amber-light/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">☕</span>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-bold text-warm-brown-dark leading-tight">
                醇香咖啡
              </h1>
              <p className="text-[10px] sm:text-xs text-mocha tracking-wider hidden sm:block">
                ARTISAN COFFEE
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4 sm:mx-8">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-amber text-sm"></i>
              <input
                type="text"
                placeholder="搜索咖啡..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-latte border border-amber-light/60 rounded-full text-sm text-coffee placeholder-mocha/60 focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all"
              />
            </div>
          </div>

          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="relative p-2 sm:p-3 rounded-full bg-warm-brown text-cream hover:bg-warm-brown-dark transition-colors"
          >
            <i className="fas fa-shopping-bag text-base sm:text-lg"></i>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-caramel text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-espresso via-warm-brown-dark to-warm-brown">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl sm:text-8xl">☕</div>
        <div className="absolute bottom-10 right-10 text-6xl sm:text-8xl">🫘</div>
        <div className="absolute top-1/2 left-1/3 text-4xl sm:text-6xl">✨</div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center">
          <p className="text-amber-light/80 text-sm sm:text-base tracking-[0.3em] uppercase mb-3 sm:mb-4 animate-fade-in">
            Specialty Coffee
          </p>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-cream mb-4 sm:mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            每一杯，都是旅程
          </h2>
          <p className="text-amber-light/70 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            我们精选全球优质产区的精品咖啡豆，以匠心烘焙，为您呈现咖啡最纯粹的风味。
            从产地到杯中，每一步都承载着对品质的执着追求。
          </p>
        </div>
      </div>
    </section>
  );
}

// Category Filter
function CategoryFilter({ 
  activeCategory, 
  setActiveCategory 
}: { 
  activeCategory: string; 
  setActiveCategory: (c: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            activeCategory === category
              ? 'bg-warm-brown text-cream shadow-lg shadow-warm-brown/20'
              : 'bg-latte text-warm-brown hover:bg-amber-light border border-amber-light/50'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

// Product Card
function ProductCard({ product, onViewDetail }: { product: Product; onViewDetail: (p: Product) => void }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div
      className="product-card bg-white rounded-2xl overflow-hidden border border-amber-light/30 cursor-pointer group"
      onClick={() => onViewDetail(product)}
    >
      {/* Product Image Area */}
      <div className="relative h-44 sm:h-52 bg-gradient-to-br from-latte to-cream-dark flex items-center justify-center overflow-hidden">
        <span className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-500">
          {product.image}
        </span>
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-warm-brown/90 text-cream text-xs rounded-full backdrop-blur-sm">
            {product.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 bg-amber/90 text-white text-xs rounded-full backdrop-blur-sm">
            {product.roast}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5">
        <div className="mb-2">
          <p className="text-xs text-mocha tracking-wider uppercase">{product.nameEn}</p>
          <h3 className="font-display text-base sm:text-lg font-semibold text-coffee mt-1">
            {product.name}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-mocha/80 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Flavor Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.flavor.slice(0, 3).map((f) => (
            <span key={f} className="px-2 py-0.5 bg-cream text-warm-brown-light text-[10px] sm:text-xs rounded-full border border-amber-light/40">
              {f}
            </span>
          ))}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-warm-brown-dark">¥{product.price}</span>
            <span className="text-xs text-mocha ml-1">/ {product.weight}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-full transition-all duration-300 ${
              added
                ? 'bg-green-500 text-white scale-110'
                : 'bg-warm-brown text-cream hover:bg-warm-brown-dark hover:scale-105'
            }`}
          >
            <i className={`fas ${added ? 'fa-check' : 'fa-plus'} text-sm`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}

// Product Detail Modal
function ProductDetail({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-espresso/60 backdrop-blur-sm"></div>
      <div
        className="relative bg-cream rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-warm-brown hover:bg-white transition-colors"
        >
          <i className="fas fa-times text-sm"></i>
        </button>

        {/* Image Area */}
        <div className="h-48 sm:h-64 bg-gradient-to-br from-latte via-cream-dark to-amber-light/30 flex items-center justify-center rounded-t-3xl">
          <span className="text-8xl sm:text-9xl">{product.image}</span>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 bg-warm-brown/10 text-warm-brown text-xs rounded-full">
              {product.category}
            </span>
            <span className="px-3 py-1 bg-amber/10 text-amber-dark text-xs rounded-full">
              {product.roast}
            </span>
            <span className="px-3 py-1 bg-mocha/10 text-mocha text-xs rounded-full">
              {product.origin}
            </span>
          </div>

          <p className="text-sm text-mocha tracking-wider uppercase">{product.nameEn}</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-coffee mt-1 mb-4">
            {product.name}
          </h2>

          <p className="text-sm sm:text-base text-warm-brown-light leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Flavor Profile */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-coffee mb-3">风味描述</h4>
            <div className="flex flex-wrap gap-2">
              {product.flavor.map((f) => (
                <span key={f} className="px-3 py-1.5 bg-latte text-warm-brown text-sm rounded-full border border-amber-light/40">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-latte/50 rounded-2xl">
            <div className="text-center">
              <p className="text-xs text-mocha">产地</p>
              <p className="text-sm font-semibold text-coffee mt-1">{product.origin}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-mocha">烘焙度</p>
              <p className="text-sm font-semibold text-coffee mt-1">{product.roast}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-mocha">规格</p>
              <p className="text-sm font-semibold text-coffee mt-1">{product.weight}</p>
            </div>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between pt-4 border-t border-amber-light/30">
            <div>
              <span className="text-3xl font-bold text-warm-brown-dark">¥{product.price}</span>
            </div>
            <button
              onClick={handleAddToCart}
              className={`px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                added
                  ? 'bg-green-500 text-white'
                  : 'btn-primary'
              }`}
            >
              <i className={`fas ${added ? 'fa-check' : 'fa-shopping-bag'}`}></i>
              {added ? '已添加' : '加入购物车'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart Sidebar
function CartSidebar({ isOpen, onClose, onCheckout }: { isOpen: boolean; onClose: () => void; onCheckout: () => void }) {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-espresso/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-cream shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-amber-light/30">
          <div className="flex items-center gap-2">
            <i className="fas fa-shopping-bag text-warm-brown"></i>
            <h2 className="font-display text-xl font-bold text-coffee">购物车</h2>
            <span className="px-2 py-0.5 bg-warm-brown/10 text-warm-brown text-xs rounded-full">
              {items.length} 件商品
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-latte flex items-center justify-center text-warm-brown hover:bg-amber-light transition-colors"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-6xl mb-4">🛒</span>
              <p className="text-mocha text-lg mb-2">购物车是空的</p>
              <p className="text-mocha/60 text-sm">快去挑选心仪的咖啡吧</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="bg-white rounded-xl p-4 border border-amber-light/20 shadow-sm">
                  <div className="flex gap-3">
                    <div className="w-14 h-14 bg-latte rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{item.product.image}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-coffee truncate">{item.product.name}</h4>
                      <p className="text-xs text-mocha mt-0.5">{item.product.weight}</p>
                      <p className="text-sm font-bold text-warm-brown-dark mt-1">¥{item.product.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-mocha/40 hover:text-red-500 transition-colors self-start"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-light/20">
                    <div className="flex items-center gap-0">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-l-lg bg-latte text-warm-brown hover:bg-amber-light transition-colors flex items-center justify-center"
                      >
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <span className="w-10 h-7 flex items-center justify-center bg-white border-y border-amber-light/30 text-sm font-medium text-coffee">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-r-lg bg-latte text-warm-brown hover:bg-amber-light transition-colors flex items-center justify-center"
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                    <span className="text-sm font-bold text-warm-brown-dark">
                      小计: ¥{item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-amber-light/30 bg-white/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-mocha">合计</span>
              <span className="text-2xl font-bold text-warm-brown-dark">¥{totalPrice}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full btn-primary py-3.5 rounded-full font-medium text-base flex items-center justify-center gap-2"
            >
              <i className="fas fa-lock text-sm"></i>
              去结算
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-2 py-2 text-sm text-mocha hover:text-warm-brown transition-colors"
            >
              清空购物车
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Checkout Modal
function CheckoutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
    clearCart();
  };

  const handleClose = () => {
    setStep('form');
    setFormData({ name: '', phone: '', address: '', note: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-espresso/60 backdrop-blur-sm"></div>
      <div
        className="relative bg-cream rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-warm-brown hover:bg-white transition-colors"
        >
          <i className="fas fa-times text-sm"></i>
        </button>

        {step === 'form' ? (
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <span className="text-4xl mb-3 block">📦</span>
              <h2 className="font-display text-2xl font-bold text-coffee">确认订单</h2>
              <p className="text-sm text-mocha mt-1">填写配送信息完成下单</p>
            </div>

            {/* Order Summary */}
            <div className="bg-latte/50 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-semibold text-coffee mb-3">订单明细</h4>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-warm-brown-light">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-coffee">¥{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-amber-light/30 mt-3 pt-3 flex justify-between">
                <span className="font-semibold text-coffee">合计</span>
                <span className="text-lg font-bold text-warm-brown-dark">¥{totalPrice}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-coffee mb-1">收货人</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-amber-light/40 rounded-xl text-sm text-coffee focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
                  placeholder="请输入姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee mb-1">联系电话</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-amber-light/40 rounded-xl text-sm text-coffee focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
                  placeholder="请输入手机号"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee mb-1">收货地址</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-amber-light/40 rounded-xl text-sm text-coffee focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 resize-none"
                  rows={2}
                  placeholder="请输入详细地址"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee mb-1">备注（选填）</label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-amber-light/40 rounded-xl text-sm text-coffee focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
                  placeholder="如：磨粉粗细要求等"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3.5 rounded-full font-medium text-base mt-6 flex items-center justify-center gap-2"
              >
                <i className="fas fa-credit-card"></i>
                确认支付 ¥{totalPrice}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center">
            <div className="animate-scale-in">
              <span className="text-7xl block mb-6">🎉</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-coffee mb-3">
                下单成功！
              </h2>
              <p className="text-mocha mb-2">感谢您的购买</p>
              <p className="text-sm text-mocha/70 mb-8">
                我们将尽快为您安排发货，请保持手机畅通。
              </p>
              <div className="bg-latte/50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-warm-brown-light">
                  <i className="fas fa-truck text-amber mr-2"></i>
                  预计 2-3 个工作日送达
                </p>
                <p className="text-sm text-warm-brown-light mt-2">
                  <i className="fas fa-envelope text-amber mr-2"></i>
                  订单确认已发送至您的手机
                </p>
              </div>
              <button
                onClick={handleClose}
                className="btn-primary px-8 py-3 rounded-full font-medium"
              >
                继续选购
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-espresso text-cream/70 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">☕</span>
              <h3 className="font-display text-lg font-bold text-cream">醇香咖啡</h3>
            </div>
            <p className="text-sm leading-relaxed">
              致力于将世界各地最优质的精品咖啡带到您的杯中。每一颗咖啡豆都经过严格筛选，每一次烘焙都倾注匠心。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-cream mb-3">联系我们</h4>
            <div className="space-y-2 text-sm">
              <p><i className="fas fa-map-marker-alt mr-2 text-amber"></i>上海市静安区南京西路1688号</p>
              <p><i className="fas fa-phone mr-2 text-amber"></i>021-8888-6666</p>
              <p><i className="fas fa-envelope mr-2 text-amber"></i>hello@chunxiang.coffee</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-cream mb-3">关注我们</h4>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-amber/30 transition-colors">
                <i className="fab fa-weixin text-sm"></i>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-amber/30 transition-colors">
                <i className="fab fa-weibo text-sm"></i>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-amber/30 transition-colors">
                <i className="fas fa-camera text-sm"></i>
              </a>
            </div>
            <p className="text-xs mt-4 text-cream/50">营业时间：周一至周日 8:00 - 22:00</p>
          </div>
        </div>
        <div className="border-t border-cream/10 pt-6 text-center text-xs text-cream/40">
          <p>© 2026 醇香咖啡 Artisan Coffee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ==================== Main App ====================
export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cart functions
  const addToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.flavor.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === '全部' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <CartContext.Provider
      value={{ items: cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      <div className="min-h-screen bg-cream">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCartClick={() => setIsCartOpen(true)}
        />

        <HeroSection />

        {/* Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-coffee mb-2">
              精选咖啡
            </h2>
            <p className="text-sm sm:text-base text-mocha">
              探索来自世界各地的精品咖啡豆
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8 sm:mb-10">
            <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} onViewDetail={setSelectedProduct} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="text-5xl block mb-4">🔍</span>
              <p className="text-lg text-mocha mb-2">未找到相关咖啡</p>
              <p className="text-sm text-mocha/60">试试其他关键词或分类吧</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('全部'); }}
                className="mt-4 btn-secondary px-6 py-2 rounded-full text-sm"
              >
                查看全部
              </button>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="bg-latte/50 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { icon: '🌍', title: '全球精选', desc: '来自世界顶级产区' },
                { icon: '🔥', title: '匠心烘焙', desc: '专业烘焙师精心制作' },
                { icon: '📦', title: '新鲜直达', desc: '烘焙后48小时内发货' },
                { icon: '💝', title: '品质保证', desc: '不满意全额退款' },
              ].map((feature) => (
                <div key={feature.title} className="text-center">
                  <span className="text-3xl sm:text-4xl block mb-3">{feature.icon}</span>
                  <h4 className="font-semibold text-coffee text-sm sm:text-base">{feature.title}</h4>
                  <p className="text-xs sm:text-sm text-mocha mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />

        {/* Modals */}
        {selectedProduct && (
          <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}

        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
        />

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
        />
      </div>
    </CartContext.Provider>
  );
}
