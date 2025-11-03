export function MacroBar({
  protein,
  fat,
  carbs,
}: {
  protein: number;
  fat: number;
  carbs: number;
}) {
  const totalCalories = Math.max(1e-6, protein + fat + carbs);
  const proteinPercent = (protein / totalCalories) * 100;
  const fatPercent = (fat / totalCalories) * 100;
  const carbsPercent = (carbs / totalCalories) * 100;

  return (
    <div className="h-4 w-full max-w-64 rounded-full bg-gray-700 overflow-hidden flex">
      <div
        className="h-full bg-emerald-400"
        style={{ width: `${proteinPercent}%` }}
        title={`Białko ${protein.toFixed(1)}g`}
      />
      <div
        className="h-full bg-rose-400"
        style={{ width: `${fatPercent}%` }}
        title={`Tłuszcz ${fat.toFixed(1)}g`}
      />
      <div
        className="h-full bg-sky-400"
        style={{ width: `${carbsPercent}%` }}
        title={`Węglowodany ${carbs.toFixed(1)}g`}
      />
    </div>
  );
}
