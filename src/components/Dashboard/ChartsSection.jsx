import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Card } from '../UI/Card';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

const ChartsSection = ({ entries, year }) => {
    const yearEntries = entries.filter(e => parseInt(e.year) === parseInt(year));

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const monthLabels = months.map(m => new Date(0, m - 1).toLocaleString('pt-BR', { month: 'short' }));

    const getServiceConsumption = (service) => {
        return months.map(m => {
            const entry = yearEntries.find(e => e.service === service && parseInt(e.month) === m);
            return entry ? parseFloat(entry.value) : 0;
        });
    };

    const getServiceCosts = (service) => {
        return months.map(m => {
            const entry = yearEntries.find(e => e.service === service && parseInt(e.month) === m);
            return entry ? parseFloat(entry.cost) : 0;
        });
    };

    // Dados para gráficos
    const totalByService = {
        energy: yearEntries.filter(e => e.service === 'energy').reduce((acc, curr) => acc + parseFloat(curr.cost), 0),
        water: yearEntries.filter(e => e.service === 'water').reduce((acc, curr) => acc + parseFloat(curr.cost), 0),
        gas: yearEntries.filter(e => e.service === 'gas').reduce((acc, curr) => acc + parseFloat(curr.cost), 0),
    };

    const totalCost = totalByService.energy + totalByService.water + totalByService.gas;
    const getPercentage = (value) => totalCost === 0 ? 0 : ((value / totalCost) * 100).toFixed(1);

    const allEntries = entries;
    const currentMonth = Math.max(...yearEntries.map(e => parseInt(e.month)), 0);

    const calculateAverage = (service) => {
        const serviceEntries = allEntries.filter(e => e.service === service);
        if (serviceEntries.length === 0) return 0;
        return serviceEntries.reduce((acc, curr) => acc + parseFloat(curr.value), 0) / serviceEntries.length;
    };

    const getCurrentValue = (service) => {
        const entry = yearEntries.find(e => e.service === service && parseInt(e.month) === currentMonth);
        return entry ? parseFloat(entry.value) : 0;
    };

    const totalCostsByMonth = months.map(m => {
        const monthEntries = yearEntries.filter(e => parseInt(e.month) === m);
        return monthEntries.reduce((acc, curr) => acc + parseFloat(curr.cost), 0);
    });

    const legendData = [
        { label: 'Energia', color: '#f59e0b', value: totalByService.energy, percentage: getPercentage(totalByService.energy) },
        { label: 'Água', color: '#3b82f6', value: totalByService.water, percentage: getPercentage(totalByService.water) },
        { label: 'Gás', color: '#ef4444', value: totalByService.gas, percentage: getPercentage(totalByService.gas) }
    ];

    if (yearEntries.length === 0) {
        return (
            <Card>
                <div className="flex flex-col items-center justify-center h-64 text-muted">
                    <p>Nenhum dado encontrado para o ano de {year}.</p>
                    <p className="text-sm">Adicione lançamentos para visualizar os gráficos.</p>
                </div>
            </Card>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {/* Linha 1, Coluna 1: Evolução Mensal do Consumo */}
            <Card>
                <div style={{ height: '350px' }}>
                    <Line options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: { mode: 'index', intersect: false },
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Evolução Mensal do Consumo' }
                        },
                        scales: {
                            y: { type: 'linear', position: 'left', title: { display: true, text: 'Energia (kWh)' }, beginAtZero: true },
                            y1: { type: 'linear', position: 'right', title: { display: true, text: 'Água/Gás (m³)' }, beginAtZero: true, grid: { drawOnChartArea: false } }
                        }
                    }} data={{
                        labels: monthLabels,
                        datasets: [
                            { label: 'Energia (kWh)', data: getServiceConsumption('energy'), borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.5)', tension: 0.3, yAxisID: 'y' },
                            { label: 'Água (m³)', data: getServiceConsumption('water'), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.5)', tension: 0.3, yAxisID: 'y1' },
                            { label: 'Gás (m³)', data: getServiceConsumption('gas'), borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.5)', tension: 0.3, yAxisID: 'y1' }
                        ]
                    }} />
                </div>
            </Card>

            {/* Linha 1, Coluna 2: Distribuição de Gastos */}
            <Card>
                <h3 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 'bold' }}>Distribuição de Gastos</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', height: '300px' }}>
                    <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <div style={{ width: '100%', maxWidth: '250px', height: '250px' }}>
                            <Doughnut options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: { callbacks: { label: (ctx) => ` R$ ${ctx.raw.toFixed(2)} (${getPercentage(ctx.raw)}%)` } }
                                }
                            }} data={{
                                labels: ['Energia', 'Água', 'Gás'],
                                datasets: [{
                                    data: [totalByService.energy, totalByService.water, totalByService.gas],
                                    backgroundColor: ['rgba(245, 158, 11, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(239, 68, 68, 0.8)'],
                                    borderColor: ['#f59e0b', '#3b82f6', '#ef4444'],
                                    borderWidth: 1
                                }]
                            }} />
                        </div>
                    </div>
                    <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '1rem' }}>
                        {legendData.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: item.color, flexShrink: 0 }}></div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <div style={{ fontWeight: '600' }}>{item.label}</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: item.color }}>{item.percentage}%</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>R$ {item.value.toFixed(2)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Linha 2, Coluna 1: Comparação Mensal de Custos */}
            <Card>
                <div style={{ height: '350px' }}>
                    <Bar options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Comparação Mensal de Custos' },
                            tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: R$ ${ctx.parsed.y.toFixed(2)}` } }
                        },
                        scales: { y: { beginAtZero: true, title: { display: true, text: 'Custo (R$)' } } }
                    }} data={{
                        labels: monthLabels,
                        datasets: [
                            { label: 'Energia', data: getServiceCosts('energy'), backgroundColor: 'rgba(245, 158, 11, 0.8)', borderColor: '#f59e0b', borderWidth: 1 },
                            { label: 'Água', data: getServiceCosts('water'), backgroundColor: 'rgba(59, 130, 246, 0.8)', borderColor: '#3b82f6', borderWidth: 1 },
                            { label: 'Gás', data: getServiceCosts('gas'), backgroundColor: 'rgba(239, 68, 68, 0.8)', borderColor: '#ef4444', borderWidth: 1 }
                        ]
                    }} />
                </div>
            </Card>

            {/* Linha 2, Coluna 2: Tendência de Gastos Totais */}
            <Card>
                <div style={{ height: '350px' }}>
                    <Line options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Tendência de Gastos Totais' },
                            tooltip: { callbacks: { label: (ctx) => `Total: R$ ${ctx.parsed.y.toFixed(2)}` } }
                        },
                        scales: { y: { beginAtZero: true, title: { display: true, text: 'Custo Total (R$)' } } }
                    }} data={{
                        labels: monthLabels,
                        datasets: [{
                            label: 'Gasto Total',
                            data: totalCostsByMonth,
                            borderColor: '#8b5cf6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            pointBackgroundColor: '#8b5cf6',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                        }]
                    }} />
                </div>
            </Card>

            {/* Linha 3, Coluna 1: Média Histórica vs Atual */}
            <Card>
                <div style={{ height: '350px' }}>
                    <Bar options={{
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Consumo: Média Histórica vs Atual' },
                            tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.x.toFixed(2)} ${ctx.label.includes('Energia') ? 'kWh' : 'm³'}` } }
                        },
                        scales: { x: { beginAtZero: true } }
                    }} data={{
                        labels: ['Energia (kWh)', 'Água (m³)', 'Gás (m³)'],
                        datasets: [
                            { label: 'Média Histórica', data: [calculateAverage('energy'), calculateAverage('water'), calculateAverage('gas')], backgroundColor: 'rgba(156, 163, 175, 0.6)', borderColor: '#9ca3af', borderWidth: 1 },
                            { label: `Atual (${monthLabels[currentMonth - 1] || 'N/A'})`, data: [getCurrentValue('energy'), getCurrentValue('water'), getCurrentValue('gas')], backgroundColor: 'rgba(34, 197, 94, 0.8)', borderColor: '#22c55e', borderWidth: 1 }
                        ]
                    }} />
                </div>
            </Card>

            {/* Linha 3, Coluna 2: Evolução Acumulada dos Custos */}
            <Card>
                <div style={{ height: '350px' }}>
                    <Line options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: { mode: 'index', intersect: false },
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Evolução Acumulada dos Custos' },
                            tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: R$ ${ctx.parsed.y.toFixed(2)}` } }
                        },
                        scales: {
                            y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Custo (R$)' } },
                            x: { stacked: true }
                        }
                    }} data={{
                        labels: monthLabels,
                        datasets: [
                            { label: 'Energia', data: getServiceCosts('energy'), backgroundColor: 'rgba(245, 158, 11, 0.6)', borderColor: '#f59e0b', borderWidth: 2, fill: true },
                            { label: 'Água', data: getServiceCosts('water'), backgroundColor: 'rgba(59, 130, 246, 0.6)', borderColor: '#3b82f6', borderWidth: 2, fill: true },
                            { label: 'Gás', data: getServiceCosts('gas'), backgroundColor: 'rgba(239, 68, 68, 0.6)', borderColor: '#ef4444', borderWidth: 2, fill: true }
                        ]
                    }} />
                </div>
            </Card>
        </div>
    );
};

export default ChartsSection;
