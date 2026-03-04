function parseIngredients(raw) {
    if (!raw) return ''
    if (Array.isArray(raw)) return raw.join(', ')
    try {
        const arr = JSON.parse(raw)
        return Array.isArray(arr) ? arr.join(', ') : raw
    } catch {
        return raw
    }
}

function ProductModal({ product, onClose }) {
    if (!product) return null

    const ns = product.nutriscore || ''
    const badges = product.badges || []

    return (
        <div
            className="fixed inset-0 bg-walnut/50 backdrop-blur-xl z-[1000] flex items-center justify-center p-5 animate-fade-in"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white w-full max-w-[880px] rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2
        overflow-hidden animate-fade-up">
                {/* Image */}
                <div
                    className="bg-periwinkle-light bg-cover bg-center min-h-[220px] md:min-h-[400px]"
                    style={{ backgroundImage: `url('${product.image_url || ''}')` }}
                />

                {/* Details */}
                <div className="p-10 flex flex-col justify-center relative">
                    <button
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 flex items-center
              justify-center text-walnut hover:bg-gray-200 hover:rotate-90 transition-all text-lg"
                        onClick={onClose}
                        aria-label="Fermer">
                        ✕
                    </button>

                    {ns && (
                        <span className={`ns-${ns.toLowerCase()} inline-flex self-start font-bold text-white
              px-3 py-1 rounded-lg uppercase text-xs tracking-wider`}>
                            Nutri-score {ns}
                        </span>
                    )}

                    {badges.length > 0 && (
                        <div className="flex gap-2 mt-2">
                            {badges.map((b, i) => (
                                <span key={i} className="inline-flex text-[10px] font-bold px-2.5 py-1
                  uppercase tracking-wide rounded-full bg-cream text-walnut">
                                    {b}
                                </span>
                            ))}
                        </div>
                    )}

                    <h2 className="font-display text-3xl font-bold mt-4 mb-2">{product.name}</h2>
                    <p className="text-gray-500 text-[15px] leading-relaxed">{product.description}</p>

                    <div className="mt-5 pt-5 border-t border-gray-200">
                        <p className="text-[11px] uppercase tracking-[1.5px] font-semibold text-cream-dark mb-1.5">
                            Ingrédients
                        </p>
                        <p className="text-gray-500 text-sm">{parseIngredients(product.ingredients)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductModal
