import { onAuthenticateUser } from "@/actions/user";
import { verifyAccessToWorkspace } from "@/actions/workspace";
import { query } from "@/lib/tanstackQuery";
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

  await query.prefetchQuery

  return <div>{children}</div>;
};

export default Layout;
