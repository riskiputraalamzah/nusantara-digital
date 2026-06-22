import { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo-noekarta.png';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const menuRef = useRef(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    // Scroll listener untuk efek floating navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        <>

            <div className="h-[80px] md:h-[88px] w-full"></div>

            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'pt-4 px-4 sm:px-6 md:px-8' : 'pt-0 px-0'}`}>
                <nav
                    ref={menuRef}
                    className={`mx-auto w-full relative transition-all duration-500 ease-in-out font-poppins ${isScrolled
                            ? 'bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full px-6 md:px-10 lg:px-12 py-3 max-w-6xl border border-gray-100/50'
                            : 'bg-white px-6 md:px-12 lg:px-24 py-5 border-b border-gray-100 max-w-full'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        {/* Bagian Logo */}
                        <div className="flex items-center shrink-0">
                            <a href="/">
                                <img src={logo} alt="Noekarta Logo" className="h-8 md:h-10 w-auto" />
                            </a>
                        </div>

                        {/* Tautan Navigasi (Desktop) */}
                        <div className="hidden lg:flex items-center gap-8 lg:gap-12 absolute left-1/2 -translate-x-1/2">
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
                                className={`lg:hidden relative w-7 h-7 flex items-center justify-center text-gray-800 hover:text-red-600 transition-colors focus:outline-none ${isMobileMenuOpen ? 'burger-open' : ''}`}
                                aria-label="Toggle menu"
                            >
                                <span className="burger-line burger-line-top" />
                                <span className="burger-line burger-line-mid" />
                                <span className="burger-line burger-line-bot" />
                            </button>
                        </div>
                    </div>

                    {/* Overlay Menu Mobile */}
                    <div className={`mobile-menu absolute left-0 w-full bg-white shadow-lg z-50 lg:hidden ${isMobileMenuOpen ? 'menu-open' : ''} ${isScrolled ? 'top-full mt-3 rounded-2xl border border-gray-100 overflow-hidden' : 'top-full border-t border-gray-100'}`}>
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
                </nav>
            </header>

            {/* Backdrop gelap saat menu mobile terbuka */}
            <div
                className={`menu-backdrop fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden ${isMobileMenuOpen ? 'menu-open' : ''}`}
                style={{ top: menuRef.current?.getBoundingClientRect().bottom || 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
            />
        </>
    );
};

export default Navbar;
