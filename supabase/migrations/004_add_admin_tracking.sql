-- Add entered_by_admin_id column to track which admin confirmed entry
ALTER TABLE participants
ADD COLUMN IF NOT EXISTS entered_by_admin_id UUID REFERENCES auth.users(id);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_participants_entered_by_admin ON participants(entered_by_admin_id);

