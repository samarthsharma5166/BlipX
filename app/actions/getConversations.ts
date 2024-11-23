import prisma from "@/app/libs/prismaDb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) {
    return [];
  }
  try {
    console.log("finiding");
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser?.id,
        },
      },
      include: {
        users: true,
        message: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    console.log(conversations);

    return conversations;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
