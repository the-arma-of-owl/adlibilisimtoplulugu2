-- Add DELETE policy for participants (authenticated admins can delete)
CREATE POLICY "Participants are deletable by authenticated admins" ON participants
    FOR DELETE USING (auth.role() = 'authenticated');

