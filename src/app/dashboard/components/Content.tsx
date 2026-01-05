// "use client";

// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

// import {
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
//   type ChartConfig,
// } from "@/components/ui/chart";

// import { useQuery } from "@tanstack/react-query";
// import { axiosInstance } from "@/lib/axios";

// type DashboardSummary = {
//   totalRevenue: number;
//   totalEvents: number;
//   totalTicketsSold: number;
//   totalVouchers: number;
//   revenueByMonth: {
//     month: string;
//     revenue: number;
//   }[];
// };

// import { HiOutlineCurrencyDollar } from "react-icons/hi";
// import { IoTicketOutline } from "react-icons/io5";
// import { PiConfetti } from "react-icons/pi";
// import { RiCouponLine } from "react-icons/ri";
// import Card from "./Card";
// import { useEffect, useState } from "react";

// function Content() {
//   // 🔑 AMBIL TOKEN (METODE LO)
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

//   // const [token, setToken] = useState<string | null>(null);

//   // useEffect(() => {
//   //   const t = localStorage.getItem("accessToken");
//   //   setToken(t);
//   // }, []);

//   const {
//     data: me,
//     isLoading: meLoading,
//     error: meError,
//   } = useQuery({
//     queryKey: ["me"],
//     enabled: !!token,
//     queryFn: async () => {
//       const res = await axiosInstance.get("/users/me");
//       return res.data;
//     },
//   });

//   const {
//     data: dashboard,
//     isLoading,
//     isError,
//   } = useQuery<DashboardSummary>({
//     queryKey: ["dashboard-summary"],
//     enabled: !!token,
//     queryFn: async () => {
//       const res = await axiosInstance.get("/dashboard/summary", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return res.data;
//     },
//   });

//   const {
//     data: coupons,
//     isLoading: couponLoading,
//     error: couponError,
//   } = useQuery({
//     queryKey: ["my-coupons"],
//     enabled: !!token,
//     queryFn: async () => {
//       const res = await axiosInstance.get("/users/me/coupons");
//       return res.data;
//     },
//   });

//   if (!token) return <p className="p-4">Not authenticated</p>;
//   if (meLoading || couponLoading) return <p className="p-4">Loading...</p>;
//   if (meError || couponError) return <p className="p-4">Unauthorized</p>;

//   if (!token) return <p className="p-4">Not authenticated</p>;
//   if (isLoading) return <p className="p-4">Loading dashboard...</p>;
//   if (isError || !dashboard)
//     return <p className="p-4">Failed to load dashboard</p>;

//   if (!me) return null;

//   const totalCoupons = coupons?.length ?? 0;
//   const activeCoupons = coupons?.filter((c: any) => !c.is_used).length ?? 0;

//   const skills = [
//     "Total Revenue",
//     "Total Events",
//     "Total Tickets",
//     "Total Vouchers",
//   ];

//   const indexContent = [
//     `Rp ${dashboard.totalRevenue.toLocaleString("id-ID")}`,
//     dashboard.totalEvents.toString(),
//     dashboard.totalTicketsSold.toString(),
//     dashboard.totalVouchers.toString(),
//   ];

//   const chartData = dashboard.revenueByMonth.map((item) => ({
//     month: item.month,
//     revenue: item.revenue,
//   }));

//   const chartConfig = {
//     revenue: {
//       label: "Revenue",
//       color: "#2563eb",
//     },
//   } satisfies ChartConfig;

//   const indexVisualization = ["Overview", "Recent Sales"];

//   const indexLogo = [
//     <HiOutlineCurrencyDollar className="text-3xl" />,
//     <PiConfetti className="text-3xl" />,
//     <IoTicketOutline className="text-3xl" />,
//     <RiCouponLine className="text-3xl" />,
//   ];

//   return (
//     <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8 xl:px-12">
//       <div className="grid grid-cols-12 gap-6">
//         {/* KIRI — USER INFO */}
//         <div className="col-span-12 md:col-span-6 border rounded-lg p-4 space-y-1">
//           <p className="text-sm text-muted-foreground">User</p>
//           <p className="text-lg font-semibold">{me.name}</p>

//           <div className="flex justify-between text-sm">
//             <span>Total Points</span>
//             <b>{me.point_balance}</b>
//           </div>

//           <div className="flex justify-between text-sm text-green-600">
//             <span>Active Points</span>
//             <b>{me.active_points}</b>
//           </div>
//         </div>

//         {/* KANAN — COUPON INFO */}
//         <div className="col-span-12 md:col-span-6 border rounded-lg p-4 space-y-1">
//           <p className="text-sm text-muted-foreground">Coupons</p>

//           <div className="flex justify-between text-sm pt-2">
//             <span>Total Coupons</span>
//             <b>{totalCoupons}</b>
//           </div>

//           <div className="flex justify-between text-sm text-green-600">
//             <span>Active Coupons</span>
//             <b>{activeCoupons}</b>
//           </div>
//         </div>
//       </div>

