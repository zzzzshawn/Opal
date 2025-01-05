import { getNotifications, onAuthenticateUser } from "@/actions/user";
import { getAllUserVideos, getWorkspaceFolders, getWorkSpaces, verifyAccessToWorkspace } from "@/actions/workspace";
import { query } from "@/lib/tanstackQuery";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  children: React.ReactNode;
  params: { workspaceId: string };
}

const Layout = async ({ children, params: { workspaceId } }: Props) => {
  const auth = await onAuthenticateUser();

  if (
    auth.status === 500 ||
    auth.status === 400 ||
    auth.status === 404 ||
    !auth.user?.workspace ||
    !auth.user?.workspace.length
  ) {
    return redirect("/auth/sign-in");
  }

  const hasAccess = await verifyAccessToWorkspace(workspaceId);
  if (hasAccess.status !== 200) {
    return redirect(`/dashboard/${auth.user?.workspace[0].id}`);
  }

  if (!hasAccess.data?.workspace) return null;

  await query.prefetchQuery({
    queryKey: ['workspace-folders'],
    queryFn: () => getWorkspaceFolders(workspaceId)
  })

  await query.prefetchQuery({
    queryKey: ['user-videos'],
    queryFn: () => getAllUserVideos(workspaceId)
  })

  await query.prefetchQuery({
    queryKey: ['user-workspaces'],
    queryFn: () => getWorkSpaces()
  }) 

  await query.prefetchQuery({
    queryKey: ['user-notifications'],
    queryFn: () => getNotifications()
  })


  return <HydrationBoundary state={dehydrate(query)}>
    {children}
  </HydrationBoundary>;
};

export default Layout;
