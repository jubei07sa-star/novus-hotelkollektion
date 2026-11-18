import { LegalPage, legalMetadata } from "@/components/LegalPage";
export function generateMetadata(){return legalMetadata("rechtliche-hinweise");}
export default function Page(){return <LegalPage kind="rechtliche-hinweise"/>;}
