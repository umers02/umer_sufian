import { create } from "zustand"

export interface Game {
  id: string
  title: string
  image: string
  price: number
  originalPrice?: number
  badge?: "FREE" | "SALE"
  description?: string
  category?: string
}

interface GameStore {
  games: Game[]
  featuredGames: Game[]
  freeGames: Game[]
  topSellers: Game[]
  upcomingGames: Game[]
  selectedGame: Game | null
  setSelectedGame: (game: Game | null) => void
  getFilteredGames: (searchQuery: string) => Game[]
  initializeCategories: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  games: [
    {
      id: "1",
      title: "Valorant",
      image: "./img/valorant.jpg",
      price: 850,
      originalPrice: 900,
      badge: "SALE",
      category: "shooter",
    },
    {
      id: "2",
      title: "Assassin's Creed Valhalla",
      image: "./img/assassins-creed.png",
      price: 2999,
      originalPrice: 3999,
      badge: "SALE",
      category: "action",
    },
    {
      id: "3",
      title: "Red Dead Redemption 2",
      image: "./img/rdr-2.png",
      price: 1599,
      originalPrice: 3199,
      badge: "SALE",
      category: "action",
    },
    {
      id: "4",
      title: "The Tomb Raider",
      image: "./img/tomb-rider.png",
      price: 2000,
      originalPrice: 2199,
      badge: "SALE",
      category: "adventure",
    },
    {
      id: "5",
      title: "Cyberpunk 2077",
      image: "./img/cyberpunk.png",
      price: 2000,
      originalPrice: 4000,
      badge: "SALE",
      category: "rpg",
    },
    {
      id: "6",
      title: "NFS UNBOUND",
      image: "./img/nfs-unbound.jpg",
      price: 34.99,
      description:
        "Why don't have NFS Unbound (AKA Lifelike Effects) and get immersed in a Thrilling Street Racing Game?",
      category: "racing",
    },
    {
      id: "7",
      title: "FIFA 23",
      image: "./img/fifa.jpg",
      price: 23.99,
      description: "FIFA 23 brings The World's Game to the pitch, with new HyperMotion2 Technology.",
      category: "sports",
    },
    {
      id: "8",
      title: "UNCHARTED 4",
      image: "./img/uncharted.jpg",
      price: 29.99,
      description: "Join the adventure UNCHARTED 4: A Thief's End with never-seen content.",
      category: "adventure",
    },
    {
      id: "9",
      title: "God of War",
      image: "./img/god-of-war.jpg",
      price: 49.99,
      description:
        "His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters.",
      category: "action",
    },
    {
      id: "10",
      title: "GTA V",
      image: "./img/gta-v.jpg",
      price: 0,
      badge: "FREE",
      category: "action",
    },
    {
      id: "11",
      title: "Outlast 2",
      image: "./img/outlast-2.png",
      price: 14.99,
      category: "horror",
    },

  ],
  featuredGames: [],
  freeGames: [],
  topSellers: [],
  upcomingGames: [],
  selectedGame: null,
  setSelectedGame: (game) => set({ selectedGame: game }),
  getFilteredGames: (searchQuery) => {
    const state = get()
    if (!searchQuery) return state.games
    return state.games.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  },
  initializeCategories: () => set((state) => ({
    featuredGames: state.games.filter((g) => g.badge === "SALE").slice(0, 5),
    freeGames: state.games.filter((g) => g.badge === "FREE"),
    topSellers: state.games.slice(1, 6),
    upcomingGames: state.games.slice(6, 10),
  })),
}))
