import VerticalNavbar from "../components/navbar";
import useAuthStore from "../store/auth-store";

export default function Home(){
    const {user}= useAuthStore();
    console.log("user: ",user)
    return (
        <div className="bg-black h-screen w-screen"> 
        <VerticalNavbar/>
            {user?.name}
        </div>
    )
}