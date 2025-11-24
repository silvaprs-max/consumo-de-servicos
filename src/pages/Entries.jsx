import React, { useState } from 'react';
import EntryForm from '../components/Entries/EntryForm';
import EntriesList from '../components/Entries/EntriesList';

const Entries = () => {
    const [editingEntry, setEditingEntry] = useState(null);

    return (
        <div className="flex flex-col gap-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h1 className="text-xl font-bold" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Lançamentos</h1>
                <p className="text-muted">Gerencie o histórico de consumo dos seus serviços.</p>
            </header>

            <EntryForm
                entryToEdit={editingEntry}
                onCancelEdit={() => setEditingEntry(null)}
            />

            <EntriesList onEdit={setEditingEntry} />
        </div>
    );
};

export default Entries;
