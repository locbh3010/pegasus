export default function ArchivedProjectsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Archived Projects</h1>
                <p className="text-muted-foreground">View your archived projects</p>
            </div>

            <div className="rounded-lg border p-8 text-center">
                <h3 className="text-lg font-medium">No archived projects</h3>
                <p className="text-muted-foreground mt-2">Archived projects will appear here</p>
            </div>
        </div>
    )
}
