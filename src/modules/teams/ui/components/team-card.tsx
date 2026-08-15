import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Team } from "@/payload-types";
import { ClockIcon, UsersIcon } from "lucide-react";

type Props = {
  data: Team;
};

export const TeamCard = ({ data }: Props) => {
  return (
    <div className="w-full bg-white border-2 border-border shadow-shadow rounded-base p-6 gap-4 flex flex-col md:flex-row justify-between hover:translate-y-[-4px] hover:translate-x-[-4px] transition-transform">
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{data.fieldCategory}</Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            Deadline: {formatDate(data.deadline)}
          </Badge>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold">
            {data.competitionName}
          </h2>
          <div className="flex items-center gap-1 text-muted-foreground mt-1 text-sm font-semibold">
            <UsersIcon className="w-4 h-4" />
            <span>Pencari: {typeof data.leader === 'object' && data.leader !== null ? data.leader.fullName : data.leader}</span>
          </div>
        </div>

        <p className="text-muted-foreground line-clamp-2 text-sm mt-2">
          {data.projectSynopsis}
        </p>
      </div>
      
      <div className="flex items-center md:items-end justify-start md:justify-end mt-4 md:mt-0 min-w-[150px]">
        <Link href={`/teams/${data.id}`} className="w-full md:w-auto">
          <Button className="w-full" size="lg">Lihat Detail</Button>
        </Link>
      </div>
    </div>
  );
};
