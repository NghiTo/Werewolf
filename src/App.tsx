import DashBoard from "./components/Dashboard";
import LoginModal from "./components/LoginModal";
import { useAuthStore } from "./store/authStore";

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <LoginModal />;
  }

  return <DashBoard />;
}

export default App;
