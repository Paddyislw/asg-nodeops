import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/bridge/usdc/eth-base");
}

