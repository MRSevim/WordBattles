import { Ladder } from "@/features/ladder/components/Ladder";
import { LadderSearchParams } from "@/utils/types";

const page = ({ searchParams }: { searchParams: LadderSearchParams }) => {
  return <Ladder searchParams={searchParams} />;
};

export default page;
