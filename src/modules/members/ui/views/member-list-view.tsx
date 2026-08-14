import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { MembersList, MembersListSkeleton } from "../components/members-list";
import { Suspense } from "react";
import YearSelector from "@/modules/about/ui/components/year-selector";

export const MemberListView = ({}) => {
  return (
    <div className="px-4 lg:px-20 py-10 flex flex-col items-center">
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid max-w-[500px] grid-cols-2 gap-2 mx-auto">
          <TabsTrigger value="about">About Us</TabsTrigger>
          <TabsTrigger value="team">Meet Our Team</TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="about">
          <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 py-5 justify-between">
            <h1 className="text-4xl lg:text-6xl font-extrabold">About Us</h1>
          </div>
          <div className="flex flex-col">
            <div className="text-justify leading-6">
              The Faculty of Technology and Design Student Senate (
              <strong>
                SEMA <span className="text-main">FTD</span>
              </strong>
              ) is the driving force of student life within our faculty. We are
              here to represent the voice of <strong>#Signtechers</strong>,
              bridge communication between students and faculty leadership, and
              create an ecosystem that supports Students. Through various work
              programs, we are committed to fostering leadership, soft skills,
              and professional networks, in line with our vision to make a
              positive impact on the UBM community and beyond.
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-10 md:gap-6 my-20">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-extrabold">Our Vision</h1>
              <p>
                Becoming a leading faculty at Bunda Mulia University that is
                active and professionally competitive through innovative work,
                as well as the development of soft skills, professional
                networks, and leadership that creates a positive impact.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-extrabold">Our Mission</h1>
              <ul className="list-decimal ml-5">
                <li>
                  Fostering leadership and interpersonal skills among students
                  to support professional readiness and self-development in the
                  future.
                </li>
                <li className="mt-2">
                  Disseminating information regarding academic and non-academic
                  activities for students of the Faculty of Technology and
                  Design, ensuring students are always updated with the latest
                  information.
                </li>
                <li className="mt-2">
                  Building collaboration among UBM student organizations by
                  initiating sports and arts festivals (porseni), and
                  non-academic competitions as a platform for developing student
                  potential.
                </li>
              </ul>
            </div>
            <div className="lg:col-span-2 xl:col-span-2">
              {/* <Image src="/cat.gif" alt="logo" width={100} height={100} /> */}
            </div>
          </div>
        </TabsContent>
        <TabsContent className="w-full" value="team">
          <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 py-5 justify-between">
            <h1 className="text-4xl lg:text-6xl font-extrabold">
              Meet Our <span className="text-main">Team</span>
            </h1>
          </div>
          <div className="flex flex-col">
            {/* pb-80 */}
            <div className="text-justify leading-6">
              Meet the people behind Sema FTD. We are a diverse, dedicated, and
              passionate team of students from various majors in the Faculty of
              Technology and Design. From the Executive Board to the Public
              Relations, R&D, Media & Communication, and Advocacy divisions. We
              believe in the power of collaboration to realize the
              organization&apos;s vision and mission.
            </div>
          </div>
          {/* <div className="flex w-full justify-center pb-10">
            <ArrowDown/>
          </div> */}
          <YearSelector />
          <Tabs defaultValue="bph" className="w-full py-5">
            <TabsList className="grid max-w-[500px] grid-cols-5 gap-2 mx-auto">
              <TabsTrigger value="bph">BPH</TabsTrigger>
              <TabsTrigger value="litbang">Litbang</TabsTrigger>
              <TabsTrigger value="humas">Humas</TabsTrigger>
              <TabsTrigger value="medkom">Medkom</TabsTrigger>
              <TabsTrigger value="advokasi">Advokasi</TabsTrigger>
            </TabsList>
            <Suspense fallback={<MembersListSkeleton />}>
              <MembersList />
            </Suspense>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};
