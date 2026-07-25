export type MndaTermType = "fixed" | "until-terminated";
export type ConfidentialityTermType = "fixed" | "perpetuity";

export interface MutualNdaFormData {
  party1Name: string;
  party1Title: string;
  party1Company: string;
  party1Address: string;
  party2Name: string;
  party2Title: string;
  party2Company: string;
  party2Address: string;
  purpose: string;
  effectiveDate: string;
  mndaTermType: MndaTermType;
  mndaTermYears: number;
  confidentialityTermType: ConfidentialityTermType;
  confidentialityTermYears: number;
  governingLaw: string;
  jurisdiction: string;
}

export const emptyMutualNdaFormData: MutualNdaFormData = {
  party1Name: "",
  party1Title: "",
  party1Company: "",
  party1Address: "",
  party2Name: "",
  party2Title: "",
  party2Company: "",
  party2Address: "",
  purpose: "",
  effectiveDate: "",
  mndaTermType: "fixed",
  mndaTermYears: 1,
  confidentialityTermType: "fixed",
  confidentialityTermYears: 1,
  governingLaw: "",
  jurisdiction: "",
};

function formatDate(isoDate: string): string {
  if (!isoDate) return "[Effective Date]";
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function pluralizeYears(years: number): string {
  return `${years} year${years === 1 ? "" : "s"}`;
}

function mndaTermPhrase(data: MutualNdaFormData): string {
  if (data.mndaTermType === "until-terminated") {
    return "Continues until terminated in accordance with the terms of the MNDA";
  }
  return `Expires ${pluralizeYears(data.mndaTermYears)} from the Effective Date`;
}

function confidentialityTermPhrase(data: MutualNdaFormData): string {
  if (data.confidentialityTermType === "perpetuity") {
    return "In perpetuity";
  }
  return `${pluralizeYears(
    data.confidentialityTermYears
  )} from the Effective Date, except that in the case of trade secrets, until the Confidential Information is no longer considered a trade secret under applicable law`;
}

function replaceCoverpageVariable(
  markdown: string,
  variable: string,
  value: string
): string {
  const pattern = new RegExp(
    `<span class="coverpage_link">${variable}</span>`,
    "g"
  );
  return markdown.replace(pattern, value);
}

function buildCoverPage(data: MutualNdaFormData): string {
  return `# Mutual Non-Disclosure Agreement

## Cover Page

**Purpose:** ${data.purpose || "[Purpose]"}

**Effective Date:** ${formatDate(data.effectiveDate)}

**MNDA Term:** ${mndaTermPhrase(data)}

**Term of Confidentiality:** ${confidentialityTermPhrase(data)}

**Governing Law:** ${data.governingLaw || "[Governing Law]"}

**Jurisdiction:** ${data.jurisdiction || "[Jurisdiction]"}

|  | Party 1 | Party 2 |
| --- | --- | --- |
| Name | ${data.party1Name || "[Name]"} | ${data.party2Name || "[Name]"} |
| Title | ${data.party1Title || "[Title]"} | ${data.party2Title || "[Title]"} |
| Company | ${data.party1Company || "[Company]"} | ${
    data.party2Company || "[Company]"
  } |
| Notice Address | ${data.party1Address || "[Notice Address]"} | ${
    data.party2Address || "[Notice Address]"
  } |
`;
}

export function generateMutualNda(
  data: MutualNdaFormData,
  standardTermsMarkdown: string
): string {
  let mergedStandardTerms = standardTermsMarkdown;

  mergedStandardTerms = replaceCoverpageVariable(
    mergedStandardTerms,
    "Purpose",
    data.purpose || "[Purpose]"
  );
  mergedStandardTerms = replaceCoverpageVariable(
    mergedStandardTerms,
    "Effective Date",
    formatDate(data.effectiveDate)
  );
  mergedStandardTerms = replaceCoverpageVariable(
    mergedStandardTerms,
    "MNDA Term",
    mndaTermPhrase(data)
  );
  mergedStandardTerms = replaceCoverpageVariable(
    mergedStandardTerms,
    "Term of Confidentiality",
    confidentialityTermPhrase(data)
  );
  mergedStandardTerms = replaceCoverpageVariable(
    mergedStandardTerms,
    "Governing Law",
    data.governingLaw || "[Governing Law]"
  );
  mergedStandardTerms = replaceCoverpageVariable(
    mergedStandardTerms,
    "Jurisdiction",
    data.jurisdiction || "[Jurisdiction]"
  );

  return `${buildCoverPage(data)}\n---\n\n${mergedStandardTerms}`;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildMutualNdaFilename(data: MutualNdaFormData): string {
  const party1 = slugify(data.party1Company || data.party1Name || "party-1");
  const party2 = slugify(data.party2Company || data.party2Name || "party-2");
  return `mutual-nda-${party1}-${party2}.md`;
}
