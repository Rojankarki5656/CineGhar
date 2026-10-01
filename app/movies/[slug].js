import { movies } from "@/lib/movies";

export async function getStaticPaths() {
  const paths = movies.map((movie) => ({
    params: { slug: movie.slug },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const movie = movies.find((m) => m.slug === params.slug);
  return { props: { movie } };
}