//       <p className=" text-3xl md:text-3xl mt-4">Dashboard</p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//         {skills.map((skill, index) => {
//           return (
//             <Card
//               key={index}
//               title={skill}
//               content={indexContent[index]}
//               logo={indexLogo[index]}
//             />
//           );
//         })}
//       </div>

//       <div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
//           {/* Card kiri */}
//           <div className="h-[500px] border rounded-4xl p-8 space-y-4">
//             <p className="text-2xl font-bold">Overview</p>

//             <ChartContainer
//               config={chartConfig}
//               className="min-h-[400px] w-full"
//             >
//               <BarChart data={chartData}>
//                 <CartesianGrid vertical={false} />
//                 <XAxis
//                   dataKey="month"
//                   tickLine={false}
//                   tickMargin={10}
//                   axisLine={false}
//                 />
//                 <ChartTooltip content={<ChartTooltipContent />} />
//                 <ChartLegend content={<ChartLegendContent />} />
//                 <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
//               </BarChart>
//             </ChartContainer>
//           </div>

//           {/* Card kanan */}
//           <div className="h-[500px] border rounded-4xl p-8 space-y-4">
//             <p className="text-2xl font-bold">Recent Sales</p>{" "}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Content;

// "use client";

// import { useEffect, useState } from "react";
// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

// import {
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
//   type ChartConfig,
// } from "@/components/ui/chart";

// import { useQuery } from "@tanstack/react-query";
// import { axiosInstance } from "@/lib/axios";

// import { HiOutlineCurrencyDollar } from "react-icons/hi";
// import { IoTicketOutline } from "react-icons/io5";
// import { PiConfetti } from "react-icons/pi";
// import { RiCouponLine } from "react-icons/ri";
// import Card from "./Card";

// /* =======================
//    TYPES
// ======================= */
// type DashboardSummary = {
//   totalRevenue: number;
//   totalEvents: number;
//   totalTicketsSold: number;
//   totalVouchers: number;
//   revenueByMonth: {
//     month: string;
//     revenue: number;
//   }[];
// };

// type MeResponse = {
//   name: string;
//   point_balance: number;
//   active_points?: number;
// };

// type Coupon = {
//   id: number;
//   is_used: boolean;
// };

// /* =======================
//    COMPONENT
// ======================= */
// function Content() {
//   /* 🔐 TOKEN STATE (ANTI RACE CONDITION) */
//   const [token, setToken] = useState<string | null>(null);
//   const [tokenReady, setTokenReady] = useState(false);

//   useEffect(() => {
//     const t = localStorage.getItem("accessToken");
//     setToken(t);
//     setTokenReady(true);
//   }, []);

//   /* =======================
//      QUERIES
//   ======================= */

//   const {
//     data: me,
//     isLoading: meLoading,
//     isError: meError,
//   } = useQuery<MeResponse>({
//     queryKey: ["me"],
//     enabled: !!token,
//     queryFn: async () => {
//       const res = await axiosInstance.get("/users/me");
//       return res.data;
//     },
//   });

//   const {
//     data: dashboard,
//     isLoading: dashboardLoading,
//     isError: dashboardError,
//   } = useQuery<DashboardSummary>({
//     queryKey: ["dashboard-summary"],
//     enabled: !!token,
//     queryFn: async () => {
//       const res = await axiosInstance.get("/dashboard/summary");
//       return res.data;
//     },
//   });

//   const {
//     data: coupons,
//     isLoading: couponLoading,
//     isError: couponError,
//   } = useQuery<Coupon[]>({
//     queryKey: ["my-coupons"],
//     enabled: !!token,
//     queryFn: async () => {
//       const res = await axiosInstance.get("/users/me/coupons");
//       return res.data;
//     },
//   });

//   /* =======================
//      GUARDS (RAPIH & AMAN)
//   ======================= */
//   if (!tokenReady) return <p className="p-4">Checking authentication...</p>;
//   if (!token) return <p className="p-4">Not authenticated</p>;

//   if (meLoading || dashboardLoading || couponLoading) {
//     return <p className="p-4">Loading dashboard...</p>;
//   }

//   if (meError || dashboardError || couponError || !dashboard || !me) {
//     return <p className="p-4">Failed to load dashboard</p>;
//   }

//   /* =======================
//      DERIVED DATA
//   ======================= */
//   const totalCoupons = coupons?.length ?? 0;
//   const activeCoupons = coupons?.filter((c) => !c.is_used).length ?? 0;

//   const skills = [
//     "Total Revenue",
//     "Total Events",
//     "Total Tickets",
//     "Total Vouchers",
//   ];

//   const indexContent = [
//     `Rp ${dashboard.totalRevenue.toLocaleString("id-ID")}`,
//     dashboard.totalEvents.toString(),
//     dashboard.totalTicketsSold.toString(),
//     dashboard.totalVouchers.toString(),
//   ];

//   const indexLogo = [
//     <HiOutlineCurrencyDollar key="rev" className="text-3xl" />,
//     <PiConfetti key="evt" className="text-3xl" />,
//     <IoTicketOutline key="tic" className="text-3xl" />,
//     <RiCouponLine key="vou" className="text-3xl" />,
//   ];

