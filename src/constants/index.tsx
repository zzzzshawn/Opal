export const MENU_ITEMS = (
    workspaceId: string,
): {
    title: string;
    href: string;
    icon: React.ReactNode;
}[] => [
    {
        title: "Home",
        href: `/dashboard/${workspaceId}/home`,
        
    }
]