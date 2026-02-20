import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Menu,
  X,
  LogOut,
  User,
  Settings as SettingsIcon,
} from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartTotalItems, clearCart } from "../features/cart/cartSlice";
import { selectFavoritesCount } from "../features/favorites/favoritesSlice";
import { logout } from "../features/auth/authSlice";
import { clearOrders } from "../features/orders/ordersSlice";
import { clearAddresses } from "../features/addresses/addressesSlice";
import { clearPreferences } from "../features/preferences/preferencesSlice";

const NAV_LINKS = [
  { to: "/", label: "HOME", isActive: (location) => location.pathname === "/" },
  {
    to: "/products",
    label: "SHOP",
    isActive: (location) => location.pathname.startsWith("/products") && !location.search.includes("category=")
  },
  {
    to: "/products?category=Electronics",
    label: "ELECTRONICS",
    isActive: (location) => location.pathname === "/products" && location.search === "?category=Electronics"
  },
  {
    to: "/products?category=Clothing",
    label: "CLOTHING",
    isActive: (location) => location.pathname === "/products" && location.search === "?category=Clothing"
  },
];

const ACCOUNT_LINKS = [
  { to: "/profile", label: "My Profile", icon: User },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const totalItems = useSelector(selectCartTotalItems);
  const favoritesCount = useSelector(selectFavoritesCount);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearOrders());
    dispatch(clearAddresses());
    dispatch(clearPreferences());
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const closeMenus = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const navItemClassName = (active) =>
    active
      ? "text-[#d4af88] font-semibold text-sm tracking-wide border-b border-[#d4af88] pb-0 cursor-default"
      : "text-[#2d2d2d] hover:text-[#d4af88] font-medium text-sm tracking-wide transition";

  const renderCartLink = (className = "relative text-[#2d2d2d] hover:text-[#d4af88] transition") => (
    <Link to="/cart" className={className} onClick={closeMenus}>
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-3 -right-3 bg-[#d4af88] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );

  const renderFavoritesLink = (className = "relative text-[#2d2d2d] hover:text-[#d4af88] transition") => (
    <Link to="/favorites" className={className} onClick={closeMenus}>
      <Heart className="w-6 h-6" />
      {favoritesCount > 0 && (
        <span className="absolute -top-3 -right-3 bg-[#d4af88] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {favoritesCount}
        </span>
      )}
    </Link>
  );

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-[#e8e8e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-sm flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">
                  S
                </span>
              </div>
              <span className="font-serif font-bold text-2xl text-[#1a1a1a] tracking-tight">
                Sell<span className="text-[#d4af88]">ora</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-12">
            {NAV_LINKS.map((item) => {
              const active = item.isActive(location);
              if (active) {
                return (
                  <span key={item.to} className={navItemClassName(true)}>
                    {item.label}
                  </span>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={navItemClassName(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && renderFavoritesLink("relative text-[#2d2d2d] hover:text-[#d4af88] transition group")}
            {renderCartLink("relative text-[#2d2d2d] hover:text-[#d4af88] transition group")}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-6 py-2 border border-[#1a1a1a] text-[#1a1a1a] rounded-none font-medium text-sm tracking-wide hover:bg-[#1a1a1a] hover:text-white transition"
                >
                  <User className="w-4 h-4" />
                  {user?.name?.split(" ")[0] || "User"}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-[#e8e8e8] py-2 shadow-lg">
                    <div className="px-6 py-4 border-b border-[#e8e8e8]">
                      <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-[#666666] truncate">{user?.email}</p>
                    </div>
                    {ACCOUNT_LINKS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="block px-6 py-3 text-[#2d2d2d] hover:bg-[#f5f5f5] font-medium text-sm transition"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <span className="flex items-center gap-2">
                            {Icon && <Icon className="w-4 h-4" />}
                            {item.label}
                          </span>
                        </Link>
                      );
                    })}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-6 py-3 text-[#d4af88] hover:bg-[#f5f5f5] font-medium text-sm flex items-center gap-2 transition border-t border-[#e8e8e8]"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 border border-[#1a1a1a] text-[#1a1a1a] rounded-none font-medium text-sm tracking-wide hover:bg-[#1a1a1a] hover:text-white transition"
              >
                LOGIN
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            {isAuthenticated && renderFavoritesLink()}
            {renderCartLink()}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#2d2d2d] hover:text-[#d4af88] transition"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[#e8e8e8]">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {NAV_LINKS.map((item) => {
              const active = item.isActive(location);
              if (active) {
                return (
                  <span
                    key={item.to}
                    className="block px-4 py-3 text-[#d4af88] bg-[#f5f5f5] font-semibold text-sm cursor-default"
                  >
                    {item.label}
                  </span>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block px-4 py-3 text-[#2d2d2d] hover:bg-[#f5f5f5] font-medium text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-[#e8e8e8] mt-4">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 border-b border-[#e8e8e8]">
                    <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-[#666666] truncate">{user?.email}</p>
                  </div>
                  {ACCOUNT_LINKS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block px-4 py-3 text-[#2d2d2d] hover:bg-[#f5f5f5] font-medium text-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          {Icon && <Icon className="w-4 h-4" />}
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-[#d4af88] hover:bg-[#f5f5f5] font-medium text-sm flex items-center gap-2 border-t border-[#e8e8e8]"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-3 bg-[#1a1a1a] text-white font-medium text-sm text-center hover:bg-[#2d2d2d] transition"
                  onClick={() => setIsOpen(false)}
                >
                  LOGIN
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
