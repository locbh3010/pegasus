import PublicGuard from '@/features/auth/components/public-guard'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <PublicGuard>{children}</PublicGuard>
}
