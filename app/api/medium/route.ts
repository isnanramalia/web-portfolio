import { NextResponse } from "next/server";

export const revalidate = 300; // revalidate every 5 minutes

interface MediumArticle {
  title: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  description: string;
  readingTime: number;
  categories: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractCDATA(str: string): string {
  const match = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return match ? match[1].trim() : str.trim();
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractFirstImage(html: string): string | undefined {
  let m = html.match(
    /src="(https?:\/\/(?:cdn-images-\d+\.medium\.com|miro\.medium\.com)[^"]+)"/i,
  );
  if (m?.[1]) return m[1];

  m = html.match(
    /src='(https?:\/\/(?:cdn-images-\d+\.medium\.com|miro\.medium\.com)[^']+)'/i,
  );
  if (m?.[1]) return m[1];

  m = html.match(/<img\b[^>]*\bsrc="(https?:\/\/[^"]+)"/i);
  if (m?.[1]) return m[1];

  m = html.match(/<img\b[^>]*\bsrc='(https?:\/\/[^']+)'/i);
  if (m?.[1]) return m[1];

  return undefined;
}

function extractContentEncoded(itemXml: string): string {
  const cdataMatch = itemXml.match(
    /<content:encoded>\s*<!\[CDATA\[([\s\S]*)\]\]>\s*<\/content:encoded>/,
  );
  if (cdataMatch?.[1]) return cdataMatch[1];

  const plainMatch = itemXml.match(
    /<content:encoded>([\s\S]*?)<\/content:encoded>/,
  );
  if (plainMatch?.[1]) return extractCDATA(plainMatch[1]);

  return "";
}

function cleanMediumUrl(url: string): string {
  try {
    const parsed = new URL(url.trim());
    parsed.search = "";
    return parsed.toString();
  } catch {
    return url.split("?")[0].trim();
  }
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// ---------------------------------------------------------------------------
// RSS parser
// ---------------------------------------------------------------------------

function parseRSSItems(xml: string): MediumArticle[] {
  const articles: MediumArticle[] = [];

  const channelMatch = xml.match(/<channel>([\s\S]*)<\/channel>/);
  if (!channelMatch) return articles;

  const channelContent = channelMatch[1];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch: RegExpExecArray | null;

  while (
    (itemMatch = itemRegex.exec(channelContent)) !== null &&
    articles.length < 3
  ) {
    const itemXml = itemMatch[1];

    // Title
    const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
    const title = titleMatch ? extractCDATA(titleMatch[1]) : "";
    if (!title) continue;

    // Link
    let link = "";
    const linkMatch = itemXml.match(/<link>(https?:\/\/[^<]+)<\/link>/);
    if (linkMatch) {
      link = cleanMediumUrl(linkMatch[1]);
    } else {
      const guidMatch = itemXml.match(/<guid[^>]*>([\s\S]*?)<\/guid>/);
      if (guidMatch) link = extractCDATA(guidMatch[1]).split("?")[0];
    }
    if (!link) continue;

    // Publish date
    const dateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const pubDate = dateMatch ? formatDate(dateMatch[1].trim()) : "";

    // Content:encoded — thumbnail + reading time
    const contentHtml = extractContentEncoded(itemXml);
    const thumbnail = extractFirstImage(contentHtml);
    const contentText = stripHtml(contentHtml);
    const readingTime = estimateReadingTime(contentText);

    // Short excerpt from <description> (falls back to content text)
    const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);
    const descRaw = descMatch ? extractCDATA(descMatch[1]) : "";
    const descText = stripHtml(descRaw);
    const source = descText.length > 50 ? descText : contentText;
    const description =
      source.length > 160 ? source.slice(0, 157).trimEnd() + "..." : source;

    // Categories / tags
    const categories: string[] = [];
    const categoryRegex = /<category>([\s\S]*?)<\/category>/g;
    let catMatch: RegExpExecArray | null;
    while ((catMatch = categoryRegex.exec(itemXml)) !== null) {
      const cat = extractCDATA(catMatch[1]);
      if (cat) categories.push(cat);
    }

    articles.push({
      title,
      link,
      pubDate,
      thumbnail,
      description,
      readingTime,
      categories,
    });
  }

  return articles;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    const response = await fetch("https://medium.com/feed/@isnanramalia", {
      next: { revalidate: 300 },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Portfolio RSS Reader/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });

    if (!response.ok) {
      throw new Error(`Medium RSS responded with status ${response.status}`);
    }

    const xml = await response.text();
    const articles = parseRSSItems(xml);

    return NextResponse.json(
      { articles },
      {
        headers: {
          // Short-lived browser cache only — no CDN stale-while-revalidate
          // that would keep serving old thumbnails for up to 86400 s.
          "Cache-Control": "public, max-age=300, s-maxage=300",
        },
      },
    );
  } catch (error) {
    console.error("[medium/route] Failed to fetch RSS:", error);

    // Hardcoded fallback so the UI never shows a broken state
    const fallback: MediumArticle[] = [
      {
        title:
          "Dua Minggu Belajar Manual Testing — Ini yang Berubah dari Cara Pikirku",
        link: "https://medium.com/@isnanramalia/dua-minggu-belajar-manual-testing-ini-yang-berubah-dari-cara-pikirku-935a51c5526e",
        pubDate: "Mar 21, 2026",
        description:
          "Dua minggu sudah berlalu sejak aku pertama kali buka materi SQA. Sembilan artikel sudah publish, puluhan test case sudah ditulis, beberapa bug sudah didokumentasikan. Dan sekarang saatnya berhenti sebentar, noleh ke belakang, dan jujur — apa yang sebenarnya berubah?",
        readingTime: 6,
        categories: ["QA", "Testing", "Learning"],
      },
      {
        title: "Test Plan: Sepenting Apa Sih Sebenernya?",
        link: "https://medium.com/@isnanramalia/test-plan-sepenting-apa-sih-sebenernya-d9c26d7d3d95",
        pubDate: "Mar 14, 2026",
        description:
          "Setelah fokus membuat Test Case, selanjutnya roadmap belajarku adalah finalisasi Test Plan. Dan di tengah proses itu muncul satu pertanyaan yang cukup mengganggu: Emang sepenting itu ya bikin Test Plan ini?",
        readingTime: 5,
        categories: ["QA", "Testing", "Test Plan"],
      },
      {
        title:
          "Regression Testing & Agile, Posisi QA di Tim Dev Itu Seperti Ini?",
        link: "https://medium.com/@isnanramalia/regression-testing-agile-posisi-qa-di-tim-dev-itu-seperti-ini-6d1d62b98441",
        pubDate: "Mar 13, 2026",
        description:
          "Hari ke-delapan belajar SQA, dan hari ini materinya ada dua yang saling berkaitan: Regression Testing dan Agile. Keduanya nyambung karena di dunia kerja nyata, regression testing itu justru paling sering muncul di lingkungan tim yang pakai Agile.",
        readingTime: 6,
        categories: ["QA", "Agile", "Testing"],
      },
    ];

    return NextResponse.json(
      { articles: fallback },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
