import fs from "fs";
import path from "path";
import NdaForm from "@/components/NdaForm";
import PrintButton from "@/components/PrintButton";

function readMutualNdaTemplate(): string {
  const templatePath = path.join(
    process.cwd(),
    "..",
    "templates",
    "Mutual-NDA.md"
  );
  return fs.readFileSync(templatePath, "utf-8");
}

export default function Home() {
  const templateMarkdown = readMutualNdaTemplate();

  return (
    <main className="page-shell">
      <header className="page-header no-print">
        <div>
          <h1>Mutual NDA Creator</h1>
          <p>
            Fill out the details below to generate a Common Paper Mutual
            Non-Disclosure Agreement.
          </p>
        </div>
        <PrintButton />
      </header>
      <NdaForm templateMarkdown={templateMarkdown} />
    </main>
  );
}
