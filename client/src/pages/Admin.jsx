import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoCream from '../assets/logos/Logo 2.svg'

function Admin() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [editingProduct, setEditingProduct] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('smookToken')
        navigate('/login')
    }

    const emptyProduct = {
        category_id: '', name: '', description: '', price: '',
        nutriscore: '', ingredients: '', is_featured: false, image_url: ''
    }

    const fetchData = () => {
        setLoading(true)
        Promise.all([
            fetch('/api/products').then(r => r.json()),
            fetch('/api/categories').then(r => r.json())
        ]).then(([prods, cats]) => {
            setProducts(prods)
            setCategories(cats)
            setLoading(false)
        })
    }

    useEffect(() => { fetchData() }, [])

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return
        try {
            const token = localStorage.getItem('smookToken')
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.status === 401 || res.status === 403) {
                alert("Session expirée")
                handleLogout()
                return
            }
            fetchData()
        } catch (err) { console.error(err) }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        const isEditing = !!editingProduct.id
        const url = isEditing ? `/api/products/${editingProduct.id}` : '/api/products'
        const method = isEditing ? 'PUT' : 'POST'

        // Convert components back to API format (ingredients array to JSON, price to number)
        const payload = { ...editingProduct }
        if (typeof payload.ingredients === 'string') {
            payload.ingredients = payload.ingredients.split(',').map(s => s.trim()).filter(Boolean)
        }

        try {
            const token = localStorage.getItem('smookToken')

            if (imageFile) {
                const formData = new FormData()
                formData.append('image', imageFile)

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                })

                if (uploadRes.status === 401 || uploadRes.status === 403) {
                    alert("Session expirée")
                    handleLogout()
                    return
                }

                const uploadData = await uploadRes.json()
                if (uploadRes.ok && uploadData.imageUrl) {
                    payload.image_url = uploadData.imageUrl
                } else {
                    alert("Erreur lors de l'upload de l'image")
                    return
                }
            }

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (res.status === 401 || res.status === 403) {
                alert("Session expirée")
                handleLogout()
                return
            }

            setIsModalOpen(false)
            fetchData()
        } catch (err) { console.error(err) }
    }

    const openEditModal = (product = null) => {
        setImageFile(null)
        if (product) {
            setEditingProduct({
                ...product,
                ingredients: product.ingredients ? (typeof product.ingredients === 'string' ? JSON.parse(product.ingredients).join(', ') : product.ingredients.join(', ')) : ''
            })
        } else {
            setEditingProduct({ ...emptyProduct })
        }
        setIsModalOpen(true)
    }

    return (
        <div className="min-h-screen bg-offwhite pb-20">
            {/* Admin Header */}
            <header className="bg-walnut text-white py-4 px-8 sticky top-0 z-40 shadow-md">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/"><img src={logoCream} alt="Smook" className="h-8" /></Link>
                        <span className="text-sm uppercase tracking-widest font-semibold border-l border-white/20 pl-4 py-1">
                            Administration
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium hover:text-cream transition-colors">← Retour au site</Link>
                        <button onClick={handleLogout} className="text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                            Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-8 mt-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-display text-4xl font-bold text-walnut">Gestion des Produits</h1>
                    <button onClick={() => openEditModal()}
                        className="bg-walnut text-white px-6 py-3 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform shadow-md">
                        + Ajouter un Produit
                    </button>
                </div>

                {/* Tableau */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                                <th className="p-4 font-semibold">Image</th>
                                <th className="p-4 font-semibold">Nom</th>
                                <th className="p-4 font-semibold">Catégorie</th>
                                <th className="p-4 font-semibold">Prix</th>
                                <th className="p-4 font-semibold text-center">En Vedette</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-400 font-medium">Chargement...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-400 font-medium">Aucun produit trouvé.</td></tr>
                            ) : (
                                products.map(p => {
                                    const cat = categories.find(c => c.id === p.category_id)
                                    return (
                                        <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="p-4 w-20">
                                                {p.image_url ?
                                                    <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100" />
                                                    : <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-lg text-xs text-gray-400">Aucune</div>}
                                            </td>
                                            <td className="p-4 font-medium">{p.name}</td>
                                            <td className="p-4 text-gray-500 text-sm">{cat ? cat.name : 'Non classée'}</td>
                                            <td className="p-4 font-medium">{Number(p.price).toFixed(2)} €</td>
                                            <td className="p-4 text-center">
                                                {p.is_featured ? <span className="text-amber-500">★</span> : <span className="text-gray-300">☆</span>}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openEditModal(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">Éditer</button>
                                                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">Supprimer</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Modale d'édition */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-walnut/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-display text-2xl font-bold">{editingProduct.id ? 'Modifier un produit' : 'Nouveau produit'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 text-xl font-bold">×</button>
                        </div>

                        <form onSubmit={handleSave} className="overflow-y-auto p-6 flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Nom du produit *</label>
                                    <input type="text" required value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-walnut" />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Catégorie *</label>
                                    <select required value={editingProduct.category_id} onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-walnut bg-white">
                                        <option value="">Sélectionner...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Prix (€) *</label>
                                    <input type="number" step="0.01" required value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-walnut" />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Description</label>
                                    <textarea rows="2" value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-walnut"></textarea>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Image du produit</label>
                                    <div className="flex items-center gap-4">
                                        <input type="file" accept="image/*" onChange={e => {
                                            if (e.target.files && e.target.files[0]) {
                                                setImageFile(e.target.files[0])
                                            }
                                        }} className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-walnut" />
                                        {(imageFile || editingProduct.image_url) && (
                                            <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                <img src={imageFile ? URL.createObjectURL(imageFile) : editingProduct.image_url} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Format accepté: JPG, PNG, WEBP.</p>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Nutriscore</label>
                                    <select value={editingProduct.nutriscore} onChange={e => setEditingProduct({ ...editingProduct, nutriscore: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-walnut bg-white">
                                        <option value="">Aucun</option>
                                        {['A', 'B', 'C', 'D', 'E'].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Ingrédients (séparés par virgule)</label>
                                    <input type="text" value={editingProduct.ingredients} onChange={e => setEditingProduct({ ...editingProduct, ingredients: e.target.value })} placeholder="Café, Lait d'avoine..." className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-walnut" />
                                </div>

                                <div className="col-span-2 flex items-center gap-3 mt-2 bg-cream-light p-4 rounded-xl border border-cream">
                                    <input type="checkbox" id="featured" checked={editingProduct.is_featured} onChange={e => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })} className="w-5 h-5 accent-walnut" />
                                    <label htmlFor="featured" className="font-semibold text-sm cursor-pointer">Mettre en vedette (apparaitra sur la page d'accueil)</label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Annuler</button>
                                <button type="submit" className="px-6 py-3 bg-walnut text-white font-semibold rounded-xl hover:shadow-lg transition-shadow">
                                    {editingProduct.id ? 'Enregistrer les modifications' : 'Créer le produit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Admin
