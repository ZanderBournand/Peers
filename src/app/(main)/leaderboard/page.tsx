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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function LeaderboardPage() {
  const actualUser = await api.users.getUser.query({});
  const allUsers = await api.users.getAllUsers.query();

  const sameUniversityUsers = allUsers.filter(
    (user) => user.universityName === actualUser.universityName,
  );

  allUsers.sort((a: UserData, b: UserData) => b.points - a.points);
  sameUniversityUsers.sort((a: UserData, b: UserData) => b.points - a.points);

  const renderLeaderboard = (users: UserData[], showUniversity: boolean) => (
    <div
      className={`flex w-full items-center justify-center rounded-xl border`}
    >
      <Table className="w-full self-center">
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
    </div>
  );

  return (
    <div className="flex items-center justify-center pb-32">
      <div className="mt-12 flex w-full max-w-screen-2xl flex-col items-center px-12">
        <p className="text-3xl font-bold">Peers Leaderboards</p>
        <p className="mt-1">
          Track your progress and see how you compare to your peers!
        </p>
        <div className="mt-12 flex w-full max-w-[900px] flex-col items-center justify-center">
          <Tabs
            defaultValue="all"
            className="flex w-full min-w-[450px] flex-col items-center"
          >
            <TabsList
              className={`grid w-11/12 items-center justify-center sm:w-full ${
                actualUser?.isVerifiedStudent
                  ? "max-w-[500px] grid-cols-2"
                  : "max-w-[300px] grid-cols-1"
              }`}
            >
              <TabsTrigger value="all">All users</TabsTrigger>
              {actualUser?.isVerifiedStudent && (
                <TabsTrigger value="university">
                  <Image
                    src={actualUser?.university?.logo ?? ""}
                    alt="selected image"
                    width={20}
                    height={20}
                    style={{
                      objectFit: "cover",
                    }}
                    className="mr-1.5 rounded-sm transition-opacity duration-500 group-hover:opacity-70"
                  />
                  <p>{actualUser.universityName}</p>
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent
              value="all"
              className="mt-12 flex w-10/12 scroll-mx-12 items-center justify-center sm:w-full"
            >
              {renderLeaderboard(allUsers, true)}
            </TabsContent>
            <TabsContent
              value="university"
              className="mt-4 flex w-10/12 scroll-mx-12 items-center justify-center sm:w-full"
            >
              {renderLeaderboard(sameUniversityUsers, false)}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
