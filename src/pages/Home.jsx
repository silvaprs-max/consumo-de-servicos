import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, BarChart2, ArrowRight } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { useData } from '../context/DataContext';

const Home = () => {
    const { entries } = useData();

    // Calculate quick stats based on due date (vencimento)
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11

    // Filter entries by due date in current month/year
    const thisMonthEntries = entries.filter(e => {
        if (!e.dueDate) return false; // Skip entries without due date

        const dueDate = new Date(e.dueDate + 'T00:00:00'); // Parse as local date
        return dueDate.getFullYear() === currentYear &&
            dueDate.getMonth() === currentMonth;
    });

    const totalCostThisMonth = thisMonthEntries.reduce((acc, curr) => acc + parseFloat(curr.cost), 0);

    return (
        <div className="flex flex-col gap-4" style={{ gap: '2rem' }}>
            <header>
                <h1 className="text-xl font-bold" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Bem-vindo ao EcoTrack</h1>
                <p className="text-muted">Gerencie seus gastos com serviços públicos de forma simples e eficiente.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <Card title="Resumo do Mês Atual">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <p className="text-sm text-muted">Gasto Total Estimado</p>
                            <p className="font-bold text-primary" style={{ fontSize: '2.5rem' }}>
                                R$ {totalCostThisMonth.toFixed(2)}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="bg-surface border rounded p-2" style={{ padding: '0.5rem', flex: 1, textAlign: 'center' }}>
                                <p className="text-sm text-muted">Lançamentos</p>
                                <p className="font-bold">{thisMonthEntries.length}</p>
                            </div>
                            <div className="bg-surface border rounded p-2" style={{ padding: '0.5rem', flex: 1, textAlign: 'center' }}>
                                <p className="text-sm text-muted">Serviços</p>
                                <p className="font-bold">{new Set(thisMonthEntries.map(e => e.service)).size}/3</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Ações Rápidas">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', justifyContent: 'center' }}>
                        <Link to="/entries">
                            <Button className="w-full" style={{ width: '100%', justifyContent: 'space-between' }}>
                                <span>Novo Lançamento</span>
                                <PlusCircle size={20} />
                            </Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button variant="secondary" className="w-full" style={{ width: '100%', justifyContent: 'space-between' }}>
                                <span>Ver Dashboard</span>
                                <BarChart2 size={20} />
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>

            <Card title="Dicas de Economia">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div className="flex items-center gap-2">
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></div>
                        <p className="text-sm">Apague as luzes ao sair dos cômodos.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                        <p className="text-sm">Reduza o tempo no banho para economizar água e energia.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }}></div>
                        <p className="text-sm">Verifique vazamentos de água periodicamente.</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Home;
