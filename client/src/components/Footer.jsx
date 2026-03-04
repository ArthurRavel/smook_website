import { Link } from 'react-router-dom'
import logoPeriwinkle from '../assets/logos/Logo 1.svg'

function Footer() {
    return (
        <footer className="bg-walnut text-white pt-16 pb-8">
            <div className="max-w-[1200px] mx-auto px-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-10 flex-wrap">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="inline-block mb-4">
                            <img src={logoPeriwinkle} alt="Smook" className="h-9" />
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-[280px]">
                            Coffee shop healthy à Toulouse.<br />
                            Simple. Bon. Sans compromis.<br />
                            © 2025 Smook.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-sm uppercase tracking-wider mb-4 text-cream">Navigation</h4>
                        <ul className="flex flex-col gap-2.5">
                            <li><Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">Accueil</Link></li>
                            <li><Link to="/carte" className="text-sm text-white/60 hover:text-white transition-colors">La Carte</Link></li>
                            <li><a href="/#concept" className="text-sm text-white/60 hover:text-white transition-colors">Concept</a></li>
                            <li><a href="/#contact" className="text-sm text-white/60 hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-sm uppercase tracking-wider mb-4 text-cream">Suivez-nous</h4>
                        <div className="flex gap-3">
                            {['IG', 'FB', 'TIK'].map(name => (
                                <a key={name} href="#"
                                    className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center
                    text-white text-[13px] font-semibold hover:bg-cream hover:text-walnut
                    hover:-translate-y-0.5 transition-all"
                                    aria-label={name}>
                                    {name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 text-center text-[13px] text-white/40">
                    Smook — Tous droits réservés · 2025
                </div>
            </div>
        </footer>
    )
}

export default Footer
