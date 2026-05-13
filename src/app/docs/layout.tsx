import { DocsSidebar } from '@/components/docs/DocsSidebar';

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <DocsSidebar />
            <div className="flex-1 p-8">
                {children}
            </div>
        </div>
    );
}