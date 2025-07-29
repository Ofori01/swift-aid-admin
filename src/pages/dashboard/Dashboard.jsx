import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

// Sample data for the data table
const sampleData = [
  {
    id: 1,
    header: "Emergency Response Team Alpha",
    type: "Medical",
    status: "Active",
    target: "City Hospital",
    limit: "High Priority",
    reviewer: "Dr. Smith",
  },
  {
    id: 2,
    header: "Fire Department Unit 5",
    type: "Fire",
    status: "Deployed",
    target: "Downtown District",
    limit: "Critical",
    reviewer: "Chief Johnson",
  },
  {
    id: 3,
    header: "Police Patrol Unit 12",
    type: "Security",
    status: "Available",
    target: "North Sector",
    limit: "Standard",
    reviewer: "Sgt. Williams",
  },
  {
    id: 4,
    header: "Ambulance Unit 7",
    type: "Medical",
    status: "En Route",
    target: "Residential Area",
    limit: "High Priority",
    reviewer: "Paramedic Davis",
  },
  {
    id: 5,
    header: "Search and Rescue Team",
    type: "Rescue",
    status: "Standby",
    target: "Mountain Region",
    limit: "Emergency",
    reviewer: "Coordinator Lee",
  },
];

const Dashboard = () => {
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive />
      <DataTable data={sampleData} />
    </>
  );
};

export default Dashboard;
