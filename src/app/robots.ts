import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  // This project is strictly a demonstration; robots are blocked even if deployed accidentally.
  return {rules:[{userAgent:"*",disallow:"/"}]};
}
