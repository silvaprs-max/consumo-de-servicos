import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

export default function PendingApproval() {
    const { user, profile, signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Se o usuário foi aprovado, redirecionar para home
        if (profile?.is_approved) {
            navigate('/');
        }
    }, [profile, navigate]);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="max-w-md w-full text-center">
                <div className="mb-6">
                    <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-10 h-10 text-yellow-600 dark:text-yellow-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Aguardando Aprovação</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Sua conta foi criada com sucesso!
                    </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Email:</strong> {user?.email}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">
                        Um administrador precisa aprovar sua conta antes que você possa acessar o sistema.
                        Você receberá um email quando sua conta for aprovada.
                    </p>
                </div>

                <div className="space-y-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enquanto isso, você pode:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <li>✓ Aguardar a aprovação do administrador</li>
                        <li>✓ Verificar seu email periodicamente</li>
                        <li>✓ Entrar em contato com o suporte se necessário</li>
                    </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="secondary"
                        onClick={handleLogout}
                        className="w-full"
                    >
                        Sair
                    </Button>
                </div>
            </Card>
        </div>
    );
}
