import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'

function Home() {
    const [featured, setFeatured] = useState([])
    const [reviews, setReviews] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [formSuccess, setFormSuccess] = useState(false)

    useEffect(() => {
        fetch('/api/products/featured').then(r => r.json()).then(setFeatured).catch(console.error)
        fetch('/api/reviews').then(r => r.json()).then(setReviews).catch(console.error)
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
        return () => observer.disconnect()
    }, [featured, reviews])

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setSelectedProduct(null) }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [])

    const stars = (r) => '★'.repeat(r) + '☆'.repeat(5 - r)

    const handleContact = async (e) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.target))
        try {
            const res = await fetch('/api/contact', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
            })
            if ((await res.json()).success) {
                setFormSuccess(true); e.target.reset()
                setTimeout(() => setFormSuccess(false), 4000)
            }
        } catch (err) { console.error(err) }
    }

    return (
        <>
            {/* HERO */}
            <section className="pt-32 pb-20 bg-gradient-to-b from-periwinkle-light via-cream-light to-offwhite text-center">
                <div className="max-w-[1200px] mx-auto px-8">
                    <span className="inline-flex items-center gap-2 bg-cream/70 border border-cream-dark/30
            text-walnut text-[13px] uppercase tracking-[2px] font-semibold px-5 py-2.5 rounded-full
            mb-6 backdrop-blur-sm">
                        ☕ Toulouse · Since 2025
                    </span>
                    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6">
                        Healthy,<br />
                        <span className="italic font-normal text-walnut-medium">sans compromis</span><br />
                        sur le goût.
                    </h1>
                    <p className="text-gray-500 text-lg max-w-[500px] mx-auto mb-10 leading-relaxed">
                        Des boissons artisanales et pâtisseries saines, préparées avec amour chaque jour.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link to="/carte"
                            className="bg-walnut text-white font-semibold text-sm uppercase tracking-wider
                px-10 py-4 rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all">
                            Voir la carte
                        </Link>
                        <a href="#concept"
                            className="bg-white border border-gray-200 font-semibold text-sm uppercase tracking-wider
                px-10 py-4 rounded-full hover:-translate-y-0.5 hover:shadow-md transition-all">
                            Notre concept
                        </a>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="py-16 bg-offwhite">
                <div className="max-w-[1200px] mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[['100%', 'Fait Maison'], ['0%', 'Sucre Raffiné'], ['4.9', 'Avis Google']].map(([val, label]) => (
                            <div key={label} className="bg-white p-10 text-center rounded-2xl border border-gray-200
                hover:-translate-y-0.5 hover:shadow-md transition-all animate-on-scroll">
                                <span className="block text-5xl font-bold text-walnut font-display">{val}</span>
                                <span className="text-xs uppercase tracking-[2px] text-gray-400 font-medium mt-2 block">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED */}
            <section id="featured" className="py-20 bg-offwhite">
                <div className="max-w-[1200px] mx-auto px-8">
                    <div className="text-center mb-14 animate-on-scroll">
                        <span className="inline-flex items-center gap-2 bg-cream/70 text-walnut text-[13px]
              uppercase tracking-[2px] font-semibold px-5 py-2.5 rounded-full mb-4">
                            ✨ Sélection
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">Nos Incontournables</h2>
                        <p className="text-gray-500 max-w-lg mx-auto">Les coups de cœur de nos clients, à découvrir en priorité.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featured.length === 0 ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="skeleton h-[280px]" />
                            ))
                        ) : (
                            featured.map(p => <ProductCard key={p.id} product={p} onClick={setSelectedProduct} />)
                        )}
                    </div>
                </div>
            </section>

            {/* CONCEPT */}
            <section id="concept" className="py-20 bg-white">
                <div className="max-w-[1200px] mx-auto px-8">
                    <div className="text-center mb-14 animate-on-scroll">
                        <span className="inline-flex items-center gap-2 bg-cream/70 text-walnut text-[13px]
              uppercase tracking-[2px] font-semibold px-5 py-2.5 rounded-full mb-4">
                            🌿 Philosophie
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl font-bold">Simple. Bon.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-on-scroll">
                        <div>
                            <h3 className="font-display text-2xl font-bold mb-4">Des recettes pensées pour le quotidien</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">
                                Smook propose des recettes pensées pour le quotidien : moins sucrées,
                                plus équilibrées, et toujours gourmandes. Chaque ingrédient est
                                sélectionné avec soin pour le goût et la qualité.
                            </p>
                            <ul className="flex flex-col gap-3">
                                {['Ingrédients 100% naturels', 'Laits végétaux premium', 'Zéro sucre raffiné ajouté', 'Fait maison chaque jour'].map(item => (
                                    <li key={item} className="flex items-center gap-3 bg-cream-light px-5 py-3.5 rounded-xl
                    border-l-4 border-cream text-walnut font-medium text-sm">
                                        <span className="text-cream-dark">✦</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-cover bg-center rounded-2xl min-h-[350px] md:min-h-[475px]"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80')" }} />
                    </div>
                </div>
            </section>

            {/* REVIEWS */}
            <section id="reviews" className="py-20 bg-offwhite">
                <div className="max-w-[1200px] mx-auto px-8">
                    <div className="text-center mb-14 animate-on-scroll">
                        <span className="inline-flex items-center gap-2 bg-cream/70 text-walnut text-[13px]
              uppercase tracking-[2px] font-semibold px-5 py-2.5 rounded-full mb-4">
                            💬 Témoignages
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">Avis Clients</h2>
                        <p className="text-gray-500">Ce que nos clients pensent de Smook.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {reviews.length === 0 ? (
                            Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-[200px]" />)
                        ) : (
                            reviews.map(r => (
                                <div key={r.id} className="bg-white p-8 rounded-2xl border border-gray-200
                  hover:-translate-y-0.5 hover:shadow-md transition-all animate-on-scroll">
                                    <div className="text-amber-400 text-lg mb-4 tracking-widest">{stars(r.rating)}</div>
                                    <p className="text-gray-600 mb-4 italic leading-relaxed">"{r.content}"</p>
                                    <span className="text-walnut font-semibold text-sm">{r.author_name}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section id="contact" className="py-20 bg-white">
                <div className="max-w-[1200px] mx-auto px-8">
                    <div className="text-center mb-14 animate-on-scroll">
                        <span className="inline-flex items-center gap-2 bg-cream/70 text-walnut text-[13px]
              uppercase tracking-[2px] font-semibold px-5 py-2.5 rounded-full mb-4">
                            📍 Nous trouver
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl font-bold">Contact</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden animate-on-scroll">
                        <div className="bg-walnut text-white p-10 md:p-14 flex flex-col justify-center">
                            <h3 className="font-display text-2xl font-bold mb-4">Venez nous voir</h3>
                            <p className="leading-[2] text-white/80">
                                📍 12 rue Exemple, 31000 Toulouse<br />
                                ⏰ Lun – Sam : 8h – 18h<br />
                                ☎️ 05 61 00 00 00<br />
                                ✉️ hello@smook.cafe
                            </p>
                        </div>
                        <div className="bg-offwhite p-10 md:p-14">
                            <h3 className="font-display text-2xl font-bold mb-6">Écrivez-nous</h3>
                            <form onSubmit={handleContact} className="flex flex-col gap-4">
                                <input type="text" name="name" placeholder="Votre nom" required
                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl
                    focus:outline-none focus:border-cream-dark focus:shadow-[0_0_0_3px_rgba(245,222,201,0.4)]
                    transition-all text-sm" />
                                <input type="email" name="email" placeholder="Votre email" required
                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl
                    focus:outline-none focus:border-cream-dark focus:shadow-[0_0_0_3px_rgba(245,222,201,0.4)]
                    transition-all text-sm" />
                                <textarea name="message" placeholder="Votre message" rows="4" required
                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl
                    focus:outline-none focus:border-cream-dark focus:shadow-[0_0_0_3px_rgba(245,222,201,0.4)]
                    transition-all text-sm resize-y" />
                                <button type="submit"
                                    className="w-full bg-walnut text-white font-semibold text-sm uppercase tracking-wider
                    py-4 rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all">
                                    Envoyer
                                </button>
                                {formSuccess && (
                                    <div className="text-green-600 bg-green-50 border border-green-200 rounded-xl
                    p-4 text-center text-sm font-medium animate-fade-in">
                                        ✅ Message envoyé avec succès !
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        </>
    )
}

export default Home
