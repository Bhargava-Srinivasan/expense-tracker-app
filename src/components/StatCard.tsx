import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconColor?: string;
}

const StatCard = ({ title, value, icon: Icon, trend, iconColor = "text-primary" }: StatCardProps) => {
  return (
    <Card className="border-border/50 shadow-soft hover:shadow-medium transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            {trend && (
              <p className={`text-xs font-medium ${trend.isPositive ? "text-success" : "text-destructive"}`}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}
              </p>
            )}
          </div>
          <div className={`rounded-xl p-3 bg-gradient-to-br from-primary/10 to-accent/10`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
