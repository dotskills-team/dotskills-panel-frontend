
"use client";

import {
  BadgeCheck,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  FileText,
  Handshake,
  PauseCircle,
  PhoneCall,
  PhoneMissed,
  PhoneOff,
  TrendingUp,
  Trophy,
  UserPlus,
  UserX,
  Users,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useLeadStats } from "@/features/leads/hooks/use-lead-stats";
import { LeadContactStatus, LeadStatus } from "@/types/lead";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  gradientClassName: string;
  isLoading: boolean;
}

/** Headline card — small rounded corners, colorful gradient background. */
function StatCard({ label, value, icon, gradientClassName, isLoading }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg p-3 text-white shadow-sm",
        gradientClassName,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs opacity-90">{label}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/20">
          {icon}
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-6 w-16 bg-white/30" />
      ) : (
        <span className="text-xl font-semibold tracking-tight">{value}</span>
      )}
    </div>
  );
}

interface StatPillProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  gradientClassName: string;
  textClassName?: string;
  isLoading: boolean;
}

/** Compact chip: icon + label + count, small rounded corners, gradient background. */
function StatPill({
  label,
  value,
  icon,
  gradientClassName,
  textClassName = "text-white",
  isLoading,
}: StatPillProps) {
  return (
    <div
      className={cn(
        "flex h-9 shrink-0 items-center gap-2 rounded-md pl-1.5 pr-3 shadow-sm",
        gradientClassName,
        textClassName,
      )}
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/20">
        {icon}
      </div>
      <span className="text-xs opacity-90 whitespace-nowrap">{label}</span>
      {isLoading ? (
        <Skeleton className="h-4 w-6 bg-white/30" />
      ) : (
        <span className="text-sm font-semibold tabular-nums">{value}</span>
      )}
    </div>
  );
}

const LEAD_STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; icon: React.ReactNode; gradientClassName: string; textClassName?: string }
> = {
  [LeadStatus.NEW]: {
    label: "New",
    icon: <UserPlus className="h-3.5 w-3.5 text-white" />,
    gradientClassName: "bg-gradient-to-br from-emerald-400 to-emerald-600",
  },
  [LeadStatus.CONTACTED]: {
    label: "Contacted",
    icon: <PhoneCall className="h-3.5 w-3.5 text-white" />,
    gradientClassName: "bg-gradient-to-br from-sky-400 to-sky-600",
  },
  [LeadStatus.QUALIFIED]: {
    label: "Qualified",
    icon: <BadgeCheck className="h-3.5 w-3.5 text-white" />,
    gradientClassName: "bg-gradient-to-br from-cyan-400 to-cyan-600",
  },
  [LeadStatus.PROPOSAL_SENT]: {
    label: "Proposal Sent",
    icon: <FileText className="h-3.5 w-3.5 text-white" />,
    gradientClassName: "bg-gradient-to-br from-purple-400 to-purple-600",
  },
  [LeadStatus.CONFIRMED_MEETING]: {
    label: "Confirmed Meeting",
    icon: <CalendarCheck className="h-3.5 w-3.5 text-white" />,
    gradientClassName: "bg-gradient-to-br from-blue-400 to-blue-600",
  },
  [LeadStatus.NEGOTIATION]: {
    label: "Negotiation",
    icon: <Handshake className="h-3.5 w-3.5 text-white" />,
    gradientClassName: "bg-gradient-to-br from-orange-400 to-orange-600",
  },
  [LeadStatus.ON_HOLD]: {
    label: "On Hold",
    icon: <PauseCircle className="h-3.5 w-3.5 text-gray-900" />,
    gradientClassName: "bg-gradient-to-br from-yellow-300 to-yellow-500",
    textClassName: "text-gray-900",
  },
  [LeadStatus.WON]: {
    label: "Won",
    icon: <Trophy className="h-3.5 w-3.5 text-white" />,
    gradientClassName: "bg-gradient-to-br from-indigo-400 to-indigo-600",
  },
  [LeadStatus.LOST]: {
    label: "Lost",
    icon: <UserX className="h-3.5 w-3.5 text-white" />,
    gradientClassName: "bg-gradient-to-br from-red-400 to-red-600",
  },
};

const CONTACT_STATUS_CONFIG: Record<
  LeadContactStatus,
  { label: string; icon: React.ReactNode; gradientClassName: string; textClassName?: string }
> = {
  [LeadContactStatus.NO_RESPONSE]: {
    label: "No Response",
    icon: <PhoneMissed className="h-3.5 w-3.5 text-white" />,
    gradientClassName: "bg-gradient-to-br from-rose-400 to-rose-600",
  },
  [LeadContactStatus.BUSY]: {
    label: "Busy",
    icon: <PhoneCall className="h-3.5 w-3.5 text-gray-900" />,
    gradientClassName: "bg-gradient-to-br from-amber-300 to-amber-500",
    textClassName: "text-gray-900",
  },
  [LeadContactStatus.NEXT_CONTACT]: {
    label: "Next Contact",
    icon: <CalendarClock className="h-3.5 w-3.5 text-white" />,
    gradientClassName: "bg-gradient-to-br from-teal-400 to-teal-600",
  },
  [LeadContactStatus.PHONE_OFF]: {
    label: "Phone Off",
    icon: <PhoneOff className="h-3.5 w-3.5 text-white" />,
    gradientClassName: "bg-gradient-to-br from-slate-500 to-slate-700",
  },
};

export function LeadsStats() {
  const { isLoading, totalCount, convertedCount, conversionRate, statusCounts, contactStatusCounts } =
    useLeadStats();

  return (
    <div className="flex flex-col gap-3">
      {/* Overview — headline numbers, now gradient cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Total Leads"
          value={totalCount.toLocaleString()}
          icon={<Users className="h-4 w-4 text-white" />}
          gradientClassName="bg-gradient-to-br from-blue-500 to-blue-700"
          isLoading={isLoading}
        />
        <StatCard
          label="Converted"
          value={convertedCount.toLocaleString()}
          icon={<CheckCircle2 className="h-4 w-4 text-white" />}
          gradientClassName="bg-gradient-to-br from-indigo-500 to-indigo-700"
          isLoading={isLoading}
        />
        <StatCard
          label="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-4 w-4 text-white" />}
          gradientClassName="bg-gradient-to-br from-amber-500 to-orange-600"
          isLoading={isLoading}
        />
      </div>

      {/* Row 1: Lead status pills */}
      <div className="flex flex-wrap items-center gap-2">
        {Object.values(LeadStatus).map((status) => {
          const config = LEAD_STATUS_CONFIG[status];
          return (
            <StatPill
              key={status}
              label={config.label}
              value={statusCounts[status].toLocaleString()}
              icon={config.icon}
              gradientClassName={config.gradientClassName}
              textClassName={config.textClassName}
              isLoading={isLoading}
            />
          );
        })}
      </div>

      {/* Row 2: Contact status pills */}
      <div className="flex flex-wrap items-center gap-2">
        {Object.values(LeadContactStatus).map((contactStatus) => {
          const config = CONTACT_STATUS_CONFIG[contactStatus];
          return (
            <StatPill
              key={contactStatus}
              label={config.label}
              value={contactStatusCounts[contactStatus].toLocaleString()}
              icon={config.icon}
              gradientClassName={config.gradientClassName}
              textClassName={config.textClassName}
              isLoading={isLoading}
            />
          );
        })}
      </div>
    </div>
  );
}
