"use client";
import AllInterview from "../all-interview/page";
import CreateOptions from "./_components/CreateOptions";

const Dashboard = () => {
  return (
    <div>
      <h2 className="py-3 font-bold text-2xl">Dashboard</h2>
      <CreateOptions />
      <AllInterview />
    </div>
  )
}

export default Dashboard;
