// import { useEffect, useState } from "react";
// import API from "../api/axiosConfig";
// import Navbar from "../components/Navbar";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Card, CardContent } from "../components/ui/card";
// import { Plus, Trash2, Edit3, CheckCircle2, Loader2, ListTodo, CheckCheck, Clock } from "lucide-react";

// const Dashboard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [title, setTitle] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

//   const getTasks = async () => {
//     try {
//       const { data } = await API.get("/api/tasks");
//       setTasks(data);
//       getStats();
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     }
//   };

//   const getStats = async () => {
//     try {
//       const { data } = await API.get("/api/stats");
//       setStats(data);
//     } catch (error) {
//       console.error("Error fetching stats:", error);
//     }
//   };

//   const toggleComplete = async (id, completed) => {
//     try {
//       await API.put(`/api/tasks/${id}`, { completed: !completed });
//       getTasks();
//     } catch (error) {
//       console.error("Error toggling task:", error);
//     }
//   };

//   const createTask = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) return;
//     setLoading(true);
//     try {
//       await API.post("/api/tasks", { title });
//       setTitle("");
//       getTasks();
//     } catch (error) {
//       console.error("Error creating task:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteTask = async (id) => {
//     try {
//       await API.delete(`/api/tasks/${id}`);
//       getTasks();
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };

//   const startEdit = (task) => {
//     setEditingId(task._id);
//     setEditTitle(task.title);
//   };

//   const saveEdit = async (id) => {
//     if (!editTitle.trim()) return;
//     try {
//       await API.put(`/api/tasks/${id}`, { title: editTitle });
//       setEditingId(null);
//       setEditTitle("");
//       getTasks();
//     } catch (error) {
//       console.error("Error updating task:", error);
//     }
//   };

//   useEffect(() => {
//     getTasks();
//     getStats();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <Navbar />

//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <div className="mb-8 animate-fade-in">
//           <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Tasks</h1>
//           <p className="text-slate-600">Manage your daily tasks efficiently</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <Card className="animate-fade-in shadow-lg">
//             <CardContent className="pt-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-blue-100 rounded-lg">
//                   <ListTodo className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-slate-600">Total Tasks</p>
//                   <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="animate-fade-in shadow-lg" style={{ animationDelay: "0.1s" }}>
//             <CardContent className="pt-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-green-100 rounded-lg">
//                   <CheckCheck className="w-6 h-6 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-slate-600">Completed</p>
//                   <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="animate-fade-in shadow-lg" style={{ animationDelay: "0.2s" }}>
//             <CardContent className="pt-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-orange-100 rounded-lg">
//                   <Clock className="w-6 h-6 text-orange-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-slate-600">Pending</p>
//                   <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <Card className="mb-8 animate-fade-in shadow-lg">
//           <CardContent className="pt-6">
//             <form onSubmit={createTask} className="flex gap-3">
//               <Input
//                 value={title}
//                 placeholder="What needs to be done?"
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="flex-1"
//               />
//               <Button type="submit" size="lg" className="gap-2" disabled={loading}>
//                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
//                 {loading ? "Adding..." : "Add Task"}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>

