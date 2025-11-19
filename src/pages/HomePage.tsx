// src/pages/HomePage.tsx
import { Box, Button, Stack, Grid } from "@mui/material";
import HeaderCard from "../components/HeaderCard";
import StatCard from "../components/StatCard";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const username = localStorage.getItem("username")!;

    function handleLogout() {
        localStorage.clear();
        navigate("/login");
    }

    // Temporary dummy stats (replace with backend data later)
    const stats = [
        { title: "Games Played", value: 120 },
        { title: "Win Rate", value: "62%" },
        { title: "Average Accuracy", value: "78%" },
        { title: "Elo Rating", value: 1450 },
    ];

    return (
        <Box sx={{ p: 4 }}>
            {/* Header */}
            <HeaderCard username={username} subtitle="Analyze your latest games" />

            <Grid container spacing={3} sx={{ mt: 2 }}>
                {stats.map((stat) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
                        <StatCard title={stat.title} value={stat.value} />
                    </Grid>
                ))}
            </Grid>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button variant="contained" color="primary" size="large" onClick={() => navigate('/analysis')}>
                    Analyze Games
                </Button>
                <Button variant="outlined" color="secondary" size="large" onClick={handleLogout}>
                    Logout
                </Button>
            </Stack>
        </Box>
    );
};

export default HomePage;