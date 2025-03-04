import { getFamilyMember } from "@/lib/actions";
import DocumentsPage from "@/components/DocumentsPage";
import { notFound } from "next/navigation";

export default async function MemberDocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id || id.length !== 24 || !/^[a-fA-F0-9]+$/.test(id)) {
    return notFound();
  }
  const familyMember = await getFamilyMember(id);

  if (!familyMember) {
    return <p className="text-center text-red-500">Family member not found.</p>;
  }

  return <DocumentsPage familyMember={familyMember} />;
}
