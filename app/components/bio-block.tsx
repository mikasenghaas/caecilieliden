// The sidebar bio as a justified word grid: every line is its own flex row
// with the words pushed apart to the block's full width, so the left and
// right edges stay flush no matter how many words a line holds. Lines are
// grouped, and only the gap between groups shows as breathing room.
const BIO_GROUPS: string[][][] = [
  [["cæcilie", "lidén", "bode"]],
  [
    ["digital", "designer", "and", "artist"],
    ["from", "copenhagen"],
  ],
  [
    ["currently", "exploring"],
    ["play", "through", "design"],
    ["and", "people-first", "approaches"],
  ],
  [
    ["creates", "through"],
    ["code", "figma", "procreate"],
    ["and", "by", "hand"],
  ],
  [
    ["this", "is", "my"],
    ["project", "parking", "spot"],
    ["welcome", "!"],
  ],
];

export default function BioBlock() {
  return (
    <div className="flex w-full flex-col gap-3 font-plex text-[20px] italic leading-[22px] font-light text-black">
      {BIO_GROUPS.map((group, groupIndex) => (
        <div key={groupIndex} className="flex flex-col">
          {group.map((line, lineIndex) => (
            <div key={lineIndex} className="flex justify-between gap-3.5">
              {line.map((word, wordIndex) => (
                <span key={wordIndex}>{word}</span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
