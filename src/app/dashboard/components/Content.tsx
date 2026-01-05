"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { axiosInstance } from "@/lib/axios";

import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { IoTicketOutline } from "react-icons/io5";
import { PiConfetti } from "react-icons/pi";
import { RiCouponLine } from "react-icons/ri";

import Card from "./Card";

/* =======================
   TYPES
======================= */
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

type MeResponse = {
  name: string;
  point_balance: number;
  active_points?: number;
  refferal_code?: string;
};

type Coupon = {
  id: number;
  is_used: boolean;
};

/* =======================
   COMPONENT
======================= */
function Content() {
  /* =======================
     QUERIES (CLEAN STYLE)
  ======================= */

  const {
    data: me,
    isLoading: meLoading,
    isError: meError,
  } = useQuery<MeResponse>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/me");
      return res.data;
    },
  });

  const {
    data: dashboard,
    isLoading: dashboardLoading,
    isError: dashboardError,
  } = useQuery<DashboardSummary>({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/summary");
      return res.data;
    },
  });

  const {
    data: coupons,
    isLoading: couponLoading,
    isError: couponError,
  } = useQuery<Coupon[]>({
    queryKey: ["my-coupons"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/me/coupons");
      return res.data;
    },
  });

  /* =======================
     GUARDS
  ======================= */
  if (meLoading || dashboardLoading || couponLoading) {
    return <p className="p-4">Loading dashboard...</p>;
  }

  if (meError || dashboardError || couponError || !me || !dashboard) {
    return <p className="p-4">Failed to load dashboard</p>;
  }

  /* =======================
     DERIVED DATA
  ======================= */
  const totalCoupons = coupons?.length ?? 0;
  const activeCoupons = coupons?.filter((c) => !c.is_used).length ?? 0;

  const skills = [
    "Total Revenue",
    "Total Events",
    "Total Tickets",
    "Total Vouchers",
  ];

  const indexContent = [
    `Rp ${dashboard.totalRevenue.toLocaleString("id-ID")}`,
    dashboard.totalEvents.toString(),
    dashboard.totalTicketsSold.toString(),
    dashboard.totalVouchers.toString(),
  ];

  const indexLogo = [
    <HiOutlineCurrencyDollar key="rev" className="text-3xl" />,
    <PiConfetti key="evt" className="text-3xl" />,
    <IoTicketOutline key="tic" className="text-3xl" />,
    <RiCouponLine key="vou" className="text-3xl" />,
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

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8 xl:px-12">
      {/* USER + COUPON INFO */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6 border rounded-lg p-4 space-y-1">
          <p className="text-sm text-muted-foreground">User</p>
          <p className="text-lg font-semibold">{me.name}</p>

          <div className="flex justify-between text-sm">
            <span>Total Points</span>
            <b>{me.point_balance}</b>
          </div>

          <div className="flex justify-between text-sm text-green-600">
            <span>Active Points</span>
            <b>{me.active_points ?? 0}</b>
          </div>

          <div className="flex justify-between text-sm">
            <span>Referral</span>
            <b>{me.refferal_code ?? 0}</b>
          </div>
        </div>

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

      {/* DASHBOARD TITLE */}
      <p className="text-3xl mt-4">Dashboard</p>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {skills.map((skill, index) => (
          <Card
            key={skill}
            title={skill}
            content={indexContent[index]}
            logo={indexLogo[index]}
          />
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="h-[500px] border rounded-2xl p-8 space-y-4">
          <p className="text-2xl font-bold">Overview</p>

          <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
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

        <div className="h-[500px] border rounded-2xl p-8">
          <p className="text-2xl font-bold">Recent Sales</p>
        </div>
      </div>
    </div>
  );
}

export default Content;
