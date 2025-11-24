import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Spinner from '../components/UI/Spinner';
import { useToast } from '../context/ToastContext';

export default function AdminPanel() {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        // Verificar se é admin
        if (!profile?.is_admin) {
            navigate('/');
            return;
        }

        fetchUsers();
    }, [profile, navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            showToast('Erro ao carregar usuários', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            setActionLoading(userId);
            const { error } = await supabase
                .from('profiles')
                .update({ is_approved: true })
                .eq('id', userId);

            if (error) throw error;

            showToast('Usuário aprovado com sucesso!', 'success');
            fetchUsers();
        } catch (error) {
            console.error('Erro ao aprovar usuário:', error);
            showToast('Erro ao aprovar usuário', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (userId) => {
        try {
            setActionLoading(userId);

            // Deletar entradas do usuário
            await supabase
                .from('entries')
                .delete()
                .eq('user_id', userId);

            // Deletar perfil (isso já impede o login do usuário)
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;

            showToast('Usuário rejeitado e removido', 'success');
            fetchUsers();
        } catch (error) {
            console.error('Erro ao rejeitar usuário:', error);
            showToast('Erro ao rejeitar usuário', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleAdmin = async (userId, currentStatus) => {
        try {
            setActionLoading(userId);
            const { error } = await supabase
                .from('profiles')
                .update({ is_admin: !currentStatus })
                .eq('id', userId);

            if (error) throw error;

            showToast(
                currentStatus ? 'Privilégios de admin removidos' : 'Usuário promovido a admin',
                'success'
            );
            fetchUsers();
        } catch (error) {
            console.error('Erro ao alterar status de admin:', error);
            showToast('Erro ao alterar status de admin', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="large" />
            </div>
        );
    }

    const pendingUsers = users.filter(u => !u.is_approved && !u.is_admin);
    const approvedUsers = users.filter(u => u.is_approved || u.is_admin);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

            {/* Usuários Pendentes */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    Usuários Pendentes de Aprovação
                    {pendingUsers.length > 0 && (
                        <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                            {pendingUsers.length}
                        </span>
                    )}
                </h2>

                {pendingUsers.length === 0 ? (
                    <Card>
                        <p className="text-gray-500 text-center py-8">
                            Nenhum usuário pendente de aprovação
                        </p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {pendingUsers.map((user) => (
                            <Card key={user.id}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">{user.email}</p>
                                        <p className="text-sm text-gray-500">
                                            Cadastrado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="success"
                                            onClick={() => handleApprove(user.id)}
                                            disabled={actionLoading === user.id}
                                        >
                                            {actionLoading === user.id ? <Spinner size="small" /> : 'Aprovar'}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleReject(user.id)}
                                            disabled={actionLoading === user.id}
                                        >
                                            {actionLoading === user.id ? <Spinner size="small" /> : 'Rejeitar'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* Usuários Aprovados */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Usuários Aprovados</h2>
                <div className="grid gap-4">
                    {approvedUsers.map((user) => (
                        <Card key={user.id}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold flex items-center gap-2">
                                        {user.email}
                                        {user.is_admin && (
                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                ADMIN
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Cadastrado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                {user.id !== profile?.id && (
                                    <Button
                                        variant={user.is_admin ? 'secondary' : 'primary'}
                                        onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                                        disabled={actionLoading === user.id}
                                    >
                                        {actionLoading === user.id ? (
                                            <Spinner size="small" />
                                        ) : user.is_admin ? (
                                            'Remover Admin'
                                        ) : (
                                            'Tornar Admin'
                                        )}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
