"use client";

import { useMemo, useState } from "react";
import {
  buildMutualNdaFilename,
  emptyMutualNdaFormData,
  generateMutualNda,
  MutualNdaFormData,
} from "@/lib/mutualNda";

interface NdaFormProps {
  templateMarkdown: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>'
    );
}

function renderMarkdownToHtml(markdown: string): string {
  const blocks = markdown.replace(/\r\n/g, "\n").split(/\n{2,}/);

  return blocks
    .map((block) => {
      const lines = block.split("\n").filter((line) => line.trim().length > 0);
      const firstLine = lines[0]?.trim() ?? "";

      if (!firstLine) return "";

      if (/^---+$/.test(firstLine)) {
        return "<hr />";
      }

      if (firstLine.startsWith("# ")) {
        return `<h1>${renderInlineMarkdown(firstLine.slice(2))}</h1>`;
      }

      if (firstLine.startsWith("## ")) {
        return `<h2>${renderInlineMarkdown(firstLine.slice(3))}</h2>`;
      }

      if (lines.every((line) => line.trim().startsWith("|"))) {
        const tableRows = lines
          .filter((line) => !/^\|\s*-+\s*(\|\s*-+\s*)+\|?$/.test(line.trim()))
          .map((line, rowIndex) => {
            const cells = line
              .trim()
              .replace(/^\|/, "")
              .replace(/\|$/, "")
              .split("|")
              .map((cell) => cell.trim());
            const cellTag = rowIndex === 0 ? "th" : "td";
            return `<tr>${cells
              .map((cell) => `<${cellTag}>${renderInlineMarkdown(cell)}</${cellTag}>`)
              .join("")}</tr>`;
          });
        return `<table><tbody>${tableRows.join("")}</tbody></table>`;
      }

      if (lines.every((line) => /^\d+\.\s+/.test(line.trim()))) {
        const start = firstLine.match(/^(\d+)\.\s+/)?.[1] ?? "1";
        return `<ol start="${start}">${lines
          .map((line) => {
            const content = line.trim().replace(/^\d+\.\s+/, "");
            return `<li>${renderInlineMarkdown(content)}</li>`;
          })
          .join("")}</ol>`;
      }

      return `<p>${renderInlineMarkdown(lines.join(" "))}</p>`;
    })
    .join("");
}

export default function NdaForm({ templateMarkdown }: NdaFormProps) {
  const [formData, setFormData] = useState<MutualNdaFormData>(
    emptyMutualNdaFormData
  );

  const generatedDocument = useMemo(
    () => generateMutualNda(formData, templateMarkdown),
    [formData, templateMarkdown]
  );
  const renderedDocument = useMemo(
    () => renderMarkdownToHtml(generatedDocument),
    [generatedDocument]
  );

  function updateField<K extends keyof MutualNdaFormData>(
    field: K,
    value: MutualNdaFormData[K]
  ) {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }

  function handleDownload() {
    const blob = new Blob([generatedDocument], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = buildMutualNdaFilename(formData);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="layout-grid">
      <div className="form-column">
        <form onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend>Party 1</legend>
            <div className="field">
              <label htmlFor="party1Name">Name</label>
              <input
                id="party1Name"
                type="text"
                required
                value={formData.party1Name}
                onChange={(e) => updateField("party1Name", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="party1Title">Title</label>
              <input
                id="party1Title"
                type="text"
                value={formData.party1Title}
                onChange={(e) => updateField("party1Title", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="party1Company">Company</label>
              <input
                id="party1Company"
                type="text"
                required
                value={formData.party1Company}
                onChange={(e) => updateField("party1Company", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="party1Address">Notice Address</label>
              <input
                id="party1Address"
                type="text"
                value={formData.party1Address}
                onChange={(e) => updateField("party1Address", e.target.value)}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Party 2</legend>
            <div className="field">
              <label htmlFor="party2Name">Name</label>
              <input
                id="party2Name"
                type="text"
                required
                value={formData.party2Name}
                onChange={(e) => updateField("party2Name", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="party2Title">Title</label>
              <input
                id="party2Title"
                type="text"
                value={formData.party2Title}
                onChange={(e) => updateField("party2Title", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="party2Company">Company</label>
              <input
                id="party2Company"
                type="text"
                required
                value={formData.party2Company}
                onChange={(e) => updateField("party2Company", e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="party2Address">Notice Address</label>
              <input
                id="party2Address"
                type="text"
                value={formData.party2Address}
                onChange={(e) => updateField("party2Address", e.target.value)}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Agreement Details</legend>
            <div className="field">
              <label htmlFor="purpose">Purpose</label>
              <textarea
                id="purpose"
                required
                value={formData.purpose}
                onChange={(e) => updateField("purpose", e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="effectiveDate">Effective Date</label>
              <input
                id="effectiveDate"
                type="date"
                required
                value={formData.effectiveDate}
                onChange={(e) => updateField("effectiveDate", e.target.value)}
              />
            </div>

            <div className="field">
              <span>MNDA Term</span>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="mndaTermType"
                    checked={formData.mndaTermType === "fixed"}
                    onChange={() => updateField("mndaTermType", "fixed")}
                  />
                  Expires{" "}
                  <input
                    type="number"
                    min={1}
                    disabled={formData.mndaTermType !== "fixed"}
                    value={formData.mndaTermYears}
                    onChange={(e) =>
                      updateField("mndaTermYears", Number(e.target.value))
                    }
                  />{" "}
                  year(s) from the Effective Date
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="mndaTermType"
                    checked={formData.mndaTermType === "until-terminated"}
                    onChange={() =>
                      updateField("mndaTermType", "until-terminated")
                    }
                  />
                  Continues until terminated
                </label>
              </div>
            </div>

            <div className="field">
              <span>Term of Confidentiality</span>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="confidentialityTermType"
                    checked={formData.confidentialityTermType === "fixed"}
                    onChange={() =>
                      updateField("confidentialityTermType", "fixed")
                    }
                  />
                  <input
                    type="number"
                    min={1}
                    disabled={formData.confidentialityTermType !== "fixed"}
                    value={formData.confidentialityTermYears}
                    onChange={(e) =>
                      updateField(
                        "confidentialityTermYears",
                        Number(e.target.value)
                      )
                    }
                  />{" "}
                  year(s) from the Effective Date
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="confidentialityTermType"
                    checked={
                      formData.confidentialityTermType === "perpetuity"
                    }
                    onChange={() =>
                      updateField("confidentialityTermType", "perpetuity")
                    }
                  />
                  In perpetuity
                </label>
              </div>
            </div>

            <div className="field">
              <label htmlFor="governingLaw">Governing Law (state)</label>
              <input
                id="governingLaw"
                type="text"
                required
                placeholder="e.g. Delaware"
                value={formData.governingLaw}
                onChange={(e) => updateField("governingLaw", e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="jurisdiction">Jurisdiction</label>
              <input
                id="jurisdiction"
                type="text"
                required
                placeholder="e.g. New Castle, DE"
                value={formData.jurisdiction}
                onChange={(e) => updateField("jurisdiction", e.target.value)}
              />
            </div>
          </fieldset>
        </form>
      </div>

      <div className="preview-column">
        <h2>Preview</h2>
        <article
          className="preview-paper"
          dangerouslySetInnerHTML={{ __html: renderedDocument }}
        />
        <button
          type="button"
          className="download-button no-print"
          onClick={handleDownload}
        >
          Download .md
        </button>
      </div>
    </div>
  );
}
