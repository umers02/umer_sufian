// import { Button } from "../components/ui/button";
// import { Card, CardContent } from "../components/ui/card";
// import { Home, AlertTriangle } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const NotFound = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <Card className="w-full max-w-md animate-fade-in shadow-2xl">
//         <CardContent className="py-12 text-center">
//           <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
//             <AlertTriangle className="w-10 h-10 text-red-600" />
//           </div>
//           <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
//           <p className="text-xl text-slate-600 mb-8">Page Not Found</p>
//           <Button onClick={() => navigate("/dashboard")} size="lg" className="gap-2">
//             <Home className="w-5 h-5" />
//             Go to Dashboard
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default NotFound;


"use client"

import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Home, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md animate-fade-in shadow-lg border border-border">
        <CardContent className="py-12 text-center">
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-xl flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">Page Not Found</p>
          <Button onClick={() => navigate("/dashboard")} size="lg" className="gap-2">
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFound
