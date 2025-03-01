import { getFamilyMember } from "@/lib/actions";
import DocumentsPage from "@/components/DocumentsPage";

export default async function MemberDocumentsPage({
  params,
}: {
  params: { id: string };
}) {
  const familyMember = await getFamilyMember(params.id);

  if (!familyMember) {
    return <p className="text-center text-red-500">Family member not found.</p>;
  }

  return <DocumentsPage familyMember={familyMember} />;
}
