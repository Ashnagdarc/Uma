import { NextResponse } from 'next/server';

type UnifiedRecipe = {
  id: string;
  title: string;
  category: string;
  image: string;
  prepMinutes: number;
  difficulty: string;
  servings: number;
  ingredients: Array<{ amount: string; name: string }>;
  steps: string[];
  nutrition: {
    calories: string;
    protein: string;
    fat: string;
    carbs: string;
  };
  source: 'mealdb' | 'dummyjson';
};

type SearchResult = {
  id: string;
  title: string;
  category: string;
  prepMinutes: number;
};

type MealDbMeal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  [key: string]: string | undefined;
};

type MealDbResponse = {
  meals: MealDbMeal[] | null;
};

type DummyRecipe = {
  id: number;
  name: string;
  image: string;
  cuisine?: string;
  mealType?: string[];
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  difficulty?: string;
  servings?: number;
  ingredients?: string[];
  instructions?: string[];
  caloriesPerServing?: number;
  proteinPerServing?: number;
  fatPerServing?: number;
  carbsPerServing?: number;
};

type DummySearchResponse = {
  recipes: DummyRecipe[];
};

function mapMealDbMealToRecipe(meal: MealDbMeal): UnifiedRecipe {
  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const ingredient = meal[`strIngredient${index + 1}`]?.trim();
    const measure = meal[`strMeasure${index + 1}`]?.trim();

    if (!ingredient) {
      return null;
    }

    return {
      amount: measure || 'As needed',
      name: ingredient,
    };
  }).filter((item): item is { amount: string; name: string } => Boolean(item));

  const steps =
    meal.strInstructions
      ?.split(/\r\n|\n|\.|;/)
      .map((step) => step.trim())
      .filter(Boolean) ?? [];

  return {
    id: `mealdb:${meal.idMeal}`,
    title: meal.strMeal,
    category: meal.strCategory || meal.strArea || 'Chef Selection',
    image: meal.strMealThumb,
    prepMinutes: 30,
    difficulty: 'Medium',
    servings: 2,
    ingredients,
    steps: steps.length > 0 ? steps : ['Follow recipe instructions.'],
    nutrition: {
      calories: 'N/A',
      protein: 'N/A',
      fat: 'N/A',
      carbs: 'N/A',
    },
    source: 'mealdb',
  };
}

function mapDummyRecipeToUnified(recipe: DummyRecipe): UnifiedRecipe {
  const prepMinutes = (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0);

  return {
    id: `dummy:${recipe.id}`,
    title: recipe.name,
    category: recipe.cuisine || recipe.mealType?.[0] || 'Chef Selection',
    image: recipe.image,
    prepMinutes: prepMinutes > 0 ? prepMinutes : 30,
    difficulty: recipe.difficulty || 'Medium',
    servings: recipe.servings || 2,
    ingredients: (recipe.ingredients ?? []).map((name) => ({
      amount: 'As needed',
      name,
    })),
    steps:
      recipe.instructions && recipe.instructions.length > 0
        ? recipe.instructions
        : ['Follow recipe instructions.'],
    nutrition: {
      calories: recipe.caloriesPerServing ? `${recipe.caloriesPerServing} kcal` : 'N/A',
      protein: recipe.proteinPerServing ? `${recipe.proteinPerServing} g` : 'N/A',
      fat: recipe.fatPerServing ? `${recipe.fatPerServing} g` : 'N/A',
      carbs: recipe.carbsPerServing ? `${recipe.carbsPerServing} g` : 'N/A',
    },
    source: 'dummyjson',
  };
}

function toSearchResult(recipe: UnifiedRecipe): SearchResult {
  return {
    id: recipe.id,
    title: recipe.title,
    category: recipe.category,
    prepMinutes: recipe.prepMinutes,
  };
}

async function fetchMealDbBySearch(query: string, limit: number): Promise<UnifiedRecipe[]> {
  const url = new URL('https://www.themealdb.com/api/json/v1/1/search.php');
  url.searchParams.set('s', query);

  const response = await fetch(url.toString(), { cache: 'no-store' });
  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as MealDbResponse;
  return (data.meals ?? []).slice(0, limit).map(mapMealDbMealToRecipe);
}

async function fetchMealDbById(id: string): Promise<UnifiedRecipe | null> {
  const url = new URL('https://www.themealdb.com/api/json/v1/1/lookup.php');
  url.searchParams.set('i', id);

  const response = await fetch(url.toString(), { cache: 'no-store' });
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as MealDbResponse;
  const meal = data.meals?.[0];
  return meal ? mapMealDbMealToRecipe(meal) : null;
}

async function fetchDummyBySearch(query: string, limit: number): Promise<UnifiedRecipe[]> {
  const url = new URL('https://dummyjson.com/recipes/search');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(limit));

  const response = await fetch(url.toString(), { cache: 'no-store' });
  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as DummySearchResponse;
  return (data.recipes ?? []).map(mapDummyRecipeToUnified);
}

async function fetchDummyById(id: string): Promise<UnifiedRecipe | null> {
  const url = new URL(`https://dummyjson.com/recipes/${id}`);
  const response = await fetch(url.toString(), { cache: 'no-store' });

  if (!response.ok) {
    return null;
  }

  const recipe = (await response.json()) as DummyRecipe;
  return mapDummyRecipeToUnified(recipe);
}

function dedupeResults(recipes: UnifiedRecipe[]): UnifiedRecipe[] {
  const seen = new Set<string>();
  const unique: UnifiedRecipe[] = [];

  for (const recipe of recipes) {
    const key = recipe.title.trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(recipe);
    }
  }

  return unique;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') ?? 'fish';
  const limit = Number(searchParams.get('limit') ?? '12');
  const safeLimit = Number.isNaN(limit) ? 12 : Math.max(1, Math.min(limit, 20));
  const recipeId = searchParams.get('id');

  try {
    if (recipeId) {
      if (recipeId.startsWith('mealdb:')) {
        const recipe = await fetchMealDbById(recipeId.replace('mealdb:', ''));
        if (recipe) {
          return NextResponse.json(recipe);
        }
      }

      if (recipeId.startsWith('dummy:')) {
        const recipe = await fetchDummyById(recipeId.replace('dummy:', ''));
        if (recipe) {
          return NextResponse.json(recipe);
        }
      }

      const [mealDbRecipe, dummyRecipe] = await Promise.all([
        fetchMealDbById(recipeId),
        fetchDummyById(recipeId),
      ]);

      const recipe = mealDbRecipe || dummyRecipe;
      if (!recipe) {
        return NextResponse.json(
          { error: 'Recipe not found in free APIs.' },
          { status: 404 }
        );
      }

      return NextResponse.json(recipe);
    }

    const [mealDbRecipes, dummyRecipes] = await Promise.all([
      fetchMealDbBySearch(query, safeLimit),
      fetchDummyBySearch(query, safeLimit),
    ]);

    const merged = dedupeResults([...mealDbRecipes, ...dummyRecipes]).slice(
      0,
      safeLimit
    );

    if (merged.length === 0) {
      return NextResponse.json(
        {
          error:
            'No matching recipe found in free APIs. Try another keyword (e.g., fish, chicken, rice, pasta).',
        },
        { status: 404 }
      );
    }

    const primary = merged[0];

    return NextResponse.json({
      ...primary,
      results: merged.map(toSearchResult),
    });
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error while fetching recipe data.' },
      { status: 500 }
    );
  }
}
