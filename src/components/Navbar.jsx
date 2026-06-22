import { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo-noekarta.png';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    // Tutup menu mobile saat klik di luar navbar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    // Kunci scroll body saat menu mobile terbuka
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { label: 'Beranda', href: '#' },
        { label: 'Beranda', href: '#' },
        { label: 'Beranda', href: '#' },
        { label: 'Beranda', href: '#' },
    ];

    return (
        <nav ref={menuRef} className="w-full bg-white px-6 md:px-12 lg:px-24 py-5 z-50 relative border-b border-gray-100 font-poppins">
            <div className="flex items-center justify-between">
                {/* Bagian Logo */}
                <div className="flex items-center shrink-0">
                    <a href="/">
                        <img src={logo} alt="Noekarta Logo" className="h-8 md:h-10 w-auto" />
                    </a>
                </div>

                {/* Tautan Navigasi (Desktop) */}
                <div className="hidden md:flex items-center gap-8 lg:gap-12 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map((link, i) => (
                        <a
                            key={i}
                            href={link.href}
                            className="relative text-gray-800 font-medium hover:text-red-600 transition-colors py-1 nav-link-animated"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Sisi Kanan Bahasa + Menu Burger */}
                <div className="flex items-center gap-4">
                    {/* pilih bahasa */}
                    <button className="flex items-center gap-1.5 text-gray-800 hover:text-black font-medium transition-colors focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                            <path d="M2 12h20" />
                        </svg>
                        <span className="text-sm tracking-wide">EN</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    {/* Tombol Menu Burger (Mobile) */}
                    <button
                        onClick={toggleMobileMenu}
                        className={`md:hidden relative w-7 h-7 flex items-center justify-center text-gray-800 hover:text-red-600 transition-colors focus:outline-none ${isMobileMenuOpen ? 'burger-open' : ''}`}
                        aria-label="Toggle menu"
                    >
                        <span className="burger-line burger-line-top" />
                        <span className="burger-line burger-line-mid" />
                        <span className="burger-line burger-line-bot" />
                    </button>
                </div>
            </div>

            {/* Overlay Menu Mobile */}
            <div className={`mobile-menu absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg z-50 md:hidden ${isMobileMenuOpen ? 'menu-open' : ''}`}>
                <div className="flex flex-col items-center gap-1 py-6">
                    {navLinks.map((link, i) => (
                        <a
                            key={i}
                            href={link.href}
                            className="mobile-link w-full text-center py-3 text-gray-800 font-medium hover:text-red-600 hover:bg-red-50 text-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>

            {/* Backdrop gelap saat menu mobile terbuka */}
            <div
                className={`menu-backdrop fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden ${isMobileMenuOpen ? 'menu-open' : ''}`}
                style={{ top: menuRef.current?.getBoundingClientRect().bottom || 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
            />
        </nav>
    );
};

export default Navbar;
