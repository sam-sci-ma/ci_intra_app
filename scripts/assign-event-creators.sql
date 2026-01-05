-- Assign old events (with NULL created_by) to a default user
-- Replace 'f49b2d25-c907-43a5-a7f2-a2324c135762' with the user ID you want

UPDATE events 
SET created_by = 'f49b2d25-c907-43a5-a7f2-a2324c135762'  -- Samuel Gyasi's ID
WHERE created_by IS NULL;

-- Or assign to a specific admin user:
-- UPDATE events 
-- SET created_by = (SELECT id FROM staff_profiles WHERE email = 'admin@um6p.ma' LIMIT 1)
-- WHERE created_by IS NULL;
