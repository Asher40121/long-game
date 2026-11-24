/** Renders the small Markdown subset used by briefs: ### headings, **bold**, "- " bullets, paragraphs. */
function inline(text: string, key: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={`${key}-${i}`} className="font-semibold text-ink">{part.slice(2, -2)}</strong> : part,
  );
}

export function Markdown({ source }: { source: string }) {
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = (k: number) => {
    if (bullets.length) {
      blocks.push(
        <ul key={`ul-${k}`} className="my-2 list-disc space-y-1 pl-5">
          {bullets.map((b, i) => <li key={i}>{inline(b, `li-${k}-${i}`)}</li>)}
        </ul>,
      );
      bullets = [];
    }
  };
  source.split("\n").forEach((line, k) => {
    if (line.startsWith("- ")) return void bullets.push(line.slice(2));
    flush(k);
    if (line.startsWith("### ")) blocks.push(<h3 key={k} className="mt-5 text-xs font-semibold uppercase tracking-wider text-accent">{line.slice(4)}</h3>);
    else if (line.trim()) blocks.push(<p key={k} className="my-2">{inline(line, `p-${k}`)}</p>);
  });
  flush(-1);
  return <div className="text-[15px] leading-relaxed text-ink/90">{blocks}</div>;
}
