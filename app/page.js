import Image from "next/image";

import ChatUI from "./chat/page";
import LoginPage from "./components/login";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      {/* <ChatUI /> */}
      <LoginPage />
    </div>
  );
}
