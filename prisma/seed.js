import "dotenv/config";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  await prisma.movie.createMany({
    data: [
      {
        title: "Oppenheimer",
        description:
          "A história do físico J. Robert Oppenheimer e o desenvolvimento da bomba atômica.",
        runtime: 180,
        genre: "Drama",
        rating: 8.4,
        available: true
      },
      {
        title: "Duna: Parte 2",
        description:
          "Paul Atreides se une a Chani e aos Fremen em uma guerra de vingança.",
        runtime: 166,
        genre: "Ficção Científica",
        rating: 8.6,
        available: true
      },
      {
        title: "Pulp Fiction",
        description:
          "As vidas de dois assassinos, um boxeador e um gângster se entrelaçam.",
        runtime: 154,
        genre: "Crime",
        rating: 8.9,
        available: false
      },
      {
        title: "O Iluminado",
        description:
          "Uma família se isola em um hotel remoto durante o inverno.",
        runtime: 146,
        genre: "Terror",
        rating: 8.4,
        available: false
      },
      {
        title: "A Viagem de Chihiro",
        description:
          "Uma menina de 10 anos vagueia por um mundo governado por deuses e espíritos.",
        runtime: 125,
        genre: "Animação",
        rating: 8.6,
        available: true
      },
      {
        title: "Batman: O Cavaleiro das Trevas",
        description: "O Coringa emerge para causar caos em Gotham City.",
        runtime: 152,
        genre: "Ação",
        rating: 9.0,
        available: true
      },
      {
        title: "Parasita",
        description:
          "A ganância e a discriminação de classe ameaçam o relacionamento entre duas famílias.",
        runtime: 132,
        genre: "Suspense",
        rating: 8.5,
        available: true
      },
      {
        title: "Interestelar",
        description:
          "Uma equipe de exploradores viaja através de um buraco de minhoca no espaço.",
        runtime: 169,
        genre: "Ficção Científica",
        rating: 8.7,
        available: true
      },
      {
        title: "O Grande Hotel Budapeste",
        description:
          "As aventuras de um lendário concierge em um famoso hotel europeu.",
        runtime: 99,
        genre: "Comédia",
        rating: 8.1,
        available: true
      },
      {
        title: "Mad Max: Estrada da Fúria",
        description:
          "Em um futuro pós-apocalíptico, uma mulher se rebela contra um governante tirano.",
        runtime: 120,
        genre: "Ação",
        rating: 8.1,
        available: false
      },
    ],
  });

  console.log("✅ Seed concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
