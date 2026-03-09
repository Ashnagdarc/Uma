'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  Container,
  Header,
  Category,
  Title,
  StatsGrid,
  StatBox,
  StatLabel,
  StatValue,
  MonolithVisual,
  RecipeDetails,
  SectionTitle,
  IngredientsList,
  IngredientItem,
  Amount,
  Name,
  Steps,
  StepBlock,
  StepNumber,
  StepContent,
  StatusText,
  NutritionGrid,
  BackLink,
} from '../../RecipePageStyles';

type RecipeResponse = {
  id: number;
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
};

export default function RecipeDetailPage() {
  const params = useParams<{ id: string }>();
  const recipeId = params?.id;
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!recipeId) {
        setError('Invalid recipe id');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/food?id=${encodeURIComponent(recipeId)}`, {
          cache: 'no-store',
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load recipe details');
        }

        if (!isMounted) {
          return;
        }

        setRecipe(data as RecipeResponse);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load recipe details'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [recipeId]);

  return (
    <Container>
      <Header>
        <BackLink href="/search">← Back to search</BackLink>
        <Category>{recipe?.category || 'Recipe Details'}</Category>
        <Title>{recipe?.title || 'Loading'}</Title>
        <StatsGrid>
          <StatBox>
            <StatLabel>Prep</StatLabel>
            <StatValue>{recipe ? `${recipe.prepMinutes}m` : '--'}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Difficulty</StatLabel>
            <StatValue>{recipe?.difficulty || '--'}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Yield</StatLabel>
            <StatValue>{recipe ? String(recipe.servings) : '--'}</StatValue>
          </StatBox>
        </StatsGrid>
        <MonolithVisual>
          <Image
            src={
              recipe?.image ||
              'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000'
            }
            alt={recipe?.title || 'Recipe image'}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </MonolithVisual>
      </Header>

      <RecipeDetails>
        {isLoading && <StatusText>Loading recipe details...</StatusText>}
        {error && <StatusText $error>{error}</StatusText>}

        <section id="ingredients">
          <SectionTitle>Ingredients</SectionTitle>
          <IngredientsList>
            {(recipe?.ingredients ?? []).map((ingredient) => (
              <IngredientItem key={`${ingredient.name}-${ingredient.amount}`}>
                <Amount>{ingredient.amount}</Amount>
                <Name>{ingredient.name}</Name>
              </IngredientItem>
            ))}
          </IngredientsList>
        </section>

        <section id="nutrition">
          <SectionTitle>Nutrition</SectionTitle>
          <NutritionGrid>
            <StatBox>
              <StatLabel>Calories</StatLabel>
              <StatValue>{recipe?.nutrition.calories || '--'}</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Protein</StatLabel>
              <StatValue>{recipe?.nutrition.protein || '--'}</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Fat</StatLabel>
              <StatValue>{recipe?.nutrition.fat || '--'}</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Carbs</StatLabel>
              <StatValue>{recipe?.nutrition.carbs || '--'}</StatValue>
            </StatBox>
          </NutritionGrid>
        </section>

        <section id="process">
          <SectionTitle>The Process</SectionTitle>
          <Steps>
            {(recipe?.steps ?? []).map((step, index) => (
              <StepBlock key={`${step.slice(0, 30)}-${index}`}>
                <StepNumber>{String(index + 1).padStart(2, '0')}</StepNumber>
                <StepContent>
                  <strong>Step {index + 1}</strong>
                  {step}
                </StepContent>
              </StepBlock>
            ))}
          </Steps>
        </section>
      </RecipeDetails>
    </Container>
  );
}
