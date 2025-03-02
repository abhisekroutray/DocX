import { getFamilyMember } from "@/lib/actions";
import DocumentsPage from "@/components/DocumentsPage";

export default async function MemberDocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Ensure params is awaited properly
  const familyMember = await getFamilyMember(id);

  if (!familyMember) {
    return <p className="text-center text-red-500">Family member not found.</p>;
  }

  return <DocumentsPage familyMember={familyMember} />;
}
