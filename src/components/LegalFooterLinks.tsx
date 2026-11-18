import Link from "next/link";
import { PrivacySettingsButton } from "./PrivacyPreferences";
export function LegalFooterLinks(){return <div className="container legal-footer-links"><PrivacySettingsButton/><Link href="/barrierefreiheit">Barrierefreiheit</Link><Link href="/rechtliche-hinweise">Buchung & rechtliche Hinweise</Link></div>;}
