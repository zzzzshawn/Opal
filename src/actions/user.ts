"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();

    if (!user) return { status: 403 };

    const userExist = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
      },
    });

    if (userExist) {
      return { status: 200, user: userExist };
    }

    const newUser = await client.user.create({
      data: {
        clerkid: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {},
        },
        subscription: {
          create: {},
        },
        workspace: {
          create: {
            name: `${user.firstName}'s Space`,
            type: "PERSONAL",
          },
        },
      },
      include: {
        workspace: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (newUser) return { status: 201, user: newUser };

    return { status: 400 };
  } catch (error) {
    console.log(error);
    return { status: 500 };
  }
};

export const getNotifications = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404, data: [] };

    const notifications = await client.user.findMany({
      where: {
        clerkid: user.id,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    });

    if (notifications && notifications.length > 0)
      return { status: 200, data: notifications };
  } catch (error) {
    console.log(error);
    return { status: 500, data: [] };
  }
};

export const searchUsers = async (query: string) => {
  try {

    const user = await currentUser();
    if(!user) return {status: 404, data: undefined}

    const users = await client.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query } },
          { lastname: {contains: query } },
          { email: { contains: query } }
        ],
        NOT: [
          {
            clerkid: user.id
          }
        ]
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true
          }
        },
        firstname: true,
        lastname: true,
        image: true,
        email: true
      }
    })

    if(users && users.length > 0) return { status: 200, data: users }

    return {status: 404, data: undefined}


  } catch (error) {
    console.log(error)
    return {status: 500, data: undefined}
  }
};
