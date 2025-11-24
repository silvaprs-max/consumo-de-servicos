import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import KPICards from '../components/Dashboard/KPICards';
import ChartsSection from '../components/Dashboard/ChartsSection';
import { Select } from '../components/UI/Select';

const Dashboard = () => {
    const { entries } = useData();
    const [year, setYear] = useState(new Date().getFullYear());

    const uniqueYears = [...new Set(entries.map(e => e.year))].sort((a, b) => b - a);

    return (
        <div className="flex flex-col gap-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="text-xl font-bold" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h1>
                    <p className="text-muted">Análise detalhada dos seus gastos.</p>
                </div>
                <div style={{ width: '150px' }}>
                    <Select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        options={uniqueYears.length > 0 ? uniqueYears.map(y => ({ value: y, label: y })) : [{ value: new Date().getFullYear(), label: new Date().getFullYear() }]}
                    />
                </div>
            </header>

            <KPICards entries={entries} year={year} />

            <ChartsSection entries={entries} year={year} />
        </div>
    );
};

export default Dashboard;
