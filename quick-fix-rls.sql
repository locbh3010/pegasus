-- =====================================================
-- QUICK FIX FOR RLS ISSUES
-- =====================================================

-- Option 1: Temporarily disable RLS (NOT RECOMMENDED for production)
-- ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE project_members DISABLE ROW LEVEL SECURITY;

-- Option 2: Create simple permissive policies
-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view projects they are members of" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Project owners and managers can update projects" ON projects;
DROP POLICY IF EXISTS "Project owners can delete projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can view their projects" ON projects;
DROP POLICY IF EXISTS "Project creators and owners can update projects" ON projects;
DROP POLICY IF EXISTS "Project creators and owners can delete projects" ON projects;

-- Simple permissive policy for authenticated users
CREATE POLICY "Allow all for authenticated users" ON projects
    FOR ALL
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Drop project_members policies
DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Project owners and managers can add members" ON project_members;
DROP POLICY IF EXISTS "Project owners and managers can update member roles" ON project_members;
DROP POLICY IF EXISTS "Project owners and managers can remove members" ON project_members;
DROP POLICY IF EXISTS "Project creators and managers can add members" ON project_members;
DROP POLICY IF EXISTS "Project creators and managers can update member roles" ON project_members;
DROP POLICY IF EXISTS "Project creators and managers can remove members" ON project_members;

-- Simple permissive policy for project_members
CREATE POLICY "Allow all for authenticated users" ON project_members
    FOR ALL
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Drop users policies
DROP POLICY IF EXISTS "Users can view active users" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Authenticated users can view active users" ON users;

-- Simple permissive policy for users
CREATE POLICY "Allow all for authenticated users" ON users
    FOR ALL
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Verify the current user session
SELECT 
    auth.uid() as current_user_id,
    auth.jwt() as current_jwt;

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('projects', 'project_members', 'users');

-- List current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('projects', 'project_members', 'users')
ORDER BY tablename, policyname;
