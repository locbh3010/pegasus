-- =====================================================
-- ROW LEVEL SECURITY POLICIES FOR PROJECT MANAGEMENT
-- =====================================================

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can view all active users (for user selection in projects)
CREATE POLICY "Users can view active users" ON users
    FOR SELECT
    USING (status = 'active');

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT
    USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    USING (auth.uid()::text = id);

-- =====================================================
-- PROJECTS TABLE POLICIES
-- =====================================================

-- Users can view projects they are members of
CREATE POLICY "Users can view projects they are members of" ON projects
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = id
            AND pm.user_id = auth.uid()::text
        )
    );

-- Users can create projects (they will automatically become the owner)
CREATE POLICY "Users can create projects" ON projects
    FOR INSERT
    WITH CHECK (auth.uid()::text = created_by);

-- Only project owners and managers can update projects
CREATE POLICY "Project owners and managers can update projects" ON projects
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = id
            AND pm.user_id = auth.uid()::text
            AND pm.role IN ('owner', 'manager')
        )
    );

-- Only project owners can delete projects
CREATE POLICY "Project owners can delete projects" ON projects
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = id
            AND pm.user_id = auth.uid()::text
            AND pm.role = 'owner'
        )
    );

-- =====================================================
-- PROJECT_MEMBERS TABLE POLICIES
-- =====================================================

-- Users can view members of projects they belong to
CREATE POLICY "Users can view project members" ON project_members
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = project_id
            AND pm.user_id = auth.uid()::text
        )
    );

-- Project owners and managers can add members
CREATE POLICY "Project owners and managers can add members" ON project_members
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = project_id
            AND pm.user_id = auth.uid()::text
            AND pm.role IN ('owner', 'manager')
        )
    );

-- Project owners and managers can update member roles
-- But owners cannot be demoted by managers
CREATE POLICY "Project owners and managers can update member roles" ON project_members
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = project_id
            AND pm.user_id = auth.uid()::text
            AND (
                -- Owners can update anyone
                pm.role = 'owner'
                OR (
                    -- Managers can update non-owners
                    pm.role = 'manager'
                    AND NOT EXISTS (
                        SELECT 1 FROM project_members target
                        WHERE target.id = project_members.id
                        AND target.role = 'owner'
                    )
                )
            )
        )
    );

-- Project owners and managers can remove members
-- But owners cannot be removed by managers, and users can remove themselves
CREATE POLICY "Project owners and managers can remove members" ON project_members
    FOR DELETE
    USING (
        -- Users can remove themselves
        user_id = auth.uid()::text
        OR EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = project_id
            AND pm.user_id = auth.uid()::text
            AND (
                -- Owners can remove anyone except themselves
                (pm.role = 'owner' AND project_members.user_id != auth.uid()::text)
                OR (
                    -- Managers can remove non-owners
                    pm.role = 'manager'
                    AND project_members.role != 'owner'
                    AND project_members.user_id != auth.uid()::text
                )
            )
        )
    );

-- =====================================================
-- TASKS TABLE POLICIES (if needed for project context)
-- =====================================================

-- Users can view tasks in projects they are members of
CREATE POLICY "Users can view tasks in their projects" ON tasks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = project_id
            AND pm.user_id = auth.uid()::text
        )
    );

-- Project members can create tasks
CREATE POLICY "Project members can create tasks" ON tasks
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = project_id
            AND pm.user_id = auth.uid()::text
        )
        AND auth.uid()::text = created_by
    );

-- Task assignees and project owners/managers can update tasks
CREATE POLICY "Task assignees and project managers can update tasks" ON tasks
    FOR UPDATE
    USING (
        assigned_to = auth.uid()::text
        OR created_by = auth.uid()::text
        OR EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = project_id
            AND pm.user_id = auth.uid()::text
            AND pm.role IN ('owner', 'manager')
        )
    );

-- Task creators and project owners/managers can delete tasks
CREATE POLICY "Task creators and project managers can delete tasks" ON tasks
    FOR DELETE
    USING (
        created_by = auth.uid()::text
        OR EXISTS (
            SELECT 1 FROM project_members pm
            WHERE pm.project_id = project_id
            AND pm.user_id = auth.uid()::text
            AND pm.role IN ('owner', 'manager')
        )
    );

-- =====================================================
-- NOTIFICATIONS TABLE POLICIES
-- =====================================================

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT
    USING (user_id = auth.uid()::text);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE
    USING (user_id = auth.uid()::text);

-- System can create notifications for any user
-- (This would typically be done via a service role or trigger)
CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- ADDITIONAL HELPER FUNCTIONS
-- =====================================================

-- Function to check if user is project owner
CREATE OR REPLACE FUNCTION is_project_owner(project_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM project_members
        WHERE project_id = project_uuid
        AND user_id = user_uuid::text
        AND role = 'owner'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is project member
CREATE OR REPLACE FUNCTION is_project_member(project_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM project_members
        WHERE project_id = project_uuid
        AND user_id = user_uuid::text
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's role in project
CREATE OR REPLACE FUNCTION get_user_project_role(project_uuid UUID, user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM project_members
    WHERE project_id = project_uuid
    AND user_id = user_uuid::text;
    
    RETURN COALESCE(user_role, 'none');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
