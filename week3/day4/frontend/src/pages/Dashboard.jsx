// import { useState, useEffect, useRef } from 'react';
// import { Box, Grid, Card, CardContent, Typography, Container } from '@mui/material';
// import { projectAPI, memberAPI } from '../services/api';
// import gsap from 'gsap';
// import FolderIcon from '@mui/icons-material/Folder';
// import GroupIcon from '@mui/icons-material/Group';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import PendingIcon from '@mui/icons-material/Pending';

// const Dashboard = () => {
//   const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, members: 0 });
//   const heroRef = useRef();
//   const cardsRef = useRef();

//   useEffect(() => {
//     fetchStats();
//     gsap.fromTo(heroRef.current, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1 });
//     gsap.fromTo(cardsRef.current.children, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, stagger: 0.15, delay: 0.5 });
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const [projectsRes, membersRes] = await Promise.all([projectAPI.getStats(), memberAPI.getAll()]);
//       const projectStats = projectsRes.data.data;
//       setStats({ 
//         total: projectStats.totalProjects, 
//         active: projectStats.activeProjects, 
//         completed: projectStats.completedProjects, 
//         members: membersRes.data.data.length 
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const statCards = [
//     { title: 'Total Projects', value: stats.total, icon: <FolderIcon sx={{ fontSize: { xs: 35, sm: 40, md: 50 } }} />, color: '#1976d2' },
//     { title: 'Active Projects', value: stats.active, icon: <PendingIcon sx={{ fontSize: { xs: 35, sm: 40, md: 50 } }} />, color: '#ed6c02' },
//     { title: 'Completed Projects', value: stats.completed, icon: <CheckCircleIcon sx={{ fontSize: { xs: 35, sm: 40, md: 50 } }} />, color: '#2e7d32' },
//     { title: 'Team Members', value: stats.members, icon: <GroupIcon sx={{ fontSize: { xs: 35, sm: 40, md: 50 } }} />, color: '#9c27b0' },
//   ];

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         py: { xs: 2, sm: 3, md: 5 },
//         px: { xs: 2, sm: 0 },
//         background:
//           'radial-gradient(circle at 15% 15%, rgba(105,166,255,0.2), transparent 30%), radial-gradient(circle at 85% 10%, rgba(220,0,78,0.18), transparent 28%), #0b1021',
//       }}
//     >
//       <Container maxWidth="lg">
//         <Box
//           ref={heroRef}
//           sx={{
//             textAlign: 'center',
//             mb: { xs: 4, sm: 5, md: 7 },
//             color: 'white',
//           }}
//         >
//           <Typography variant="overline" sx={{ letterSpacing: 3, color: 'rgba(255,255,255,0.7)' }}>
//             Overview
//           </Typography>
//           <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2rem', sm: '2.8rem', md: '3.6rem' } }}>
//             Team & Project Portal
//           </Typography>
//           <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: { xs: '1rem', sm: '1.05rem', md: '1.2rem' } }}>
//             Manage your projects, track progress, and align your team in one place.
//           </Typography>
//         </Box>
//         <Grid ref={cardsRef} container spacing={{ xs: 2.5, sm: 3, md: 3.5 }}>
//           {statCards.map((card, idx) => (
//             <Grid item xs={12} sm={6} md={3} key={idx}>
//               <Card
//                 sx={{
//                   height: '100%',
//                   background: `linear-gradient(160deg, ${card.color} 0%, ${card.color}cc 35%, #0b1021 100%)`,
//                   color: 'white',
//                   borderRadius: 3,
//                   border: '1px solid rgba(255,255,255,0.08)',
//                   boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
//                   '&:hover': { transform: 'translateY(-6px)', transition: 'all 0.3s ease' },
//                 }}
//               >
//                 <CardContent sx={{ textAlign: 'center', py: { xs: 2.5, sm: 3 }, display: 'grid', gap: 1 }}>
//                   {card.icon}
//                   <Typography variant="h3" fontWeight="bold" mt={1} sx={{ fontSize: { xs: '2rem', sm: '2.6rem', md: '3rem' } }}>
//                     {card.value}
//                   </Typography>
//                   <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>{card.title}</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default Dashboard;



"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Grid, Card, CardContent, Typography, Container, LinearProgress } from "@mui/material"
import { projectAPI, memberAPI } from "../services/api"
import gsap from "gsap"
import FolderIcon from "@mui/icons-material/Folder"
import GroupIcon from "@mui/icons-material/Group"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import PendingIcon from "@mui/icons-material/Pending"

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, members: 0 })
  const containerRef = useRef()
  const heroRef = useRef()
  const cardsRef = useRef()
  const progressRef = useRef()
  const navigate = useNavigate()

  const handleCardClick = (cardTitle) => {
    if (cardTitle === "Total Projects" || cardTitle === "Active Projects" || cardTitle === "Completed Projects") {
      navigate("/projects")
    } else if (cardTitle === "Team Members") {
      navigate("/members")
    }
  }

  useEffect(() => {
    fetchStats()
    animateOnMount()
  }, [])

  const animateOnMount = () => {
    // Hero section animation
    gsap.fromTo(heroRef.current, { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })

    // Stat cards staggered animation
    gsap.fromTo(
      cardsRef.current?.children,
      { opacity: 0, scale: 0.7, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: 0.12,
        delay: 0.3,
        duration: 0.6,
        ease: "back.out",
      },
    )

    // Progress bars animation
    gsap.fromTo(
      progressRef.current?.querySelectorAll(".stat-progress"),
      { scaleX: 0 },
      { scaleX: 1, stagger: 0.15, delay: 0.8, duration: 0.8, ease: "power2.out" },
    )
  }

  const fetchStats = async () => {
    try {
      const [projectsRes, membersRes] = await Promise.all([projectAPI.getStats(), memberAPI.getAll()])
      const projectStats = projectsRes.data.data
      setStats({
        total: projectStats.totalProjects,
        active: projectStats.activeProjects,
        completed: projectStats.completedProjects,
        members: membersRes.data.data.length,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const statCards = [
    {
      title: "Total Projects",
      value: stats.total,
      icon: <FolderIcon />,
      color: "#6a9aff",
      bgGradient: "linear-gradient(135deg, rgba(106,154,255,0.15) 0%, rgba(106,154,255,0.05) 100%)",
      accentColor: "rgba(106,154,255,0.3)",
      progress: 100,
    },
    {
      title: "Active Projects",
      value: stats.active,
      icon: <PendingIcon />,
      color: "#ff9a56",
      bgGradient: "linear-gradient(135deg, rgba(255,154,86,0.15) 0%, rgba(255,154,86,0.05) 100%)",
      accentColor: "rgba(255,154,86,0.3)",
      progress: (stats.active / stats.total) * 100 || 0,
    },
    {
      title: "Completed Projects",
      value: stats.completed,
      icon: <CheckCircleIcon />,
      color: "#4ade80",
      bgGradient: "linear-gradient(135deg, rgba(74,222,128,0.15) 0%, rgba(74,222,128,0.05) 100%)",
      accentColor: "rgba(74,222,128,0.3)",
      progress: (stats.completed / stats.total) * 100 || 0,
    },
    {
      title: "Team Members",
      value: stats.members,
      icon: <GroupIcon />,
      color: "#d946ef",
      bgGradient: "linear-gradient(135deg, rgba(217,70,239,0.15) 0%, rgba(217,70,239,0.05) 100%)",
      accentColor: "rgba(217,70,239,0.3)",
      progress: 100,
    },
  ]

  return (
    <Box
      ref={containerRef}
      sx={{
        minHeight: "100vh",
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 1.5, sm: 2, md: 0 },
        background: theme => theme.palette.mode === 'dark' ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(106,154,255,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-30%",
          left: "-5%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(217,70,239,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <Box
          ref={heroRef}
          sx={{
            textAlign: "center",
            mb: { xs: 5, sm: 6, md: 8 },
            color: theme => theme.palette.mode === 'dark' ? "white" : "black",
          }}
        >
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 4,
              color: theme => theme.palette.mode === 'dark' ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Dashboard Overview
          </Typography>
          <Typography
            variant="h2"
            fontWeight={800}
            gutterBottom
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.5rem" },
              background: theme => theme.palette.mode === 'dark' ? "linear-gradient(135deg, #ffffff 0%, #b0c9ff 100%)" : "linear-gradient(135deg, #000000 0%, #1e40af 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
              mt: 2,
            }}
          >
            Team & Project Portal
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme => theme.palette.mode === 'dark' ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
              fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.2rem" },
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Manage your projects, track progress, and align your team in one centralized dashboard
          </Typography>
        </Box>

        {/* Stat Cards Grid */}
        <Grid ref={cardsRef} container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {statCards.map((card, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                onClick={() => handleCardClick(card.title)}
                sx={{
                  height: "100%",
                  background: card.bgGradient,
                  border: `1.5px solid ${card.accentColor}`,
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(135deg, ${card.color}11 0%, transparent 100%)`,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.01)",
                    borderColor: card.color,
                    boxShadow: `0 16px 40px ${card.accentColor}, inset 0 1px 0 rgba(255,255,255,0.15)`,
                    "&::before": {
                      opacity: 1,
                    },
                  },
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    boxShadow: `0 20px 50px ${card.accentColor}`,
                    duration: 0.3,
                  })
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    height: "100%",
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "56px",
                      height: "56px",
                      borderRadius: "12px",
                      background: `${card.accentColor}`,
                      color: card.color,
                      fontSize: "28px",
                      transition: "all 0.3s ease",
                      "& svg": {
                        fontSize: { xs: "28px", sm: "32px" },
                      },
                    }}
                  >
                    {card.icon}
                  </Box>

                  {/* Value */}
                  <Box>
                    <Typography
                      variant="h3"
                      fontWeight={800}
                      sx={{
                        color: theme => theme.palette.mode === 'dark' ? "white" : "black",
                        fontSize: { xs: "2rem", sm: "2.4rem", md: "2.8rem" },
                        lineHeight: 1,
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme => theme.palette.mode === 'dark' ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {card.title}
                  </Typography>

                  {/* Progress Bar */}
                  <Box sx={{ mt: "auto" }}>
                    <Box
                      className="stat-progress"
                      sx={{
                        height: "4px",
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "2px",
                        overflow: "hidden",
                        transformOrigin: "left",
                      }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={card.progress}
                        sx={{
                          height: "100%",
                          borderRadius: "2px",
                          backgroundColor: "transparent",
                          "& .MuiLinearProgress-bar": {
                            background: `linear-gradient(90deg, ${card.color}, ${card.color}dd)`,
                            borderRadius: "2px",
                          },
                        }}
                      />
                    </Box>
                    {(card.title === "Active Projects" || card.title === "Completed Projects") && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme => theme.palette.mode === 'dark' ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                          fontSize: "0.75rem",
                          mt: 0.5,
                          display: "block",
                        }}
                      >
                        {Math.round(card.progress)}% Complete
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Dashboard
