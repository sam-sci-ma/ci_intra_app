# Adding 2 Super Admins to the SCI Intranet

## Setup Instructions

Follow these steps to add 2 super admin accounts to your Supabase database:

### Step 1: Go to Supabase SQL Editor

1. Log in to your Supabase project
2. Navigate to the **SQL Editor** section
3. Create a new query

### Step 2: Run the SQL Commands

Copy and paste this SQL into the SQL Editor and execute it:

```sql
-- Create super_admins table
CREATE TABLE IF NOT EXISTS super_admins (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'super_admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert 2 super admins
INSERT INTO super_admins (name, email, role) 
VALUES 
  ('Admin User 1', 'admin1@scintranet.edu', 'super_admin'),
  ('Admin User 2', 'admin2@scintranet.edu', 'super_admin')
ON CONFLICT (email) DO NOTHING;
```

### Super Admin Details

Once created, you'll have 2 super admin accounts:

| Name | Email | Role |
|------|-------|------|
| Admin User 1 | admin1@scintranet.edu | super_admin |
| Admin User 2 | admin2@scintranet.edu | super_admin |

## Verification

After running the SQL, verify the admins were created by running:

```sql
SELECT * FROM super_admins;
```

You should see 2 rows returned with the admin information.

## API Endpoints

The following endpoints are available:

- `GET /api/create-admin-table` - Shows the SQL commands needed to create the super_admins table
- `POST /api/setup-admins` - Attempts to insert the super admins (requires table to exist)
- `GET /api/seed/status` - Shows counts of all tables including super_admins

## Next Steps

Once the super_admins table is created and populated:

1. The admins can be used for authentication in the application
2. You can add more admins by inserting additional rows into the super_admins table
3. Consider adding a login page that checks the super_admins table for authentication
