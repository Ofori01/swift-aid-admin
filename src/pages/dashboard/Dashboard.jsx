import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
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
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Error Loading Dashboard
        </h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => dispatch(fetchDashboardData())}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const tableData =
    data?.recent_emergencies?.map((emergency, index) => ({
      id: index + 1,
      header: emergency.title || `Emergency ${emergency.id}`,
      type: emergency.type,
      status: emergency.status,
      target: emergency.location,
      limit: emergency.severity,
      reviewer: emergency.responder_name || "Assigned Personnel",
    })) || [];

  return (
    <>
      <SectionCards data={data} />
      <ChartAreaInteractive data={data} />
      <DataTable data={tableData} />
    </>
  );
};

export default Dashboard;
