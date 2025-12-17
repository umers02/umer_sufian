import Image from 'next/image'


export function Footer() {
  return (
    <footer className="bg-[#202020] mt-12 md:mt-20">
      <div className="container py-8 md:py-12 px-4 md:px-8">
        {/* Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6 md:mb-8">
          <div className="flex gap-4">
          <div className="w-8 h-8 rounded flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_604_7444" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_604_7444)"></g>
              <g clipPath="url(#clip0_604_7444)">
                <path d="M20.896 2H3.104C2.494 2 2 2.494 2 3.104V20.896C2 21.506 2.494 22 3.104 22H12.682V14.255H10.076V11.237H12.682V9.01C12.682 6.426 14.26 5.02 16.565 5.02C17.669 5.02 18.617 5.102 18.894 5.139V7.839H17.296C16.042 7.839 15.8 8.435 15.8 9.309V11.236H18.789L18.399 14.254H15.799V22H20.896C21.506 22 22 21.506 22 20.896V3.104C22 2.494 21.506 2 20.896 2Z" fill="#CCCCCC"/>
              </g>
              <defs>
                <clipPath id="clip0_604_7444">
                  <rect width="20" height="20" fill="white" transform="translate(2 2)"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.3619 7.75881C20.2635 15.1787 15.5187 20.2609 8.43573 20.5801C5.51482 20.7138 3.39872 19.7703 1.55713 18.6004C3.71595 18.9449 6.39288 18.082 7.82456 16.8564C5.70846 16.6506 4.45559 15.5735 3.86936 13.8401C4.48083 13.9458 5.12502 13.9177 5.70594 13.7947C3.79642 13.1555 2.43283 11.9753 2.36238 9.50232C2.89823 9.74628 3.45684 9.97561 4.19896 10.0208C2.7699 9.20797 1.71319 6.23654 2.92347 4.27166C5.04442 6.59639 7.59567 8.49344 11.7849 8.75007C10.7331 4.25404 16.6911 1.81597 19.1846 4.83775C20.2387 4.63383 21.0967 4.23391 21.922 3.79863C21.5823 4.84273 20.9281 5.57239 20.1307 6.1561C21.0061 6.03792 21.7809 5.82401 22.4429 5.49693C22.0323 6.34988 21.1344 7.11476 20.3619 7.75881Z" fill="#CCCCCC"/>
            </svg>
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.8 6.65039C21.95 7.30041 22.1 8.35041 22.15 9.70041L22.2 11.5504V13.5004C22.15 14.9004 22 15.9504 21.85 16.6004C21.75 17.0004 21.5 17.4004 21.2 17.7004C20.9 18.0004 20.5 18.2504 20.05 18.3504C19.4 18.5004 17.9 18.6504 15.5 18.7504L12 18.8004L8.59999 18.7504C6.19999 18.6504 4.69998 18.5504 4.04999 18.3504C3.59999 18.2504 3.19998 18.0004 2.89998 17.7004C2.5 17.4004 2.29998 17.0004 2.14998 16.6004C1.99998 15.9004 1.84998 14.9004 1.79999 13.5004L1.75 11.6504C1.75 11.1004 1.75 10.5004 1.79999 9.80039C1.84998 8.45039 1.99998 7.40039 2.14998 6.7504C2.29998 6.20039 2.5 5.80041 2.84999 5.50041C3.19998 5.20041 3.55 4.9504 4 4.8004C4.64999 4.6504 6.14999 4.5004 8.54999 4.45041L12 4.40039L15.4 4.45041C17.8 4.5004 19.35 4.6504 20 4.8004C20.45 4.90041 20.85 5.15039 21.15 5.45039C21.45 5.80041 21.7 6.20039 21.8 6.65039ZM9.89999 14.7004L15.25 11.6504L9.89999 8.60039V14.7004Z" fill="#CCCCCC"/>
            </svg>
          </div>
          </div>
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:bg-gray-700 transition-colors rounded p-1"
            aria-label="Scroll to top"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="31" height="31" stroke="#F5F5F5"/>
              <path d="M10 18L16 12L22 18" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 mb-6 md:mb-8 max-w-[750px]">
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Resources</h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#" className="hover:text-white">Creator Support</a></li>
              <li><a href="#" className="hover:text-white">Publish On Epic Games</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Company</a></li>
            </ul>
          </div>

          <div>
            <ul className="space-y-2 text-xs text-gray-400 mt-8">
              <li><a href="#" className="hover:text-white">Fan Work Policy</a></li>
              <li><a href="#" className="hover:text-white">UGC Service</a></li>
              <li><a href="#" className="hover:text-white">User License</a></li>
            </ul>
          </div>

          <div>
            <ul className="space-y-2 text-xs text-gray-400 mt-8">
              <li><a href="#" className="hover:text-white">Online Service</a></li>
              <li><a href="#" className="hover:text-white">Community</a></li>
              <li><a href="#" className="hover:text-white">Epic Newsroom</a></li>
            </ul>
          </div>

          <div>
            <ul className="space-y-2 text-xs text-gray-400 mt-8">
              <li><a href="#" className="hover:text-white">Battle Breakers</a></li>
              <li><a href="#" className="hover:text-white">Fortnite</a></li>
              <li><a href="#" className="hover:text-white">Infinity Blade</a></li>
            </ul>
          </div>

          <div>
            <ul className="space-y-2 text-xs text-gray-400 mt-8">
              <li><a href="#" className="hover:text-white">Robo Recall</a></li>
              <li><a href="#" className="hover:text-white">Shadow Complex</a></li>
              <li><a href="#" className="hover:text-white">Unreal Tournament</a></li>
            </ul>
          </div>


        </div>

        <div className="pt-4 md:pt-6">
          <p className="text-xs text-gray-400 leading-relaxed mb-4 max-w-[888px]">
            © 2022, Epic Games, Inc. All rights reserved. Epic, Epic Games, Epic Games logo, Fortnite, Fortnite logo, Unreal, Unreal Engine, Unreal Engine logo, Unreal Tournament, and the Unreal Tournament logo are trademarks or registered trademarks of Epic Games, Inc. in the United States of America and elsewhere. Other brand or product names are trademarks of their respective owners. Transactions outside the United States are handled through Epic Games International, S.à r.l.
          </p>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Store Refund Policy</a>
            </div>
            <Image src="./img/logo.png" alt="Epic Games" width={24} height={24} className="mt-2 md:mt-0" />
          </div>
        </div>
      </div>
    </footer>
  )
}
