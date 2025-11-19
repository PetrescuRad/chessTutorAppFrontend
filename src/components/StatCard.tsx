import { Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string | number;
  color?: string;
}

const StatCard = ({ title, value, color }: StatCardProps) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        textAlign: "center",
        backgroundColor: color || "background.paper",
        minHeight: 120,
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={600}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
