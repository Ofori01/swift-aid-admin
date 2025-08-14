import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { TodayInsights } from "@/components/today-insights";
import { RecentActivityTable } from "@/components/recent-activity-table";
import { fetchDashboardData } from "@/store/slices/dashboardSlice";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Section Cards Skeleton */}
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          ))}
        </div>

        {/* Today Insights Skeleton */}
        <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="px-6">
          <div className="animate-pulse">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>

        {/* Recent Activity Table Skeleton */}
        <div className="px-6">
          <div className="animate-pulse">
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchDashboardData())}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionCards data={data} />
      <TodayInsights data={data} />
      <div className="px-6">
        <ChartAreaInteractive data={data} />
      </div>
      <div className="px-6">
        <RecentActivityTable data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