//         <div className="space-y-3">
//           {tasks.length === 0 ? (
//             <Card className="animate-fade-in">
//               <CardContent className="py-12 text-center">
//                 <CheckCircle2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                 <p className="text-slate-500 text-lg">No tasks yet. Add one to get started!</p>
//               </CardContent>
//             </Card>
//           ) : (
//             tasks.map((task, index) => (
//               <Card
//                 key={task._id}
//                 className="animate-fade-in hover:shadow-xl transition-all"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 <CardContent className="p-4">
//                   <div className="flex items-center gap-3">
//                     {editingId === task._id ? (
//                       <>
//                         <Input
//                           value={editTitle}
//                           onChange={(e) => setEditTitle(e.target.value)}
//                           className="flex-1"
//                           autoFocus
//                         />
//                         <Button onClick={() => saveEdit(task._id)} size="sm">
//                           Save
//                         </Button>
//                         <Button onClick={() => setEditingId(null)} variant="outline" size="sm">
//                           Cancel
//                         </Button>
//                       </>
//                     ) : (
//                       <>
//                         <input
//                           type="checkbox"
//                           checked={task.completed}
//                           onChange={() => toggleComplete(task._id, task.completed)}
//                           className="w-5 h-5 cursor-pointer"
//                         />
//                         <div className="flex-1">
//                           <p className={`text-lg ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
//                             {task.title}
//                           </p>
//                         </div>
//                         <Button
//                           onClick={() => startEdit(task)}
//                           variant="outline"
//                           size="sm"
//                           className="gap-2"
//                         >
//                           <Edit3 className="w-4 h-4" />
//                           Edit
//                         </Button>
//                         <Button
//                           onClick={() => deleteTask(task._id)}
//                           variant="destructive"
//                           size="sm"
//                           className="gap-2"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                           Delete
//                         </Button>
//                       </>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



"use client"

import { useEffect, useState } from "react"
import API from "../api/axiosConfig"
import Navbar from "../components/Navbar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Plus, Trash2, Edit3, CheckCircle2, Loader2, ListTodo, CheckCheck, Clock } from "lucide-react"

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 })

  const getTasks = async () => {
    try {
      const { data } = await API.get("/api/tasks")
      setTasks(data)
      getStats()
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  const getStats = async () => {
    try {
      const { data } = await API.get("/api/stats")
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const toggleComplete = async (id, completed) => {
    try {
      await API.put(`/api/tasks/${id}`, { completed: !completed })
      getTasks()
    } catch (error) {
      console.error("Error toggling task:", error)
    }
  }

  const createTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await API.post("/api/tasks", { title })
      setTitle("")
      getTasks()
    } catch (error) {
      console.error("Error creating task:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id) => {
    try {
      await API.delete(`/api/tasks/${id}`)
      getTasks()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const startEdit = (task) => {
    setEditingId(task._id)
    setEditTitle(task.title)
  }

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return
    try {
      await API.put(`/api/tasks/${id}`, { title: editTitle })
      setEditingId(null)
      setEditTitle("")
      getTasks()
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  useEffect(() => {
    getTasks()
    getStats()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Tasks</h1>
          <p className="text-muted-foreground">Organize and manage your tasks efficiently</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="animate-fade-in shadow-md border border-border hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <ListTodo className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="animate-fade-in shadow-md border border-border hover:shadow-lg transition-shadow"
            style={{ animationDelay: "0.1s" }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-950 rounded-lg">
                  <CheckCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-foreground">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="animate-fade-in shadow-md border border-border hover:shadow-lg transition-shadow"
            style={{ animationDelay: "0.2s" }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-950 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 animate-fade-in shadow-md border border-border">
          <CardContent className="pt-6">
            <form onSubmit={createTask} className="flex gap-3">
              <Input
                value={title}
                placeholder="What needs to be done?"
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-input border-border"
              />
              <Button type="submit" size="lg" className="gap-2" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                {loading ? "Adding..." : "Add Task"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <Card className="animate-fade-in border border-border">
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No tasks yet. Add one to get started!</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task, index) => (
              <Card
                key={task._id}
                className="animate-fade-in hover:shadow-md transition-all border border-border"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {editingId === task._id ? (
                      <>
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 bg-input border-border"
                          autoFocus
                        />
                        <Button onClick={() => saveEdit(task._id)} size="sm">
                          Save
                        </Button>
                        <Button onClick={() => setEditingId(null)} variant="outline" size="sm">
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleComplete(task._id, task.completed)}
                          className="w-5 h-5 cursor-pointer rounded border-border"
                        />
                        <div className="flex-1">
                          <p
                            className={`text-base font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                          >
                            {task.title}
                          </p>
                        </div>
                        <Button onClick={() => startEdit(task)} variant="outline" size="sm" className="gap-2">
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button onClick={() => deleteTask(task._id)} variant="destructive" size="sm" className="gap-2">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
