// import { Button } from "./ui/button";
// import { LogOut, CheckSquare } from "lucide-react";

// const Navbar = () => {
//   const logout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   };

//   return (
//     <nav className="bg-white border-b shadow-sm sticky top-0 z-50 animate-slide-in">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
//               <CheckSquare className="w-6 h-6 text-white" />
//             </div>
//             <h2 className="text-2xl font-bold text-slate-900">Task Manager</h2>
//           </div>
//           <Button onClick={logout} variant="destructive" className="gap-2">
//             <LogOut className="w-4 h-4" />
//             Logout
//           </Button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



"use client"

import { Button } from "./ui/button"
import { LogOut, CheckSquare } from "lucide-react"

const Navbar = () => {
  const logout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <nav className="bg-background border-b border-border shadow-sm sticky top-0 z-50 animate-slide-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
              <CheckSquare className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Task Manager</h2>
          </div>
          <Button onClick={logout} variant="outline" className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
