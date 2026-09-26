#!/usr/bin/env node
// Converts the Markdown newsletters under newsletter/<series>/ into
// email-safe HTML (inline styles, table layout) matching the existing
// Brevo DOI template's look. Writes one .html file per episode plus a
// manifest.json (subject/preheader/htmlPath) into each series' own output
// folder, which the agent reads to create the Brevo SMTP templates via MCP.
//
// Run: node scripts/newsletter-generator/build-templates.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_OUT_DIR = path.join(__dirname, "output");
const SITE_URL = "https://schreiner.digital";

// Jede Serie hat einen eigenen Quellordner unter newsletter/ und einen
// eigenen Ausgabeordner, damit neue Serien nie mit bestehenden
// Episoden-Dateinamen kollidieren.
const SERIES = [
  {
    label: "Auftragsabwicklung",
    srcDir: path.join(__dirname, "../../newsletter/auftragsabwicklung"),
    outDir: BASE_OUT_DIR,
    // Eigene Brevo-Liste mit dediziertem Opt-in (siehe SOURCE_ENV_OVERRIDES
    // in src/lib/newsletter.ts) – Hinweistext nennt die Serie deshalb
    // namentlich.
    signupReason: "die Lehrzettel-Serie &bdquo;Auftragsabwicklung&ldquo;",
  },
  {
    label: "Tools erklärt",
    srcDir: path.join(__dirname, "../../newsletter/tools-erklaert"),
    outDir: path.join(BASE_OUT_DIR, "tools-erklaert"),
    // Läuft über die allgemeine Newsletter-Liste, kein eigenes Opt-in –
    // Hinweistext bleibt deshalb generisch.
    signupReason: "den Newsletter",
  },
];

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderInline(text) {
  let s = escapeHtml(text);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const href = url.startsWith("/") ? SITE_URL + url : url;
    return `<a href="${href}" style="color:${ACCENT};text-decoration:underline;">${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return s;
}

// Farb-Tokens 1:1 aus src/app/globals.css (Light-Mode) übernommen, damit der
// Newsletter dieselbe Palette wie die Website nutzt statt eigener Näherungswerte.
const INK = "#1b1712";
const INK_MUTED = "#6c6252";
const INK_FAINT = "#928777";
const BORDER = "#e6ddce";
const BORDER_STRONG = "#d6c9b3";
const ACCENT = "#ff7a1a";
const ACCENT_SOFT = "#f4e8d8";

const h1 = (t) => `<h1 style="margin:0 0 18px 0;font-size:23px;line-height:1.3;color:${INK};">${t}</h1>`;
const h2 = (t) =>
  `<h2 style="margin:26px 0 10px 0;font-size:17px;line-height:1.4;color:${INK};padding-bottom:6px;border-bottom:1px solid ${BORDER};">${t}</h2>`;
const p = (t) => `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:${INK_MUTED};">${t}</p>`;
const ul = (items) =>
  `<ul style="margin:0 0 16px 0;padding:0 0 0 20px;">${items
    .map((it) => `<li style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:${INK_MUTED};">${it}</li>`)
    .join("")}</ul>`;
const ol = (items) =>
  `<ol style="margin:0 0 16px 0;padding:0 0 0 20px;">${items
    .map((it) => `<li style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:${INK_MUTED};">${it}</li>`)
    .join("")}</ol>`;
const img = (src, alt) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px 0;"><tr><td style="border:1px solid ${BORDER};border-radius:10px;overflow:hidden;line-height:0;"><img src="${src}" alt="${alt}" width="560" style="display:block;width:100%;max-width:560px;height:auto;" /></td></tr></table>`;

const IMAGE_RE = /^!\[([^\]]*)\]\(([^)]+)\)$/;

function renderMainBlocks(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      out.push(h1(renderInline(line.slice(2).trim())));
      i++;
    } else if (line.startsWith("## ")) {
      out.push(h2(renderInline(line.slice(3).trim())));
      i++;
    } else if (IMAGE_RE.test(line.trim())) {
      const [, alt, url] = line.trim().match(IMAGE_RE);
      const src = url.startsWith("/") ? SITE_URL + url : url;
      out.push(img(src, escapeHtml(alt)));
      i++;
    } else if (/^- /.test(line)) {
      const items = [];
      while (i < lines.length && /^- /.test(lines[i])) {
        items.push(renderInline(lines[i].slice(2).trim()));
        i++;
      }
      out.push(ul(items));
    } else if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(renderInline(lines[i].replace(/^\d+\.\s/, "").trim()));
        i++;
      }
      out.push(ol(items));
    } else {
      const paraLines = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !/^#|^- |^\d+\.\s/.test(lines[i]) &&
        !IMAGE_RE.test(lines[i].trim())
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      out.push(p(renderInline(paraLines.join(" ").trim())));
    }
  }
  return out.join("\n");
}

