import React from 'react';
import { Card } from '../UI/Card';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

const KPICards = ({ entries, year }) => {
    const yearEntries = entries.filter(e => parseInt(e.year) === parseInt(year));

    const totalCost = yearEntries.reduce((acc, curr) => acc + parseFloat(curr.cost), 0);
    const avgMonthlyCost = totalCost / (yearEntries.length > 0 ? 12 : 1); // Or divide by unique months present

    // Find most expensive month
    const monthlyTotals = {};
    yearEntries.forEach(e => {
        const key = `${e.month}`;
        monthlyTotals[key] = (monthlyTotals[key] || 0) + parseFloat(e.cost);
    });

    let maxMonth = null;
    let maxVal = -1;
    Object.entries(monthlyTotals).forEach(([m, val]) => {
        if (val > maxVal) {
            maxVal = val;
            maxMonth = m;
        }
    });

    const monthName = maxMonth ? new Date(0, parseInt(maxMonth) - 1).toLocaleString('pt-BR', { month: 'long' }) : '-';

    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <Card>
                <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="bg-surface border rounded p-3" style={{ padding: '0.75rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">Gasto Total ({year})</p>
                        <p className="text-xl font-bold">{formatCurrency(totalCost)}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="bg-surface border rounded p-3" style={{ padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-success)' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">Média Mensal</p>
                        <p className="text-xl font-bold">{formatCurrency(avgMonthlyCost)}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="bg-surface border rounded p-3" style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)' }}>
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted">Mês Mais Caro</p>
                        <p className="text-xl font-bold capitalize">{monthName}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default KPICards;
