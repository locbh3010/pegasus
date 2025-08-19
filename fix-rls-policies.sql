-- =====================================================
-- FIX RLS POLICIES FOR PROJECT CREATION
-- =====================================================

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view projects they are members of" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Project owners and managers can update projects" ON projects;
DROP POLICY IF EXISTS "Project owners can delete projects" ON projects;

-- =====================================================
-- PROJECTS TABLE POLICIES
-- =====================================================

-- Allow authenticated users to create projects
CREATE POLICY "Authenticated users can create projects" ON projects
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Users can view projects they created or are members of
CREATE POLICY "Users can view their projects" ON projects
    FOR SELECT
    USING (
        auth.uid()::text = created_by
        OR EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = id
            AND pm.user_id = auth.uid()::text
        )
    );

-- Project creators and owners can update projects
CREATE POLICY "Project creators and owners can update projects" ON projects
    FOR UPDATE
    USING (
        auth.uid()::text = created_by
        OR EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = id
            AND pm.user_id = auth.uid()::text
            AND pm.role IN ('owner', 'manager')
        )
    );

-- Project creators and owners can delete projects
CREATE POLICY "Project creators and owners can delete projects" ON projects
    FOR DELETE
    USING (
        auth.uid()::text = created_by
        OR EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = id
            AND pm.user_id = auth.uid()::text
            AND pm.role = 'owner'
        )
    );

-- =====================================================
-- PROJECT_MEMBERS TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Project owners and managers can add members" ON project_members;
DROP POLICY IF EXISTS "Project owners and managers can update member roles" ON project_members;
DROP POLICY IF EXISTS "Project owners and managers can remove members" ON project_members;

-- Users can view members of projects they belong to
CREATE POLICY "Users can view project members" ON project_members
    FOR SELECT
    USING (
        user_id = auth.uid()::text
        OR EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = project_id
            AND pm.user_id = auth.uid()::text
        )
        OR EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = project_id
            AND p.created_by = auth.uid()::text
        )
    );

-- Project creators and owners/managers can add members
CREATE POLICY "Project creators and managers can add members" ON project_members
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = project_id
            AND p.created_by = auth.uid()::text
        )
        OR EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = project_id
            AND pm.user_id = auth.uid()::text
            AND pm.role IN ('owner', 'manager')
        )
    );

-- Project creators and owners/managers can update member roles
CREATE POLICY "Project creators and managers can update member roles" ON project_members
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = project_id
            AND p.created_by = auth.uid()::text
        )
        OR EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = project_id
            AND pm.user_id = auth.uid()::text
            AND pm.role IN ('owner', 'manager')
        )
    );

-- Project creators and owners/managers can remove members, users can remove themselves
CREATE POLICY "Project creators and managers can remove members" ON project_members
    FOR DELETE
    USING (
        user_id = auth.uid()::text
        OR EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = project_id
            AND p.created_by = auth.uid()::text
        )
        OR EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = project_id
            AND pm.user_id = auth.uid()::text
            AND pm.role IN ('owner', 'manager')
        )
    );

-- =====================================================
-- USERS TABLE POLICIES (for user selection)
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view active users" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Allow authenticated users to view all active users (for user selection)
CREATE POLICY "Authenticated users can view active users" ON users
    FOR SELECT
    USING (auth.uid() IS NOT NULL AND status = 'active');

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    USING (auth.uid()::text = id);

-- =====================================================
-- VERIFY POLICIES
-- =====================================================

-- Check if policies are created correctly
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('projects', 'project_members', 'users')
ORDER BY tablename, policyname;
