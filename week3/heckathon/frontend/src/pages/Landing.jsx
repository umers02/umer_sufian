import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Button } from '../components/ui/button'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white" style={{fontFamily: 'Montserrat, sans-serif'}}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-white w-full">
        <div className="flex justify-start items-start">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start" style={{
            width: '1800px',
            height: '628px',
            gap: '120px',
            opacity: 1
          }}>
            {/* Left Image */}
            <div className="relative">
              <img 
                src="/landing-page-main.jpg" 
                alt="Tea collection with various loose teas in spoons" 
                style={{
                  width: '1100px',
                  height: '500px',
                  opacity: 1,
                  objectFit: 'cover'
                }}
              />
            </div>
            
            {/* Right Content */}
            <div className="space-y-6" style={{marginTop: '120px', maxWidth: '450px'}}>
              <h1 className="text-3xl font-medium text-gray-900 leading-tight" style={{fontFamily: 'Prosto One, cursive'}}>
                Every day is unique,<br />
                just like our tea
              </h1>
              <div className="space-y-4 text-gray-600" style={{fontFamily: 'Montserrat, sans-serif'}}>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus adipiscing odio. Neque lacus nibh eros in.
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus adipiscing odio. Neque lacus nibh eros in.
                </p>
              </div>
              <Button className="bg-black hover:bg-gray-900 text-white px-16 py-3 rounded-none text-sm font-light">
                BROWSE TEAS
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16" style={{backgroundColor: '#F4F4F4'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_171_157" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_171_157)">
                  <path d="M4 21V19H20V21H4ZM8 17C6.9 17 5.95833 16.6083 5.175 15.825C4.39167 15.0417 4 14.1 4 13V3H20C20.55 3 21.0208 3.19583 21.4125 3.5875C21.8042 3.97917 22 4.45 22 5V8C22 8.55 21.8042 9.02083 21.4125 9.4125C21.0208 9.80417 20.55 10 20 10H18V13C18 14.1 17.6083 15.0417 16.825 15.825C16.0417 16.6083 15.1 17 14 17H8ZM8 15H14C14.55 15 15.0208 14.8042 15.4125 14.4125C15.8042 14.0208 16 13.55 16 13V5H6V13C6 13.55 6.19583 14.0208 6.5875 14.4125C6.97917 14.8042 7.45 15 8 15ZM18 8H20V5H18V8Z" fill="#282828"/>
                </g>
              </svg>
              <div className="text-sm text-gray-600" style={{fontFamily: 'Montserrat, sans-serif'}}>450+ KIND OF LOOSELEAF TEA</div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_171_172" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_171_172)">
                  <path d="M4 17V19H20V17H4ZM4 6H6.2C6.11667 5.85 6.0625 5.69167 6.0375 5.525C6.0125 5.35833 6 5.18333 6 5C6 4.16667 6.29167 3.45833 6.875 2.875C7.45833 2.29167 8.16667 2 9 2C9.5 2 9.9625 2.12917 10.3875 2.3875C10.8125 2.64583 11.1833 2.96667 11.5 3.35L12 4L12.5 3.35C12.8 2.95 13.1667 2.625 13.6 2.375C14.0333 2.125 14.5 2 15 2C15.8333 2 16.5417 2.29167 17.125 2.875C17.7083 3.45833 18 4.16667 18 5C18 5.18333 17.9875 5.35833 17.9625 5.525C17.9375 5.69167 17.8833 5.85 17.8 6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8V19C22 19.55 21.8042 20.0208 21.4125 20.4125C21.0208 20.8042 20.55 21 20 21H4C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V8C2 7.45 2.19583 6.97917 2.5875 6.5875C2.97917 6.19583 3.45 6 4 6ZM4 14H20V8H14.9L17 10.85L15.4 12L12 7.4L8.6 12L7 10.85L9.05 8H4V14ZM9 6C9.28333 6 9.52083 5.90417 9.7125 5.7125C9.90417 5.52083 10 5.28333 10 5C10 4.71667 9.90417 4.47917 9.7125 4.2875C9.52083 4.09583 9.28333 4 9 4C8.71667 4 8.47917 4.09583 8.2875 4.2875C8.09583 4.47917 8 4.71667 8 5C8 5.28333 8.09583 5.52083 8.2875 5.7125C8.47917 5.90417 8.71667 6 9 6ZM15 6C15.2833 6 15.5208 5.90417 15.7125 5.7125C15.9042 5.52083 16 5.28333 16 5C16 4.71667 15.9042 4.47917 15.7125 4.2875C15.5208 4.09583 15.2833 4 15 4C14.7167 4 14.4792 4.09583 14.2875 4.2875C14.0958 4.47917 14 4.71667 14 5C14 5.28333 14.0958 5.52083 14.2875 5.7125C14.4792 5.90417 14.7167 6 15 6Z" fill="#282828"/>
                </g>
              </svg>
              <div className="text-sm text-gray-600" style={{fontFamily: 'Montserrat, sans-serif'}}>CERTIFICATED ORGANIC TEAS</div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_171_179" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_171_179)">
                  <path d="M6 20C5.16667 20 4.45833 19.7083 3.875 19.125C3.29167 18.5417 3 17.8333 3 17H1V6C1 5.45 1.19583 4.97917 1.5875 4.5875C1.97917 4.19583 2.45 4 3 4H17V8H20L23 12V17H21C21 17.8333 20.7083 18.5417 20.125 19.125C19.5417 19.7083 18.8333 20 18 20C17.1667 20 16.4583 19.7083 15.875 19.125C15.2917 18.5417 15 17.8333 15 17H9C9 17.8333 8.70833 18.5417 8.125 19.125C7.54167 19.7083 6.83333 20 6 20ZM6 18C6.28333 18 6.52083 17.9042 6.7125 17.7125C6.90417 17.5208 7 17.2833 7 17C7 16.7167 6.90417 16.4792 6.7125 16.2875C6.52083 16.0958 6.28333 16 6 16C5.71667 16 5.47917 16.0958 5.2875 16.2875C5.09583 16.4792 5 16.7167 5 17C5 17.2833 5.09583 17.5208 5.2875 17.7125C5.47917 17.9042 5.71667 18 6 18ZM3 15H3.8C4.08333 14.7 4.40833 14.4583 4.775 14.275C5.14167 14.0917 5.55 14 6 14C6.45 14 6.85833 14.0917 7.225 14.275C7.59167 14.4583 7.91667 14.7 8.2 15H15V6H3V15ZM18 18C18.2833 18 18.5208 17.9042 18.7125 17.7125C18.9042 17.5208 19 17.2833 19 17C19 16.7167 18.9042 16.4792 18.7125 16.2875C18.5208 16.0958 18.2833 16 18 16C17.7167 16 17.4792 16.0958 17.2875 16.2875C17.0958 16.4792 17 16.7167 17 17C17 17.2833 17.0958 17.5208 17.2875 17.7125C17.4792 17.9042 17.7167 18 18 18ZM17 13H21.25L19 10H17V13Z" fill="#282828"/>
                </g>
              </svg>
              <div className="text-sm text-gray-600" style={{fontFamily: 'Montserrat, sans-serif'}}>FREE DELIVERY</div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_171_184" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_171_184)">
                  <path d="M14.25 21.4C13.8667 21.7833 13.3917 21.975 12.825 21.975C12.2583 21.975 11.7833 21.7833 11.4 21.4L2.6 12.6C2.41667 12.4167 2.27083 12.2 2.1625 11.95C2.05417 11.7 2 11.4333 2 11.15V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H11.15C11.4333 2 11.7 2.05417 11.95 2.1625C12.2 2.27083 12.4167 2.41667 12.6 2.6L21.4 11.425C21.7833 11.8083 21.975 12.2792 21.975 12.8375C21.975 13.3958 21.7833 13.8667 21.4 14.25L14.25 21.4ZM12.825 20L19.975 12.85L11.15 4H4V11.15L12.825 20ZM6.5 8C6.91667 8 7.27083 7.85417 7.5625 7.5625C7.85417 7.27083 8 6.91667 8 6.5C8 6.08333 7.85417 5.72917 7.5625 5.4375C7.27083 5.14583 6.91667 5 6.5 5C6.08333 5 5.72917 5.14583 5.4375 5.4375C5.14583 5.72917 5 6.08333 5 6.5C5 6.91667 5.14583 7.27083 5.4375 7.5625C5.72917 7.85417 6.08333 8 6.5 8Z" fill="black"/>
                </g>
              </svg>
              <div className="text-sm text-gray-600" style={{fontFamily: 'Montserrat, sans-serif'}}>SAMPLE FOR ALL TEAS</div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" className="px-16 py-3 rounded-none bg-transparent border-gray-800">
              LEARN MORE
            </Button>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-medium text-center text-gray-900 mb-16" style={{fontFamily: 'Prosto One, cursive'}}>Our Collections</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Row 1 */}
            <div className="group cursor-pointer">
              <img src="/our-collection-card-1.jpg" alt="Black Tea" className="w-full h-64 object-cover" />
              <h3 className="text-gray-900 text-lg font-light p-6 text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>BLACK TEA</h3>
            </div>
            
            <div className="group cursor-pointer">
              <img src="/our-collection-card-2.jpg" alt="Green Tea" className="w-full h-64 object-cover" />
              <h3 className="text-gray-900 text-lg font-light p-6 text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>GREEN TEA</h3>
            </div>
            
            <div className="group cursor-pointer">
              <img src="/our-collection-card-3.jpg" alt="White Tea" className="w-full h-64 object-cover" />
              <h3 className="text-gray-900 text-lg font-light p-6 text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>WHITE TEA</h3>
            </div>
            
            {/* Row 2 */}
            <div className="group cursor-pointer">
              <img src="/our-collection-card-4.jpg" alt="Matcha" className="w-full h-64 object-cover" />
              <h3 className="text-gray-900 text-lg font-light p-6 text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>MATCHA</h3>
            </div>
            
            <div className="group cursor-pointer">
              <img src="/our-collection-card-5.jpg" alt="Herbal Tea" className="w-full h-64 object-cover" />
              <h3 className="text-gray-900 text-lg font-light p-6 text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>HERBAL TEA</h3>
            </div>
            
            <div className="group cursor-pointer">
              <img src="/our-collection-card-6.jpg" alt="Chai" className="w-full h-64 object-cover" />
              <h3 className="text-gray-900 text-lg font-light p-6 text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>CHAI</h3>
            </div>
            
            {/* Row 3 */}
            <div className="group cursor-pointer">
              <img src="/our-collection-card-7.jpg" alt="Oolong" className="w-full h-64 object-cover" />
              <h3 className="text-gray-900 text-lg font-light p-6 text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>OOLONG</h3>
            </div>
            
            <div className="group cursor-pointer">
              <img src="/our-collection-card-8.jpg" alt="Rooibos" className="w-full h-64 object-cover" />
              <h3 className="text-gray-900 text-lg font-light p-6 text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>ROOIBOS</h3>
            </div>
            
            <div className="group cursor-pointer">
              <img src="/our-collection-card-9.jpg" alt="Teaware" className="w-full h-64 object-cover" />
              <h3 className="text-gray-900 text-lg font-light p-6 text-center" style={{fontFamily: 'Montserrat, sans-serif'}}>TEAWARE</h3>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}