// Box-Stil für den ersten Absatz (Vorlagen-Verweis, alle 10 Ausgaben) sowie für
// jeden weiteren Absatz, der mit "[INFO]" markiert ist (z. B. ein zusätzlicher
// Praxis-Hinweis wie die GoBD-Falle in Ausgabe 1).
function renderFooterBlock(footerMd) {
  const paras = footerMd.trim().split(/\n\s*\n/).filter(Boolean);
  return paras
    .map((raw, idx) => {
      let trimmed = raw.trim();
      const isInfoBox = trimmed.startsWith("[INFO]");
      if (isInfoBox) trimmed = trimmed.slice("[INFO]".length).trim();
      const isDisclaimer = trimmed.startsWith("*") && trimmed.endsWith("*") && !trimmed.startsWith("**");
      const text = isDisclaimer ? trimmed.slice(1, -1) : trimmed;
      const inline = renderInline(text);
      if (idx === 0 || isInfoBox) {
        return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px 0;"><tr><td style="background-color:${ACCENT_SOFT};border:1px solid ${BORDER_STRONG};border-radius:10px;padding:16px 18px;"><p style="margin:0;font-size:14.5px;line-height:1.6;color:${INK};">${inline}</p></td></tr></table>`;
      }
      if (isDisclaimer) {
        return `<p style="margin:20px 0 0 0;font-size:12px;line-height:1.6;color:${INK_FAINT};font-style:italic;">${inline}</p>`;
      }
      return p(inline);
    })
    .join("\n");
}

function buildHtml({ episode, total, label, signupReason, mainHtml, footerHtml }) {
  return `<!doctype html>
<html lang="de">
  <body style="margin:0;padding:0;background-color:#faf8f4;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf8f4;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:28px 36px 16px 36px;border-bottom:1px solid ${BORDER};">
                <p style="margin:0;font-size:20px;line-height:1;letter-spacing:-0.02em;">
                  <span style="font-weight:bold;color:${INK};">schreiner</span><span style="font-weight:bold;color:${ACCENT};">.digital</span>
                </p>
                <p style="margin:8px 0 0 0;font-size:12px;letter-spacing:0.03em;color:${INK_FAINT};">Lehrzettel-Serie &middot; ${label} &middot; Ausgabe ${episode}/${total}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 36px 8px 36px;">
${mainHtml}
${footerHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 36px 32px 36px;border-top:1px solid ${BORDER};">
                <p style="margin:0 0 6px 0;font-size:12px;line-height:1.6;color:${INK_FAINT};">
                  Du bekommst diese E-Mail, weil du dich f&uuml;r ${signupReason} auf schreiner.digital angemeldet hast.
                </p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:${INK_FAINT};">
                  <a href="{{ unsubscribe }}" style="color:${INK_FAINT};text-decoration:underline;">Newsletter abbestellen</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

let totalGenerated = 0;

for (const series of SERIES) {
  if (!fs.existsSync(series.srcDir)) continue;
  fs.mkdirSync(series.outDir, { recursive: true });

  const files = fs
    .readdirSync(series.srcDir)
    .filter((f) => /^\d{2}-.*\.md$/.test(f))
    .sort();

  const manifest = [];

  files.forEach((file, idx) => {
    const episode = idx + 1;
    const total = files.length;
    const raw = fs.readFileSync(path.join(series.srcDir, file), "utf8");
    const { data, content } = matter(raw);
    const [mainMd, footerMd] = content.split(/\n---\n/);

    const mainHtml = renderMainBlocks(mainMd);
    const footerHtml = renderFooterBlock(footerMd);
    const html = buildHtml({
      episode,
      total,
      label: series.label,
      signupReason: series.signupReason,
      mainHtml,
      footerHtml,
    });

    const outFile = `${String(episode).padStart(2, "0")}-${path.basename(file, ".md")}.html`;
    fs.writeFileSync(path.join(series.outDir, outFile), html, "utf8");

    manifest.push({
      episode,
      file,
      subject: data.Betreff,
      preheader: data.Preheader,
      htmlFile: outFile,
    });
  });

  fs.writeFileSync(path.join(series.outDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log(`Generated ${manifest.length} email templates (${series.label}) into ${series.outDir}`);
  totalGenerated += manifest.length;
}

console.log(`Done: ${totalGenerated} email templates total.`);
