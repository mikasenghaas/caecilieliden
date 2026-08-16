import Link from "next/link";

// Bottom-left counterpart to BioBlock: the internship note and the social
// links set as the same justified word grid, so both ends of every line stay
// flush with the column edges.
const SOCIALS: Record<string, string> = {
  email: "mailto:caeciliebode@gmail.com",
  linkedin:
    "https://www.linkedin.com/in/c%C3%A6cilie-lid%C3%A9n-bode-8745a025a/",
  twitter: "https://x.com/caecilieliden",
  instagram: "https://www.instagram.com/caecilieliden/",
  pinterest: "https://pin.it/7Jg9C1reP",
};

const NOTE_GROUPS: string[][][] = [
  [
    ["looking", "for", "an", "internship"],
    ["this", "spring"],
  ],
  [["feel", "free", "to", "reach", "out"]],
];

const LINK_LINES: string[][] = [
  ["email", "linkedin", "twitter"],
  ["instagram", "pinterest"],
];

function Line({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-between gap-3.5">{children}</div>;
}

export default function ContactBlock() {
  return (
    <div className="flex w-full flex-col gap-3 font-plex text-[20px] italic leading-[22px] font-light text-black">
      {NOTE_GROUPS.map((group, groupIndex) => (
        <div key={groupIndex} className="flex flex-col">
          {group.map((line, lineIndex) => (
            <Line key={lineIndex}>
              {line.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </Line>
          ))}
        </div>
      ))}

      <div className="flex flex-col">
        {LINK_LINES.map((line, lineIndex) => (
          <Line key={lineIndex}>
            {line.map((name) => (
              <Link
                key={name}
                href={SOCIALS[name]}
                {...(SOCIALS[name].startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="transition-colors duration-200 ease-out hover:text-[#ED2E85]"
              >
                {name}
              </Link>
            ))}
          </Line>
        ))}
      </div>
    </div>
  );
}
