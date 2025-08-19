export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Manage and organize your projects
        </p>
      </div>
      
      <div className="rounded-lg border p-8 text-center">
        <h3 className="text-lg font-medium">No projects yet</h3>
        <p className="text-muted-foreground mt-2">
          Create your first project to get started
        </p>
      </div>
    </div>
  )
}
