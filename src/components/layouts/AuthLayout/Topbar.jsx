import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/helpers/auth";
import { persistor } from "@/store";
import Logo from "@/components/ui/Logo/Logo";
import CustomButton from "@/components/ui/Button/Button";

export default function Topbar({ isauthenticated }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async (e) => {
    if (e) e.preventDefault();
    await logout(
      () => {
        navigate("/", { replace: true });
      },
      dispatch,
      persistor,
    );
  };
  return (
    <div className="h-16.25 bg-white px-28 flex items-center shadow-lg relative z-30 justify-between">
      <Logo
        width={48}
        height={48}
        className="h-6 md:h-8 lg:h-10 2xl:h-12 w-auto object-contain cursor-pointer"
        onClick={() => navigate("/")}
      />
      {isauthenticated && (
        <div>
          <CustomButton
            label="Logout"
            variant="primary"
            onClick={handleLogout}
            className=""
          />
        </div>
      )}
    </div>
  );
}