//   const chartData = dashboard.revenueByMonth.map((item) => ({
//     month: item.month,
//     revenue: item.revenue,
//   }));

//   const chartConfig = {
//     revenue: {
//       label: "Revenue",
//       color: "#2563eb",
//     },
//   } satisfies ChartConfig;

//   /* =======================
//      RENDER
//   ======================= */
//   return (
//     <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8 xl:px-12">
//       {/* USER + COUPON INFO */}
//       <div className="grid grid-cols-12 gap-6">
//         <div className="col-span-12 md:col-span-6 border rounded-lg p-4 space-y-1">
//           <p className="text-sm text-muted-foreground">User</p>
//           <p className="text-lg font-semibold">{me.name}</p>

//           <div className="flex justify-between text-sm">
//             <span>Total Points</span>
//             <b>{me.point_balance}</b>
//           </div>

//           <div className="flex justify-between text-sm text-green-600">
//             <span>Active Points</span>
//             <b>{me.active_points ?? 0}</b>
//           </div>
//         </div>

//         <div className="col-span-12 md:col-span-6 border rounded-lg p-4 space-y-1">
//           <p className="text-sm text-muted-foreground">Coupons</p>

//           <div className="flex justify-between text-sm pt-2">
//             <span>Total Coupons</span>
//             <b>{totalCoupons}</b>
//           </div>

//           <div className="flex justify-between text-sm text-green-600">
//             <span>Active Coupons</span>
//             <b>{activeCoupons}</b>
//           </div>
//         </div>
//       </div>

//       {/* DASHBOARD TITLE */}
//       <p className="text-3xl mt-4">Dashboard</p>

//       {/* STATS CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//         {skills.map((skill, index) => (
//           <Card
//             key={skill}
//             title={skill}
//             content={indexContent[index]}
//             logo={indexLogo[index]}
//           />
//         ))}
//       </div>

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
//         <div className="h-[500px] border rounded-2xl p-8 space-y-4">
//           <p className="text-2xl font-bold">Overview</p>

//           <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
//             <BarChart data={chartData}>
//               <CartesianGrid vertical={false} />
//               <XAxis
//                 dataKey="month"
//                 tickLine={false}
//                 tickMargin={10}
//                 axisLine={false}
//               />
//               <ChartTooltip content={<ChartTooltipContent />} />
//               <ChartLegend content={<ChartLegendContent />} />
//               <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
//             </BarChart>
//           </ChartContainer>
//         </div>

//         <div className="h-[500px] border rounded-2xl p-8">
//           <p className="text-2xl font-bold">Recent Sales</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Content;

"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

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
};

type Coupon = {
  id: number;
  is_used: boolean;
};

/* =======================
   COMPONENT
======================= */
function Content() {
  const { status } = useSession();

  const isAuth = status === "authenticated";

  /* =======================
     QUERIES
  ======================= */
  const { data: me, isLoading: meLoading } = useQuery<MeResponse>({
    queryKey: ["me"],
    enabled: isAuth,
    queryFn: async () => {
      const res = await axiosInstance.get("/users/me");
      return res.data;
    },
  });

  const { data: dashboard, isLoading: dashboardLoading } =
    useQuery<DashboardSummary>({
      queryKey: ["dashboard-summary"],
      enabled: isAuth,
      queryFn: async () => {
        const res = await axiosInstance.get("/dashboard/summary");
        return res.data;
      },
    });

  const { data: coupons, isLoading: couponLoading } = useQuery<Coupon[]>({
    queryKey: ["my-coupons"],
    enabled: isAuth,
    queryFn: async () => {
      const res = await axiosInstance.get("/users/me/coupons");
      return res.data;
    },
  });

  /* =======================
     GUARDS
  ======================= */
  if (status === "loading") return <p className="p-4">Checking session...</p>;
  if (!isAuth) return <p className="p-4">Not authenticated</p>;

  if (meLoading || dashboardLoading || couponLoading)
    return <p className="p-4">Loading dashboard...</p>;

  if (!me || !dashboard) return <p className="p-4">Failed to load dashboard</p>;

  /* =======================
     DERIVED DATA
  ======================= */
  const totalCoupons = coupons?.length ?? 0;
  const activeCoupons = coupons?.filter((c) => !c.is_used).length ?? 0;

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

      {/* DASHBOARD */}
      <p className="text-3xl mt-4">Dashboard</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card
          title="Total Revenue"
          content={`Rp ${dashboard.totalRevenue.toLocaleString("id-ID")}`}
          logo={<HiOutlineCurrencyDollar />}
        />
        <Card
          title="Total Events"
          // content={dashboard.totalEvents}
          content={dashboard.totalEvents.toString()}
          logo={<PiConfetti />}
        />
        <Card
          title="Total Tickets"
          content={dashboard.totalTicketsSold.toString()}
          logo={<IoTicketOutline />}
        />
        <Card
          title="Total Vouchers"
          content={dashboard.totalVouchers.toString()}
          logo={<RiCouponLine />}
        />
      </div>

      <div className="h-[500px] border rounded-2xl p-8">
        <ChartContainer config={chartConfig} className="h-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}

export default Content;
