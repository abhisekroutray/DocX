import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  // Get the logged-in user's ID from Clerk
  const { userId } = await auth();
  if (!userId) return <p>Unauthorized. Please sign in.</p>;

  try {
    // Fetch family members for the logged-in user
    const familyMembers = await prisma.familyMember.findMany({
      where: { userId },
      select: { id: true, name: true },
    });

    return (
      <div className="p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>All Members *</CardTitle>
              <div>
                <UserButton />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Family Member */}
            <Link href="/add-family-member" passHref>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add New Member
              </Button>
            </Link>

            {/* List of Family Members */}
            {familyMembers.length === 0 ? (
              <p className="text-center text-gray-500">
                No family members added yet.
              </p>
            ) : (
              familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                >
                  <span>{member.name}</span>
                  <Link href={`/${member.id}`} passHref>
                    <Button variant="outline" size="sm">
                      View Documents
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error fetching family members:", error);
    return <p className="text-red-500">Failed to load family members.</p>;
  }
}
