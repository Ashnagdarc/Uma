import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#050505',
        color: '#f5f5f5',
        padding: '2.5rem 1.5rem',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '1100px',
          border: '1px solid #2a2a2a',
          background: '#0a0a0a',
          padding: 'clamp(1.5rem, 3vw, 3rem)',
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.35em',
              color: '#ff4d00',
            }}
          >
            Uma Recipes / Entry
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              lineHeight: 0.9,
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
              fontWeight: 900,
              background: 'linear-gradient(180deg, #fff 0%, #666 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Search Meals
            <br />
            Discover Recipes
          </h1>
          <p
            style={{
              margin: 0,
              fontFamily: 'JetBrains Mono, monospace',
              color: '#a0a0a0',
              lineHeight: 1.7,
              maxWidth: '42ch',
            }}
          >
            Browse matching meals by ingredient, cuisine, or diet. Open any card to view complete recipe details, ingredients, and instructions.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href="/search"
              style={{
                display: 'inline-block',
                background: '#ff4d00',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.9rem 1.2rem',
                fontFamily: 'JetBrains Mono, monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.75rem',
              }}
            >
              Open Search
            </Link>
            <Link
              href="/recipe/52772"
              style={{
                display: 'inline-block',
                border: '1px solid #2a2a2a',
                color: '#f5f5f5',
                textDecoration: 'none',
                padding: '0.9rem 1.2rem',
                fontFamily: 'JetBrains Mono, monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.75rem',
                background: '#121212',
              }}
            >
              View Sample Recipe
            </Link>
          </div>
        </div>

        <div
          style={{
            border: '1px solid #2a2a2a',
            background: '#121212',
            padding: '1.25rem',
            display: 'grid',
            alignContent: 'space-between',
            gap: '1rem',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#a0a0a0',
            }}
          >
            Quick Start
          </p>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ border: '1px solid #2a2a2a', padding: '0.85rem' }}>
              <p style={{ margin: 0, color: '#ff4d00', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Step 01</p>
              <p style={{ margin: '0.4rem 0 0', fontFamily: 'JetBrains Mono, monospace', color: '#f5f5f5' }}>Search for fish, pasta, chicken, or vegan meals.</p>
            </div>
            <div style={{ border: '1px solid #2a2a2a', padding: '0.85rem' }}>
              <p style={{ margin: 0, color: '#ff4d00', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Step 02</p>
              <p style={{ margin: '0.4rem 0 0', fontFamily: 'JetBrains Mono, monospace', color: '#f5f5f5' }}>Select any result card to open dedicated details.</p>
            </div>
            <div style={{ border: '1px solid #2a2a2a', padding: '0.85rem' }}>
              <p style={{ margin: 0, color: '#ff4d00', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Step 03</p>
              <p style={{ margin: '0.4rem 0 0', fontFamily: 'JetBrains Mono, monospace', color: '#f5f5f5' }}>Review ingredients, nutrition, and cooking steps.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
