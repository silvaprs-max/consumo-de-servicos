import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Card } from '../components/UI/Card';
import { useToast } from '../context/ToastContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await signIn(email, password);
            addToast('Login realizado com sucesso!', 'success');
            navigate('/');
        } catch (error) {
            addToast('Erro ao fazer login: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div className="w-full" style={{ maxWidth: '350px', width: '100%' }}>
                <Card title="Login">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                        <p className="text-center text-sm text-text-secondary mt-4">
                            Não tem uma conta? <Link to="/register" className="text-primary hover:underline">Registre-se</Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
