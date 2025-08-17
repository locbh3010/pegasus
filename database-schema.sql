-- =====================================================
-- TASK MANAGEMENT SYSTEM DATABASE SCHEMA
-- Supabase/PostgreSQL Database Schema
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. QUẢN LÝ NHÂN SỰ (USER MANAGEMENT)
-- =====================================================

-- Bảng người dùng (Users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    department VARCHAR(100),
    position VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng thông tin chi tiết người dùng (User Profiles)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    skills TEXT[],
    experience_years INTEGER DEFAULT 0,
    education TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. QUẢN LÝ DỰ ÁN (PROJECT MANAGEMENT)
-- =====================================================

-- Bảng dự án (Projects)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    client_name VARCHAR(255),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng thành viên dự án (Project Members)
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'manager', 'member', 'viewer')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- =====================================================
-- 3. QUẢN LÝ TASK (TASK MANAGEMENT)
-- =====================================================

-- Bảng danh mục task (Task Categories)
CREATE TABLE task_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng task (Tasks)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'testing', 'done')),
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category_id UUID REFERENCES task_categories(id) ON DELETE SET NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE, -- For subtasks
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng comment task (Task Comments)
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng file đính kèm task (Task Attachments)
CREATE TABLE task_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng lịch sử task (Task History)
CREATE TABLE task_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL, -- 'created', 'updated', 'status_changed', 'assigned', etc.
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. BẢNG PHỤ TRỢ (SUPPORTING TABLES)
-- =====================================================

-- Bảng tags (Tags)
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7) DEFAULT '#6B7280',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng liên kết task-tag (Task Tags)
CREATE TABLE task_tags (
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
);

-- Bảng thông báo (Notifications)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    related_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    related_project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);

-- Projects indexes
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_start_date ON projects(start_date);
CREATE INDEX idx_projects_end_date ON projects(end_date);

-- Project members indexes
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);

-- Tasks indexes
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_parent_task_id ON tasks(parent_task_id);

-- Task comments indexes
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_task_comments_user_id ON task_comments(user_id);

-- Task attachments indexes
CREATE INDEX idx_task_attachments_task_id ON task_attachments(task_id);

-- Task history indexes
CREATE INDEX idx_task_history_task_id ON task_history(task_id);
CREATE INDEX idx_task_history_user_id ON task_history(user_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- =====================================================
-- 6. TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_comments_updated_at BEFORE UPDATE ON task_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS) FOR SUPABASE
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. SAMPLE DATA (OPTIONAL)
-- =====================================================

-- Insert sample users
INSERT INTO users (email, full_name, role, department, position) VALUES
('admin@company.com', 'Admin User', 'admin', 'IT', 'System Administrator'),
('manager@company.com', 'Project Manager', 'manager', 'Project Management', 'Senior Project Manager'),
('developer@company.com', 'John Developer', 'member', 'Development', 'Full Stack Developer'),
('designer@company.com', 'Jane Designer', 'member', 'Design', 'UI/UX Designer');

-- Insert sample project
INSERT INTO projects (name, description, status, priority, start_date, end_date, created_by) VALUES
('Website Redesign', 'Redesign company website with modern UI/UX', 'active', 'high', '2024-01-01', '2024-03-31',
 (SELECT id FROM users WHERE email = 'manager@company.com'));

-- Insert sample task categories
INSERT INTO task_categories (name, color, project_id) VALUES
('Frontend', '#3B82F6', (SELECT id FROM projects WHERE name = 'Website Redesign')),
('Backend', '#10B981', (SELECT id FROM projects WHERE name = 'Website Redesign')),
('Design', '#F59E0B', (SELECT id FROM projects WHERE name = 'Website Redesign')),
('Testing', '#EF4444', (SELECT id FROM projects WHERE name = 'Website Redesign'));

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, category_id, project_id, assigned_to, created_by, estimated_hours, due_date) VALUES
('Design Homepage', 'Create modern homepage design with responsive layout', 'in_progress', 'high',
 (SELECT id FROM task_categories WHERE name = 'Design'),
 (SELECT id FROM projects WHERE name = 'Website Redesign'),
 (SELECT id FROM users WHERE email = 'designer@company.com'),
 (SELECT id FROM users WHERE email = 'manager@company.com'), 8, '2024-01-15'),

('Implement User Authentication', 'Build login/register functionality with JWT', 'todo', 'high',
 (SELECT id FROM task_categories WHERE name = 'Backend'),
 (SELECT id FROM projects WHERE name = 'Website Redesign'),
 (SELECT id FROM users WHERE email = 'developer@company.com'),
 (SELECT id FROM users WHERE email = 'manager@company.com'), 16, '2024-01-20'),

('Create Responsive Header', 'Build responsive navigation header component', 'todo', 'medium',
 (SELECT id FROM task_categories WHERE name = 'Frontend'),
 (SELECT id FROM projects WHERE name = 'Website Redesign'),
 (SELECT id FROM users WHERE email = 'developer@company.com'),
 (SELECT id FROM users WHERE email = 'manager@company.com'), 6, '2024-01-25');

-- =====================================================
-- 9. VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for project overview with member count and task statistics
CREATE VIEW project_overview AS
SELECT
    p.*,
    COUNT(DISTINCT pm.user_id) as member_count,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_tasks,
    ROUND(
        CASE
            WHEN COUNT(DISTINCT t.id) > 0
            THEN (COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END)::DECIMAL / COUNT(DISTINCT t.id)::DECIMAL) * 100
            ELSE 0
        END, 2
    ) as completion_percentage
FROM projects p
LEFT JOIN project_members pm ON p.id = pm.project_id
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id;

-- View for user workload
CREATE VIEW user_workload AS
SELECT
    u.id,
    u.full_name,
    u.email,
    COUNT(t.id) as total_assigned_tasks,
    COUNT(CASE WHEN t.status = 'todo' THEN t.id END) as pending_tasks,
    COUNT(CASE WHEN t.status = 'in_progress' THEN t.id END) as in_progress_tasks,
    COUNT(CASE WHEN t.status = 'done' THEN t.id END) as completed_tasks,
    SUM(t.estimated_hours) as total_estimated_hours,
    SUM(t.actual_hours) as total_actual_hours
FROM users u
LEFT JOIN tasks t ON u.id = t.assigned_to
GROUP BY u.id, u.full_name, u.email;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
