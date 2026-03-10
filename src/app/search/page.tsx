'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Container,
  Header,
  Category,
  SearchForm,
  SearchInput,
  SearchButton,
  Title,
  RecipeDetails,
  SectionTitle,
  ResultsGrid,
  ResultCard,
  ResultTitle,
  CategoryBadge,
  ResultLink,
  StatusText,
  StatLabel,
} from '../RecipePageStyles';

type SearchResult = {
  id: string;
  title: string;
  category: string;
  prepMinutes: number;
};

type RecipeSearchResponse = {
  results: SearchResult[];
};

export default function RecipeSearchPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('fish');
  const [activeQuery, setActiveQuery] = useState('fish');

  const fetchRecipes = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      setFetchError(null);

      const response = await fetch(
        `/api/food?query=${encodeURIComponent(query)}&limit=16`,
        { cache: 'no-store' }
      );
      const data = (await response.json()) as RecipeSearchResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recipes');
      }

      setResults(data.results ?? []);
    } catch (error) {
      setFetchError(
        error instanceof Error ? error.message : 'Unable to load recipes'
      );
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes(activeQuery);
  }, [activeQuery, fetchRecipes]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = searchText.trim();
    if (!trimmedQuery) {
      return;
    }
    setActiveQuery(trimmedQuery);
  };

  return (
    <Container>
      <Header>
        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Try fish, pasta, chicken, vegan..."
            aria-label="Search recipes"
          />
          <SearchButton type="submit" disabled={isLoading}>
            Search
          </SearchButton>
        </SearchForm>
        <Category>Recipe Search / {activeQuery}</Category>
        <Title>Find Your Meal</Title>
      </Header>

      <RecipeDetails>
        {isLoading && <StatusText>Loading recipes...</StatusText>}
        {fetchError && <StatusText $error>{fetchError}</StatusText>}

        <section id="results">
          <SectionTitle>Available Meals</SectionTitle>
          <ResultsGrid>
            {results.map((result) => (
              <ResultLink key={result.id} href={`/recipe/${result.id}`}>
                <ResultCard>
                  <CategoryBadge>{result.category}</CategoryBadge>
                  <ResultTitle>{result.title}</ResultTitle>
                  <StatLabel>
                    {result.prepMinutes > 0
                      ? `${result.prepMinutes} min`
                      : 'Prep time N/A'}
                  </StatLabel>
                </ResultCard>
              </ResultLink>
            ))}
          </ResultsGrid>
          {!isLoading && !fetchError && results.length === 0 && (
            <StatusText>No recipes found for this search.</StatusText>
          )}
        </section>
      </RecipeDetails>
    </Container>
  );
}
