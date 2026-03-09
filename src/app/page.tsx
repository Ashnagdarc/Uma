import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#050505',
        color: '#f5f5f5',
        padding: '2rem',
      }}
    >
      <section style={{ maxWidth: '720px', textAlign: 'center' }}>
        <p
          style={{
            margin: 0,
            color: '#ff4d00',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
          }}
        >
          UMA Recipes
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', margin: '1rem 0' }}>
          Search meals by ingredient, cuisine, or diet.
        </h1>
        <p style={{ color: '#a0a0a0', marginBottom: '2rem' }}>
          Browse all matching recipes on the search page, then open any card for full details.
        </p>
        <Link
          href="/search"
          style={{
            display: 'inline-block',
            background: '#ff4d00',
            color: '#fff',
            textDecoration: 'none',
            padding: '0.9rem 1.3rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: '0.8rem',
          }}
        >
          Go to Search
        </Link>
      </section>
    </main>
  );
}
