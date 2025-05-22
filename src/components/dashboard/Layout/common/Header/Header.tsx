"use client";
import Link from "next/link";
import { LuMessageCircle } from "react-icons/lu";
import { MdOutlineMenu } from "react-icons/md";
import { RiMenuUnfold3Line } from "react-icons/ri";
import DropdownUser from "./DropdownUser";
const Navbar = ({
  onToggleSidebar,
  onToggleMobileSidebar,
  isOpen,
}: {
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
  isOpen: boolean;
}) => {
  return (
    <div className="sticky flex z-30  top-0 items-center justify-between bg-white shadow-sm p-4">
      {/* Mobile Menu Button */}
      <div className="flex items-center space-x-4  md:hidden lg:hidden">
        <button onClick={onToggleMobileSidebar} className="">
          <MdOutlineMenu className="text-xl text-primary font-nunito md:text-3xl cursor-pointer" />
        </button>
        <Link href="/" className="flex items-center">
          {/* <div className="relative h-[45px] w-[45px] md:h-[55px] md:w-[100] mr-3">
            <Image
              src="/images/logo/Nyumba.png"
              alt="Nyumba Logo"
              width={300}
              height={300}
              className="h-full w-full object-contain"
              priority
            />
          </div> */}

          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-roboto tracking-tight text-primary uppercase">
              HillTechIT
            </h2>
            <span className="text-[10px] flex whitespace-nowrap text-darkBlue font-medium leading-tight">
              {/* Real Estate Solutions */}
            </span>
          </div>
        </Link>
      </div>

      {/* Large Screen Sidebar Collapse Button */}
      <button onClick={onToggleSidebar} className="hidden md:block">
        {isOpen ? (
          <MdOutlineMenu className="text-lg text-primary font-nunito md:text-3xl cursor-pointer" />
        ) : (
          <RiMenuUnfold3Line className="text-lg text-primary font-nunito md:text-3xl cursor-pointer" />
        )}
      </button>

      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 hidden items-center justify-center cursor-pointer">
          <LuMessageCircle />
        </div>
        <DropdownUser />
        {/* <div className=" flex-col hidden md:flex md:flex-row gap-2">
          <span className="text-xs leading-3 font-medium">Simon</span>
          <span className="text-[10px] text-gray-500 text-right">Kasongo</span>
        </div>
        <Image
          src="/avatar.png"
          alt=""
          width={36}
          height={36}
          className="rounded-full"
        /> */}
      </div>
    </div>
  );
};

export default Navbar;
