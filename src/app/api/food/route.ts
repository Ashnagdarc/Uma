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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') ?? 'ribeye steak';
  const limit = Number(searchParams.get('limit') ?? '12');
  const recipeId = searchParams.get('id');
  const apiKey = process.env.SPOONACULAR_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'Missing SPOONACULAR_API_KEY. Add it to your .env.local file.',
      },
      { status: 500 }
    );
  }

  try {
    if (recipeId) {
      const detailsUrl = new URL(`https://api.spoonacular.com/recipes/${recipeId}/information`);
      detailsUrl.searchParams.set('includeNutrition', 'true');
      detailsUrl.searchParams.set('apiKey', apiKey);

      const detailsResponse = await fetch(detailsUrl.toString(), { cache: 'no-store' });

      if (!detailsResponse.ok) {
        return NextResponse.json(
          { error: `Failed to fetch recipe details: ${detailsResponse.status}` },
          { status: detailsResponse.status }
        );
      }

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

      const steps =
        recipe.analyzedInstructions?.[0]?.steps?.map((step) => step.step) ?? [];

      return NextResponse.json({
        id: Number(recipeId),
        title: recipe.title,
        category:
          recipe.cuisines?.[0] || recipe.dishTypes?.[0] || 'Chef Selection',
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
      });
    }

    const url = new URL('https://api.spoonacular.com/recipes/complexSearch');
    url.searchParams.set('query', query);
    url.searchParams.set('number', String(Number.isNaN(limit) ? 12 : Math.max(1, Math.min(limit, 20))));
    url.searchParams.set('addRecipeInformation', 'true');
    url.searchParams.set('addRecipeNutrition', 'true');
    url.searchParams.set('instructionsRequired', 'true');
    url.searchParams.set('fillIngredients', 'true');
    url.searchParams.set('apiKey', apiKey);

    const response = await fetch(url.toString(), { cache: 'no-store' });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch recipe: ${response.status}` },
        { status: response.status }
      );
    }

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

    const steps =
      recipe.analyzedInstructions?.[0]?.steps?.map((step) => step.step) ?? [];

    const results = recipes.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.cuisines?.[0] || item.dishTypes?.[0] || 'Chef Selection',
      prepMinutes: item.readyInMinutes ?? 0,
    }));

    return NextResponse.json({
      title: recipe.title,
      category:
        recipe.cuisines?.[0] || recipe.dishTypes?.[0] || 'Chef Selection',
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
    });
  } catch {
    return NextResponse.json(
      { error: 'Unexpected error while fetching recipe data.' },
      { status: 500 }
    );
  }
}
