-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    entry_code TEXT NOT NULL UNIQUE,
    qr_token TEXT NOT NULL UNIQUE,
    has_entered BOOLEAN DEFAULT FALSE,
    entered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_participants_event_id ON participants(event_id);
CREATE INDEX IF NOT EXISTS idx_participants_entry_code ON participants(entry_code);
CREATE INDEX IF NOT EXISTS idx_participants_qr_token ON participants(qr_token);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for events table
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for settings table
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Events: Public can read, authenticated admins can write
CREATE POLICY "Events are viewable by everyone" ON events
    FOR SELECT USING (true);

CREATE POLICY "Events are insertable by authenticated admins" ON events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Events are updatable by authenticated admins" ON events
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Participants: Public can read their own entry by code, admins can read all
CREATE POLICY "Participants are viewable by entry code" ON participants
    FOR SELECT USING (true);

CREATE POLICY "Participants are insertable by authenticated admins" ON participants
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Participants are updatable by authenticated admins" ON participants
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Settings: Public can read, admins can write
CREATE POLICY "Settings are viewable by everyone" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Settings are insertable by authenticated admins" ON settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Settings are updatable by authenticated admins" ON settings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO settings (key, value) VALUES
    ('whatsapp_contact', '+905551234567'),
    ('about_text', 'Adli Bilişim Topluluğu olarak yıl boyunca çeşitli etkinlikler düzenliyoruz.'),
    ('community_name', 'Adli Bilişim Topluluğu')
ON CONFLICT (key) DO NOTHING;

