import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { PrismaClient } from "@prisma/client";

import Link from "next/link";
const prisma = new PrismaClient();

export default function AddFamilyMemberPage() {
  async function addFamilyMember(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Add the family member to the database
    await prisma.familyMember.create({
      data: {
        name,
        userId, // This is now a String (Clerk's userId)
      },
    });

    // Redirect back to the family members page
    redirect("/");
  }

  return (
    <div className="p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Add Family Member</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addFamilyMember} className="space-y-4 mb-3">
            <Input
              name="name"
              placeholder="Family member name"
              required
              minLength={2}
              maxLength={50}
            />
            <Button type="submit" className="w-full">
              Add Family Member
            </Button>
          </form>
          <Link href="/">
            <Button variant="outline" className="w-full mb-3">
              Back to Family Members
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
