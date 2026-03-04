import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logoCream from '../assets/logos/Logo 2.svg'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            const data = await res.json()

            if (res.ok && data.token) {
                localStorage.setItem('smookToken', data.token)
                navigate('/admin')
            } else {
                setError(data.error || 'Identifiants incorrects')
            }
        } catch (err) {
            console.error(err)
            setError('Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-offwhite flex flex-col justify-center items-center px-4">
            <Link to="/" className="mb-8 hover:scale-105 transition-transform">
                <img src={logoCream} alt="Smook" className="h-12 drop-shadow-sm invert" />
            </Link>

            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <h1 className="text-3xl font-display font-bold text-walnut mb-2 text-center">Administration</h1>
                <p className="text-gray-500 mb-8 text-center text-sm">Veuillez vous connecter pour gérer le catalogue.</p>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Identifiant</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-walnut bg-gray-50 focus:bg-white transition-colors"
                            placeholder="Ex: admin"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Mot de passe</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-walnut bg-gray-50 focus:bg-white transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 mt-2 font-semibold text-white rounded-xl transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-walnut hover:shadow-lg hover:-translate-y-0.5'
                            }`}
                    >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>
            </div>

            <Link to="/" className="mt-8 text-sm font-medium text-gray-400 hover:text-walnut transition-colors">
                ← Retourner au site
            </Link>
        </div>
    )
}

export default Login
