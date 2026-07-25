"use client";

import { useState } from "react";
import {
  buildMutualNdaFilename,
  emptyMutualNdaFormData,
  generateMutualNda,
  MutualNdaFormData,
} from "@/lib/mutualNda";

interface NdaFormProps {
  templateMarkdown: string;
}

export default function NdaForm({ templateMarkdown }: NdaFormProps) {
  const [formData, setFormData] = useState<MutualNdaFormData>(
    emptyMutualNdaFormData
  );
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(
    null
  );

  function updateField<K extends keyof MutualNdaFormData>(
    field: K,
    value: MutualNdaFormData[K]
  ) {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGeneratedDocument(generateMutualNda(formData, templateMarkdown));
  }

  function handleDownload() {
    if (!generatedDocument) return;
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
    <div>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Party 1</legend>
          <label htmlFor="party1Name">Name</label>
          <input
            id="party1Name"
            type="text"
            required
            value={formData.party1Name}
            onChange={(e) => updateField("party1Name", e.target.value)}
          />
          <label htmlFor="party1Title">Title</label>
          <input
            id="party1Title"
            type="text"
            value={formData.party1Title}
            onChange={(e) => updateField("party1Title", e.target.value)}
          />
          <label htmlFor="party1Company">Company</label>
          <input
            id="party1Company"
            type="text"
            required
            value={formData.party1Company}
            onChange={(e) => updateField("party1Company", e.target.value)}
          />
          <label htmlFor="party1Address">Notice Address</label>
          <input
            id="party1Address"
            type="text"
            value={formData.party1Address}
            onChange={(e) => updateField("party1Address", e.target.value)}
          />
        </fieldset>

        <fieldset>
          <legend>Party 2</legend>
          <label htmlFor="party2Name">Name</label>
          <input
            id="party2Name"
            type="text"
            required
            value={formData.party2Name}
            onChange={(e) => updateField("party2Name", e.target.value)}
          />
          <label htmlFor="party2Title">Title</label>
          <input
            id="party2Title"
            type="text"
            value={formData.party2Title}
            onChange={(e) => updateField("party2Title", e.target.value)}
          />
          <label htmlFor="party2Company">Company</label>
          <input
            id="party2Company"
            type="text"
            required
            value={formData.party2Company}
            onChange={(e) => updateField("party2Company", e.target.value)}
          />
          <label htmlFor="party2Address">Notice Address</label>
          <input
            id="party2Address"
            type="text"
            value={formData.party2Address}
            onChange={(e) => updateField("party2Address", e.target.value)}
          />
        </fieldset>

        <fieldset>
          <legend>Agreement Details</legend>
          <label htmlFor="purpose">Purpose</label>
          <textarea
            id="purpose"
            required
            value={formData.purpose}
            onChange={(e) => updateField("purpose", e.target.value)}
          />

          <label htmlFor="effectiveDate">Effective Date</label>
          <input
            id="effectiveDate"
            type="date"
            required
            value={formData.effectiveDate}
            onChange={(e) => updateField("effectiveDate", e.target.value)}
          />

          <div>
            <span>MNDA Term</span>
            <label>
              <input
                type="radio"
                name="mndaTermType"
                checked={formData.mndaTermType === "fixed"}
                onChange={() => updateField("mndaTermType", "fixed")}
              />
              Expires
              <input
                type="number"
                min={1}
                disabled={formData.mndaTermType !== "fixed"}
                value={formData.mndaTermYears}
                onChange={(e) =>
                  updateField("mndaTermYears", Number(e.target.value))
                }
              />
              year(s) from the Effective Date
            </label>
            <label>
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

          <div>
            <span>Term of Confidentiality</span>
            <label>
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
              />
              year(s) from the Effective Date
            </label>
            <label>
              <input
                type="radio"
                name="confidentialityTermType"
                checked={formData.confidentialityTermType === "perpetuity"}
                onChange={() =>
                  updateField("confidentialityTermType", "perpetuity")
                }
              />
              In perpetuity
            </label>
          </div>

          <label htmlFor="governingLaw">Governing Law (state)</label>
          <input
            id="governingLaw"
            type="text"
            required
            placeholder="e.g. Delaware"
            value={formData.governingLaw}
            onChange={(e) => updateField("governingLaw", e.target.value)}
          />

          <label htmlFor="jurisdiction">Jurisdiction</label>
          <input
            id="jurisdiction"
            type="text"
            required
            placeholder="e.g. New Castle, DE"
            value={formData.jurisdiction}
            onChange={(e) => updateField("jurisdiction", e.target.value)}
          />
        </fieldset>

        <button type="submit">Generate NDA</button>
      </form>

      {generatedDocument && (
        <section>
          <h2>Preview</h2>
          <pre>{generatedDocument}</pre>
          <button type="button" onClick={handleDownload}>
            Download .md
          </button>
        </section>
      )}
    </div>
  );
}
