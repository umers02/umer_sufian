// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import API from "../api/axiosConfig";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
// import { UserPlus, Mail, Lock, User, AlertCircle } from "lucide-react";

// const Register = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       await API.post("/api/auth/register", { username, email, password });
//       navigate("/login");
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <Card className="w-full max-w-md animate-fade-in shadow-2xl">
//         <CardHeader className="space-y-3 text-center">
//           <div className="mx-auto w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-2">
//             <UserPlus className="w-8 h-8 text-white" />
//           </div>
//           <CardTitle className="text-3xl">Create Account</CardTitle>
//           <p className="text-slate-500">Sign up to get started</p>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleRegister} className="space-y-4">
//             {error && (
//               <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-md text-red-700 animate-fade-in">
//                 <AlertCircle className="w-5 h-5" />
//                 <span className="text-sm">{error}</span>
//               </div>
//             )}
            
//             <div className="space-y-2">
//               <label className="text-sm font-medium flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 Name
//               </label>
//               <Input
//                 type="text"
//                 placeholder="John Doe"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium flex items-center gap-2">
//                 <Mail className="w-4 h-4" />
//                 Email
//               </label>
//               <Input
//                 type="email"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium flex items-center gap-2">
//                 <Lock className="w-4 h-4" />
//                 Password
//               </label>
//               <Input
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>

//             <Button type="submit" className="w-full" size="lg" disabled={loading}>
//               {loading ? "Creating Account..." : "Sign Up"}
//             </Button>

//             <p className="text-center text-sm text-slate-600">
//               Already have an account?{" "}
//               <Link to="/login" className="text-slate-900 font-semibold hover:underline">
//                 Sign In
//               </Link>
//             </p>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Register;



"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../api/axiosConfig"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { UserPlus, Mail, Lock, User, AlertCircle } from "lucide-react"

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await API.post("/api/auth/register", { username, email, password })
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md animate-fade-in shadow-lg border border-border">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-md mb-2">
            <UserPlus className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <p className="text-muted-foreground text-sm">Sign up to get started</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-border"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
