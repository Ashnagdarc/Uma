import { NextResponse } from 'next/server';

type SpoonacularSearchResponse = {
  results: Array<{
    id: number;
    title: string;
    image: string;
    readyInMinutes?: number;
    servings?: number;
    cuisines?: string[];
    dishTypes?: string[];
    extendedIngredients?: Array<{
      originalMeasure?: string;
      amount?: number;
      unit?: string;
      nameClean?: string;
      name?: string;
    }>;
    analyzedInstructions?: Array<{
      steps: Array<{
        number: number;
        step: string;
      }>;
    }>;
    nutrition?: {
      nutrients?: Array<{
        name: string;
        amount: number;
        unit: string;
      }>;
    };
  }>;
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

function mapMealDbMealToRecipe(meal: MealDbMeal) {
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

  const rawSteps = meal.strInstructions
    ?.split(/\r\n|\n|\.|;/)
    .map((step) => step.trim())
    .filter(Boolean);

  const steps = rawSteps && rawSteps.length > 0 ? rawSteps : ['Follow recipe instructions.'];

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    category: meal.strCategory || meal.strArea || 'Chef Selection',
    image: meal.strMealThumb,
    prepMinutes: 30,
    difficulty: 'Medium',
    servings: 2,
    ingredients,
    steps,
    nutrition: {
      calories: 'N/A',
      protein: 'N/A',
      fat: 'N/A',
      carbs: 'N/A',
    },
  };
}

async function fetchFromMealDbBySearch(query: string, limit: number) {
  const url = new URL('https://www.themealdb.com/api/json/v1/1/search.php');
  url.searchParams.set('s', query);

  const response = await fetch(url.toString(), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`MealDB search failed: ${response.status}`);
  }

  const data = (await response.json()) as MealDbResponse;
  const meals = (data.meals ?? []).slice(0, limit);

  if (meals.length === 0) {
    return null;
  }

  const firstRecipe = mapMealDbMealToRecipe(meals[0]);

  return {
    ...firstRecipe,
    results: meals.map((meal) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      category: meal.strCategory || meal.strArea || 'Chef Selection',
      prepMinutes: 30,
    })),
    source: 'mealdb',
  };
}

