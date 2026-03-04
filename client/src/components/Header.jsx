import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoCream from '../assets/logos/Logo 2.svg'

function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        setMenuOpen(false)
        document.body.style.overflow = ''
    }, [location])

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
        document.body.style.overflow = !menuOpen ? 'hidden' : ''
    }

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300
      ${scrolled ? 'bg-offwhite/90 backdrop-blur-xl shadow-sm py-2.5' : ''}`}>
            <div className="max-w-[1200px] mx-auto px-8">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logoCream} alt="Smook" className="h-10 w-auto hover:scale-105 transition-transform" />
                    </Link>

                    <nav className={menuOpen
                        ? 'fixed inset-0 bg-offwhite z-[150] flex items-center justify-center'
                        : 'hidden md:block'}>
                        <ul className={`flex gap-9 ${menuOpen ? 'flex-col items-center gap-8 text-xl' : ''}`}>
                            <li>
                                <Link to="/carte"
                                    className={`font-medium text-sm uppercase tracking-wider relative py-1 hover:after:w-full
                    after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-0.5
                    after:bg-cream-dark after:rounded after:transition-all after:duration-300
                    ${location.pathname === '/carte' ? 'after:w-full' : ''}`}>
                                    La Carte
                                </Link>
                            </li>
                            <li>
                                <a href={location.pathname === '/' ? '#featured' : '/#featured'}
                                    className="font-medium text-sm uppercase tracking-wider hover:text-walnut-medium transition-colors">
                                    Sélection
                                </a>
                            </li>
                            <li>
                                <a href={location.pathname === '/' ? '#concept' : '/#concept'}
                                    className="font-medium text-sm uppercase tracking-wider hover:text-walnut-medium transition-colors">
                                    Concept
                                </a>
                            </li>
                            <li>
                                <a href={location.pathname === '/' ? '#contact' : '/#contact'}
                                    className="font-medium text-sm uppercase tracking-wider hover:text-walnut-medium transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <button
                        className={`flex md:hidden flex-col gap-[5px] bg-transparent border-none p-2 z-[200] cursor-pointer`}
                        onClick={toggleMenu}
                        aria-label="Menu">
                        <span className={`block w-6 h-0.5 bg-walnut rounded transition-all duration-300
              ${menuOpen ? 'rotate-45 translate-x-[5px] translate-y-[5px]' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-walnut rounded transition-all duration-300
              ${menuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-walnut rounded transition-all duration-300
              ${menuOpen ? '-rotate-45 translate-x-[5px] -translate-y-[5px]' : ''}`} />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header
