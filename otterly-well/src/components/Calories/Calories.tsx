import { useMemo, useState } from "react";
import { CalorieIcon } from "../icons";

type Entry = { id: string; name: string; kcal: number };

const defaultGoalCalories = 2137;

export default function Calories() {
  const [goalCalories, setGoal] = useState<number>(defaultGoalCalories);
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState<string>("");
  const [entries, setEntries] = useState<Entry[]>([]);

  const totalCalories = useMemo(
    () => entries.reduce((sum, e) => sum + e.kcal, 0),
    [entries]
  );

  const goalPercent = Math.round(
    (totalCalories / Math.max(goalCalories, 1)) * 100
  );

  function addEntry(e: React.FormEvent) {
    e.preventDefault();
    const cleanProductName = name.trim();
    const productCalorieCount = Number(kcal);
    if (
      !cleanProductName ||
      !Number.isFinite(productCalorieCount) ||
      productCalorieCount <= 0
    )
      return;

    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: cleanProductName,
        kcal: Math.round(productCalorieCount),
      },
    ]);
    setName("");
    setKcal("");
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex items-center gap-3">
        <div className="rounded-lg p-2 bg-gray-700/50 text-orange-400">
          <CalorieIcon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Kalorie</h1>
          <p className="text-gray-400">Lorem ipsum lorem ipsum.</p>
        </div>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-gray-800/50 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-gray-400">Dzisiejszy cel</p>
              <p className="text-3xl font-semibold text-gray-100">
                {goalCalories} kcal
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Zjedzono</p>
              <p className="text-3xl font-semibold text-gray-100">
                {totalCalories} kcal
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-3 w-full rounded-full bg-gray-700 overflow-hidden">
              <div
                className="h-3 bg-orange-400 transition-[width] duration-500"
                style={{ width: `${goalPercent}%` }}
                aria-valuenow={goalPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="mt-2 text-sm text-gray-400">{goalPercent}% celu</p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <label className="text-sm text-gray-300">Ustaw nowy cel:</label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              className="w-28 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
              value={goalCalories}
              onChange={(e) => {
                const newGoal = Number(e.target.value);
                setGoal(newGoal > 0 ? newGoal : defaultGoalCalories);
              }}
            />
          </div>
        </div>

        <form
          onSubmit={addEntry}
          className="rounded-xl border border-white/10 bg-gray-800/50 p-4"
        >
          <h2 className="text-lg font-semibold text-gray-100">Dodaj produkt</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <input
              className="rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 sm:col-span-2"
              placeholder="Nazwa produktu"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              inputMode="numeric"
              className="rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
              placeholder="kcal"
              value={kcal}
              onChange={(e) => setKcal(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full rounded-md bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-400 transition duration-300 cursor-pointer"
            >
              Dodaj
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-white/10 bg-gray-800/50 p-4">
        <h2 className="text-lg font-semibold text-gray-100">
          Historia posiłków
        </h2>

        {entries.length === 0 ? (
          <p className="mt-4 text-gray-400">
            Nic dziś jeszcze nie dodano. Dodaj pierwszy produkt powyżej.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-white/5">
            {entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-gray-100">{e.name}</p>
                  <p className="text-sm text-gray-400">{e.kcal} kcal</p>
                </div>
                <button
                  onClick={() => removeEntry(e.id)}
                  className="rounded-md border border-white/10 bg-gray-900 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800"
                >
                  Usuń
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