async function fetchFromMealDbById(id: string) {
  const url = new URL('https://www.themealdb.com/api/json/v1/1/lookup.php');
  url.searchParams.set('i', id);

  const response = await fetch(url.toString(), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`MealDB lookup failed: ${response.status}`);
  }

  const data = (await response.json()) as MealDbResponse;
  const meal = data.meals?.[0];

  if (!meal) {
    return null;
  }

  return {
    ...mapMealDbMealToRecipe(meal),
    source: 'mealdb',
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') ?? 'fish';
  const limit = Number(searchParams.get('limit') ?? '12');
  const safeLimit = Number.isNaN(limit) ? 12 : Math.max(1, Math.min(limit, 20));
  const recipeId = searchParams.get('id');
  const apiKey = process.env.SPOONACULAR_API_KEY;

  try {
    if (recipeId) {
      if (apiKey) {
        const detailsUrl = new URL(`https://api.spoonacular.com/recipes/${recipeId}/information`);
        detailsUrl.searchParams.set('includeNutrition', 'true');
        detailsUrl.searchParams.set('apiKey', apiKey);

        const detailsResponse = await fetch(detailsUrl.toString(), { cache: 'no-store' });

        if (detailsResponse.ok) {
          const recipe = (await detailsResponse.json()) as SpoonacularSearchResponse['results'][number];
          const nutrients = recipe.nutrition?.nutrients ?? [];
          const calories = nutrients.find((n) => n.name === 'Calories');
          const protein = nutrients.find((n) => n.name === 'Protein');
          const fat = nutrients.find((n) => n.name === 'Fat');
          const carbs = nutrients.find((n) => n.name === 'Carbohydrates');

          const ingredients = (recipe.extendedIngredients ?? []).map((ingredient) => {
            const amount = ingredient.originalMeasure?.trim();
            const fallbackAmount =
              ingredient.amount !== undefined
                ? `${ingredient.amount}${ingredient.unit ? ` ${ingredient.unit}` : ''}`
                : 'As needed';

            return {
              amount: amount || fallbackAmount,
              name: ingredient.nameClean || ingredient.name || 'Ingredient',
            };
          });

          const steps = recipe.analyzedInstructions?.[0]?.steps?.map((step) => step.step) ?? [];

          return NextResponse.json({
            id: String(recipe.id),
            title: recipe.title,
            category: recipe.cuisines?.[0] || recipe.dishTypes?.[0] || 'Chef Selection',
            image: recipe.image,
            prepMinutes: recipe.readyInMinutes ?? 25,
            difficulty: 'Medium',
            servings: recipe.servings ?? 2,
            ingredients,
            steps,
            nutrition: {
              calories: calories ? `${Math.round(calories.amount)} ${calories.unit}` : 'N/A',
              protein: protein ? `${Math.round(protein.amount)} ${protein.unit}` : 'N/A',
              fat: fat ? `${Math.round(fat.amount)} ${fat.unit}` : 'N/A',
              carbs: carbs ? `${Math.round(carbs.amount)} ${carbs.unit}` : 'N/A',
            },
            source: 'spoonacular',
          });
        }

        const mealDbFallback = await fetchFromMealDbById(recipeId);
        if (mealDbFallback) {
          return NextResponse.json(mealDbFallback);
        }

        return NextResponse.json(
          { error: `Failed to fetch recipe details: ${detailsResponse.status}` },
          { status: detailsResponse.status }
        );
      }

      const mealDbRecipe = await fetchFromMealDbById(recipeId);
      if (mealDbRecipe) {
        return NextResponse.json(mealDbRecipe);
      }

      return NextResponse.json({ error: 'No recipe found.' }, { status: 404 });
    }

    if (apiKey) {
      const url = new URL('https://api.spoonacular.com/recipes/complexSearch');
      url.searchParams.set('query', query);
      url.searchParams.set('number', String(safeLimit));
      url.searchParams.set('addRecipeInformation', 'true');
      url.searchParams.set('addRecipeNutrition', 'true');
      url.searchParams.set('instructionsRequired', 'true');
      url.searchParams.set('fillIngredients', 'true');
      url.searchParams.set('apiKey', apiKey);

      const response = await fetch(url.toString(), { cache: 'no-store' });

      if (response.ok) {
        const data = (await response.json()) as SpoonacularSearchResponse;
        const recipes = data.results ?? [];
        const recipe = recipes[0];

        if (!recipe) {
          return NextResponse.json({ error: 'No recipe found.' }, { status: 404 });
        }

        const nutrients = recipe.nutrition?.nutrients ?? [];
        const calories = nutrients.find((n) => n.name === 'Calories');
        const protein = nutrients.find((n) => n.name === 'Protein');
        const fat = nutrients.find((n) => n.name === 'Fat');
        const carbs = nutrients.find((n) => n.name === 'Carbohydrates');

        const ingredients = (recipe.extendedIngredients ?? []).map((ingredient) => {
          const amount = ingredient.originalMeasure?.trim();
          const fallbackAmount =
            ingredient.amount !== undefined
              ? `${ingredient.amount}${ingredient.unit ? ` ${ingredient.unit}` : ''}`
              : 'As needed';

          return {
            amount: amount || fallbackAmount,
            name: ingredient.nameClean || ingredient.name || 'Ingredient',
          };
        });

        const steps = recipe.analyzedInstructions?.[0]?.steps?.map((step) => step.step) ?? [];

        const results = recipes.map((item) => ({
          id: String(item.id),
          title: item.title,
          category: item.cuisines?.[0] || item.dishTypes?.[0] || 'Chef Selection',
          prepMinutes: item.readyInMinutes ?? 0,
        }));

        return NextResponse.json({
          id: String(recipe.id),
          title: recipe.title,
          category: recipe.cuisines?.[0] || recipe.dishTypes?.[0] || 'Chef Selection',
          image: recipe.image,
          prepMinutes: recipe.readyInMinutes ?? 25,
          difficulty: 'Medium',
          servings: recipe.servings ?? 2,
          ingredients,
          steps,
          nutrition: {
            calories: calories ? `${Math.round(calories.amount)} ${calories.unit}` : 'N/A',
            protein: protein ? `${Math.round(protein.amount)} ${protein.unit}` : 'N/A',
            fat: fat ? `${Math.round(fat.amount)} ${fat.unit}` : 'N/A',
            carbs: carbs ? `${Math.round(carbs.amount)} ${carbs.unit}` : 'N/A',
          },
          results,
          source: 'spoonacular',
        });
      }

      const mealDbFallback = await fetchFromMealDbBySearch(query, safeLimit);
      if (mealDbFallback) {
        return NextResponse.json(mealDbFallback);
      }

      return NextResponse.json(
        { error: `Failed to fetch recipe: ${response.status}` },
        { status: response.status }
      );
    }

    const mealDbSearch = await fetchFromMealDbBySearch(query, safeLimit);
    if (mealDbSearch) {
      return NextResponse.json(mealDbSearch);
    }

    return NextResponse.json({ error: 'No recipe found.' }, { status: 404 });
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error while fetching recipe data.' },
      { status: 500 }
    );
  }
}
