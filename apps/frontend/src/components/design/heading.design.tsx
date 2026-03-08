export function Heading({ name, desc }: { name: string; desc?: string }) {
  return (
    <div className="flex w-full relative mt-2 mb-4 flex-col">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-main capitalize  pb ">{name}</h1>
      </div>
      {desc && <p className="text-main-500 text-sm mt-2">{desc}</p>}
    </div>
  );
}
