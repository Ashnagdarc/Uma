'use client';

import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Container = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  align-items: start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 2rem 1.5rem;
  }
`;

export const Header = styled.div`
  position: sticky;
  top: 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  @media (max-width: 900px) {
    position: relative;
    top: 0;
  }
`;

export const Category = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.4em;
  color: #ff4d00;
  opacity: 0;
  animation: ${slideIn} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

export const Title = styled.div`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  line-height: 0.9;
  text-transform: uppercase;
  letter-spacing: -0.04em;
  margin-bottom: 1rem;
  background: linear-gradient(180deg, #fff 0%, #444 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
  animation: ${slideIn} 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #2a2a2a;
  border: 1px solid #2a2a2a;
  opacity: 0;
  animation: ${fadeIn} 1s ease 0.4s forwards;
`;

export const StatBox = styled.div`
  background: #0a0a0a;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StatLabel = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: #a0a0a0;
  text-transform: uppercase;
`;

export const StatValue = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
  font-weight: 500;
`;

export const MonolithVisual = styled.div`
  position: relative;
  aspect-ratio: 4/5;
  background: #121212;
  box-shadow: 20px 20px 60px #050505, -5px -5px 20px #1a1a1a;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.05);
  opacity: 0;
  transform: translateY(40px);
  animation: ${slideUp} 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  @media (max-width: 900px) {
    aspect-ratio: 1/1;
  }
`;

export const RecipeDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6rem;
  margin-top: 4rem;
`;

export const SectionTitle = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: #a0a0a0;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  &::after {
    content: "";
    height: 1px;
    flex-grow: 1;
    background: #2a2a2a;
  }
`;

export const IngredientsList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
`;

export const IngredientItem = styled.li`
  padding: 1.5rem;
  background: #121212;
  border-left: 2px solid #2a2a2a;
  transition: all 0.3s ease;
  cursor: crosshair;
  &:hover {
    border-left-color: #ff4d00;
    background: #1a1a1a;
    transform: translateX(10px);
  }
`;

export const Amount = styled.span`
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.2rem;
  color: #f5f5f5;
  margin-bottom: 0.25rem;
`;

export const Name = styled.span`
  font-size: 0.85rem;
  color: #a0a0a0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

export const StepBlock = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 2rem;
`;

export const StepNumber = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 3rem;
  font-weight: 300;
  color: #2a2a2a;
  line-height: 0.8;
`;

export const StepContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #a0a0a0;
  padding-top: 0.5rem;
  strong {
    color: #f5f5f5;
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1.4rem;
    letter-spacing: -0.02em;
  }
`;

export const CtaMonolith = styled.button`
  position: fixed;
  bottom: 3rem;
  right: 3rem;
  background: #f5f5f5;
  color: #0a0a0a;
  padding: 1.5rem 3rem;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  cursor: pointer;
  border: none;
  z-index: 100;
  box-shadow: 10px 10px 30px rgba(0,0,0,0.5);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  &:hover {
    transform: translateY(-5px);
    background: #ff4d00;
    color: white;
  }
`;
