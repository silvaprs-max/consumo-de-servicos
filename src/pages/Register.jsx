import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Card } from '../components/UI/Card';
import { useToast } from '../context/ToastContext';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return addToast('As senhas não coincidem', 'error');
        }
        try {
            setLoading(true);
            await signUp(email, password);
            addToast('Cadastro realizado! Verifique seu email para confirmar.', 'success');
            navigate('/login');
        } catch (error) {
            addToast('Erro ao cadastrar: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full" style={{ maxWidth: '350px', width: '100%' }}>
                <Card title="Criar Conta">
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
                            minLength={6}
                        />
                        <Input
                            label="Confirmar Senha"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Cadastrando...' : 'Cadastrar'}
                        </Button>
                        <p className="text-center text-sm text-text-secondary mt-4">
                            Já tem uma conta? <Link to="/login" className="text-primary hover:underline">Entre aqui</Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Register;
