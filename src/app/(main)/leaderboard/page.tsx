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
import {
  AcademicCapIcon,
  BoltIcon,
  TrophyIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default async function LeaderboardPage() {
  const actualUser = await api.users.getUser.query({});
  const allUsers = await api.users.getAllUsers.query();

  const sameUniversityUsers = allUsers.filter(
    (user) => user.universityName === actualUser.universityName,
  );

  allUsers.sort((a: UserData, b: UserData) => b.points - a.points);
  sameUniversityUsers.sort((a: UserData, b: UserData) => b.points - a.points);

  const renderLeaderboard = (
    users: UserData[],
    showUniversity: boolean,
    width: number,
  ) => (
    <Table className="border-2" style={{ width: `${width}px` }}>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex flex-row items-center justify-center">
              <TrophyIcon className="mr-1 h-5 w-5"></TrophyIcon>
              <p>Ranking</p>
            </div>
          </TableHead>
          <TableHead>
            <div className="flex flex-row items-center justify-center">
              <UserIcon className="mr-1 h-5 w-5"></UserIcon>
              <p>User</p>
            </div>
          </TableHead>
          {showUniversity && (
            <TableHead>
              <div className="flex flex-row items-center justify-center">
                <AcademicCapIcon className="mr-1 h-5 w-5"></AcademicCapIcon>
                <p>University</p>
              </div>
            </TableHead>
          )}
          <TableHead>
            <div className="flex flex-row items-center justify-center">
              <BoltIcon className="mr-1 h-5 w-5"></BoltIcon>
              <p>PeerPoints</p>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.slice(0, 25).map((user, index) => (
          <TableRow key={index}>
            <TableCell className="flex justify-center font-medium">
              {index + 1}
            </TableCell>
            <TableCell>
              <Link
                href={`/user/${user.id}`}
                className="flex flex-row items-center justify-center"
              >
                <Image
                  src={user.image}
                  width={30}
                  height={30}
                  className="mr-2 rounded-full"
                  alt={""}
                />
                {getDisplayName(user, true)}
              </Link>
            </TableCell>
            {showUniversity && (
              <TableCell>
                <div className="flex flex-row items-center justify-center">
                  {user?.university && (
                    <Image
                      src={user?.university?.logo ?? ""}
                      alt="selected image"
                      width={20}
                      height={20}
                      style={{
                        objectFit: "cover",
                      }}
                      className="mr-1.5 rounded-sm transition-opacity duration-500 group-hover:opacity-70"
                    />
                  )}
                  <p>{user?.universityName ?? "N/A"}</p>
                </div>
              </TableCell>
            )}
            <TableCell className="text-center">{user.points}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex items-center justify-center pb-32">
      <div className="mt-12 flex w-full max-w-screen-2xl flex-col items-center px-12">
        <p className="text-3xl font-bold">Peers Leaderboards</p>
        <p className="mt-1">
          Track your progress and see how you compare to your peers!
        </p>
        <div className="mt-12 flex flex-col items-center justify-center">
          <h1 className="mb-6 text-2xl font-bold">All Users</h1>
          <div>{renderLeaderboard(allUsers, true, 900)}</div>
          <div className="mb-6 mt-16 flex flex-row items-center">
            <Image
              src={actualUser?.university?.logo ?? ""}
              alt="selected image"
              width={30}
              height={30}
              style={{
                objectFit: "cover",
              }}
              className="mr-1.5 rounded-sm transition-opacity duration-500 group-hover:opacity-70"
            />
            <p className="text-2xl font-bold">{actualUser.universityName}</p>
          </div>
          <div>{renderLeaderboard(sameUniversityUsers, false, 600)}</div>
        </div>
      </div>
    </div>
  );
}
