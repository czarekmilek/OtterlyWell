import { useMemo, useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFoodSearch } from "./hooks/useFoodSearch";
import type { Entry, FoodHit, FoodHitWithGrams } from "./types/types";
import {
  Goals,
  FoodSearch,
  CustomEntry,
  BarcodeScanner,
  EntriesList,
  DateSelector,
} from "./components";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";

export default function Calories() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [goalCalories, setGoalCalories] = useState<number>(2137);
  const [goalProtein, setGoalProtein] = useState(133);
  const [goalFat, setGoalFat] = useState(77);
  const [goalCarbs, setGoalCarbs] = useState(255);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [query, setQuery] = useState("");
  const { loading, hits, error } = useFoodSearch(query);
  const [activeTab, setActiveTab] = useState<"search" | "custom" | "scan">(
    "custom"
  );
  const [customEntry, setCustomEntry] = useState<Omit<Entry, "id">>({
    name: "",
    kcal: 0,
    grams: 100,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  const hitsWithGrams: FoodHitWithGrams[] = useMemo(
    () =>
      hits.map((h) => ({
        ...h,
        listId: (h.sourceId ?? "") + h.name + (h.id ?? ""),
        grams: 100,
      })),
    [hits]
  );

  const [localHits, setLocalHits] = useState<FoodHitWithGrams[]>(hitsWithGrams);

  useEffect(() => {
    if (!user) return;

    async function loadData() {
      if (!user) return;
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("goal_calories, goal_protein, goal_fat, goal_carbs")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) console.error("Error fetching profile", profileError);

      if (profileData) {
        if (profileData.goal_calories)
          setGoalCalories(profileData.goal_calories);
        if (profileData.goal_protein) setGoalProtein(profileData.goal_protein);
        if (profileData.goal_fat) setGoalFat(profileData.goal_fat);
        if (profileData.goal_carbs) setGoalCarbs(profileData.goal_carbs);
      }

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: entriesData, error: entriesError } = await supabase
        .from("calorie_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString())
        .order("created_at", { ascending: false });

      if (entriesError) console.error("Error fetching entries", entriesError);

      if (entriesData) {
        setEntries(entriesData);
      }
      setIsLoading(false);
    }

    loadData();
  }, [user, selectedDate]);

  useEffect(() => {
    setLocalHits(hitsWithGrams);
  }, [hitsWithGrams]);

  const totalCalories = useMemo(
    () =>
      entries.reduce(
        (acc, e) => {
          acc.kcal += e.kcal;
          acc.protein += e.protein;
          acc.fat += e.fat;
          acc.carbs += e.carbs;
          return acc;
        },
        { kcal: 0, protein: 0, fat: 0, carbs: 0 }
      ),
    [entries]
  );

  async function addEntryFromFood(food: FoodHit, grams: number) {
    if (food.kcalPer100g == null) return;
    if (!user) return;

    let foodId = food.id;

    // If external food (no ID yet) try to find it or create new entery in 'foods'
    if (!foodId && food.sourceId) {
      // Check if exists by source_id
      const { data: existing } = await supabase
        .from("foods")
        .select("id")
        .eq("source_id", food.sourceId)
        .maybeSingle();

      if (existing) {
        foodId = existing.id;
      } else {
        const { data: newFood, error: createError } = await supabase
          .from("foods")
          .insert({
            name: food.name,
            brand: food.brand,
            source: "openfoodfacts",
            source_id: food.sourceId,
            kcal_per_100g: food.kcalPer100g,
            protein_g_per_100g: food.proteinPer100g,
            fat_g_per_100g: food.fatPer100g,
            carbs_g_per_100g: food.carbsPer100g,
            image_url: food.imageUrl,
          })
          .select("id")
          .single();

        if (createError) {
          console.error("Error creating food", createError);
        } else if (newFood) {
          foodId = newFood.id;
        }
      }
    }

    const kcal = (food.kcalPer100g * grams) / 100;
    const protein = ((food.proteinPer100g ?? 0) * grams) / 100;
    const fat = ((food.fatPer100g ?? 0) * grams) / 100;
    const carbs = ((food.carbsPer100g ?? 0) * grams) / 100;

    const entryToInsert = {
      user_id: user.id,
      food_id: foodId || null,
      name: `${food.name} (${grams}g)`,
      kcal: Math.round(kcal),
      grams,
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs),
      created_at: selectedDate.toISOString(),
    };

    const { data: newEntry, error } = await supabase
      .from("calorie_entries")
      .insert(entryToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error inserting entry", error);
    } else if (newEntry) {
      setEntries((prev) => [newEntry, ...prev].sort((a, b) => b.kcal - a.kcal));
    }
  }

  const saveGoals = async (updates: {
    goal_calories?: number;
    goal_protein?: number;
    goal_fat?: number;
    goal_carbs?: number;
  }) => {
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      goal_calories: goalCalories,
      goal_protein: goalProtein,
      goal_fat: goalFat,
      goal_carbs: goalCarbs,
      ...updates,
    });

    if (error) console.error("Error updating goals", error);
  };

  const handleSetGoalCalories = (value: number) => {
    const v = value > 0 ? value : 0;
    setGoalCalories(v);
    saveGoals({ goal_calories: v });
  };

  const handleSetGoalProtein = (value: number) => {
    const v = value > 0 ? value : 0;
    setGoalProtein(v);
    saveGoals({ goal_protein: v });
  };

  const handleSetGoalFat = (value: number) => {
    const v = value > 0 ? value : 0;
    setGoalFat(v);
    saveGoals({ goal_fat: v });
  };

  const handleSetGoalCarbs = (value: number) => {
    const v = value > 0 ? value : 0;
    setGoalCarbs(v);
    saveGoals({ goal_carbs: v });
  };

  function handleCustomEntryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setCustomEntry((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Number(value),
    }));
  }

  async function handleCustomEntrySubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    const entryToInsert = {
      ...customEntry,
      user_id: user.id,
      name: `${customEntry.name} (${customEntry.grams}g)`,
      created_at: selectedDate.toISOString(),
    };

    const { data: newEntry, error } = await supabase
      .from("calorie_entries")
      .insert(entryToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error inserting entry", error);
    } else if (newEntry) {
      setEntries((prev) => [newEntry, ...prev].sort((a, b) => b.kcal - a.kcal));
      setCustomEntry({
        name: "",
        kcal: 0,
        grams: 100,
        protein: 0,
        fat: 0,
        carbs: 0,
      });
    }
  }

  async function removeEntry(id: string) {
    const { error } = await supabase
      .from("calorie_entries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting entry", error);
      return;
    }

    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const getTabClassName = (tabName: typeof activeTab) =>
    `flex-1 text-center px-2 sm:px-4 py-2 rounded-t-md transition-colors relative -mb-px ${
      activeTab === tabName
        ? "bg-brand-neutral-dark/50 text-brand-neutral-light border-x border-t border-brand-depth border-b-transparent"
        : "text-brand-neutral-dark hover:bg-brand-accent-3 border-b border-brand-depth cursor-pointer"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-2 sm:py-4 lg:h-[calc(100vh)]"
    >
      <section className="flex lg:flex-row flex-col h-full gap-2">
        <div className="lg:w-1/3 w-full h-full gap-2 flex flex-col">
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          <EntriesList
            entries={entries}
            removeEntry={removeEntry}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:w-2/3 w-full gap-2 flex flex-col h-full">
          {/* <div className="hidden lg:block">
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div> */}
          <Goals
            goalCalories={goalCalories}
            totalCalories={totalCalories}
            goalProtein={goalProtein}
            goalFat={goalFat}
            goalCarbs={goalCarbs}
            setGoalCalories={handleSetGoalCalories}
            setGoalProtein={handleSetGoalProtein}
            setGoalFat={handleSetGoalFat}
            setGoalCarbs={handleSetGoalCarbs}
            isLoading={isLoading}
          />
          <motion.div className="rounded-xl border border-brand-depth bg-brand-neutral-dark/50 p-4 flex-1 flex flex-col min-h-0">
            <div className="flex border-b border-brand-depth">
              <button
                onClick={() => setActiveTab("search")}
                className={getTabClassName("search")}
              >
                Wyszukaj
              </button>
              <button
                onClick={() => setActiveTab("custom")}
                className={getTabClassName("custom")}
              >
                Dodaj własny
              </button>
              <button
                onClick={() => setActiveTab("scan")}
                className={getTabClassName("scan")}
              >
                Skanuj
              </button>
            </div>
            <AnimatePresence mode="wait">
              {activeTab === "search" ? (
                <FoodSearch
                  key="search"
                  query={query}
                  setQuery={setQuery}
                  loading={loading}
                  error={error}
                  localHits={localHits}
                  addEntryFromFood={addEntryFromFood}
                />
              ) : activeTab === "custom" ? (
                <CustomEntry
                  key="custom"
                  customEntry={customEntry}
                  handleCustomEntryChange={handleCustomEntryChange}
                  handleCustomEntrySubmit={handleCustomEntrySubmit}
                />
              ) : (
                <BarcodeScanner
                  key="scan"
                  addEntryFromFood={addEntryFromFood}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
