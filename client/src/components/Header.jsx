import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logoCream from '../assets/logos/Logo 2.svg'

function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        setMenuOpen(false)
        document.body.style.overflow = ''
    }, [location])

    useEffect(() => {
        if (location.hash) {
            const el = document.querySelector(location.hash)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        }
    }, [location])

    const scrollToSection = (hash) => {
        if (location.pathname === '/') {
            const el = document.querySelector(hash)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        } else {
            navigate('/' + hash)
        }
    }

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
        document.body.style.overflow = !menuOpen ? 'hidden' : ''
    }

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300
      ${scrolled ? 'bg-offwhite/90 backdrop-blur-xl shadow-sm py-2.5' : ''}`}>
            <div className="max-w-[1200px] mx-auto px-8">
                <div className="flex items-center justify-between">
                    {/* Left: nav links */}
                    <nav className={menuOpen
                        ? 'fixed inset-0 bg-offwhite z-[150] flex items-center justify-center'
                        : 'hidden md:flex items-center gap-9'}>
                        <ul className={`flex gap-9 ${menuOpen ? 'flex-col items-center gap-8 text-xl' : ''}`}>
                            <li>
                                <button onClick={() => scrollToSection('#featured')}
                                    className="font-medium text-sm uppercase tracking-wider hover:text-walnut-medium transition-colors bg-transparent border-none cursor-pointer">
                                    Sélection
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollToSection('#concept')}
                                    className="font-medium text-sm uppercase tracking-wider hover:text-walnut-medium transition-colors bg-transparent border-none cursor-pointer">
                                    Concept
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollToSection('#contact')}
                                    className="font-medium text-sm uppercase tracking-wider hover:text-walnut-medium transition-colors bg-transparent border-none cursor-pointer">
                                    Contact
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {/* Center: logo */}
                    <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="absolute left-1/2 -translate-x-1/2 flex items-center cursor-pointer">
                        <img src={logoCream} alt="Smook" className="h-10 w-auto hover:scale-105 transition-transform" />
                    </Link>

                    {/* Right: La Carte + hamburger */}
                    <div className="flex items-center gap-4">
                        <Link to="/carte"
                            className={`hidden md:block font-medium text-sm uppercase tracking-wider relative py-1 hover:after:w-full
                            after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-0.5
                            after:bg-cream-dark after:rounded after:transition-all after:duration-300
                            ${location.pathname === '/carte' ? 'after:w-full' : ''}`}>
                            La Carte
                        </Link>

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
            </div>
        </header>
    )
}

export default Header
