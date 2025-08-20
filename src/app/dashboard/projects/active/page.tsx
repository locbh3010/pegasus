export default function ActiveProjectsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Active Projects</h1>
                <p className="text-muted-foreground">View and manage your active projects</p>
            </div>

            <div className="rounded-lg border p-8 text-center">
                <h3 className="text-lg font-medium">No active projects</h3>
                <p className="text-muted-foreground mt-2">
                    All your active projects will appear here
                </p>
            </div>
        </div>
    )
}
