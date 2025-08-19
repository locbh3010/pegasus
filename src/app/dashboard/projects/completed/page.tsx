export default function CompletedProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Completed Projects</h1>
        <p className="text-muted-foreground">
          View your completed projects
        </p>
      </div>
      
      <div className="rounded-lg border p-8 text-center">
        <h3 className="text-lg font-medium">No completed projects</h3>
        <p className="text-muted-foreground mt-2">
          Completed projects will appear here
        </p>
      </div>
    </div>
  )
}
