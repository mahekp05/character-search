type Character = {
  id: number;
  name: string;
  source: string;
  traits: string[];
};

export default async function Home() {
  const res = await fetch("http://localhost:5000/api/characters", {
    cache: "no-store",
  });

  const characters: Character[] = await res.json();

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6">Character Search</h1>

      <div className="grid gap-4">
        {characters.map((character) => (
          <div key={character.id} className="border rounded-xl p-4">
            <h2 className="text-xl font-semibold">{character.name}</h2>
            <p>{character.source}</p>
            <p>{character.traits.join(", ")}</p>
          </div>
        ))}
      </div>
    </main>
  );
}