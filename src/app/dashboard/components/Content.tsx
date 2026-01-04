"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

type DashboardSummary = {
  totalRevenue: number;
  totalEvents: number;
  totalTicketsSold: number;
  totalVouchers: number;
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
};

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "#2563eb",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "#60a5fa",
//   },
// } satisfies ChartConfig;

import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { IoTicketOutline } from "react-icons/io5";
import { PiConfetti } from "react-icons/pi";
import { RiCouponLine } from "react-icons/ri";
import Card from "./Card";

function Content() {
  // 🔑 AMBIL TOKEN (METODE LO)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // const {
  //   data: me,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["me"],
  //   enabled: !!token, // ⬅️ KUNCI UTAMA
  //   queryFn: async () => {
  //     const res = await axiosInstance.get("/users/me");
  //     return res.data;
  //   },
  // });

  const {
    data: me,
    isLoading: meLoading,
    error: meError,
  } = useQuery({
    queryKey: ["me"],
    enabled: !!token,
    queryFn: async () => {
      const res = await axiosInstance.get("/users/me");
      return res.data;
    },
  });

  const {
    data: dashboard,
    isLoading,
    isError,
  } = useQuery<DashboardSummary>({
    queryKey: ["dashboard-summary"],
    enabled: !!token,
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const {
    data: coupons,
    isLoading: couponLoading,
    error: couponError,
  } = useQuery({
    queryKey: ["my-coupons"],
    enabled: !!token,
    queryFn: async () => {
      // ⬅️ SESUAIKAN ENDPOINT BACKEND LO
      const res = await axiosInstance.get("/users/me/coupons");
      return res.data; // asumsi array
    },
  });

  /* ======================
     RENDER GUARDS
  ======================= */
  // if (!token) return <p className="p-4">Not authenticated</p>;
  // if (isLoading) return <p className="p-4">Loading...</p>;
  // if (error) return <p className="p-4">Unauthorized</p>;
  // if (!me) return null;

  if (!token) return <p className="p-4">Not authenticated</p>;
  if (meLoading || couponLoading) return <p className="p-4">Loading...</p>;
  if (meError || couponError) return <p className="p-4">Unauthorized</p>;

  if (!token) return <p className="p-4">Not authenticated</p>;
  if (isLoading) return <p className="p-4">Loading dashboard...</p>;
  if (isError || !dashboard)
    return <p className="p-4">Failed to load dashboard</p>;

  if (!me) return null;

  const totalCoupons = coupons?.length ?? 0;
  const activeCoupons = coupons?.filter((c: any) => !c.is_used).length ?? 0;

  // const {
  //   data: me,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["me"],
  //   queryFn: async () => {
  //     const res = await axiosInstance.get("/users/me");
  //     return res.data;
  //   },
  // });

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Unauthorized / Error loading user</p>;
  // if (!me) return null;

  const skills = [
    "Total Revenue",
    "Total Events",
    "Total Tickets",
    "Total Vouchers",
  ];

  // const indexContent = [
  //   "Total dadsa",
  //   "Total dsa",
  //   "Total Tickets",
  //   "Total Vouchers",
  // ];
  const indexContent = [
    `Rp ${dashboard.totalRevenue.toLocaleString("id-ID")}`,
    dashboard.totalEvents.toString(),
    dashboard.totalTicketsSold.toString(),
    dashboard.totalVouchers.toString(),
  ];

  const chartData = dashboard.revenueByMonth.map((item) => ({
    month: item.month,
    revenue: item.revenue,
  }));

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const indexVisualization = ["Overview", "Recent Sales"];

  const indexLogo = [
    <HiOutlineCurrencyDollar className="text-3xl" />,
    <PiConfetti className="text-3xl" />,
    <IoTicketOutline className="text-3xl" />,
    <RiCouponLine className="text-3xl" />,
  ];
  // if (isLoading) return <p>Loading...</p>;

  return (
    // <div className="w-full space-y-8">
    // <div className="w-full space-y-8">
    <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8 xl:px-12">
      {/* <div className="p-4 border rounded">
        <p>Name: {me.name}</p>
        <p>Active Points: {me.active_points}</p>
        <p>Total Balance: {me.point_balance}</p>
        <p>Total Coupons: {totalCoupons}</p>
      </div> */}

      <div className="grid grid-cols-12 gap-6">
        {/* KIRI — USER INFO */}
        <div className="col-span-12 md:col-span-6 border rounded-lg p-4 space-y-1">
          <p className="text-sm text-muted-foreground">User</p>
          <p className="text-lg font-semibold">{me.name}</p>

          <div className="flex justify-between text-sm">
            <span>Total Points</span>
            <b>{me.point_balance}</b>
          </div>

          <div className="flex justify-between text-sm text-green-600">
            <span>Active Points</span>
            <b>{me.active_points}</b>
          </div>
        </div>

        {/* KANAN — COUPON INFO */}
        <div className="col-span-12 md:col-span-6 border rounded-lg p-4 space-y-1">
          <p className="text-sm text-muted-foreground">Coupons</p>

          <div className="flex justify-between text-sm pt-2">
            <span>Total Coupons</span>
            <b>{totalCoupons}</b>
          </div>

          <div className="flex justify-between text-sm text-green-600">
            <span>Active Coupons</span>
            <b>{activeCoupons}</b>
          </div>
        </div>
      </div>

      <p className=" text-3xl md:text-3xl mt-4">Dashboard</p>

      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8"> */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {skills.map((skill, index) => {
          return (
            <Card
              key={index}
              title={skill}
              content={indexContent[index]}
              logo={indexLogo[index]}
            />
          );
        })}
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Card kiri */}
          <div className="h-[500px] border rounded-4xl p-8 space-y-4">
            <p className="text-2xl font-bold">Overview</p>

            <ChartContainer
              config={chartConfig}
              className="min-h-[400px] w-full"
            >
              {/* <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart> */}

              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Card kanan */}
          <div className="h-[500px] border rounded-4xl p-8 space-y-4">
            <p className="text-2xl font-bold">Recent Sales</p>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
