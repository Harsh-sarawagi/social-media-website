import VerticalNavbar from "../components/navbar";
import useAuthStore from "../store/auth-store";

export default function Home(){
    const {user}= useAuthStore();
    console.log("user: ",user)
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-black"> 
        <VerticalNavbar/>
        <div className="flex w-full h-screen items-center justify-center text-xl text-white">
            No Recent Activities
        </div>
        </div>
    )
}