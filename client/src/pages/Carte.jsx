import { useState, useEffect } from 'react'
import ProductModal from '../components/ProductModal'

function Carte() {
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            fetch('/api/categories').then(r => r.json()),
            fetch('/api/products').then(r => r.json())
        ])
            .then(([cats, prods]) => { setCategories(cats); setProducts(prods); setLoading(false) })
            .catch(err => { console.error(err); setLoading(false) })
    }, [])

    useEffect(() => {
        if (loading) return
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
        }, { threshold: 0.1 })
        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
        return () => observer.disconnect()
    }, [loading, categories, products])

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setSelectedProduct(null) }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [])

    return (
        <>
            {/* HERO */}
            <section className="pt-32 pb-12 bg-gradient-to-b from-periwinkle-light via-cream-light to-offwhite text-center">
                <div className="max-w-[1200px] mx-auto px-8">
                    <span className="inline-flex items-center gap-2 bg-cream/70 text-walnut text-[13px]
            uppercase tracking-[2px] font-semibold px-5 py-2.5 rounded-full mb-6">
                        ☕ La Carte Complète
                    </span>
                    <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] mb-4">
                        Tous nos<br /><span className="italic font-normal text-walnut-medium">choix.</span>
                    </h1>
                    <p className="text-gray-500 text-lg">Sélectionnés avec soin, préparés à la commande.</p>
                </div>
            </section>

            {/* MENU */}
            <section className="py-16 bg-offwhite">
                <div className="max-w-[1200px] mx-auto px-8">
                    {loading ? (
                        <div className="space-y-12">
                            <div className="skeleton h-14" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-40" />)}
                            </div>
                        </div>
                    ) : (
                        categories.map(cat => {
                            const catProducts = products.filter(p => p.category_id === cat.id)
                            if (catProducts.length === 0) return null

                            return (
                                <div key={cat.id} className="mb-14 animate-on-scroll">
                                    <div className="mb-6 pb-4 border-b-2 border-cream">
                                        <h2 className="font-display text-3xl font-bold text-walnut">{cat.name}</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {catProducts.map(p => (
                                            <div key={p.id}
                                                className="bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer relative
                          hover:-translate-y-0.5 hover:shadow-lg hover:border-cream transition-all group"
                                                onClick={() => setSelectedProduct(p)}>
                                                <span className="absolute top-5 right-5 text-walnut-medium font-bold text-xl
                          group-hover:text-walnut transition-colors">
                                                    {Number(p.price).toFixed(2).replace('.', ',')}€
                                                </span>
                                                <h3 className="text-base font-semibold pr-16 mb-1.5">
                                                    {p.name}
                                                    {p.badges && p.badges.map((b, i) => (
                                                        <span key={i} className="inline-flex text-[10px] font-bold px-2.5 py-1
                              uppercase tracking-wide rounded-full bg-cream text-walnut ml-1.5">
                                                            {b}
                                                        </span>
                                                    ))}
                                                </h3>
                                                <p className="text-gray-400 text-sm leading-relaxed">{p.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </section>

            {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        </>
    )
}

export default Carte
