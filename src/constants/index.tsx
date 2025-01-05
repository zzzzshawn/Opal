import { Bell, CreditCard, FileDuoToneBlack, Home, Settings } from "@/components/icons";

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
        icon: <Home/>
    },
    {
        title: "My Library",
        href: `/dashboard/${workspaceId}`,
        icon: <FileDuoToneBlack/>
    },
    {
        title: "Notifications",
        href: `/dashboard/${workspaceId}/notifications`,
        icon: <Bell/>
    },
    {
        title: "Billing",
        href: `/dashboard/${workspaceId}/billing`,
        icon: <CreditCard/>
    },
    {
        title: "Settings",
        href: `/dashboard/${workspaceId}/settings`,
        icon: <Settings/>
    },
]