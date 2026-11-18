import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionHeading({ eyebrow, title, description, href, action }: { eyebrow: string; title: string; description?: string; href?: string; action?: string }) {
  return <div className="section-heading"><div><span className="eyebrow eyebrow--dark">{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>{href && <Link className="text-link" href={href}>{action || "Mehr entdecken"} <ArrowUpRight size={17}/></Link>}</div>;
}
