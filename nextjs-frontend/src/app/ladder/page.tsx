import { Ladder } from "@/components/pages/Ladder";
import { LadderSearchParams } from "@/utils/types";

const page = ({ searchParams }: { searchParams: LadderSearchParams }) => {
  return <Ladder searchParams={searchParams} />;
};

export default page;
