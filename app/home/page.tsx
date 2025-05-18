import { Navbar } from "@/components/navbar"
import { HeroBanner } from "@/components/hero-banner"
import { MovieRow } from "@/components/movie-row"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <main>
        <HeroBanner
          title="CHISO MAANCHHE"
          description="| New Nepali Official Full Movie 2025 / 2082 || Arpan Thapa, Swastima Khadka, Desh Bhakta Khanal, Aashant Sharma, Prabhakar Neupane, Ram Babu Regmi, Jhaken BC, Sanjog Rasali || CHISO MANCHHE Nepali Full Movie 2025"
          imageUrl="https://risingnepaldaily.com/storage/media/5704/chisss.png"
          year="2022"
          duration="2h 15m"
          rating="PG-13"
        />

        <div className="px-4 md:px-6 py-8 space-y-8">
          <MovieRow
            title="Trending Now"
            movies={[
              { id: "13", title: "Loot", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJHH7busy1SJrWKP0gi1eHY68NpA2Ap3lxhA&s", year: "2022", rating: "4.5" },
              { id: "3", title: "Pashupati Prasad", imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/a7/Pashupati_Prasad_poster.jpg", year: "2016", rating: "4.8" },
              { id: "4", title: "Chhakka Panja 4", imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1e/Chhakka_Panja_4.jpg", year: "2023", rating: "4.2" },
              { id: "5", title: "Talakjung vs Tulke", imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/13/Talakjung_vs_Tulke_movie_poster.jpg", year: "2014", rating: "4.6" },
              { id: "6", title: "Bulbul", imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/f3/Bulbul_-_film_poster.jpg", year: "2019", rating: "4.4" },
              { id: "7", title: "Sano Mann", imageUrl: "https://www.thefilmnepal.com/uploads/medias/sanomann.jpg", year: "2018", rating: "4.3" },
            ]}
          />

          <MovieRow
            title="New Releases"
            movies={[
              { id: "8", title: "Saili", imageUrl: "https://m.media-amazon.com/images/M/MV5BNDg0NmVmYjEtYzU4MC00M2QwLWIzNzAtZWM3ZjJlMGQzZTBjXkEyXkFqcGc@._V1_.jpg", year: "2023", rating: "4.1" },
              { id: "9", title: "Chiso Maanche", imageUrl: "https://upload.wikimedia.org/wikipedia/en/0/02/Chiso_Manchhe.jpg", year: "2023", rating: "4.3" },
              { id: "9", title: "Garud Puran", imageUrl: "https://m.media-amazon.com/images/M/MV5BMDdkODM3MDAtZTQ2MS00MDVjLWJkMTItMmUzNTcwNmQ1ZDZlXkEyXkFqcGc@._V1_.jpg", year: "2023", rating: "4.0" },
              { id: "10", title: "Cha Maya Chapakkai", imageUrl: "https://m.media-amazon.com/images/M/MV5BOWI1YTNhZjAtYzhmYS00ZmQ0LTg0NDgtYzEwZWQ3MGRkNTUwXkEyXkFqcGc@._V1_.jpg", year: "2023", rating: "4.2" },
              { id: "11", title: "Lakka Jawan", imageUrl: "https://www.thefilmnepal.com/uploads/medias/lakkajawan.jpg", year: "2023", rating: "3.9" },
              { id: "12", title: "Gorkha Warrior", imageUrl: "https://m.media-amazon.com/images/M/MV5BZmVkMWQ2NGMtYjNiMS00MjcyLWEwZTItZTU2MTk2MzFhMmRjXkEyXkFqcGc@._V1_.jpg", year: "2023", rating: "4.5" },
            ]}
          />

          <MovieRow
            title="Action Movies"
            movies={[
              { id: "13", title: "Loot", imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/c3/Loot_2012_film.jpg", year: "2012", rating: "4.7" },
              { id: "13", title: "Loot 2", imageUrl: "https://m.media-amazon.com/images/M/MV5BYjAxOGIxMmQtOGEzYS00NDBiLTkyZGQtMzM4MGQ5YzIzMDk2XkEyXkFqcGc@._V1_.jpg", year: "2017", rating: "4.5" },
              { id: "14", title: "Machha Machha", imageUrl: "https://www.thefilmnepal.com/uploads/medias/machhamachha.jpg", year: "2019", rating: "4.0" },
              { id: "15", title: "Bir Bikram", imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Birbikramposter.jpg/250px-Birbikramposter.jpg", year: "2016", rating: "4.2" },
              { id: "16", title: "Bir Bikram 2", imageUrl: "https://upload.wikimedia.org/wikipedia/en/7/78/Bir_Bikram_2.jpg", year: "2019", rating: "4.3" },
              { id: "17", title: "Jatra", imageUrl: "https://upload.wikimedia.org/wikipedia/en/8/8f/Jatranepalimovieposter.jpg", year: "2016", rating: "4.4" },
            ]}
          />

          <MovieRow
            title="Nepali Classics"
            movies={[
              { id: "19", title: "Kusume Rumal", imageUrl: "https://www.thefilmnepal.com/uploads/medias/kusumerumal.jpg", year: "1985", rating: "4.9" },
              { id: "19", title: "Balidaan", imageUrl: "https://www.thefilmnepal.com/uploads/medias/balidaan.jpg", year: "1996", rating: "4.8" },
              { id: "20", title: "Maitighar", imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0a/Maitighar.jpg/250px-Maitighar.jpg", year: "1966", rating: "4.7" },
              { id: "21", title: "Darpan Chhaya", imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b3/DarpanChaya.jpg", year: "2001", rating: "4.9" },
              { id: "22", title: "Caravan", imageUrl: "https://upload.wikimedia.org/wikipedia/en/0/0d/Himalaya_film.jpg", year: "2002", rating: "4.8" },
              { id: "23", title: "Numafung", imageUrl: "https://www.thefilmnepal.com/uploads/medias/numafung.jpg", year: "2001", rating: "4.6" },
            ]}
          />

          <MovieRow
            title="Family Friendly"
            movies={[
              { id: "25", title: "Chhakka Panja", imageUrl: "https://m.media-amazon.com/images/M/MV5BYTY3N2ZhMTQtODE0OC00YTlkLWFiMzMtYjI1OTY2ZjdlZGQwXkEyXkFqcGc@._V1_.jpg", year: "2016", rating: "4.5" },
              { id: "25", title: "Chhakka Panja 2", imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Chhakka_Panja_2_poster.jpeg/250px-Chhakka_Panja_2_poster.jpeg", year: "2017", rating: "4.4" },
              { id: "26", title: "Chhakka Panja 3", imageUrl: "https://upload.wikimedia.org/wikipedia/en/4/4e/Chhakka_panja_three_ver2.jpg", year: "2018", rating: "4.3" },
              { id: "27", title: "Woda Number 6", imageUrl: "https://www.thefilmnepal.com/uploads/medias/wodanumber6.jpg", year: "2018", rating: "4.2" },
              { id: "28", title: "Shatru Gate", imageUrl: "https://upload.wikimedia.org/wikipedia/en/e/ec/Shatru_Gate.jpg", year: "2018", rating: "4.1" },
              { id: "29", title: "Chhakka Panja 4", imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1e/Chhakka_Panja_4.jpg", year: "2022", rating: "4.4" },
            ]}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
