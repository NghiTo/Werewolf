import LoginModal from "./components/LoginModal";
import DashBoard from "./components/DashBoard";
import { useAuthStore } from "./store/authStore";

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <LoginModal />;
  }

  return <DashBoard />;
}

export default App;
