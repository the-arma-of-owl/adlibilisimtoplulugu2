-- Seed data for testing (optional)

-- Example events
INSERT INTO events (title, description, date, location, is_active) VALUES
    ('Adli Bilişim Workshop 2024', 'Yeni başlayanlar için adli bilişim workshop', NOW() + INTERVAL '10 days', 'Ana Kampüs - Konferans Salonu', true),
    ('Siber Güvenlik Semineri', 'Siber güvenlik alanında uzman konuşmacılar', NOW() + INTERVAL '30 days', 'Ana Kampüs - Amfi 1', false),
    ('CTF Etkinliği', 'Capture The Flag yarışması', NOW() + INTERVAL '60 days', 'Ana Kampüs - Bilgisayar Lab', false)
ON CONFLICT DO NOTHING;

-- Example participants (you'll need to generate actual entry codes and QR tokens)
-- INSERT INTO participants (event_id, name, phone, entry_code, qr_token)
-- SELECT 
--     e.id,
--     'Test Kullanıcı',
--     '+905551234567',
--     'FDG-SGS-DRH-GSE',
--     encode(gen_random_bytes(16), 'hex')
-- FROM events e
-- WHERE e.is_active = true
-- LIMIT 1;

