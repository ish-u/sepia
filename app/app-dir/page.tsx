import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

const Page = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  return <div>App Dir</div>;
};

export default Page;
