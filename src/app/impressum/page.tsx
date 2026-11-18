import { LegalPage, legalMetadata } from "@/components/LegalPage";
export function generateMetadata(){return legalMetadata("impressum");}
export default function Page(){return <LegalPage kind="impressum"/>;}
