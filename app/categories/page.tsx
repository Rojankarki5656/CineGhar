import { Metadata } from "next";
import CategoriesClient from "./categories-client";

export const metadata: Metadata = {
  title: "Browse Categories | CineGhar",
  description: "Explore movies and TV shows by genre. Find your next favorite Action, Comedy, Drama, or Horror film.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}