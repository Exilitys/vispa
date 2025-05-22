import Navbar from "@/components/ui/navbar";
import FloatingNavbar from "@/components/ui/floating-navbar";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfilePicture from "@/components/profile/ProfilePicture";
import ContinueCourseSection from "@/components/home/ContinueCourseSection";
import FooterSection from "@/components/home/FooterSection";
import SignOutButton from "@/components/profile/SignOutButton"; // ✅ Import client button
import CompletedCourseSection from "@/components/profile/CompletedCourseSection";

export default async function Profile() {
  return (
    <div className="relative w-full">
      <Navbar />
      <FloatingNavbar />
      <div className="mx-10 flex flex-col gap-20 mt-24">
        <div className="flex md:flex-row justify-center mx-auto items-center gap-10 flex-col">
          <ProfilePicture />
          <ProfileStats />
        </div>
        {/* Completed Courses */}
        <CompletedCourseSection className="mb-32" />
        <ContinueCourseSection className="mb-32" />
        <div className="mx-auto flex justify-center items-center">
          <SignOutButton /> {/* ✅ Client button inserted here */}
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
