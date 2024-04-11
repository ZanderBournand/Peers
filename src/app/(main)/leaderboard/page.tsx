import { api } from "@/trpc/server";
import { type UserData } from "@/lib/interfaces/userData";
import { getDisplayName } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Image from "next/image";

const users = await api.users.getAllUsers.query();

users.sort((a: UserData, b: UserData) => b.points - a.points);

export default async function LeaderboardPage() {
  return (
    <div className="flex items-center justify-center">
      <div className="mt-8 flex flex-col items-center">
        <h1 className="mb-4 text-2xl font-bold">Leaderboard</h1>
        <div>
          <Table className="w-[900px] border-2">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Ranking</TableHead>
                <TableHead className="text-center">User</TableHead>
                <TableHead className="text-center">University</TableHead>
                <TableHead className="text-center">PeerPoints</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className="flex justify-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center">
                    <Image
                      src={user.image}
                      width={30}
                      height={30}
                      className="-mb-[25px] ml-4 rounded-full"
                      alt={""}
                    />
                    <Link href={`/user/${user.id}`} className="underline">
                      {getDisplayName(user, true)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <p>{user?.universityName ?? "No University"}</p>
                  </TableCell>
                  <TableCell className="text-center">{user.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
