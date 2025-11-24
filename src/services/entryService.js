import { supabase } from '../lib/supabase';

const mapToDb = (entry) => {
    const serviceMap = {
        'energy': 'electricity',
        'water': 'water',
        'gas': 'gas'
    };

    // Construct a date for the month/year reference (1st of the month)
    // Ensure we handle string inputs for year/month if they come as strings
    const year = parseInt(entry.year);
    const month = parseInt(entry.month);
    const date = new Date(year, month - 1, 1).toISOString().split('T')[0];

    return {
        service_type: serviceMap[entry.service] || entry.service,
        date: date,
        reading_date_start: entry.readingDateStart || null,
        reading_date_end: entry.readingDateEnd || null,
        due_date: entry.dueDate,
        consumption: parseFloat(entry.value),
        amount: parseFloat(entry.cost),
    };
};

const mapFromDb = (dbEntry) => {
    const serviceMap = {
        'electricity': 'energy',
        'water': 'water',
        'gas': 'gas'
    };

    // Parse the date string (YYYY-MM-DD) correctly to avoid timezone issues
    // We treat the stored date as local date parts
    const [year, month, day] = dbEntry.date.split('-').map(Number);

    return {
        id: dbEntry.id,
        service: serviceMap[dbEntry.service_type] || dbEntry.service_type,
        month: month,
        year: year,
        value: dbEntry.consumption.toString(),
        cost: dbEntry.amount.toString(),
        readingDateStart: dbEntry.reading_date_start,
        readingDateEnd: dbEntry.reading_date_end,
        dueDate: dbEntry.due_date,
        createdAt: dbEntry.created_at
    };
};

export const entryService = {
    async getAll() {
        const { data, error } = await supabase
            .from('entries')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return data.map(mapFromDb);
    },

    async create(entry) {
        const dbEntry = mapToDb(entry);
        const { data, error } = await supabase
            .from('entries')
            .insert([dbEntry])
            .select()
            .single();

        if (error) throw error;
        return mapFromDb(data);
    },

    async update(id, entry) {
        const dbEntry = mapToDb(entry);
        const { data, error } = await supabase
            .from('entries')
            .update(dbEntry)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return mapFromDb(data);
    },

    async delete(id) {
        const { error } = await supabase
            .from('entries')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    async upsert(entry) {
        const dbEntry = mapToDb(entry);
        // If entry has an ID, include it for upsert
        if (entry.id) {
            dbEntry.id = entry.id;
        }

        const { data, error } = await supabase
            .from('entries')
            .upsert(dbEntry)
            .select()
            .single();

        if (error) throw error;
        return mapFromDb(data);
    }
};
