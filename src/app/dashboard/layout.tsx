import { AuthProvider } from '@/features/auth'
import DashboardLayout from '@/features/layouts/components/DashboardLayout'

export default async function layout({ children }: React.PropsWithChildren) {
    return (
        <AuthProvider>
            <DashboardLayout>{children}</DashboardLayout>
        </AuthProvider>
    )
}
