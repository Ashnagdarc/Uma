'use client';

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
  CtaMonolith
} from './RecipePageStyles';
import Image from 'next/image';

export default function RecipePage() {
  return (
    <Container>
      <Header>
        <Category>Basalt Kitchen / 004</Category>
        <Title>Smoked<br />Charcoal<br />Ribeye</Title>
        <StatsGrid>
          <StatBox>
            <StatLabel>Prep</StatLabel>
            <StatValue>25m</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Heat</StatLabel>
            <StatValue>High</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Yield</StatLabel>
            <StatValue>02</StatValue>
          </StatBox>
        </StatsGrid>
        <MonolithVisual>
          <Image
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000"
            alt="Prime Ribeye on dark stone"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </MonolithVisual>
      </Header>
      <RecipeDetails>
        <section id="ingredients">
          <SectionTitle>Ingredients</SectionTitle>
          <IngredientsList>
            <IngredientItem>
              <Amount>800g</Amount>
              <Name>Dry-Aged Ribeye</Name>
            </IngredientItem>
            <IngredientItem>
              <Amount>40g</Amount>
              <Name>Black Lava Salt</Name>
            </IngredientItem>
            <IngredientItem>
              <Amount>3 Sprigs</Amount>
              <Name>Charred Rosemary</Name>
            </IngredientItem>
            <IngredientItem>
              <Amount>15ml</Amount>
              <Name>Bone Marrow Oil</Name>
            </IngredientItem>
            <IngredientItem>
              <Amount>10g</Amount>
              <Name>Activated Carbon</Name>
            </IngredientItem>
            <IngredientItem>
              <Amount>4 cloves</Amount>
              <Name>Fermented Garlic</Name>
            </IngredientItem>
          </IngredientsList>
        </section>
        <section id="process">
          <SectionTitle>The Process</SectionTitle>
          <Steps>
            <StepBlock>
              <StepNumber>01</StepNumber>
              <StepContent>
                <strong>Atmospheric Tempering</strong>
                Allow the monolith of beef to reach ambient temperature (21°C). Pat dry until the surface tension is absolute. This ensures the Maillard reaction occurs without tectonic steam.
              </StepContent>
            </StepBlock>
            <StepBlock>
              <StepNumber>02</StepNumber>
              <StepContent>
                <strong>Mineral Application</strong>
                Combine the activated carbon with crushed black lava salt. Rub with high pressure into the fibers, creating a dark, obsidian crust that mimics the basalt terrain.
              </StepContent>
            </StepBlock>
            <StepBlock>
              <StepNumber>03</StepNumber>
              <StepContent>
                <strong>Thermal Shock</strong>
                Introduce to a cast iron surface at 260°C. Sear for 120 seconds per side. Do not agitate. Let the heat propagate through the center like magma through a vent.
              </StepContent>
            </StepBlock>
            <StepBlock>
              <StepNumber>04</StepNumber>
              <StepContent>
                <strong>Stasis</strong>
                Rest the protein on a warm stone slab for exactly 8 minutes. This allows the internal kinetic energy to redistribute, ensuring structural integrity upon carving.
              </StepContent>
            </StepBlock>
          </Steps>
        </section>
      </RecipeDetails>
      <CtaMonolith>Start Timer</CtaMonolith>
    </Container>
  );
}
