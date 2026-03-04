function ProductCard({ product, onClick }) {
    const badges = product.badges || []

    return (
        <article
            className="bg-white rounded-2xl overflow-hidden border border-gray-200 cursor-pointer
        hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group"
            onClick={() => onClick(product)}>
            <div className="aspect-square bg-periwinkle-light overflow-hidden relative">
                <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-walnut/5" />
            </div>
            <div className="p-5">
                <h3 className="text-base font-semibold mb-1.5">
                    {product.name}
                    {badges.map((b, i) => (
                        <span key={i} className="inline-flex items-center text-[10px] font-bold px-2.5 py-1
              uppercase tracking-wide rounded-full bg-cream text-walnut ml-1.5">
                            {b}
                        </span>
                    ))}
                </h3>
                <span className="font-semibold text-walnut-medium text-[15px]">
                    {Number(product.price).toFixed(2).replace('.', ',')}€
                </span>
            </div>
        </article>
    )
}

export default ProductCard
