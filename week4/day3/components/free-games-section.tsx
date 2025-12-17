"use client"

import Image from "next/image"

export function FreeGamesSection() {
  const freeGames = [
    {
      id: 1,
      title: "Darkwood",
      image: "/img/darkwood.jpg",
      period: "Free Now - Jul 25"
    },
    {
      id: 2,
      title: "Assassin's Creed Black Flag",
      image: "/img/assassins-creed-black-flag.jpg",
      period: "Free Now - Jul 25"
    },
    {
      id: 3,
      title: "NFS : Shift",
      image: "/img/nfs-shift.jpg",
      period: "Free Jul 27 - Aug 5"
    },
    {
      id: 4,
      title: "Warface",
      image: "/img/warface.jpg",
      period: "Free Jul 27 - Aug 5"
    }
  ]

  return (
    <section className="min-h-[400px] md:h-[522px] bg-[#2A2A2A] flex flex-col py-6 md:py-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 px-4 md:px-4 pt-2 md:pt-8 gap-4 md:gap-0">
        <div className="flex items-center gap-3 ml-0 md:ml-8">
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.25 7.1875C16.1081 7.19354 15.0147 7.64983 14.2073 8.45728C13.3998 9.26472 12.9435 10.3581 12.9375 11.5C12.9375 12.006 13.0448 12.4832 13.2058 12.9375H5.75V21.5625H7.1875V40.25H38.8125V21.5625H40.25V12.9375H32.7942C32.9552 12.4832 33.0625 12.006 33.0625 11.5C33.0565 10.3581 32.6002 9.26472 31.7927 8.45728C30.9853 7.64983 29.8919 7.19354 28.75 7.1875C26.2334 7.1875 24.5276 9.0965 23.4025 10.6912C23.253 10.9039 23.1342 11.1128 23 11.3198C22.8658 11.1128 22.747 10.9039 22.5975 10.6912C21.4705 9.0965 19.7647 7.1875 17.25 7.1875ZM17.25 10.0625C18.1489 10.0625 19.3162 11.0285 20.2151 12.3088C20.4336 12.6232 20.401 12.6404 20.5735 12.9375H17.25C17.0603 12.9409 16.8719 12.906 16.6959 12.835C16.52 12.7639 16.3602 12.6582 16.226 12.524C16.0919 12.3898 15.9861 12.23 15.915 12.0541C15.844 11.8781 15.8091 11.6897 15.8125 11.5C15.8125 10.6854 16.4354 10.0625 17.25 10.0625ZM28.75 10.0625C29.5646 10.0625 30.1875 10.6854 30.1875 11.5C30.1875 12.3146 29.5646 12.9375 28.75 12.9375H25.4265C25.599 12.6404 25.5664 12.6232 25.7849 12.3088C26.6838 11.0285 27.8511 10.0625 28.75 10.0625ZM8.625 15.8125H37.375V18.6875H24.4375V17.25H21.5625V18.6875H8.625V15.8125ZM10.0625 21.5625H35.9375V37.375H24.4375V23H21.5625V37.375H10.0625V21.5625Z" fill="white"/>
          </svg>
          <h2 className="text-lg md:text-xl font-semibold text-white">Free Games</h2>
        </div>
        <button className="text-gray-400 text-xs md:text-sm border border-gray-600 px-2 md:px-3 py-1 rounded hover:text-white hover:border-gray-400">View More</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 flex-1 items-center">
        {freeGames.map((game) => (
          <div key={game.id} className="bg-transparent rounded-sm overflow-hidden hover:scale-105 transition-transform cursor-pointer w-full max-w-[280px] mx-auto md:max-w-none md:w-48">
            <div className="relative h-56 md:h-72 w-full rounded-sm overflow-hidden">
              <Image src={game.image} alt={game.title} fill className="object-cover" />
            </div>
            
            <div className="pt-2 md:pt-3 space-y-1 text-center md:text-left">
              <h3 className="text-white font-medium text-sm">{game.title}</h3>
              <p className="text-gray-400 text-xs">{game.period}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}