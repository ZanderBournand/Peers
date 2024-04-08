import { api } from "@/trpc/server";
import { type UserData } from "@/lib/interfaces/userData";
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

const userArr: string[] = [
  "b78058e1-3441-4fd1-bece-689dcbcc514b",
  "64272793-93f6-4068-892e-c9f9d4e7b7c2",
  "0d05971f-44c0-4d69-b9a9-e2e0b2bd5ef8",
];

const users: UserData[] = [];
for (const userID of userArr) {
  const userData = await api.users.getUser.query({ id: userID });
  users.push(userData as UserData);
}

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
                      className="-mb-[25px] ml-2 rounded-full"
                      alt={""}
                    />
                    <Link href={`/user/${user.id}`} className="underline">
                      {user.firstName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Image
                      src={user?.university?.logo ?? ""}
                      alt="selected image"
                      width={20}
                      height={20}
                      className="-mb-5 ml-14 rounded"
                    />
                    {user?.university?.name ?? "No University"}
                  </TableCell>
                  <TableCell className="text-center">100</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
