import { Card, Typography, Avatar, Stack } from "@mui/material";

interface HeaderCardProps {
  username: string;
  subtitle?: string;
}

const HeaderCard = ({ username, subtitle }: HeaderCardProps) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 4,
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #1a237e, #283593)",
        color: "white",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: "#3949ab", width: 60, height: 60, fontSize: 24 }}>
          {username.charAt(0).toUpperCase()}
        </Avatar>
        <div>
          <Typography variant="h5" fontWeight="bold">
            Welcome back, {username}!
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.8)">
            {subtitle || "Ready to improve your chess?"}
          </Typography>
        </div>
      </Stack>
    </Card>
  );
};

export default HeaderCard;
