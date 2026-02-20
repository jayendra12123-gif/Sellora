import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Sell<span className="text-[#d4af88]">ora</span></h3>
            <p className="text-[#999999]">
              Your one-stop destination for premium products and exceptional shopping experience.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white uppercase tracking-wide text-xs">Quick Links</h4>
            <ul className="space-y-2 text-[#999999]">
              <li><Link to="/" className="hover:text-[#d4af88] transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-[#d4af88] transition">Products</Link></li>
              <li><Link to="/cart" className="hover:text-[#d4af88] transition">Cart</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-[#d4af88] transition">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#d4af88] transition">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white uppercase tracking-wide text-xs">Contact</h4>
            <p className="text-[#999999] text-sm">Email: support@sellorashop.com</p>
            <p className="text-[#999999] text-sm">Phone: (555) 123-4567</p>
          </div>
        </div>
        <div className="border-t border-[#333333] mt-8 pt-8 text-center text-[#666666]">
          &copy; {new Date().getFullYear()} Sellora. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
