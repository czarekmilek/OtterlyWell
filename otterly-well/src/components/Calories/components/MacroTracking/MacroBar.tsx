export function MacroBar({
  protein,
  fat,
  carbs,
}: {
  protein: number;
  fat: number;
  carbs: number;
}) {
  // Converting grams to calories
  const proteinCals = protein * 4;
  const fatCals = fat * 9;
  const carbsCals = carbs * 4;

  const totalCalories = Math.max(1e-6, proteinCals + fatCals + carbsCals);
  const proteinPercent = (proteinCals / totalCalories) * 100;
  const fatPercent = (fatCals / totalCalories) * 100;
  const carbsPercent = (carbsCals / totalCalories) * 100;

  return (
    <div className="h-2 w-full rounded-full bg-brand-neutral-dark overflow-hidden flex">
      <div
        className="h-full bg-brand-primary"
        style={{ width: `${proteinPercent}%` }}
        title={`Białko ${protein.toFixed(1)}g`}
      />
      <div
        className="h-full bg-brand-accent-1"
        style={{ width: `${fatPercent}%` }}
        title={`Tłuszcz ${fat.toFixed(1)}g`}
      />
      <div
        className="h-full bg-brand-accent-2"
        style={{ width: `${carbsPercent}%` }}
        title={`Węglowodany ${carbs.toFixed(1)}g`}
      />
    </div>
  );
}
